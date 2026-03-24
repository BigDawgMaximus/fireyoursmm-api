import { Router, type Request, type Response } from "express";
import { requireAuth } from "../middleware/auth.js";
import { prisma } from "../lib/prisma.js";
import { callAgent } from "../services/claude.js";
import { generateIntelligenceBrief } from "../services/intelligence.js";
import { vault } from "../vault/manager.js";
import { scraper } from "../services/scraper-client.js";
import { runStatisticalAnalysis, compareWithCompetitors, type StatisticalAnalysis } from "../services/statistical-analyzer.js";
import type { Platform, ScrapedPost } from "../types/index.js";

export const chatRouter = Router();

// All chat routes require auth
chatRouter.use(requireAuth);

// ============================================================
// INTENT DETECTION ($0 - regex/keyword matching, no Claude call)
// ============================================================

type ChatIntent =
  | "analyze_url"
  | "generate_content"
  | "competitor_query"
  | "trending_query"
  | "performance_analysis"
  | "generate_hooks"
  | "rewrite_content"
  | "strategy_request"
  | "generate_brief"
  | "score_content"
  | "thumbnail_request"
  | "statistical_analysis"
  | "posting_schedule"
  | "hook_analysis"
  | "general_chat";

const INTENT_RULES: Array<{ test: (msg: string) => boolean; intent: ChatIntent }> = [
  { test: (m) => /\b(analyze my account|what'?s working|analyze my (posts|content)|my stats)\b/i.test(m), intent: "statistical_analysis" },
  { test: (m) => /\b(when should I post|best time|posting schedule|optimal time)\b/i.test(m), intent: "posting_schedule" },
  { test: (m) => /\b(what hooks work|best hooks|hook analysis|hook patterns)\b/i.test(m), intent: "hook_analysis" },
  { test: (m) => /\b(compare me|vs competitors|competitor comparison|how do I stack up)\b/i.test(m), intent: "statistical_analysis" },
  { test: (m) => /https?:\/\/\S+/.test(m), intent: "analyze_url" },
  { test: (m) => /^(draft|write|post about)\b/i.test(m), intent: "generate_content" },
  { test: (m) => /\b(competitor|what did|who posted)\b/i.test(m), intent: "competitor_query" },
  { test: (m) => /\b(trending|what'?s hot)\b/i.test(m), intent: "trending_query" },
  { test: (m) => /\b(why did|flopped|performance)\b/i.test(m), intent: "performance_analysis" },
  { test: (m) => /\b(rewrite|make it|more\s)/i.test(m), intent: "rewrite_content" },
  { test: (m) => /\bhooks?\b/i.test(m), intent: "generate_hooks" },
  { test: (m) => /\b(strategy|plan|campaign)\b/i.test(m), intent: "strategy_request" },
  { test: (m) => /\b(brief|morning)\b/i.test(m), intent: "generate_brief" },
  { test: (m) => /\b(score|rate)\b/i.test(m), intent: "score_content" },
  { test: (m) => /\b(thumb(nail)?|cover image|banner)\b/i.test(m), intent: "thumbnail_request" },
];

function detectIntent(message: string): ChatIntent {
  for (const rule of INTENT_RULES) {
    if (rule.test(message)) return rule.intent;
  }
  return "general_chat";
}

// ============================================================
// CREDIT COSTS PER INTENT
// ============================================================

const CREDIT_COSTS: Record<ChatIntent, number> = {
  analyze_url: 2,
  generate_content: 1,
  competitor_query: 0,
  trending_query: 0,
  performance_analysis: 0,
  generate_hooks: 3,
  rewrite_content: 1,
  strategy_request: 5,
  generate_brief: 0,
  score_content: 0,
  thumbnail_request: 0,
  statistical_analysis: 0,  // Zero AI cost
  posting_schedule: 0,       // Zero AI cost
  hook_analysis: 0,          // Zero AI cost
  general_chat: 0,
};

// ============================================================
// FOLLOW-UP SUGGESTIONS PER INTENT
// ============================================================

const SUGGESTIONS: Record<ChatIntent, string[]> = {
  analyze_url: [
    "Rewrite this in my voice",
    "Generate 10 hooks using this pattern",
    "What did my competitors post today?",
  ],
  generate_content: [
    "Adapt this for LinkedIn",
    "Give me 10 hook alternatives",
    "Score this post before I publish",
  ],
  competitor_query: [
    "Draft a post on the same topic",
    "What's trending right now?",
    "Generate my morning brief",
  ],
  trending_query: [
    "Draft a post about this trend",
    "What are my competitors saying about this?",
    "Generate hooks for this topic",
  ],
  performance_analysis: [
    "Rewrite my worst-performing post",
    "What's working for my competitors?",
    "Draft something using my best patterns",
  ],
  generate_hooks: [
    "Write a full post with the best hook",
    "Score these hooks",
    "What hooks are my competitors using?",
  ],
  rewrite_content: [
    "Adapt this for another platform",
    "Score this rewrite",
    "Generate 10 more hook alternatives",
  ],
  strategy_request: [
    "Generate my morning brief",
    "What's trending I should react to?",
    "Draft a post for today",
  ],
  generate_brief: [
    "Draft the top recommended post",
    "Show me competitor activity",
    "What's trending today?",
  ],
  score_content: [
    "Rewrite to improve the score",
    "Generate better hooks for this",
    "Show me top-performing examples",
  ],
  thumbnail_request: [
    "Analyze a YouTube thumbnail",
    "Generate a thumbnail for my next video",
    "What makes a high-CTR thumbnail?",
  ],
  statistical_analysis: [
    "When should I post?",
    "What hooks work best for me?",
    "Draft a post using my best patterns",
  ],
  posting_schedule: [
    "What hooks work best for me?",
    "Analyze my account stats",
    "Draft a post for the optimal window",
  ],
  hook_analysis: [
    "Write a post using my best hook pattern",
    "When should I post?",
    "Compare me to competitors",
  ],
  general_chat: [
    "Generate my morning brief",
    "What did my competitors post?",
    "Draft a post about something trending",
  ],
};

// ============================================================
// CONTEXT LOADERS
// ============================================================

async function loadVoiceContext(userId: string): Promise<string> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { vault_path: true },
  });
  if (!user?.vault_path) return "";

  const clientId = userId;
  try {
    const [voice, knowledge] = await Promise.all([
      vault.loadVoiceProfile(clientId, "marketing"),
      vault.loadKnowledgeBase(clientId),
    ]);
    return `VOICE PROFILE:\n${voice || "Not set up yet."}\n\nKNOWLEDGE BASE:\n${knowledge || "No knowledge base yet."}`;
  } catch {
    return "";
  }
}

async function loadTrainingContext(userId: string): Promise<string> {
  try {
    const training = await vault.loadTrainingData(userId);
    const parts: string[] = [];
    if (training.hooks) parts.push(`HOOKS THAT WORK:\n${training.hooks}`);
    if (training.triggers) parts.push(`TRIGGERS THAT WORK:\n${training.triggers}`);
    if (training.formats) parts.push(`FORMAT PATTERNS:\n${training.formats}`);
    return parts.join("\n\n");
  } catch {
    return "";
  }
}

async function loadChatHistory(userId: string, limit = 10): Promise<string> {
  const messages = await prisma.chatMessage.findMany({
    where: { user_id: userId },
    orderBy: { created_at: "desc" },
    take: limit,
  });

  if (!messages.length) return "";

  return messages
    .reverse()
    .map((m) => `${m.role === "user" ? "User" : "Kai"}: ${m.content}`)
    .join("\n\n");
}

async function loadCompetitorContext(userId: string): Promise<string> {
  try {
    const competitors = await vault.listCompetitors(userId);
    if (!competitors.length) return "No competitors tracked yet.";

    const entries: string[] = [];
    for (const handle of competitors.slice(0, 5)) {
      const topPosts = await vault.readFile(userId, `competitors/${handle}/top_posts.md`);
      const latestActivity = await vault.readFile(userId, `competitors/${handle}/latest_activity.md`);
      entries.push(`@${handle}:\n${latestActivity || topPosts?.substring(0, 500) || "No data yet."}`);
    }
    return entries.join("\n\n");
  } catch {
    return "No competitor data available.";
  }
}

// ============================================================
// INTENT HANDLERS
// ============================================================

async function handleIntent(
  intent: ChatIntent,
  message: string,
  userId: string,
): Promise<string> {
  switch (intent) {
    case "generate_content": {
      const [voice, training, history] = await Promise.all([
        loadVoiceContext(userId),
        loadTrainingContext(userId),
        loadChatHistory(userId),
      ]);

      return callAgent({
        model: "haiku",
        system: `You are Kai, an elite social media ghostwriter. Write content that sounds exactly like the user.

${voice}

${training}

CONVERSATION CONTEXT:
${history}

Write a complete social media post based on the user's request. Follow their voice patterns exactly.
Output ONLY the post text. No labels, no quotes, no explanation.`,
        user: message,
        max_tokens: 1024,
      });
    }

    case "generate_hooks": {
      const [voice, training] = await Promise.all([
        loadVoiceContext(userId),
        loadTrainingContext(userId),
      ]);

      return callAgent({
        model: "haiku",
        system: `You are Kai's hook generator. Generate hooks segmented by audience awareness level.

${voice}

${training}

Generate 12 hooks total — 3 per awareness level. Match the user's exact voice and style.

Format EXACTLY like this:

## COLD — They don't know the problem exists
Pattern interrupts, "Did you know..." hooks, shocking stats, myth-busting.
1. [hook text]
   → Why it works: [one line]
2. [hook text]
   → Why it works: [one line]
3. [hook text]
   → Why it works: [one line]

## PROBLEM AWARE — They feel the pain but haven't found a solution
"Tired of..." hooks, pain amplification, "If you're still doing X..." hooks.
4. [hook text]
   → Why it works: [one line]
5. [hook text]
   → Why it works: [one line]
6. [hook text]
   → Why it works: [one line]

## SOLUTION AWARE — They've tried alternatives
"I tried X and Y, then found..." hooks, comparison hooks, "why most solutions fail" hooks.
7. [hook text]
   → Why it works: [one line]
8. [hook text]
   → Why it works: [one line]
9. [hook text]
   → Why it works: [one line]

## PRODUCT AWARE — They've seen you but haven't converted
Social proof, urgency, differentiation, "here's what changed" hooks.
10. [hook text]
    → Why it works: [one line]
11. [hook text]
    → Why it works: [one line]
12. [hook text]
    → Why it works: [one line]

Rules:
- Write each hook naturally in the user's voice. No templates.
- Short. Punchy. No filler.
- Never use these AI-sounding words: leverage, utilize, comprehensive, cutting-edge, seamless, harness, robust, elevate, delve, foster, landscape, paradigm, synergy, empower, game-changing, groundbreaking.`,
        user: message,
        max_tokens: 2048,
      });
    }

    case "analyze_url": {
      const urlMatch = message.match(/https?:\/\/\S+/);
      const url = urlMatch?.[0] || "";

      let postContent = "";
      try {
        const post = await scraper.scrapePostDetail(url);
        postContent = `Text: ${post.text}\nLikes: ${post.metrics.likes} | Replies: ${post.metrics.replies} | Retweets: ${post.metrics.retweets || 0} | Bookmarks: ${post.metrics.bookmarks || 0} | Views: ${post.metrics.views || "N/A"}`;
      } catch {
        postContent = `URL: ${url}\n(Could not scrape - analyzing based on URL context)`;
      }

      const voice = await loadVoiceContext(userId);

      return callAgent({
        model: "haiku",
        system: `You are Kai's post decoder. Analyze social media posts and explain why they work (or don't).

${voice}

Break down:
1. HOOK: What type, why it stops the scroll
2. STRUCTURE: Formatting choices optimized for the algorithm
3. TRIGGER: What forces engagement
4. VELOCITY: Estimated performance trajectory
5. REPLICATION: How the user could write something similar in their own voice

Be specific. Reference the actual text.`,
        user: `Analyze this post:\n\n${postContent}\n\nUser's additional context: ${message.replace(url, "").trim() || "None"}`,
        max_tokens: 2000,
      });
    }

    case "competitor_query": {
      const [competitors, history] = await Promise.all([
        loadCompetitorContext(userId),
        loadChatHistory(userId),
      ]);

      return callAgent({
        model: "haiku",
        system: `You are Kai's competitive intelligence analyst. Answer questions about competitor activity using the data provided.

COMPETITOR DATA:
${competitors}

CONVERSATION CONTEXT:
${history}

Be specific. Reference actual posts and metrics. Identify patterns and opportunities.`,
        user: message,
        max_tokens: 1500,
      });
    }

    case "trending_query": {
      let trendingData = "";
      try {
        const data = await scraper.scrapeTrending("x", "general");
        trendingData = JSON.stringify(data, null, 2);
      } catch {
        trendingData = "Trending data unavailable right now.";
      }

      return callAgent({
        model: "haiku",
        system: `You are Kai's trend analyst. Summarize what's trending and suggest angles the user could take.

TRENDING DATA:
${trendingData}

Be specific. Suggest concrete content angles, not generic advice.`,
        user: message,
        max_tokens: 1500,
      });
    }

    case "performance_analysis": {
      const [voice, history] = await Promise.all([
        loadVoiceContext(userId),
        loadChatHistory(userId),
      ]);

      let postHistory = "";
      try {
        const content = await prisma.generatedContent.findMany({
          where: { user_id: userId },
          orderBy: { created_at: "desc" },
          take: 20,
          select: { type: true, input: true, output: true, velocity_score: true, created_at: true },
        });
        postHistory = content
          .map((c) => `[${c.type}] Score: ${c.velocity_score ?? "N/A"}\nInput: ${c.input.substring(0, 100)}\nOutput: ${c.output.substring(0, 200)}`)
          .join("\n\n");
      } catch {
        postHistory = "No post history available.";
      }

      return callAgent({
        model: "haiku",
        system: `You are Kai's performance analyst. Analyze the user's content history and explain what's working and what isn't.

${voice}

POST HISTORY:
${postHistory}

CONVERSATION CONTEXT:
${history}

Be brutally honest. Use specific examples. Identify patterns in what works vs what doesn't.`,
        user: message,
        max_tokens: 2000,
      });
    }

    case "rewrite_content": {
      const [voice, history] = await Promise.all([
        loadVoiceContext(userId),
        loadChatHistory(userId),
      ]);

      return callAgent({
        model: "haiku",
        system: `You are Kai's voice rewriter. Rewrite content to match the user's exact voice and style.

${voice}

CONVERSATION CONTEXT (use the last generated content if the user says "rewrite" without specifying what):
${history}

Output ONLY the rewritten text. No labels, no quotes, no explanation.`,
        user: message,
        max_tokens: 1024,
      });
    }

    case "strategy_request": {
      const [voice, training, competitors, history] = await Promise.all([
        loadVoiceContext(userId),
        loadTrainingContext(userId),
        loadCompetitorContext(userId),
        loadChatHistory(userId),
      ]);

      return callAgent({
        model: "sonnet",
        system: `You are Kai's head strategist. Build actionable social media strategies.

${voice}

${training}

COMPETITOR LANDSCAPE:
${competitors}

CONVERSATION CONTEXT:
${history}

Create a specific, actionable strategy. Include content pillars, posting cadence, key themes, and concrete examples. No generic advice.`,
        user: message,
        max_tokens: 3000,
      });
    }

    case "generate_brief": {
      try {
        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: { priority_platform: true },
        });
        const platforms: Platform[] = [
          (user?.priority_platform as Platform) || "x",
        ];
        const brief = await generateIntelligenceBrief(userId, platforms, "marketing");
        return brief;
      } catch (err) {
        return `Could not generate brief: ${String(err)}. Make sure onboarding is complete.`;
      }
    }

    case "score_content": {
      const [voice, training, history] = await Promise.all([
        loadVoiceContext(userId),
        loadTrainingContext(userId),
        loadChatHistory(userId),
      ]);

      return callAgent({
        model: "haiku",
        system: `You are Kai's content scorer. Rate content on a 1-100 scale based on the user's proven patterns.

${voice}

${training}

CONVERSATION CONTEXT (score the content from the latest message, or from the conversation):
${history}

Score the content on:
- Hook strength (1-10)
- Structure optimization (1-10)
- Trigger effectiveness (1-10)
- Voice match (1-10)
- Overall velocity prediction (1-100)

Be specific about what would improve the score.`,
        user: message,
        max_tokens: 1500,
      });
    }

    case "thumbnail_request": {
      return "Head to the **Thumbnail Workshop** (/thumbnails) to:\n\n" +
        "1. **Analyze & Recreate** — Upload any thumbnail you love. I'll decode its visual structure (layout, colors, fonts, hooks) and generate a new one with your brand.\n\n" +
        "2. **Generate from Scratch** — Tell me your title and platform, and I'll design a high-CTR thumbnail concept with a CSS preview and image generation prompt.\n\n" +
        "You can also use the API directly:\n" +
        "- `POST /api/v1/thumbnails/analyze` — Upload an image\n" +
        "- `POST /api/v1/thumbnails/generate` — Generate a concept\n\n" +
        "What platform are you designing for?";
    }

    case "statistical_analysis": {
      // Try to load cached analysis from vault
      const cachedAnalysis = await vault.readFile(userId, "meta/statistical-analysis.json");
      if (cachedAnalysis) {
        try {
          const analysis: StatisticalAnalysis = JSON.parse(cachedAnalysis);
          const summary = formatStatisticalSummary(analysis);
          return summary;
        } catch {
          return "I have your statistical data but it seems corrupted. Try running a fresh analysis from your settings.";
        }
      }
      return "I don't have statistical data for your account yet. Once onboarding is complete and we've scraped your posts, I'll have a full breakdown of your posting patterns, best times, top hooks, and more. All at zero cost, no AI needed.";
    }

    case "posting_schedule": {
      const cachedAnalysis = await vault.readFile(userId, "meta/statistical-analysis.json");
      if (cachedAnalysis) {
        try {
          const analysis: StatisticalAnalysis = JSON.parse(cachedAnalysis);
          return formatScheduleSummary(analysis.posting_schedule);
        } catch {
          return "Could not load your posting schedule data.";
        }
      }
      return "I need to analyze your posts first. Complete onboarding so I can find your optimal posting windows.";
    }

    case "hook_analysis": {
      const cachedAnalysis = await vault.readFile(userId, "meta/statistical-analysis.json");
      if (cachedAnalysis) {
        try {
          const analysis: StatisticalAnalysis = JSON.parse(cachedAnalysis);
          return formatHookSummary(analysis.hook_patterns);
        } catch {
          return "Could not load your hook analysis data.";
        }
      }
      return "I need to analyze your posts first. Complete onboarding so I can find your best hook patterns.";
    }

    case "general_chat":
    default: {
      const history = await loadChatHistory(userId);

      return callAgent({
        model: "haiku",
        system: `You are Kai, an AI social media strategist. You help users create better content, understand their competitors, and grow their audience.

CONVERSATION CONTEXT:
${history}

Be helpful, direct, and specific. If the user seems to want content or analysis, suggest the right action.`,
        user: message,
        max_tokens: 1024,
      });
    }
  }
}

