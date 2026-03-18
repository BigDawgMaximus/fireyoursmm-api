import { prisma } from "../lib/prisma.js";
import { vault } from "../vault/manager.js";
import { callAgent } from "./claude.js";
import { HOOK_PATTERNS, BANNED_WORDS } from "../config/algorithm.js";
import {
  saveExperiments,
  getCalibrationFactors,
  type Experiment,
} from "./experiment-log.js";

// ============================================================
// AUTORESEARCH — Nightly content optimization loop
//
// Runs 50-65 experiments per user overnight. By morning, the
// daily brief contains optimized content based on discoveries.
//
// Pattern: Karpathy-style autoresearch applied to social media.
// Set a metric → run experiments → keep what improves → repeat.
//
// AI cost: ~$0.15-0.25 per user per night (Haiku only).
// ============================================================

const bannedWordsList = BANNED_WORDS.join(", ");

export interface AutoresearchResult {
  total_experiments: number;
  top_hooks: Experiment[];
  best_format: { format: string; score: number } | null;
  optimal_times: Array<{ slot: string; score: number }>;
  rising_pillars: string[];
  declining_pillars: string[];
  competitor_gaps: Array<{ topic: string; score: number }>;
  voice_drift_score: number;
  recommendations: string[];
  cost_usd: number;
  duration_ms: number;
}

// ============================================================
// MAIN ENTRY POINT
// ============================================================

