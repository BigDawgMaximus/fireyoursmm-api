import { callAgent } from "./claude.js";
import { vault } from "../vault/manager.js";
import { BANNED_WORDS } from "../config/algorithm.js";
import type { Platform } from "../types/index.js";

// ============================================================
// INTELLIGENCE SERVICE
// Hybrid generation: voice patterns as context for Haiku calls.
//
// "Learn Once" extracts patterns to vault (Sonnet, $0.05).
// Generation uses those patterns as system prompt context
// for cheap Haiku calls ($0.003-0.01 each).
// ============================================================

type GenerationMode = "hook" | "post" | "rewrite" | "brief";

const bannedWordsList = BANNED_WORDS.join(", ");

function buildHookSystemPrompt(voiceProfile: string, training: { hooks: string }): string {
  return `You generate social media hooks segmented by audience awareness level. You write EXACTLY like this person.

VOICE PROFILE:
${voiceProfile}

HOOKS THAT WORKED FOR THIS PERSON (ranked by engagement):
${training.hooks}

Generate hooks across 4 awareness levels:

**COLD** — They don't know the problem exists.
Use: pattern interrupts, "Did you know..." hooks, shocking stats, myth-busting, curiosity gaps.

**PROBLEM AWARE** — They feel the pain but haven't found a solution.
Use: "Tired of..." hooks, pain amplification, "If you're still doing X..." hooks, empathy-first openers.

**SOLUTION AWARE** — They've tried alternatives that didn't work.
Use: "I tried X and Y, then found..." hooks, comparison hooks, "why most solutions fail" hooks.

**PRODUCT AWARE** — They've seen you but haven't converted.
Use: social proof, urgency, differentiation, "here's what changed" hooks, testimonial-style openers.

Label each hook with its awareness level in brackets like [COLD], [PROBLEM AWARE], etc.

Rules:
- Write naturally in their voice. No templates.
- Short. Punchy. No filler.
- Match their exact punctuation, capitalization, and cadence.
- Never use these words: ${bannedWordsList}`;
}

function buildPostSystemPrompt(
  voiceProfile: string,
  platform: Platform,
  training: { hooks: string; triggers: string; formats: string },
): string {
  return `You write social media posts. You write EXACTLY like this person.

VOICE PROFILE:
${voiceProfile}

HOOKS THAT WORKED (ranked by engagement):
${training.hooks}

TRIGGERS THAT WORKED:
${training.triggers}

FORMAT PATTERNS:
${training.formats}

Platform: ${platform}
Write a complete post about the given topic.
Follow their exact patterns. Short sentences. Their vocabulary. Their punctuation style. Their line break patterns.
Every post needs a hook (first line that stops the scroll) and a trigger (something that forces replies).
The post must feel like they typed it themselves.

Never use these words: ${bannedWordsList}

Respond with ONLY the post text. No labels, no explanation, no quotes around it.`;
}

function buildRewriteSystemPrompt(voiceProfile: string): string {
  return `You rewrite text to match a specific person's voice.

VOICE PROFILE:
${voiceProfile}

Rewrite the given text so it sounds exactly like this person wrote it.
Keep the meaning. Change the voice.
Match their sentence length, punctuation, vocabulary, and tone.
Never use these words: ${bannedWordsList}

Respond with ONLY the rewritten text. No labels, no explanation.`;
}

function buildBriefSystemPrompt(
  voiceProfile: string,
  training: { hooks: string; triggers: string; formats: string },
): string {
  return `You are an elite social media strategist. You deliver a morning intelligence briefing based on competitor data and market conditions.

VOICE PROFILE (write all content pieces in this voice):
${voiceProfile}

HOOKS THAT WORK:
${training.hooks}

TRIGGERS THAT WORK:
${training.triggers}

FORMAT PATTERNS:
${training.formats}

Structure the brief as:

1. MARKET INTELLIGENCE
What competitors did overnight. Narrative shifts. Gaps you can exploit.

2. YOUR PERFORMANCE
Yesterday's scorecard with analysis.

3. STRATEGIC RECOMMENDATIONS
Content pillars ranked by impact. Key messaging (what to say and what to avoid). Hook ideas to test.

4. CONTENT QUEUE
5-8 ready-to-post pieces. Each must have:
- A hook that stops the scroll
- A trigger that forces replies
- Platform-specific formatting
- Optimal posting time

5. BRAINSTORM VAULT
Ideas still building. Reactive templates for breaking news. A/B test suggestions.

Write every content piece in the user's EXACT voice. Be specific. Use the actual competitor data. No generic advice.
Never use these words: ${bannedWordsList}`;
}