// ============================================================
// STATISTICAL ANALYSIS FORMATTERS (human-readable, not raw JSON)
// ============================================================

function formatStatisticalSummary(a: StatisticalAnalysis): string {
  const lines: string[] = [];
  lines.push(`**Your Content Analysis** (${a.total_posts_analyzed} posts analyzed)\n`);

  // Engagement
  lines.push(`**Engagement Rate:** ${(a.top_performers.avg_engagement_rate * 100).toFixed(2)}% avg, ${(a.top_performers.p90_engagement_rate * 100).toFixed(2)}% top 10%\n`);

  // Best times
  if (a.posting_schedule.optimal_schedule.length) {
    const best = a.posting_schedule.optimal_schedule.slice(0, 3);
    lines.push("**Best Posting Times:**");
    for (const slot of best) {
      const hour = slot.hour > 12 ? `${slot.hour - 12}PM` : slot.hour === 0 ? "12AM" : `${slot.hour}AM`;
      lines.push(`  ${slot.day} at ${hour} (${(slot.avg_engagement * 100).toFixed(2)}% eng, ${slot.post_count} posts)`);
    }
    lines.push("");
  }

  // Hook patterns
  if (a.hook_patterns.pattern_engagement_rates.length) {
    lines.push("**Your Best Hook Patterns:**");
    for (const p of a.hook_patterns.pattern_engagement_rates.slice(0, 5)) {
      lines.push(`  ${p.pattern.replace(/_/g, " ")}: ${(p.avg_engagement * 100).toFixed(2)}% avg (${p.count} posts)`);
    }
    lines.push("");
  }

  // Format ranking
  if (a.format_detection.format_ranking.length) {
    lines.push("**Best Content Formats:**");
    for (const f of a.format_detection.format_ranking.slice(0, 5)) {
      lines.push(`  ${f.format.replace(/_/g, " ")}: ${(f.avg_engagement * 100).toFixed(2)}% avg (${f.count} posts)`);
    }
    lines.push("");
  }

  // Post length
  lines.push(`**Optimal Post Length:** ${a.post_length.optimal_chars.min} to ${a.post_length.optimal_chars.max} characters, ${a.post_length.optimal_words.min} to ${a.post_length.optimal_words.max} words\n`);

  // Media
  if (a.media_performance.media_ranking.length) {
    lines.push("**Media Type Ranking:**");
    for (const m of a.media_performance.media_ranking) {
      lines.push(`  ${m.type}: ${(m.avg_engagement * 100).toFixed(2)}% avg (${m.count} posts)`);
    }
    lines.push("");
  }

  // Competitors
  if (a.competitor_comparison) {
    if (a.competitor_comparison.competitive_gaps.length) {
      lines.push("**Gaps vs Competitors:**");
      for (const gap of a.competitor_comparison.competitive_gaps.slice(0, 5)) {
        lines.push(`  - ${gap}`);
      }
      lines.push("");
    }
    if (a.competitor_comparison.competitive_advantages.length) {
      lines.push("**Your Advantages:**");
      for (const adv of a.competitor_comparison.competitive_advantages.slice(0, 5)) {
        lines.push(`  - ${adv}`);
      }
    }
  }

  lines.push("\nThis analysis uses zero AI. Pure data from your actual posts.");
  return lines.join("\n");
}

