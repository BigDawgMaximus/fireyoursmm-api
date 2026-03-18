import { Router, type Request, type Response } from "express";
import { requireAuth } from "../middleware/auth.js";
import { prisma } from "../lib/prisma.js";

export const rewardsRouter = Router();

rewardsRouter.use(requireAuth);

// ============================================================
// REWARD CREDIT VALUES
// ============================================================

const REWARD_CREDITS: Record<string, number> = {
  ugc_post: 50,
  ugc_viral: 250,       // base bonus, scales with views
  testimonial: 75,      // text; video = 150
  testimonial_video: 150,
  share: 25,
  bug_report: 15,
  referral_signup: 100,
  referral_paid: 500,
  onboarding_complete: 50,
  platform_connect: 15,
  brand_upload: 20,
};

const VIRAL_TIERS = [
  { min: 1_000_000, credits: 3000 },
  { min: 500_000, credits: 1500 },
  { min: 100_000, credits: 750 },
  { min: 50_000, credits: 500 },
  { min: 10_000, credits: 250 },
] as const;

function ok(res: Response, data: object): void {
  res.json({ success: true, data, timestamp: new Date().toISOString() });
}

function fail(res: Response, status: number, error: string): void {
  res.status(status).json({ success: false, error });
}

// ============================================================
// GET /rewards — Reward history + totals
// ============================================================

rewardsRouter.get("/", async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;

    const [rewards, totals, pendingCount] = await Promise.all([
      prisma.reward.findMany({
        where: { user_id: userId },
        orderBy: { created_at: "desc" },
        take: 50,
      }),
      prisma.reward.aggregate({
        where: { user_id: userId, status: { in: ["approved", "auto_approved"] } },
        _sum: { credits: true },
        _count: true,
      }),
      prisma.reward.count({
        where: { user_id: userId, status: "pending" },
      }),
    ]);

    ok(res, {
      rewards,
      total_credits_earned: totals._sum.credits ?? 0,
      total_rewards: totals._count,
      pending_count: pendingCount,
    });
  } catch (err) {
    console.error("Rewards list error:", err);
    fail(res, 500, String(err));
  }
});

// ============================================================
// GET /rewards/referral-code — Get user's referral link
// ============================================================

rewardsRouter.get("/referral-code", async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: { referral_code: true },
    });

    if (!user) {
      fail(res, 404, "User not found");
      return;
    }

    const referrals = await prisma.referral.findMany({
      where: { referrer_id: req.user!.id },
      select: { status: true, credits_awarded: true },
    });

    const stats = {
      total_referrals: referrals.length,
      signed_up: referrals.filter((r) => r.status !== "pending").length,
      converted: referrals.filter((r) => r.status === "paid").length,
      total_credits: referrals.reduce((s, r) => s + r.credits_awarded, 0),
    };

    ok(res, {
      referral_code: user.referral_code,
      referral_link: `https://fireyoursmm.com/?ref=${user.referral_code}`,
      stats,
    });
  } catch (err) {
    console.error("Referral code error:", err);
    fail(res, 500, String(err));
  }
});

// ============================================================
// POST /rewards/claim — Submit a reward claim
// ============================================================

rewardsRouter.post("/claim", async (req: Request, res: Response) => {
  try {
    const { type, proof_url, platform, description } = req.body;
    const userId = req.user!.id;

    const validTypes = ["ugc_post", "ugc_viral", "testimonial", "testimonial_video", "share", "bug_report"];
    if (!validTypes.includes(type)) {
      fail(res, 400, `Invalid reward type. Must be one of: ${validTypes.join(", ")}`);
      return;
    }

    if (!proof_url?.trim()) {
      fail(res, 400, "proof_url is required — link to your post, tweet, reel, or video");
      return;
    }

    const credits = REWARD_CREDITS[type] ?? 0;

    const reward = await prisma.reward.create({
      data: {
        user_id: userId,
        type,
        credits,
        description: description || `${type} submission`,
        proof_url: proof_url.trim(),
        status: "pending",
        metadata: platform ? JSON.stringify({ platform }) : null,
      },
    });

    ok(res, {
      reward,
      message: "Reward submitted for review. Credits will be added once verified (usually within 24 hours).",
    });
  } catch (err) {
    console.error("Reward claim error:", err);
    fail(res, 500, String(err));
  }
});

