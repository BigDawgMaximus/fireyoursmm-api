import { orchestrateDraft } from "../agents/orchestrator.js";
import { callAgent } from "../services/claude.js";
import { vault } from "../vault/manager.js";
import { scraper } from "../services/scraper-client.js";
import type { Platform, ScrapedPost } from "../types/index.js";

// ============================================================
// DAILY BRIEF ENGINE
// This is the #1 selling point of Kai.
//
// Every morning, Kai:
// 1. Scrapes all competitors for overnight activity
// 2. Pulls trending topics in the client's sector
// 3. Analyzes the client's recent post performance
// 4. Generates 3-5 ready-to-post drafts for the day
// 5. Packages it all into a single brief
// 6. Delivers via Telegram / email / web notification
//
// The customer wakes up. Opens Telegram. Their entire day
// of content is written, optimized, and scheduled.
// 15 minutes to review and approve. Done.
//
// That's not a tool. That's a $5K/mo social media manager
// for $299/mo.
// ============================================================

export interface DailyBrief {
  client_id: string;
  generated_at: string;
  competitor_overnight: CompetitorOvernight[];
  trending_topics: TrendingTopic[];
  yesterday_recap: YesterdayRecap;
  todays_content: ScheduledPost[];
  raw_text: string; // Formatted brief for Telegram delivery
}

interface CompetitorOvernight {
  handle: string;
  posts_count: number;
  top_post?: {
    text: string;
    engagement: number;
    url?: string;
    why_it_worked?: string;
  };
  notable_moves: string[]; // "went silent", "changed bio", "follower spike"
}

interface TrendingTopic {
  topic: string;
  velocity: string; // "rising fast", "peaked", "steady"
  relevance: string; // why it matters to this client
  content_angle: string; // suggested angle to cover it
}

interface YesterdayRecap {
  posts_count: number;
  total_impressions: number;
  best_post?: {
    text: string;
    engagement: number;
    why_it_worked: string;
  };
  weakest_post?: {
    text: string;
    engagement: number;
    what_went_wrong: string;
  };
  avg_engagement_rate: number;
}

interface ScheduledPost {
  post_number: number;
  scheduled_time: string; // "9:30 AM EST"
  content_type: string; // "breaking news", "hot take", "thread", "engagement play"
  main_post: string;
  self_reply?: string;
  second_reply?: string;
  velocity_score: number;
  reasoning: string; // why this post, why this time
}

// ============================================================
// BRIEF GENERATION
// ============================================================

export async function generateDailyBrief(clientId: string): Promise<DailyBrief> {
  const startTime = Date.now();

  // --- Step 1: Load client context ---
  const [config, voiceProfile, knowledgeBase, training] = await Promise.all([
    vault.readFile(clientId, "meta/config.md"),
    vault.loadVoiceProfile(clientId, "marketing"),
    vault.loadKnowledgeBase(clientId),
    vault.loadTrainingData(clientId),
  ]);

  const competitors = await vault.listCompetitors(clientId);
  const platforms: Platform[] = extractPlatforms(config || "") || ["x"];

  // --- Step 2: Scrape competitors overnight activity ---
  const competitorData = await scrapeCompetitorsOvernight(clientId, competitors);

  // --- Step 3: Get trending topics ---
  let trendingTopics: TrendingTopic[] = [];
  try {
    const trending = await scraper.scrapeTrending("x", "crypto");
    trendingTopics = await analyzeTrendingRelevance(clientId, trending.topics, knowledgeBase);
  } catch (err) {
    console.error("Trending scrape failed:", err);
  }

  // --- Step 4: Yesterday's performance recap ---
  const yesterdayRecap = await buildYesterdayRecap(clientId);

  // --- Step 5: Generate today's content ---
  const todaysContent = await generateTodaysContent({
    clientId,
    platforms,
    voiceProfile,
    knowledgeBase,
    training,
    competitorData,
    trendingTopics,
    yesterdayRecap,
  });

  // --- Step 6: Package the brief ---
  const brief: DailyBrief = {
    client_id: clientId,
    generated_at: new Date().toISOString(),
    competitor_overnight: competitorData,
    trending_topics: trendingTopics,
    yesterday_recap: yesterdayRecap,
    todays_content: todaysContent,
    raw_text: "", // populated below
  };

  brief.raw_text = formatBriefForDelivery(brief);

  // Save to vault
  const dateStr = new Date().toISOString().split("T")[0];
  await vault.writeFile(clientId, `posts/briefs/${dateStr}.md`, brief.raw_text);

  const elapsed = Date.now() - startTime;
  console.log(`Daily brief generated for ${clientId} in ${elapsed}ms`);

  return brief;
}