function formatScheduleSummary(schedule: StatisticalAnalysis["posting_schedule"]): string {
  const lines: string[] = [];
  lines.push("**Your Optimal Posting Schedule**\n");

  if (schedule.optimal_schedule.length) {
    lines.push("**Best windows (highest engagement):**");
    for (const slot of schedule.optimal_schedule) {
      const hour = slot.hour > 12 ? `${slot.hour - 12}PM` : slot.hour === 0 ? "12AM" : `${slot.hour}AM`;
      lines.push(`  ${slot.day} at ${hour} - ${(slot.avg_engagement * 100).toFixed(2)}% avg engagement (${slot.post_count} posts)`);
    }
    lines.push("");
  }

  if (schedule.worst_times.length) {
    lines.push("**Avoid these times:**");
    for (const slot of schedule.worst_times) {
      const hour = slot.hour > 12 ? `${slot.hour - 12}PM` : slot.hour === 0 ? "12AM" : `${slot.hour}AM`;
      lines.push(`  ${slot.day} at ${hour} - ${(slot.avg_engagement * 100).toFixed(2)}% avg (${slot.post_count} posts)`);
    }
    lines.push("");
  }

  // Day ranking
  const activeDays = schedule.day_performance.filter(d => d.post_count > 0).sort((a, b) => b.avg_engagement - a.avg_engagement);
  if (activeDays.length) {
    lines.push("**Day ranking:**");
    for (const day of activeDays) {
      const bar = "█".repeat(Math.round(day.avg_engagement * 1000));
      lines.push(`  ${day.day}: ${bar} ${(day.avg_engagement * 100).toFixed(2)}%`);
    }
  }

  lines.push("\nBased on real engagement data from your posts. Zero AI cost.");
  return lines.join("\n");
}