// ============================================================
// GET /rewards/leaderboard — Top UGC creators this month
// ============================================================

rewardsRouter.get("/leaderboard", async (req: Request, res: Response) => {
  try {
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    const leaders = await prisma.reward.groupBy({
      by: ["user_id"],
      where: {
        status: { in: ["approved", "auto_approved"] },
        type: { in: ["ugc_post", "ugc_viral", "testimonial", "testimonial_video", "share"] },
        created_at: { gte: monthStart },
      },
      _sum: { credits: true },
      _count: true,
      orderBy: { _sum: { credits: "desc" } },
      take: 10,
    });

    // Fetch user names
    const userIds = leaders.map((l) => l.user_id);
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, name: true, email: true },
    });
    const userMap = new Map(users.map((u) => [u.id, u]));

    const leaderboard = leaders.map((l, i) => {
      const user = userMap.get(l.user_id);
      return {
        rank: i + 1,
        name: user?.name || user?.email?.split("@")[0] || "Anonymous",
        posts: l._count,
        credits_earned: l._sum.credits ?? 0,
      };
    });

    ok(res, { leaderboard, month: monthStart.toISOString().slice(0, 7) });
  } catch (err) {
    console.error("Leaderboard error:", err);
    fail(res, 500, String(err));
  }
});

// ============================================================
// AUTO-AWARD HELPERS (called from other routes)
// ============================================================

export async function awardAutoReward(
  userId: string,
  type: string,
  description: string,
): Promise<void> {
  const credits = REWARD_CREDITS[type] ?? 0;
  if (credits === 0) return;

  await prisma.$transaction([
    prisma.reward.create({
      data: {
        user_id: userId,
        type,
        credits,
        description,
        status: "auto_approved",
      },
    }),
    prisma.user.update({
      where: { id: userId },
      data: { credits_remaining: { increment: credits } },
    }),
  ]);

  console.log(`[REWARDS] Auto-awarded ${credits} credits to ${userId} for ${type}`);
}

export async function awardReferralSignup(
  referrerCode: string,
  referredUserId: string,
  referredEmail: string,
): Promise<void> {
  const referrer = await prisma.user.findUnique({
    where: { referral_code: referrerCode },
    select: { id: true },
  });

  if (!referrer) return;

  const credits = REWARD_CREDITS.referral_signup;

  await prisma.$transaction([
    prisma.referral.create({
      data: {
        referrer_id: referrer.id,
        referred_email: referredEmail,
        referred_user_id: referredUserId,
        status: "signed_up",
        credits_awarded: credits,
        converted_at: new Date(),
      },
    }),
    prisma.reward.create({
      data: {
        user_id: referrer.id,
        type: "referral_signup",
        credits,
        description: `Referral signup: ${referredEmail}`,
        status: "auto_approved",
      },
    }),
    prisma.user.update({
      where: { id: referrer.id },
      data: { credits_remaining: { increment: credits } },
    }),
  ]);

  console.log(`[REWARDS] Referral signup: ${referredEmail} → ${credits} credits to referrer ${referrer.id}`);
}

export async function awardReferralPaid(referredUserId: string): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { id: referredUserId },
    select: { referred_by: true },
  });

  if (!user?.referred_by) return;

  const referrer = await prisma.user.findUnique({
    where: { referral_code: user.referred_by },
    select: { id: true },
  });

  if (!referrer) return;

  // Check if already awarded
  const existing = await prisma.referral.findFirst({
    where: {
      referrer_id: referrer.id,
      referred_user_id: referredUserId,
      status: "paid",
    },
  });
  if (existing) return;

  const credits = REWARD_CREDITS.referral_paid;

  await prisma.$transaction([
    prisma.referral.updateMany({
      where: {
        referrer_id: referrer.id,
        referred_user_id: referredUserId,
      },
      data: {
        status: "paid",
        credits_awarded: { increment: credits },
        converted_at: new Date(),
      },
    }),
    prisma.reward.create({
      data: {
        user_id: referrer.id,
        type: "referral_paid",
        credits,
        description: `Referral converted to paid plan`,
        status: "auto_approved",
      },
    }),
    prisma.user.update({
      where: { id: referrer.id },
      data: { credits_remaining: { increment: credits } },
    }),
  ]);

  console.log(`[REWARDS] Referral paid: ${credits} credits to referrer ${referrer.id}`);
}