export async function runContentResearch(userId: string): Promise<AutoresearchResult> {
  const start = Date.now();
  let aiCalls = 0;

  // ── Load all context ─────────────────────────────────────
  const [voiceProfile, training, competitorIntel] = await Promise.all([
    vault.loadVoiceProfile(userId, "marketing"),
    vault.loadTrainingData(userId),
    vault.loadCompetitorIntel(userId),
  ]);

  const historicalPosts = await loadHistoricalPosts(userId, 90);
  const calibration = await getCalibrationFactors(userId);
  const baseline = calculateBaseline(historicalPosts);

  const experiments: Experiment[] = [];

  // ── Experiment 1: Hook Variations (21 experiments, 7 AI calls) ──
  const hookTypes = ["contrarian", "number", "story", "question", "hot_take", "authority", "fomo"];
  for (const hookType of hookTypes) {
    const hooks = await generateHooksWithType(voiceProfile, training.hooks, hookType);
    aiCalls++;
    for (const hook of hooks) {
      const rawScore = scoreHookAgainstHistory(hook, hookType, baseline, historicalPosts);
      const score = Math.round(rawScore * (calibration["hook"] ?? 1.0));
      experiments.push({ type: "hook", variant: hookType, content: hook, score });
    }
  }

  // ── Experiment 2: Format Testing (12 experiments, 3 AI calls) ──
  const topHooks = experiments
    .filter((e) => e.type === "hook")
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  const formats = ["single", "thread", "image_text", "poll"] as const;
  for (const hookExp of topHooks) {
    for (const format of formats) {
      const draft = await expandHookToFormat(voiceProfile, hookExp.content ?? "", format);
      aiCalls++;
      const rawScore = scoreFormatAgainstHistory(format, baseline);
      const score = Math.round(rawScore * (calibration["format"] ?? 1.0));
      experiments.push({ type: "format", variant: format, content: draft, score });
    }
  }

  // ── Experiment 3: Timing Optimization (7-12 experiments, 0 AI calls) ──
  const timingExps = analyzeOptimalTiming(historicalPosts);
  experiments.push(...timingExps);

  // ── Experiment 4: Content Pillar Performance (6-10 experiments, 0 AI calls) ──
  const pillarExps = analyzeContentPillars(historicalPosts, competitorIntel);
  experiments.push(...pillarExps);

  // ── Experiment 5: Competitor Gap Analysis (5-10 experiments, 0 AI calls) ──
  const gapExps = findCompetitorGaps(historicalPosts, competitorIntel);
  experiments.push(...gapExps);

  // ── Experiment 6: Voice Drift Check (5 experiments, 0 AI calls) ──
  const voiceExps = checkVoiceDrift(voiceProfile, historicalPosts);
  experiments.push(...voiceExps);

  // ── Analyze results ──────────────────────────────────────
  const hookExps = experiments.filter((e) => e.type === "hook").sort((a, b) => b.score - a.score);
  const formatExps = experiments.filter((e) => e.type === "format").sort((a, b) => b.score - a.score);
  const timingResults = experiments.filter((e) => e.type === "timing").sort((a, b) => b.score - a.score);
  const pillarResults = experiments.filter((e) => e.type === "pillar");
  const gapResults = experiments.filter((e) => e.type === "gap").sort((a, b) => b.score - a.score);
  const voiceResults = experiments.filter((e) => e.type === "voice");

  const rising = pillarResults.filter((e) => e.score > 60).map((e) => e.variant);
  const declining = pillarResults.filter((e) => e.score < 40).map((e) => e.variant);
  const avgVoiceDrift = voiceResults.length > 0
    ? Math.round(voiceResults.reduce((s, e) => s + e.score, 0) / voiceResults.length)
    : 100;

  // ── Generate strategic recommendations (1 AI call) ───────
  const recommendations = await generateRecommendations({
    topHooks: hookExps.slice(0, 5),
    bestFormat: formatExps[0] ?? null,
    optimalTimes: timingResults.slice(0, 3),
    risingPillars: rising,
    decliningPillars: declining,
    gaps: gapResults.slice(0, 3),
    voiceDrift: avgVoiceDrift,
    baseline,
  });
  aiCalls++;

  const result: AutoresearchResult = {
    total_experiments: experiments.length,
    top_hooks: hookExps.slice(0, 5),
    best_format: formatExps[0] ? { format: formatExps[0].variant, score: formatExps[0].score } : null,
    optimal_times: timingResults.slice(0, 5).map((e) => ({ slot: e.variant, score: e.score })),
    rising_pillars: rising,
    declining_pillars: declining,
    competitor_gaps: gapResults.slice(0, 5).map((e) => ({ topic: e.variant, score: e.score })),
    voice_drift_score: avgVoiceDrift,
    recommendations,
    cost_usd: aiCalls * 0.005,
    duration_ms: Date.now() - start,
  };

  // ── Persist results ──────────────────────────────────────
  const dateStr = new Date().toISOString().split("T")[0];

  await Promise.all([
    saveExperiments(userId, experiments),
    vault.writeFile(userId, `research/autoresearch_${dateStr}.md`, formatResearchReport(result)),
  ]);

  // Append winning hooks to training data
  if (hookExps.length > 0) {
    const newHooks = hookExps
      .slice(0, 5)
      .filter((h) => h.content)
      .map((h) => `- ${h.content} [score: ${h.score}, type: ${h.variant}]`)
      .join("\n");
    if (newHooks) {
      await vault.appendFile(userId, "training/hooks_that_worked.md", `\n\n## Autoresearch ${dateStr}\n${newHooks}`);
    }
  }

  return result;
}

// ============================================================
// SCORING FUNCTIONS ($0 — no AI calls)
// ============================================================

interface Baseline {
  avgEngagement: number;
  avgLength: number;
  topHookTypes: Record<string, number>;
  topFormats: Record<string, number>;
  timeBuckets: Record<string, number>;
  pillarScores: Record<string, number>;
  recentTopics: Set<string>;
}

interface HistoricalPost {
  text: string;
  engagement: number;
  format: string;
  hour: number;
  dayOfWeek: number;
}