// ============================================================
// LOAD PATTERNS FROM VAULT
// ============================================================

async function loadPatterns(clientId: string, role: string) {
  const [voiceProfile, training] = await Promise.all([
    vault.loadVoiceProfile(clientId, role),
    vault.loadTrainingData(clientId),
  ]);

  return { voiceProfile, training };
}

// ============================================================
// GENERATE WITH PATTERNS (core function)
// ============================================================

export async function generateWithPatterns(
  clientId: string,
  prompt: string,
  platform: Platform,
  mode: GenerationMode,
  role: string = "marketing",
): Promise<string> {
  const { voiceProfile, training } = await loadPatterns(clientId, role);

  if (!voiceProfile) {
    throw new Error("No voice profile found. Run onboarding first (/onboard/best-content).");
  }

  const systemPrompts: Record<GenerationMode, string> = {
    hook: buildHookSystemPrompt(voiceProfile, training),
    post: buildPostSystemPrompt(voiceProfile, platform, training),
    rewrite: buildRewriteSystemPrompt(voiceProfile),
    brief: buildBriefSystemPrompt(voiceProfile, training),
  };

  const maxTokens: Record<GenerationMode, number> = {
    hook: 1024,
    post: 1024,
    rewrite: 1024,
    brief: 4096,
  };

  const response = await callAgent({
    model: mode === "brief" ? "sonnet" : "haiku",
    system: systemPrompts[mode],
    user: prompt,
    max_tokens: maxTokens[mode],
  });

  return response;
}

// ============================================================
// GENERATE DAILY INTELLIGENCE BRIEF
// ============================================================

export async function generateIntelligenceBrief(
  clientId: string,
  platforms: Platform[],
  role: string = "marketing",
): Promise<string> {
  const [{ voiceProfile, training }, competitorDigest, yesterdayMetrics, overnightResearch] = await Promise.all([
    loadPatterns(clientId, role),
    buildCompetitorDigest(clientId),
    buildYesterdayMetrics(clientId),
    buildOvernightResearch(clientId),
  ]);

  if (!voiceProfile) {
    throw new Error("No voice profile found. Run onboarding first.");
  }

  const prompt = `Here's today's data:

Competitor digest:
${competitorDigest}

Yesterday's performance:
${yesterdayMetrics}

${overnightResearch}

Platforms: ${platforms.join(", ")}

Generate the full daily intelligence brief. If overnight research data is available, include an "OVERNIGHT RESEARCH" section with the top discoveries and recommendations.`;

  return generateWithPatterns(clientId, prompt, platforms[0] || "x", "brief", role);
}

// ============================================================
// HELPERS
// ============================================================

async function buildCompetitorDigest(clientId: string): Promise<string> {
  const competitors = await vault.listCompetitors(clientId);
  const entries: string[] = [];

  for (const handle of competitors) {
    const latestActivity = await vault.readFile(clientId, `competitors/${handle}/latest_activity.md`);
    const topPosts = await vault.readFile(clientId, `competitors/${handle}/top_posts.md`);

    if (latestActivity) {
      entries.push(`@${handle}:\n${latestActivity}`);
    } else if (topPosts) {
      entries.push(`@${handle}:\n${topPosts.substring(0, 500)}`);
    } else {
      entries.push(`@${handle}: No recent data.`);
    }
  }

  return entries.join("\n\n") || "No competitor data available.";
}

async function buildOvernightResearch(clientId: string): Promise<string> {
  const dateStr = new Date().toISOString().split("T")[0];
  const research = await vault.readFile(clientId, `research/autoresearch_${dateStr}.md`);

  if (research) {
    return `Overnight research (autoresearch ran while user slept):\n${research.substring(0, 2000)}`;
  }

  // Check yesterday's research if today's hasn't run yet
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split("T")[0];
  const yesterdayResearch = await vault.readFile(clientId, `research/autoresearch_${yesterday}.md`);

  if (yesterdayResearch) {
    return `Overnight research (from yesterday):\n${yesterdayResearch.substring(0, 2000)}`;
  }

  return "No overnight research data available yet.";
}

async function buildYesterdayMetrics(clientId: string): Promise<string> {
  // Check for published posts from yesterday
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split("T")[0];
  const briefFile = await vault.readFile(clientId, `posts/briefs/${yesterday}.md`);

  if (briefFile) {
    return `Previous brief from ${yesterday} exists. Review performance of recommended posts.\n${briefFile.substring(0, 1000)}`;
  }

  return "No performance data from yesterday yet.";
}