// ============================================================
// COMPETITOR OVERNIGHT SCRAPING
// ============================================================

async function scrapeCompetitorsOvernight(
  clientId: string,
  competitors: string[],
): Promise<CompetitorOvernight[]> {
  const results: CompetitorOvernight[] = [];

  for (const handle of competitors) {
    try {
      const posts = await scraper.scrapePosts("x", handle, 20);
      const recentPosts = posts.posts.filter((p) => isWithinHours(p.date, 24));

      // Find their top post from overnight
      const topPost = recentPosts
        .sort((a, b) => totalEngagement(b) - totalEngagement(a))[0];

      // Detect notable moves
      const notableMoves: string[] = [];
      if (recentPosts.length === 0) {
        notableMoves.push("Went silent (0 posts in 24h)");
      } else if (recentPosts.length > 10) {
        notableMoves.push(`High volume: ${recentPosts.length} posts in 24h`);
      }

      if (topPost && totalEngagement(topPost) > 1000) {
        // Analyze why it worked
        const analysis = await callAgent({
          model: "haiku",
          system: "In 1-2 sentences, explain why this social media post performed well. Focus on the hook, trigger, or timing. Be specific.",
          user: `Post: "${topPost.text}"\nLikes: ${topPost.metrics.likes} | Replies: ${topPost.metrics.replies} | RTs: ${topPost.metrics.retweets || 0}`,
        });

        results.push({
          handle,
          posts_count: recentPosts.length,
          top_post: {
            text: topPost.text,
            engagement: totalEngagement(topPost),
            url: topPost.url,
            why_it_worked: analysis,
          },
          notable_moves: notableMoves,
        });
      } else {
        results.push({
          handle,
          posts_count: recentPosts.length,
          top_post: topPost ? {
            text: topPost.text,
            engagement: totalEngagement(topPost),
            url: topPost.url,
          } : undefined,
          notable_moves: notableMoves,
        });
      }

      // Update vault with latest data
      const topPostsContent = recentPosts
        .sort((a, b) => totalEngagement(b) - totalEngagement(a))
        .slice(0, 10)
        .map((p, i) => `${i + 1}. "${p.text.substring(0, 100)}..." - ${totalEngagement(p)} eng`)
        .join("\n");

      await vault.writeFile(
        clientId,
        `competitors/${handle}/latest_activity.md`,
        `# Latest Activity - @${handle}\nUpdated: ${new Date().toISOString()}\nPosts (24h): ${recentPosts.length}\n\n${topPostsContent}`
      );
    } catch (err) {
      console.error(`Failed to scrape @${handle}:`, err);
      results.push({
        handle,
        posts_count: 0,
        notable_moves: ["Scrape failed"],
      });
    }
  }

  return results;
}

// ============================================================
// TRENDING TOPIC ANALYSIS
// ============================================================

async function analyzeTrendingRelevance(
  clientId: string,
  topics: Array<{ name: string; velocity: number; sample_posts: ScrapedPost[] }>,
  knowledgeBase: string,
): Promise<TrendingTopic[]> {
  if (!topics.length) return [];

  const topicsText = topics
    .slice(0, 10)
    .map((t) => `- ${t.name} (velocity: ${t.velocity})`)
    .join("\n");

  const analysis = await callAgent({
    model: "haiku",
    system: `You analyze trending social media topics for relevance to a specific brand/protocol.

Given the client's knowledge base and a list of trending topics, identify the top 3 most relevant topics and suggest a content angle for each.

Respond in JSON array:
[{ "topic": "...", "velocity": "rising fast|peaked|steady", "relevance": "why it matters", "content_angle": "suggested post angle" }]`,
    user: `KNOWLEDGE BASE:\n${knowledgeBase.substring(0, 2000)}\n\nTRENDING TOPICS:\n${topicsText}`,
  });

  try {
    const cleaned = analysis.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    return JSON.parse(cleaned);
  } catch {
    return [];
  }
}

// ============================================================
// YESTERDAY RECAP
// ============================================================

async function buildYesterdayRecap(clientId: string): Promise<YesterdayRecap> {
  // In production, this reads from published posts tracking
  // For now, return a placeholder structure
  // Phase 4: integrate with actual post performance tracking
  return {
    posts_count: 0,
    total_impressions: 0,
    avg_engagement_rate: 0,
  };
}

