import { Router, type Request, type Response } from "express";
import { orchestrateDraft } from "../agents/orchestrator.js";
import { vault } from "../vault/manager.js";
import { scraper } from "../services/scraper-client.js";
import { callAgent } from "../services/claude.js";
import { generateWithPatterns, generateIntelligenceBrief } from "../services/intelligence.js";
import { getSchedulerStatus } from "../services/scheduler.js";
import type { DraftRequest, GenerateRequest, RewriteRequest, BriefRequest, Platform, ClientRole, ApiResponse } from "../types/index.js";

export const router = Router();

// ============================================================
// HEALTH
// ============================================================

router.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", version: "0.1.0", timestamp: new Date().toISOString() });
});

// ============================================================
// SCHEDULER STATUS
// ============================================================

router.get("/scheduler/status", (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: { jobs: getSchedulerStatus() },
    timestamp: new Date().toISOString(),
  });
});

// ============================================================
// DRAFT - Core feature. Runs all 7 agents.
// ============================================================

router.post("/draft", async (req: Request, res: Response) => {
  try {
    const { client_id, raw_text, platforms, role, retention } = req.body as DraftRequest;

    if (!client_id || !raw_text || !platforms?.length) {
      res.status(400).json({ success: false, error: "Missing client_id, raw_text, or platforms" });
      return;
    }

    // Verify client vault exists
    if (!(await vault.vaultExists(client_id))) {
      res.status(404).json({ success: false, error: "Client vault not found. Run /onboard first." });
      return;
    }

    const result = await orchestrateDraft({
      client_id,
      raw_text,
      platforms: platforms as Platform[],
      role: role as ClientRole,
      retention,
    });

    const response: ApiResponse<typeof result> = {
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    };

    res.json(response);
  } catch (err) {
    console.error("Draft error:", err);
    res.status(500).json({ success: false, error: String(err) });
  }
});

// ============================================================
// DECODE - Reverse-engineer any post
// ============================================================