function calculateBaseline(posts: HistoricalPost[]): Baseline {
  if (posts.length === 0) {
    return {
      avgEngagement: 0, avgLength: 0,
      topHookTypes: {}, topFormats: {},
      timeBuckets: {}, pillarScores: {},
      recentTopics: new Set(),
    };
  }

  const totalEng = posts.reduce((s, p) => s + p.engagement, 0);
  const totalLen = posts.reduce((s, p) => s + p.text.length, 0);

  // Hook type performance
  const hookTypeEng: Record<string, number[]> = {};
  for (const post of posts) {
    const types = detectHookTypes(post.text);
    for (const t of types) {
      if (!hookTypeEng[t]) hookTypeEng[t] = [];
      hookTypeEng[t].push(post.engagement);
    }
  }
  const topHookTypes: Record<string, number> = {};
  for (const [type, engs] of Object.entries(hookTypeEng)) {
    topHookTypes[type] = engs.reduce((a, b) => a + b, 0) / engs.length;
  }

  // Format performance
  const formatEng: Record<string, number[]> = {};
  for (const post of posts) {
    if (!formatEng[post.format]) formatEng[post.format] = [];
    formatEng[post.format].push(post.engagement);
  }
  const topFormats: Record<string, number> = {};
  for (const [fmt, engs] of Object.entries(formatEng)) {
    topFormats[fmt] = engs.reduce((a, b) => a + b, 0) / engs.length;
  }

  // Time buckets
  const bucketEng: Record<string, number[]> = {};
  for (const post of posts) {
    const bucket = hourToBucket(post.hour);
    if (!bucketEng[bucket]) bucketEng[bucket] = [];
    bucketEng[bucket].push(post.engagement);
  }
  const timeBuckets: Record<string, number> = {};
  for (const [bucket, engs] of Object.entries(bucketEng)) {
    timeBuckets[bucket] = engs.reduce((a, b) => a + b, 0) / engs.length;
  }

  // Extract recent topics (simple word frequency from last 30 posts)
  const recentTopics = new Set<string>();
  for (const post of posts.slice(0, 30)) {
    const words = post.text.toLowerCase().split(/\s+/).filter((w) => w.length > 5);
    words.forEach((w) => recentTopics.add(w));
  }

  return {
    avgEngagement: totalEng / posts.length,
    avgLength: totalLen / posts.length,
    topHookTypes,
    topFormats,
    timeBuckets,
    pillarScores: topFormats, // Reuse format as proxy for pillars
    recentTopics,
  };
}

function scoreHookAgainstHistory(
  hook: string,
  hookType: string,
  baseline: Baseline,
  posts: HistoricalPost[],
): number {
  let score = 50; // Base score

  // 1. Hook type match — does this user's audience respond to this type?
  const typeAvg = baseline.topHookTypes[hookType] ?? 0;
  const overallAvg = baseline.avgEngagement || 1;
  if (typeAvg > overallAvg * 1.2) score += 20; // This type outperforms
  else if (typeAvg > overallAvg) score += 10;
  else if (typeAvg < overallAvg * 0.5) score -= 15; // This type underperforms

  // 2. Length similarity to top performers
  const topPosts = posts.sort((a, b) => b.engagement - a.engagement).slice(0, 10);
  const avgTopLength = topPosts.length > 0
    ? topPosts.reduce((s, p) => s + p.text.length, 0) / topPosts.length
    : 150;
  const lengthDiff = Math.abs(hook.length - avgTopLength) / avgTopLength;
  if (lengthDiff < 0.2) score += 10; // Similar length
  else if (lengthDiff > 0.5) score -= 10; // Very different length

  // 3. First-word impact
  const firstWord = hook.split(/\s/)[0]?.toUpperCase() ?? "";
  if (/^\d/.test(firstWord)) score += 8; // Starts with number
  if (firstWord.endsWith("?")) score += 5; // Question
  if (["BREAKING", "JUST", "ALERT", "UNPOPULAR"].includes(firstWord)) score += 10;

  // 4. Emotional intensity (power words)
  const powerWords = ["never", "always", "secret", "mistake", "wrong", "truth", "hate", "love", "obsessed", "insane", "shocking"];
  const foundPower = powerWords.filter((w) => hook.toLowerCase().includes(w)).length;
  score += Math.min(foundPower * 5, 15);

  // 5. Novelty — how different from recent content
  const hookWords = new Set(hook.toLowerCase().split(/\s+/).filter((w) => w.length > 4));
  const overlap = [...hookWords].filter((w) => baseline.recentTopics.has(w)).length;
  const novelty = hookWords.size > 0 ? 1 - overlap / hookWords.size : 0.5;
  score += Math.round(novelty * 15); // More novel = higher score

  return Math.max(0, Math.min(100, score));
}