// ============================================================
// TODAY'S CONTENT GENERATION
// The money feature. 3-5 ready-to-post drafts.
// ============================================================

interface ContentGenInput {
  clientId: string;
  platforms: Platform[];
  voiceProfile: string;
  knowledgeBase: string;
  training: { hooks: string; triggers: string; formats: string; best_posts: string };
  competitorData: CompetitorOvernight[];
  trendingTopics: TrendingTopic[];
  yesterdayRecap: YesterdayRecap;
}

async function generateTodaysContent(input: ContentGenInput): Promise<ScheduledPost[]> {
  const {
    clientId, platforms, voiceProfile, knowledgeBase, training,
    competitorData, trendingTopics, yesterdayRecap,
  } = input;

  // Build context for the content strategist
  const competitorSummary = competitorData
    .map((c) => {
      let summary = `@${c.handle}: ${c.posts_count} posts`;
      if (c.top_post) {
        summary += ` | Top: "${c.top_post.text.substring(0, 80)}..." (${c.top_post.engagement} eng)`;
      }
      if (c.notable_moves.length) {
        summary += ` | ${c.notable_moves.join(", ")}`;
      }
      return summary;
    })
    .join("\n");

  const trendingSummary = trendingTopics
    .map((t) => `${t.topic} (${t.velocity}) - Angle: ${t.content_angle}`)
    .join("\n");

  // Ask Claude to plan the day's content strategy
  const contentPlan = await callAgent({
    model: "sonnet",
    system: `You are the content strategist for Kai, a social media intelligence platform.

Your job: plan a full day of social media content for a client. Generate 3-5 ready-to-post drafts.

You have access to:
- The client's voice profile (write EXACTLY in their voice)
- Their knowledge base (use real facts, metrics, product details)
- Competitor overnight activity (react to what they did)
- Trending topics (ride momentum)
- Yesterday's performance (learn from what worked/didn't)
- Algorithm intelligence (optimize for maximum reach)

Rules:
- Every post must have a hook that stops the scroll (first 10 words)
- Every post must have a reply trigger (binary choice, open question, hot take)
- No links in main tweet. Links go in self-reply.
- No AI-sounding language. Write like a human. Short sentences. Line breaks.
- Mix content types: 1 breaking/reactive, 1 hot take, 1 value/thread, 1 engagement play
- Schedule across optimal windows: morning (9-11 AM EST), afternoon (2-4 PM), evening (8-10 PM)
- Include self-reply text for each post

NEVER use these words: leverage, utilize, comprehensive, cutting-edge, seamless, harness, robust, elevate, craft, delve, foster, landscape, navigate, paradigm, streamline, synergy, empower, innovative, transform, revolutionize, excited to announce, thrilled to share, game-changing

Respond in JSON:
{
  "posts": [
    {
      "post_number": 1,
      "scheduled_time": "9:30 AM EST",
      "content_type": "breaking news",
      "main_post": "full post text",
      "self_reply": "link or cashtags",
      "velocity_score": 85,
      "reasoning": "why this post, why this time"
    }
  ]
}`,
    user: `CLIENT VOICE PROFILE:
${voiceProfile}

KNOWLEDGE BASE (key facts):
${knowledgeBase.substring(0, 3000)}

COMPETITOR OVERNIGHT:
${competitorSummary || "No competitor data available."}

TRENDING TOPICS:
${trendingSummary || "No trending data available."}

YESTERDAY'S PERFORMANCE:
Posts: ${yesterdayRecap.posts_count} | Avg engagement: ${yesterdayRecap.avg_engagement_rate}%
${yesterdayRecap.best_post ? `Best: "${yesterdayRecap.best_post.text.substring(0, 100)}" - ${yesterdayRecap.best_post.why_it_worked}` : "No data yet."}

HOOKS THAT WORK FOR THIS CLIENT:
${training.hooks.substring(0, 1000)}

TRIGGERS THAT WORK:
${training.triggers.substring(0, 1000)}

TARGET PLATFORMS: ${platforms.join(", ")}

Generate 3-5 posts for today. Make them ready to copy-paste and post.`,
    max_tokens: 4096,
  });

  try {
    const cleaned = contentPlan.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const parsed = JSON.parse(cleaned);
    return parsed.posts || [];
  } catch {
    console.error("Failed to parse content plan, returning raw");
    return [{
      post_number: 1,
      scheduled_time: "10:00 AM EST",
      content_type: "manual",
      main_post: contentPlan,
      velocity_score: 0,
      reasoning: "Auto-generation failed. Raw output returned.",
    }];
  }
}