function formatHookSummary(hooks: StatisticalAnalysis["hook_patterns"]): string {
  const lines: string[] = [];
  lines.push("**Your Hook Pattern Analysis**\n");
  lines.push(`Your dominant pattern: **${hooks.dominant_type.replace(/_/g, " ")}**\n`);

  if (hooks.pattern_engagement_rates.length) {
    lines.push("**Pattern performance ranking:**");
    for (const p of hooks.pattern_engagement_rates) {
      lines.push(`  ${p.pattern.replace(/_/g, " ")}: ${(p.avg_engagement * 100).toFixed(2)}% avg engagement (${p.count} posts)`);
    }
    lines.push("");
  }

  if (hooks.top_performing_hooks.length) {
    lines.push("**Your best hooks (ranked by engagement):**");
    for (const h of hooks.top_performing_hooks.slice(0, 5)) {
      lines.push(`  "${h.text}" [${h.pattern}] - ${(h.engagement_rate * 100).toFixed(2)}%`);
    }
  }

  lines.push("\nBased on real engagement data. Zero AI cost.");
  return lines.join("\n");
}

// ============================================================
// POST /api/v1/chat/message - Send a message, get a response
// ============================================================

chatRouter.post("/message", async (req: Request, res: Response) => {
  try {
    const user = req.user!;
    const { message, type } = req.body as { message: string; type?: "text" | "url" | "file" };

    if (!message?.trim()) {
      res.status(400).json({ success: false, error: "Missing message" });
      return;
    }

    // Detect intent
    const intent = detectIntent(message);
    const creditCost = CREDIT_COSTS[intent];

    // Check credits
    if (creditCost > 0 && user.credits_remaining < creditCost) {
      res.status(402).json({
        success: false,
        error: `Not enough credits. This action costs ${creditCost} credits, you have ${user.credits_remaining}.`,
        credits_remaining: user.credits_remaining,
        credits_needed: creditCost,
      });
      return;
    }

    // Save user message
    await prisma.chatMessage.create({
      data: {
        user_id: user.id,
        role: "user",
        content: message,
      },
    });

    // Generate response
    const response = await handleIntent(intent, message, user.id);

    // Deduct credits and save assistant message in parallel
    const [updatedUser] = await Promise.all([
      creditCost > 0
        ? prisma.user.update({
            where: { id: user.id },
            data: { credits_remaining: { decrement: creditCost } },
            select: { credits_remaining: true },
          })
        : Promise.resolve({ credits_remaining: user.credits_remaining }),
      prisma.chatMessage.create({
        data: {
          user_id: user.id,
          role: "assistant",
          content: response,
          credits_used: creditCost,
        },
      }),
    ]);

    // Pick 2-3 suggestions
    const allSuggestions = SUGGESTIONS[intent];
    const suggestions = allSuggestions.slice(0, 3);

    res.json({
      success: true,
      data: {
        message: response,
        credits_used: creditCost,
        credits_remaining: updatedUser.credits_remaining,
        intent,
        suggestions,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Chat error:", err);
    res.status(500).json({ success: false, error: String(err) });
  }
});

// ============================================================
// GET /api/v1/chat/history - Returns last 50 messages
// ============================================================

chatRouter.get("/history", async (req: Request, res: Response) => {
  try {
    const messages = await prisma.chatMessage.findMany({
      where: { user_id: req.user!.id },
      orderBy: { created_at: "asc" },
      take: 50,
      select: {
        id: true,
        role: true,
        content: true,
        credits_used: true,
        created_at: true,
      },
    });

    res.json({
      success: true,
      data: { messages, count: messages.length },
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Chat history error:", err);
    res.status(500).json({ success: false, error: String(err) });
  }
});

// ============================================================
// DELETE /api/v1/chat/clear - Clear chat history
// ============================================================

chatRouter.delete("/clear", async (req: Request, res: Response) => {
  try {
    const result = await prisma.chatMessage.deleteMany({
      where: { user_id: req.user!.id },
    });

    res.json({
      success: true,
      data: { deleted: result.count },
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Chat clear error:", err);
    res.status(500).json({ success: false, error: String(err) });
  }
});