function scoreFormatAgainstHistory(format: string, baseline: Baseline): number {
  let score = 50;

  const formatAvg = baseline.topFormats[format] ?? 0;
  const overallAvg = baseline.avgEngagement || 1;

  if (formatAvg > overallAvg * 1.3) score += 25; // This format significantly outperforms
  else if (formatAvg > overallAvg) score += 15;
  else if (formatAvg < overallAvg * 0.7) score -= 15;

  // Bonus for underused high-performing formats
  const formatCounts = Object.values(baseline.topFormats);
  const totalPosts = formatCounts.reduce((a, b) => a + b, 0) || 1;
  const formatShare = (baseline.topFormats[format] ?? 0) / totalPosts;
  if (formatShare < 0.15 && formatAvg > overallAvg) {
    score += 15; // Underused but effective
  }

  return Math.max(0, Math.min(100, score));
}

function analyzeOptimalTiming(posts: HistoricalPost[]): Experiment[] {
  const buckets = ["5-9AM", "9-12PM", "12-3PM", "3-6PM", "6-9PM", "9PM-12AM"];
  const experiments: Experiment[] = [];

  const bucketData: Record<string, { total: number; count: number }> = {};
  for (const post of posts) {
    const bucket = hourToBucket(post.hour);
    if (!bucketData[bucket]) bucketData[bucket] = { total: 0, count: 0 };
    bucketData[bucket].total += post.engagement;
    bucketData[bucket].count++;
  }

  for (const bucket of buckets) {
    const data = bucketData[bucket];
    const avg = data ? data.total / data.count : 0;
    const maxAvg = Math.max(...Object.values(bucketData).map((d) => d.total / d.count), 1);
    const score = Math.round((avg / maxAvg) * 100);

    experiments.push({ type: "timing", variant: bucket, score });
  }

  // Add day-of-week analysis
  const dayData: Record<number, { total: number; count: number }> = {};
  for (const post of posts) {
    if (!dayData[post.dayOfWeek]) dayData[post.dayOfWeek] = { total: 0, count: 0 };
    dayData[post.dayOfWeek].total += post.engagement;
    dayData[post.dayOfWeek].count++;
  }
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const maxDayAvg = Math.max(...Object.values(dayData).map((d) => d.total / d.count), 1);
  for (const [day, data] of Object.entries(dayData)) {
    const score = Math.round((data.total / data.count / maxDayAvg) * 100);
    experiments.push({ type: "timing", variant: dayNames[Number(day)], score });
  }

  return experiments;
}

function analyzeContentPillars(posts: HistoricalPost[], competitorIntel: string): Experiment[] {
  // Extract rough "pillars" by checking common topic keywords
  const pillars = ["tutorial", "opinion", "news", "story", "thread", "question", "announcement", "meme"];
  const experiments: Experiment[] = [];

  for (const pillar of pillars) {
    const matching = posts.filter((p) => p.text.toLowerCase().includes(pillar));
    if (matching.length === 0) {
      // Not used — check if competitors use it
      if (competitorIntel.toLowerCase().includes(pillar)) {
        experiments.push({ type: "pillar", variant: pillar, score: 55, content: "Gap: competitors use this pillar" });
      }
      continue;
    }
    const avgEng = matching.reduce((s, p) => s + p.engagement, 0) / matching.length;
    const overall = posts.reduce((s, p) => s + p.engagement, 0) / posts.length || 1;
    const score = Math.round((avgEng / overall) * 50 + 25);
    experiments.push({ type: "pillar", variant: pillar, score: Math.min(100, score) });
  }

  return experiments;
}