// ============================================================
// FORMAT BRIEF FOR DELIVERY
// ============================================================

function formatBriefForDelivery(brief: DailyBrief): string {
  const lines: string[] = [];
  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });

  lines.push(`DAILY BRIEF - ${today}`);
  lines.push("");

  // Competitor overnight
  if (brief.competitor_overnight.length) {
    lines.push("OVERNIGHT:");
    for (const comp of brief.competitor_overnight) {
      if (comp.top_post) {
        lines.push(`- @${comp.handle}: ${comp.posts_count} posts | Top: "${comp.top_post.text.substring(0, 60)}..." (${comp.top_post.engagement} eng)`);
        if (comp.top_post.why_it_worked) {
          lines.push(`  Why: ${comp.top_post.why_it_worked}`);
        }
      } else {
        lines.push(`- @${comp.handle}: ${comp.posts_count} posts${comp.notable_moves.length ? " | " + comp.notable_moves.join(", ") : ""}`);
      }
    }
    lines.push("");
  }

  // Trending
  if (brief.trending_topics.length) {
    lines.push("TRENDING:");
    for (const topic of brief.trending_topics) {
      lines.push(`- ${topic.topic} (${topic.velocity})`);
      lines.push(`  Angle: ${topic.content_angle}`);
    }
    lines.push("");
  }

  // Yesterday recap
  if (brief.yesterday_recap.posts_count > 0) {
    lines.push("YESTERDAY:");
    lines.push(`- ${brief.yesterday_recap.posts_count} posts | Avg engagement: ${brief.yesterday_recap.avg_engagement_rate}%`);
    if (brief.yesterday_recap.best_post) {
      lines.push(`- Best: "${brief.yesterday_recap.best_post.text.substring(0, 60)}..." - ${brief.yesterday_recap.best_post.why_it_worked}`);
    }
    lines.push("");
  }

  // Today's content
  lines.push("TODAY'S CONTENT:");
  lines.push("");

  for (const post of brief.todays_content) {
    lines.push(`--- POST ${post.post_number} (${post.scheduled_time}) - ${post.content_type} ---`);
    lines.push(`Score: ${post.velocity_score}/100`);
    lines.push("");
    lines.push(post.main_post);
    if (post.self_reply) {
      lines.push("");
      lines.push(`Self-reply: ${post.self_reply}`);
    }
    if (post.second_reply) {
      lines.push(`2nd reply: ${post.second_reply}`);
    }
    lines.push("");
    lines.push(`Why: ${post.reasoning}`);
    lines.push("");
  }

  lines.push("Reply with a number to edit that post, 'approve all' to lock them in, or tell me what else to write.");

  return lines.join("\n");
}

// ============================================================
// SCHEDULED BRIEF RUNNER
// Called by cron job every morning at configured time per client
// ============================================================

export async function runScheduledBriefs(): Promise<void> {
  // In production: query PostgreSQL for all active clients
  // For each client, check their configured brief time (default 8 AM local)
  // Generate and deliver brief

  // Placeholder: reads from vault root to find all client IDs
  // This would be replaced with a proper DB query
  console.log("Running scheduled daily briefs...");

  // TODO: Implement when PostgreSQL is added
  // const clients = await db.query("SELECT * FROM clients WHERE tier != 'growth' AND brief_enabled = true");
  // for (const client of clients) {
  //   try {
  //     const brief = await generateDailyBrief(client.id);
  //     await deliverBrief(client, brief);
  //   } catch (err) {
  //     console.error(`Brief failed for ${client.id}:`, err);
  //   }
  // }
}

// ============================================================
// HELPERS
// ============================================================

function totalEngagement(post: ScrapedPost): number {
  return (
    (post.metrics.likes || 0) +
    (post.metrics.replies || 0) +
    (post.metrics.retweets || 0) +
    (post.metrics.bookmarks || 0)
  );
}

function isWithinHours(dateStr: string, hours: number): boolean {
  if (!dateStr) return false;
  const postDate = new Date(dateStr);
  const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000);
  return postDate >= cutoff;
}

function extractPlatforms(config: string): Platform[] | null {
  const match = config.match(/platforms:\s*(.+)/);
  if (!match) return null;
  return match[1].split(",").map((p) => p.trim()) as Platform[];
}