router.post("/decode", async (req: Request, res: Response) => {
  try {
    const { client_id, url } = req.body;

    if (!url) {
      res.status(400).json({ success: false, error: "Missing url" });
      return;
    }

    // Scrape the post
    const post = await scraper.scrapePostDetail(url);

    // Load client context for personalized replication playbook
    let clientContext = "";
    if (client_id && await vault.vaultExists(client_id)) {
      const [voice, knowledge] = await Promise.all([
        vault.loadVoiceProfile(client_id, "marketing"),
        vault.loadKnowledgeBase(client_id),
      ]);
      clientContext = `\nCLIENT VOICE:\n${voice}\n\nCLIENT KNOWLEDGE:\n${knowledge}`;
    }

    const analysis = await callAgent({
      model: "sonnet",
      system: `You are Kai's decode engine. You reverse-engineer viral social media posts.

For the given post, analyze:
1. HOOK PATTERN: What type of hook is used? Why does it work? (urgency/contrarian/number/binary/prediction/insider/question)
2. STRUCTURE: Line breaks, length, formatting choices. What's optimized for the algorithm?
3. TRIGGER MECHANISM: What forces engagement? Binary choice? Open question? Hot take?
4. SENTIMENT: How is this positioned relative to current narratives? Contrarian? Consensus?
5. TIMING: When was this posted? Was the timing strategic?
6. VELOCITY ESTIMATE: Given the metrics, estimate the engagement velocity in the first 30 min.
7. REPLICATION PLAYBOOK: How would the CLIENT (if context provided) write a post using the same patterns but for THEIR content and in THEIR voice?

Be specific. Use the actual text. No generic advice.${clientContext}`,
      user: `POST TO DECODE:\n\nText: ${post.text}\nDate: ${post.date}\nLikes: ${post.metrics.likes}\nRetweets: ${post.metrics.retweets || 0}\nReplies: ${post.metrics.replies}\nBookmarks: ${post.metrics.bookmarks || 0}\nViews: ${post.metrics.views || "N/A"}\n\nSample replies:\n${(post.replies_sample || []).join("\n")}`,
      max_tokens: 3000,
    });

    res.json({
      success: true,
      data: {
        post,
        analysis,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Decode error:", err);
    res.status(500).json({ success: false, error: String(err) });
  }
});

// ============================================================
// SCOREBOARD
// ============================================================

router.get("/scoreboard/:client_id", async (req: Request, res: Response) => {
  try {
    const { client_id } = req.params;
    const period = (req.query.period as string) || "7d";

    const competitors = await vault.listCompetitors(client_id);
    const entries = [];

    for (const handle of competitors) {
      const profile = await vault.readFile(client_id, `competitors/${handle}/profile.md`);
      const topPosts = await vault.readFile(client_id, `competitors/${handle}/top_posts.md`);

      entries.push({
        handle,
        profile_summary: profile?.substring(0, 300) || "No data",
        top_posts_preview: topPosts?.substring(0, 500) || "No data",
      });
    }

    res.json({
      success: true,
      data: {
        client_id,
        period,
        competitors: entries,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Scoreboard error:", err);
    res.status(500).json({ success: false, error: String(err) });
  }
});

// ============================================================
// TRENDING
// ============================================================

router.get("/trending", async (req: Request, res: Response) => {
  try {
    const platform = (req.query.platform as Platform) || "x";
    const sector = (req.query.sector as string) || "crypto";

    const data = await scraper.scrapeTrending(platform, sector);

    res.json({
      success: true,
      data,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Trending error:", err);
    res.status(500).json({ success: false, error: String(err) });
  }
});

// ============================================================
// TRAIN - Ongoing training data input
// ============================================================

router.post("/train", async (req: Request, res: Response) => {
  try {
    const { client_id, posts, role } = req.body;

    if (!client_id || !posts?.length) {
      res.status(400).json({ success: false, error: "Missing client_id or posts" });
      return;
    }

    // Append to existing training data and re-analyze voice
    await Promise.all([
      analyzeVoice(client_id, role || "marketing", posts),
      extractTrainingPatterns(client_id, posts),
    ]);

    res.json({
      success: true,
      data: { message: `Voice profile and training data updated with ${posts.length} new posts.` },
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Train error:", err);
    res.status(500).json({ success: false, error: String(err) });
  }
});

// ============================================================
// INTELLIGENCE - Hybrid generation (patterns + Haiku)
// ============================================================

// Hook generation ($0.003 per call)
router.post("/intelligence/generate/hook", async (req: Request, res: Response) => {
  try {
    const { client_id, topic, platform, role } = req.body as GenerateRequest;

    if (!client_id || !topic) {
      res.status(400).json({ success: false, error: "Missing client_id or topic" });
      return;
    }

    if (!(await vault.vaultExists(client_id))) {
      res.status(404).json({ success: false, error: "Client vault not found. Run /onboard first." });
      return;
    }

    const hook = await generateWithPatterns(
      client_id,
      `Topic: ${topic}. Platform: ${platform || "x"}.`,
      (platform as Platform) || "x",
      "hook",
      role || "marketing",
    );

    res.json({
      success: true,
      data: { hook, topic, platform: platform || "x" },
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Hook generation error:", err);
    res.status(500).json({ success: false, error: String(err) });
  }
});

// Full post generation ($0.005 per call)
router.post("/intelligence/generate/post", async (req: Request, res: Response) => {
  try {
    const { client_id, topic, platform, role } = req.body as GenerateRequest;

    if (!client_id || !topic) {
      res.status(400).json({ success: false, error: "Missing client_id or topic" });
      return;
    }

    if (!(await vault.vaultExists(client_id))) {
      res.status(404).json({ success: false, error: "Client vault not found. Run /onboard first." });
      return;
    }

    const post = await generateWithPatterns(
      client_id,
      `Topic: ${topic}. Write a post reacting to this. Platform: ${platform || "x"}.`,
      (platform as Platform) || "x",
      "post",
      role || "marketing",
    );

    res.json({
      success: true,
      data: { post, topic, platform: platform || "x" },
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Post generation error:", err);
    res.status(500).json({ success: false, error: String(err) });
  }
});

// Voice rewriting ($0.004 per call)
router.post("/intelligence/rewrite", async (req: Request, res: Response) => {
  try {
    const { client_id, text, platform, role } = req.body as RewriteRequest;

    if (!client_id || !text) {
      res.status(400).json({ success: false, error: "Missing client_id or text" });
      return;
    }

    if (!(await vault.vaultExists(client_id))) {
      res.status(404).json({ success: false, error: "Client vault not found. Run /onboard first." });
      return;
    }

    const rewritten = await generateWithPatterns(
      client_id,
      `Original: ${text}`,
      (platform as Platform) || "x",
      "rewrite",
      role || "marketing",
    );

    res.json({
      success: true,
      data: { original: text, rewritten, platform: platform || "x" },
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Rewrite error:", err);
    res.status(500).json({ success: false, error: String(err) });
  }
});

// Daily intelligence brief ($0.01 per call)
router.post("/intelligence/brief", async (req: Request, res: Response) => {
  try {
    const { client_id, platforms, role } = req.body as BriefRequest;

    if (!client_id) {
      res.status(400).json({ success: false, error: "Missing client_id" });
      return;
    }

    if (!(await vault.vaultExists(client_id))) {
      res.status(404).json({ success: false, error: "Client vault not found. Run /onboard first." });
      return;
    }

    const brief = await generateIntelligenceBrief(
      client_id,
      (platforms as Platform[]) || ["x"],
      role || "marketing",
    );

    // Save to vault
    const dateStr = new Date().toISOString().split("T")[0];
    await vault.writeFile(client_id, `posts/briefs/${dateStr}_intelligence.md`, brief);

    res.json({
      success: true,
      data: { brief, generated_at: new Date().toISOString() },
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Intelligence brief error:", err);
    res.status(500).json({ success: false, error: String(err) });
  }
});

// ============================================================
// DAILY BRIEF - The killer feature (legacy, full orchestrated)
// ============================================================

router.post("/brief/generate", async (req: Request, res: Response) => {
  try {
    const { client_id } = req.body;

    if (!client_id) {
      res.status(400).json({ success: false, error: "Missing client_id" });
      return;
    }

    if (!(await vault.vaultExists(client_id))) {
      res.status(404).json({ success: false, error: "Client vault not found." });
      return;
    }

    // Import here to avoid circular deps
    const { generateDailyBrief } = await import("../services/daily-brief.js");
    const brief = await generateDailyBrief(client_id);

    res.json({
      success: true,
      data: brief,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Brief generation error:", err);
    res.status(500).json({ success: false, error: String(err) });
  }
});

// Manual competitor refresh
router.post("/scrape/refresh", async (req: Request, res: Response) => {
  try {
    const { client_id } = req.body;

    if (!client_id) {
      res.status(400).json({ success: false, error: "Missing client_id" });
      return;
    }

    const competitors = await vault.listCompetitors(client_id);

    // Trigger scrapes for all competitors
    const results = await Promise.allSettled(
      competitors.map(async (handle) => {
        const posts = await scraper.scrapePosts("x", handle, 20);
        const profile = await scraper.scrapeProfile("x", handle);

        await vault.writeFile(client_id, `competitors/${handle}/profile.md`,
          `# @${handle}\nFollowers: ${profile.followers}\nFollowing: ${profile.following}\nBio: ${profile.bio}\nUpdated: ${new Date().toISOString()}\n`
        );

        return { handle, posts_count: posts.posts.length };
      })
    );

    res.json({
      success: true,
      data: {
        refreshed: results.filter(r => r.status === "fulfilled").length,
        failed: results.filter(r => r.status === "rejected").length,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    res.status(500).json({ success: false, error: String(err) });
  }
});

// ============================================================
// VAULT - Direct vault access (for web dashboard)
// ============================================================

router.get("/vault/:client_id/files", async (req: Request, res: Response) => {
  try {
    const files = await vault.listFiles(req.params.client_id);
    res.json({ success: true, data: { files } });
  } catch (err) {
    res.status(500).json({ success: false, error: String(err) });
  }
});

router.get("/vault/:client_id/file", async (req: Request, res: Response) => {
  try {
    const filePath = req.query.path as string;
    if (!filePath) {
      res.status(400).json({ success: false, error: "Missing path query param" });
      return;
    }
    const content = await vault.readFile(req.params.client_id, filePath);
    res.json({ success: true, data: { path: filePath, content } });
  } catch (err) {
    res.status(500).json({ success: false, error: String(err) });
  }
});

router.get("/vault/:client_id/search", async (req: Request, res: Response) => {
  try {
    const query = req.query.q as string;
    if (!query) {
      res.status(400).json({ success: false, error: "Missing q query param" });
      return;
    }
    const results = await vault.search(req.params.client_id, query);
    res.json({ success: true, data: { results } });
  } catch (err) {
    res.status(500).json({ success: false, error: String(err) });
  }
});