function findCompetitorGaps(posts: HistoricalPost[], competitorIntel: string): Experiment[] {
  const experiments: Experiment[] = [];
  const userTopics = new Set(posts.flatMap((p) => extractKeyTopics(p.text)));

  // Extract topics from competitor intel
  const compTopics = extractKeyTopics(competitorIntel);

  for (const topic of compTopics) {
    if (!userTopics.has(topic) && topic.length > 3) {
      // Competitor covers this, user doesn't
      const mentionCount = (competitorIntel.match(new RegExp(topic, "gi")) || []).length;
      const score = Math.min(100, 40 + mentionCount * 10);
      experiments.push({ type: "gap", variant: topic, score, content: `Competitor covers "${topic}" — you don't` });
    }
  }

  return experiments.sort((a, b) => b.score - a.score).slice(0, 10);
}

function checkVoiceDrift(voiceProfile: string, posts: HistoricalPost[]): Experiment[] {
  const experiments: Experiment[] = [];
  const recent = posts.slice(0, 10);
  if (recent.length === 0 || !voiceProfile) return experiments;

  // Extract voice markers from profile
  const profileLower = voiceProfile.toLowerCase();
  const markers = {
    emoji: profileLower.includes("emoji") || profileLower.includes("🔥"),
    short_sentences: profileLower.includes("short") || profileLower.includes("punchy"),
    questions: profileLower.includes("question"),
    data: profileLower.includes("data") || profileLower.includes("number"),
    humor: profileLower.includes("humor") || profileLower.includes("witty"),
  };

  // Check if recent posts match
  for (const [marker, expected] of Object.entries(markers)) {
    let matchCount = 0;
    for (const post of recent) {
      const text = post.text;
      switch (marker) {
        case "emoji":
          if (/[\u{1F300}-\u{1F9FF}]/u.test(text)) matchCount++;
          break;
        case "short_sentences":
          if (text.split(/[.!?]/).filter(Boolean).length > 2 && text.length < 200) matchCount++;
          break;
        case "questions":
          if (text.includes("?")) matchCount++;
          break;
        case "data":
          if (/\d+[%xKMB]/.test(text)) matchCount++;
          break;
        case "humor":
          if (/lol|lmao|😂|🤣|haha/i.test(text)) matchCount++;
          break;
      }
    }

    const driftScore = expected ? Math.round((matchCount / recent.length) * 100) : 50;
    experiments.push({
      type: "voice",
      variant: marker,
      score: driftScore,
      content: `Voice marker "${marker}": ${matchCount}/${recent.length} recent posts match`,
    });
  }

  return experiments;
}

// ============================================================
// AI CALLS (Haiku only, ~$0.005 each)
// ============================================================

async function generateHooksWithType(
  voiceProfile: string,
  trainingHooks: string,
  hookType: string,
): Promise<string[]> {
  const response = await callAgent({
    model: "haiku",
    system: `Generate exactly 3 social media hooks of type "${hookType}".
Write in this person's voice:
${voiceProfile.substring(0, 800)}

Past hooks that worked:
${trainingHooks.substring(0, 500)}

Never use: ${bannedWordsList}
Output ONLY the 3 hooks, one per line. No labels, no numbers, no explanations.`,
    user: `Generate 3 ${hookType} hooks about recent trends in this person's niche.`,
    max_tokens: 256,
  });

  return response.split("\n").map((l) => l.trim()).filter(Boolean).slice(0, 3);
}

