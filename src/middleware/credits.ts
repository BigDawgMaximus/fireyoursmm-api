import { prisma } from "../lib/prisma.js";

export async function deductCredits(
  userId: string,
  amount: number,
  type: string,
): Promise<{ success: boolean; remaining: number }> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { credits_remaining: true, credits_reset_at: true, credits_monthly: true },
  });

  if (!user) {
    return { success: false, remaining: 0 };
  }

  // Reset credits if a month has passed
  const now = new Date();
  const resetAt = new Date(user.credits_reset_at);
  const monthMs = 30 * 24 * 60 * 60 * 1000;

  if (now.getTime() - resetAt.getTime() > monthMs) {
    await prisma.user.update({
      where: { id: userId },
      data: {
        credits_remaining: user.credits_monthly,
        credits_reset_at: now,
      },
    });
    user.credits_remaining = user.credits_monthly;
  }

  if (user.credits_remaining < amount) {
    return { success: false, remaining: user.credits_remaining };
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { credits_remaining: { decrement: amount } },
    select: { credits_remaining: true },
  });

  return { success: true, remaining: updated.credits_remaining };
}