async function expandHookToFormat(
  voiceProfile: string,
  hook: string,
  format: string,
): Promise<string> {
  const formatInstructions: Record<string, string> = {
    single: "Expand into a single compelling post (1-3 paragraphs).",
    thread: "Expand into a 5-tweet thread. Number each tweet. First tweet is the hook.",
    image_text: "Write caption text to accompany a visual/image post. Include a CTA.",
    poll: "Create a poll question with 2-4 options. Start with the hook, then present the poll.",
  };

  const response = await callAgent({
    model: "haiku",
    system: `You write social media content. Match this voice:
${voiceProfile.substring(0, 500)}
Never use: ${bannedWordsList}`,
    user: `Hook: "${hook}"\n\n${formatInstructions[format] ?? formatInstructions.single}`,
    max_tokens: 512,
  });

  return response;
}

async function generateRecommendations(analysis: {
  topHooks: Experiment[];
  bestFormat: Experiment | null;
  optimalTimes: Experiment[];
  risingPillars: string[];
  decliningPillars: string[];
  gaps: Experiment[];
  voiceDrift: number;
  baseline: Baseline;
}): Promise<string[]> {
  const prompt = `Based on overnight research:

TOP HOOKS (scored 0-100):
${analysis.topHooks.map((h) => `- [${h.score}] ${h.variant}: ${h.content?.substring(0, 80)}`).join("\n")}

BEST FORMAT: ${analysis.bestFormat?.variant ?? "unknown"} (score: ${analysis.bestFormat?.score ?? 0})

OPTIMAL TIMES: ${analysis.optimalTimes.map((t) => `${t.variant}(${t.score})`).join(", ")}

RISING PILLARS: ${analysis.risingPillars.join(", ") || "none detected"}
DECLINING PILLARS: ${analysis.decliningPillars.join(", ") || "none detected"}

COMPETITOR GAPS: ${analysis.gaps.map((g) => g.variant).join(", ") || "none"}

VOICE DRIFT SCORE: ${analysis.voiceDrift}/100 (100=on-brand, <50=drifting)

Generate exactly 5 actionable recommendations for today. Be specific. One sentence each.`;

  const response = await callAgent({
    model: "haiku",
    system: "You are a social media strategist. Give specific, actionable recommendations based on data. No fluff.",
    user: prompt,
    max_tokens: 512,
  });

  return response.split("\n").map((l) => l.trim()).filter(Boolean).slice(0, 5);
}

// ============================================================
// HELPERS
// ============================================================

async function loadHistoricalPosts(userId: string, days: number): Promise<HistoricalPost[]> {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  // Load from GeneratedContent (user's own content)
  const generated = await prisma.generatedContent.findMany({
    where: {
      user_id: userId,
      type: { in: ["post", "hook"] },
      approved: true,
      created_at: { gte: since },
    },
    select: { output: true, created_at: true, velocity_score: true },
    orderBy: { created_at: "desc" },
  });

  // Load from training data (best posts from onboarding)
  const bestPosts = await vault.readFile(userId, "training/best_performing_posts.md");

  const posts: HistoricalPost[] = [];

  for (const g of generated) {
    posts.push({
      text: g.output,
      engagement: g.velocity_score ?? 50,
      format: detectFormat(g.output),
      hour: g.created_at.getHours(),
      dayOfWeek: g.created_at.getDay(),
    });
  }

  // Parse best posts from vault
  if (bestPosts) {
    const sections = bestPosts.split("---").filter(Boolean);
    for (const section of sections) {
      const text = section.replace(/^## Post \d+\n+/, "").trim();
      if (text.length > 10) {
        posts.push({
          text,
          engagement: 80, // Assumed high since these are "best" posts
          format: detectFormat(text),
          hour: 10, // Default
          dayOfWeek: 1,
        });
      }
    }
  }

  return posts;
}

function detectFormat(text: string): string {
  if (text.includes("1/") || text.includes("🧵") || text.split("\n").length > 5) return "thread";
  if (text.includes("?") && text.length < 100) return "poll";
  if (text.length < 80) return "single";
  return "single";
}

function detectHookTypes(text: string): string[] {
  const firstLine = text.split("\n")[0]?.substring(0, 120) ?? "";
  const types: string[] = [];

  for (const pattern of HOOK_PATTERNS) {
    if (pattern.template.includes("{") && firstLine.length > 10) {
      // Simple heuristic matching
      if (pattern.name === "urgency_break" && /^(BREAKING|JUST IN|ALERT)/i.test(firstLine)) types.push("urgency");
      if (pattern.name === "contrarian" && /wrong|unpopular/i.test(firstLine)) types.push("contrarian");
      if (pattern.name === "number_hook" && /\d+[%xKMB]/.test(firstLine)) types.push("number");
      if (pattern.name === "binary_choice" && /\bor\b.*\?/i.test(firstLine)) types.push("binary");
      if (pattern.name === "prediction" && /will |going to/i.test(firstLine)) types.push("prediction");
      if (pattern.name === "insider" && /nobody|no one|sleeping on/i.test(firstLine)) types.push("insider");
      if (pattern.name === "listicle" && /^\d+\s+(things?|ways?|tips?)/i.test(firstLine)) types.push("listicle");
      if (pattern.name === "question" && firstLine.includes("?")) types.push("question");
    }
  }

  return types.length > 0 ? types : ["unclassified"];
}

function extractKeyTopics(text: string): string[] {
  // Extract significant words (nouns/keywords, rough heuristic)
  return text
    .toLowerCase()
    .replace(/[^a-z\s]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 5)
    .filter((w) => !["about", "their", "there", "these", "those", "which", "would", "should", "could", "other"].includes(w))
    .slice(0, 50);
}

function hourToBucket(hour: number): string {
  if (hour >= 5 && hour < 9) return "5-9AM";
  if (hour >= 9 && hour < 12) return "9-12PM";
  if (hour >= 12 && hour < 15) return "12-3PM";
  if (hour >= 15 && hour < 18) return "3-6PM";
  if (hour >= 18 && hour < 21) return "6-9PM";
  if (hour >= 21) return "9PM-12AM";
  return "12-5AM";
}

// ============================================================
// REPORT FORMATTER
// ============================================================

function formatResearchReport(result: AutoresearchResult): string {
  const lines: string[] = [
    `# Autoresearch Report — ${new Date().toISOString().split("T")[0]}`,
    "",
    `Ran **${result.total_experiments} experiments** in ${result.duration_ms}ms. Cost: $${result.cost_usd.toFixed(3)}`,
    "",
    "## Top Hook Discoveries",
    ...result.top_hooks.map((h, i) =>
      `${i + 1}. [${h.score}/100] **${h.variant}**: ${h.content}`
    ),
    "",
    "## Best Format",
    result.best_format ? `**${result.best_format.format}** (score: ${result.best_format.score})` : "Insufficient data",
    "",
    "## Optimal Posting Times",
    ...result.optimal_times.map((t) => `- ${t.slot}: ${t.score}/100`),
    "",
    "## Content Pillars",
    `Rising: ${result.rising_pillars.join(", ") || "none"}`,
    `Declining: ${result.declining_pillars.join(", ") || "none"}`,
    "",
    "## Competitor Gaps",
    ...result.competitor_gaps.map((g) => `- ${g.topic} (opportunity: ${g.score}/100)`),
    "",
    "## Voice Drift",
    `Score: ${result.voice_drift_score}/100 ${result.voice_drift_score < 50 ? "⚠️ DRIFTING" : "✅ On-brand"}`,
    "",
    "## Recommendations",
    ...result.recommendations.map((r, i) => `${i + 1}. ${r}`),
  ];

  return lines.join("\n");
}
