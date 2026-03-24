import type { ScrapedPost, Platform, PostMetrics } from "../types/index.js";

// ============================================================
// STATISTICAL ANALYSIS ENGINE
// Zero AI cost. Pure math, regex, statistics.
// This is what makes FireYourSMM different from every wrapper.
// ============================================================

export interface StatisticalAnalysis {
  account_handle: string;
  platform: Platform;
  total_posts_analyzed: number;
  analysis_date: string;

  top_performers: TopPerformerAnalysis;
  posting_schedule: PostingScheduleAnalysis;
  hook_patterns: HookPatternAnalysis;
  post_length: PostLengthAnalysis;
  media_performance: MediaPerformanceAnalysis;
  hashtag_strategy: HashtagStrategyAnalysis;
  format_detection: FormatDetectionAnalysis;
  topic_clusters: TopicClusterAnalysis;
  competitor_comparison?: CompetitorComparison;
}

interface TopPerformerAnalysis {
  top_posts: RankedPost[];
  bottom_posts: RankedPost[];
  median_engagement_rate: number;
  avg_engagement_rate: number;
  p90_engagement_rate: number;
}

interface RankedPost {
  text: string;
  engagement_rate: number;
  metrics: PostMetrics;
  date: string;
}

interface PostingScheduleAnalysis {
  optimal_schedule: TimeSlot[];
  worst_times: TimeSlot[];
  day_performance: { day: string; avg_engagement: number; post_count: number }[];
  hour_performance: { hour: number; avg_engagement: number; post_count: number }[];
}

interface TimeSlot {
  day: string;
  hour: number;
  avg_engagement: number;
  post_count: number;
}

interface HookPatternAnalysis {
  dominant_type: string;
  top_performing_hooks: { text: string; pattern: string; engagement_rate: number }[];
  pattern_engagement_rates: { pattern: string; avg_engagement: number; count: number }[];
}

interface PostLengthAnalysis {
  optimal_chars: { min: number; max: number };
  optimal_words: { min: number; max: number };
  optimal_lines: { min: number; max: number };
  correlation_score: number; // -1 to 1: negative = shorter is better
}

interface MediaPerformanceAnalysis {
  media_ranking: { type: string; avg_engagement: number; count: number }[];
}

interface HashtagStrategyAnalysis {
  platform_recommendations: Record<string, {
    recommended_count: number;
    top_performing_tags: string[];
    engagement_with_hashtags: number;
    engagement_without_hashtags: number;
  }>;
}

interface FormatDetectionAnalysis {
  format_ranking: { format: string; avg_engagement: number; count: number }[];
}

interface TopicClusterAnalysis {
  topic_performance: { topic: string; keywords: string[]; avg_engagement: number; count: number }[];
}

export interface CompetitorComparison {
  competitors: {
    handle: string;
    total_posts: number;
    avg_engagement_rate: number;
    top_format: string;
    best_posting_time: string;
    dominant_hook: string;
  }[];
  competitive_gaps: string[];
  competitive_advantages: string[];
}

// ============================================================
// CORE: Compute engagement rate for a post
// ============================================================

function engagementRate(post: ScrapedPost, followerCount?: number): number {
  const m = post.metrics;
  const totalEngagement =
    (m.likes || 0) +
    (m.retweets || 0) +
    (m.replies || 0) +
    (m.bookmarks || 0) +
    (m.comments || 0) +
    (m.shares || 0) +
    (m.saves || 0) +
    (m.reposts || 0);

  if (m.impressions && m.impressions > 0) {
    return totalEngagement / m.impressions;
  }
  if (m.views && m.views > 0) {
    return totalEngagement / m.views;
  }
  if (followerCount && followerCount > 0) {
    return totalEngagement / followerCount;
  }
  return totalEngagement > 0 ? totalEngagement / 1000 : 0;
}

// ============================================================
// ANALYSIS 1: Top Performer Identification
// ============================================================

function analyzeTopPerformers(posts: ScrapedPost[], followerCount?: number): TopPerformerAnalysis {
  const rates = posts.map(p => ({
    post: p,
    rate: engagementRate(p, followerCount),
  })).sort((a, b) => b.rate - a.rate);

  const topN = Math.max(1, Math.ceil(rates.length * 0.1));
  const bottomN = Math.max(1, Math.ceil(rates.length * 0.1));

  const allRates = rates.map(r => r.rate);
  const sorted = [...allRates].sort((a, b) => a - b);
  const median = sorted[Math.floor(sorted.length / 2)] || 0;
  const avg = allRates.reduce((s, r) => s + r, 0) / (allRates.length || 1);
  const p90 = sorted[Math.floor(sorted.length * 0.9)] || 0;

  const toRanked = (r: { post: ScrapedPost; rate: number }): RankedPost => ({
    text: r.post.text.substring(0, 200),
    engagement_rate: Math.round(r.rate * 10000) / 10000,
    metrics: r.post.metrics,
    date: r.post.date,
  });

  return {
    top_posts: rates.slice(0, topN).map(toRanked),
    bottom_posts: rates.slice(-bottomN).map(toRanked),
    median_engagement_rate: Math.round(median * 10000) / 10000,
    avg_engagement_rate: Math.round(avg * 10000) / 10000,
    p90_engagement_rate: Math.round(p90 * 10000) / 10000,
  };
}

// ============================================================
// ANALYSIS 2: Posting Schedule
// ============================================================

function analyzePostingSchedule(posts: ScrapedPost[], followerCount?: number): PostingScheduleAnalysis {
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  const dayMap = new Map<string, { total: number; count: number }>();
  const hourMap = new Map<number, { total: number; count: number }>();
  const slotMap = new Map<string, { total: number; count: number; day: string; hour: number }>();

  for (const post of posts) {
    const d = new Date(post.date);
    if (isNaN(d.getTime())) continue;
    const day = dayNames[d.getDay()];
    const hour = d.getHours();
    const rate = engagementRate(post, followerCount);

    // Day aggregation
    const dayEntry = dayMap.get(day) || { total: 0, count: 0 };
    dayEntry.total += rate;
    dayEntry.count += 1;
    dayMap.set(day, dayEntry);

    // Hour aggregation
    const hourEntry = hourMap.get(hour) || { total: 0, count: 0 };
    hourEntry.total += rate;
    hourEntry.count += 1;
    hourMap.set(hour, hourEntry);

    // Slot aggregation
    const key = `${day}-${hour}`;
    const slotEntry = slotMap.get(key) || { total: 0, count: 0, day, hour };
    slotEntry.total += rate;
    slotEntry.count += 1;
    slotMap.set(key, slotEntry);
  }

  const slots: TimeSlot[] = [...slotMap.values()]
    .filter(s => s.count >= 2)
    .map(s => ({
      day: s.day,
      hour: s.hour,
      avg_engagement: Math.round((s.total / s.count) * 10000) / 10000,
      post_count: s.count,
    }))
    .sort((a, b) => b.avg_engagement - a.avg_engagement);

  return {
    optimal_schedule: slots.slice(0, 3),
    worst_times: slots.slice(-3).reverse(),
    day_performance: dayNames.map(day => {
      const entry = dayMap.get(day);
      return {
        day,
        avg_engagement: entry ? Math.round((entry.total / entry.count) * 10000) / 10000 : 0,
        post_count: entry?.count || 0,
      };
    }),
    hour_performance: Array.from({ length: 24 }, (_, h) => {
      const entry = hourMap.get(h);
      return {
        hour: h,
        avg_engagement: entry ? Math.round((entry.total / entry.count) * 10000) / 10000 : 0,
        post_count: entry?.count || 0,
      };
    }),
  };
}

// ============================================================
// ANALYSIS 3: Hook Patterns
// ============================================================

function analyzeHookPatterns(posts: ScrapedPost[], followerCount?: number): HookPatternAnalysis {
  const patterns: Record<string, { total: number; count: number; examples: { text: string; rate: number }[] }> = {
    starts_with_number: { total: 0, count: 0, examples: [] },
    starts_with_question: { total: 0, count: 0, examples: [] },
    starts_with_breaking: { total: 0, count: 0, examples: [] },
    starts_with_contrarian: { total: 0, count: 0, examples: [] },
    starts_with_emoji: { total: 0, count: 0, examples: [] },
    starts_with_statistic: { total: 0, count: 0, examples: [] },
    starts_with_quote: { total: 0, count: 0, examples: [] },
    starts_with_story: { total: 0, count: 0, examples: [] },
    other: { total: 0, count: 0, examples: [] },
  };

  for (const post of posts) {
    const text = post.text.trim();
    const firstLine = text.split("\n")[0].trim();
    const rate = engagementRate(post, followerCount);
    let matched = false;

    if (/^\d/.test(firstLine)) {
      patterns.starts_with_number.total += rate;
      patterns.starts_with_number.count += 1;
      patterns.starts_with_number.examples.push({ text: firstLine.substring(0, 80), rate });
      matched = true;
    }
    if (/^[^a-zA-Z0-9]*[?]|^(who|what|when|where|why|how|are|is|do|does|did|can|could|would|should|have)/i.test(firstLine)) {
      patterns.starts_with_question.total += rate;
      patterns.starts_with_question.count += 1;
      patterns.starts_with_question.examples.push({ text: firstLine.substring(0, 80), rate });
      matched = true;
    }
    if (/^(BREAKING|JUST IN|🚨|⚡)/i.test(firstLine)) {
      patterns.starts_with_breaking.total += rate;
      patterns.starts_with_breaking.count += 1;
      patterns.starts_with_breaking.examples.push({ text: firstLine.substring(0, 80), rate });
      matched = true;
    }
    if (/^(most people|nobody|unpopular opinion|hot take|controversial|people think|everyone says)/i.test(firstLine)) {
      patterns.starts_with_contrarian.total += rate;
      patterns.starts_with_contrarian.count += 1;
      patterns.starts_with_contrarian.examples.push({ text: firstLine.substring(0, 80), rate });
      matched = true;
    }
    if (/^[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u.test(firstLine)) {
      patterns.starts_with_emoji.total += rate;
      patterns.starts_with_emoji.count += 1;
      patterns.starts_with_emoji.examples.push({ text: firstLine.substring(0, 80), rate });
      matched = true;
    }
    if (/\d+%|\$\d|€\d|\d+x|\d+\.\d+/.test(firstLine)) {
      patterns.starts_with_statistic.total += rate;
      patterns.starts_with_statistic.count += 1;
      patterns.starts_with_statistic.examples.push({ text: firstLine.substring(0, 80), rate });
      matched = true;
    }
    if (/^["'""]/.test(firstLine)) {
      patterns.starts_with_quote.total += rate;
      patterns.starts_with_quote.count += 1;
      patterns.starts_with_quote.examples.push({ text: firstLine.substring(0, 80), rate });
      matched = true;
    }
    if (/^(I was|I remember|Last (week|month|year)|Yesterday|Today|This morning|A few)/i.test(firstLine)) {
      patterns.starts_with_story.total += rate;
      patterns.starts_with_story.count += 1;
      patterns.starts_with_story.examples.push({ text: firstLine.substring(0, 80), rate });
      matched = true;
    }
    if (!matched) {
      patterns.other.total += rate;
      patterns.other.count += 1;
      patterns.other.examples.push({ text: firstLine.substring(0, 80), rate });
    }
  }

  const patternRanking = Object.entries(patterns)
    .filter(([_, v]) => v.count > 0)
    .map(([pattern, v]) => ({
      pattern,
      avg_engagement: Math.round((v.total / v.count) * 10000) / 10000,
      count: v.count,
    }))
    .sort((a, b) => b.avg_engagement - a.avg_engagement);

  const topHooks = Object.values(patterns)
    .flatMap(p => p.examples)
    .sort((a, b) => b.rate - a.rate)
    .slice(0, 10)
    .map(h => ({
      text: h.text,
      pattern: detectHookPattern(h.text),
      engagement_rate: Math.round(h.rate * 10000) / 10000,
    }));

  return {
    dominant_type: patternRanking[0]?.pattern || "other",
    top_performing_hooks: topHooks,
    pattern_engagement_rates: patternRanking,
  };
}

function detectHookPattern(text: string): string {
  if (/^\d/.test(text)) return "number";
  if (/\?/.test(text)) return "question";
  if (/^(BREAKING|JUST IN|🚨)/i.test(text)) return "breaking";
  if (/^(most people|nobody|unpopular|hot take)/i.test(text)) return "contrarian";
  if (/\d+%|\$\d|\d+x/.test(text)) return "statistic";
  if (/^["'""]/.test(text)) return "quote";
  return "other";
}

// ============================================================
// ANALYSIS 4: Post Length
// ============================================================

function analyzePostLength(posts: ScrapedPost[], followerCount?: number): PostLengthAnalysis {
  const data = posts.map(p => ({
    chars: p.text.length,
    words: p.text.split(/\s+/).filter(Boolean).length,
    lines: p.text.split("\n").filter(l => l.trim()).length,
    rate: engagementRate(p, followerCount),
  }));

  // Sort by engagement, take top quartile for optimal ranges
  const sorted = [...data].sort((a, b) => b.rate - a.rate);
  const topQ = sorted.slice(0, Math.max(1, Math.ceil(sorted.length * 0.25)));

  const charValues = topQ.map(d => d.chars).sort((a, b) => a - b);
  const wordValues = topQ.map(d => d.words).sort((a, b) => a - b);
  const lineValues = topQ.map(d => d.lines).sort((a, b) => a - b);

  // Correlation between length and engagement
  const n = data.length;
  if (n < 3) {
    return {
      optimal_chars: { min: 50, max: 280 },
      optimal_words: { min: 10, max: 50 },
      optimal_lines: { min: 1, max: 5 },
      correlation_score: 0,
    };
  }

  const avgChars = data.reduce((s, d) => s + d.chars, 0) / n;
  const avgRate = data.reduce((s, d) => s + d.rate, 0) / n;
  let num = 0, denA = 0, denB = 0;
  for (const d of data) {
    num += (d.chars - avgChars) * (d.rate - avgRate);
    denA += (d.chars - avgChars) ** 2;
    denB += (d.rate - avgRate) ** 2;
  }
  const correlation = denA && denB ? num / Math.sqrt(denA * denB) : 0;

  return {
    optimal_chars: { min: charValues[0] || 50, max: charValues[charValues.length - 1] || 280 },
    optimal_words: { min: wordValues[0] || 10, max: wordValues[wordValues.length - 1] || 50 },
    optimal_lines: { min: lineValues[0] || 1, max: lineValues[lineValues.length - 1] || 5 },
    correlation_score: Math.round(correlation * 100) / 100,
  };
}

// ============================================================
// ANALYSIS 5: Media Type Performance
// ============================================================

function analyzeMediaPerformance(posts: ScrapedPost[], followerCount?: number): MediaPerformanceAnalysis {
  const mediaMap = new Map<string, { total: number; count: number }>();

  for (const post of posts) {
    const type = post.media_type || "text";
    const entry = mediaMap.get(type) || { total: 0, count: 0 };
    entry.total += engagementRate(post, followerCount);
    entry.count += 1;
    mediaMap.set(type, entry);
  }

  return {
    media_ranking: [...mediaMap.entries()]
      .map(([type, v]) => ({
        type,
        avg_engagement: Math.round((v.total / v.count) * 10000) / 10000,
        count: v.count,
      }))
      .sort((a, b) => b.avg_engagement - a.avg_engagement),
  };
}

// ============================================================
// ANALYSIS 6: Hashtag Analysis
// ============================================================

function analyzeHashtags(posts: ScrapedPost[], platform: Platform, followerCount?: number): HashtagStrategyAnalysis {
  let withTags = 0, withoutTags = 0, withCount = 0, withoutCount = 0;
  const tagCounts = new Map<string, { total: number; count: number }>();

  for (const post of posts) {
    const tags = post.text.match(/#\w+/g) || [];
    const rate = engagementRate(post, followerCount);

    if (tags.length > 0) {
      withTags += rate;
      withCount += 1;
      for (const tag of tags) {
        const entry = tagCounts.get(tag.toLowerCase()) || { total: 0, count: 0 };
        entry.total += rate;
        entry.count += 1;
        tagCounts.set(tag.toLowerCase(), entry);
      }
    } else {
      withoutTags += rate;
      withoutCount += 1;
    }
  }

  const topTags = [...tagCounts.entries()]
    .map(([tag, v]) => ({ tag, avg: v.total / v.count, count: v.count }))
    .filter(t => t.count >= 2)
    .sort((a, b) => b.avg - a.avg)
    .slice(0, 10)
    .map(t => t.tag);

  // Platform-specific recommendations
  const platformRecs: Record<string, { recommended_count: number; top_performing_tags: string[]; engagement_with_hashtags: number; engagement_without_hashtags: number }> = {};

  if (platform === "x") {
    platformRecs.x = {
      recommended_count: 0, // Deboosted in 2026
      top_performing_tags: [],
      engagement_with_hashtags: withCount ? Math.round((withTags / withCount) * 10000) / 10000 : 0,
      engagement_without_hashtags: withoutCount ? Math.round((withoutTags / withoutCount) * 10000) / 10000 : 0,
    };
  } else if (platform === "instagram") {
    platformRecs.instagram = {
      recommended_count: Math.min(15, Math.max(5, topTags.length)),
      top_performing_tags: topTags.slice(0, 15),
      engagement_with_hashtags: withCount ? Math.round((withTags / withCount) * 10000) / 10000 : 0,
      engagement_without_hashtags: withoutCount ? Math.round((withoutTags / withoutCount) * 10000) / 10000 : 0,
    };
  } else if (platform === "linkedin") {
    platformRecs.linkedin = {
      recommended_count: Math.min(5, Math.max(3, topTags.length)),
      top_performing_tags: topTags.slice(0, 5),
      engagement_with_hashtags: withCount ? Math.round((withTags / withCount) * 10000) / 10000 : 0,
      engagement_without_hashtags: withoutCount ? Math.round((withoutTags / withoutCount) * 10000) / 10000 : 0,
    };
  } else {
    platformRecs[platform] = {
      recommended_count: 0,
      top_performing_tags: topTags.slice(0, 5),
      engagement_with_hashtags: withCount ? Math.round((withTags / withCount) * 10000) / 10000 : 0,
      engagement_without_hashtags: withoutCount ? Math.round((withoutTags / withoutCount) * 10000) / 10000 : 0,
    };
  }

  return { platform_recommendations: platformRecs };
}

// ============================================================
// ANALYSIS 7: Format Detection
// ============================================================

function analyzeFormats(posts: ScrapedPost[], followerCount?: number): FormatDetectionAnalysis {
  const formatMap = new Map<string, { total: number; count: number }>();

  for (const post of posts) {
    const format = detectFormat(post.text);
    const rate = engagementRate(post, followerCount);
    const entry = formatMap.get(format) || { total: 0, count: 0 };
    entry.total += rate;
    entry.count += 1;
    formatMap.set(format, entry);
  }

  return {
    format_ranking: [...formatMap.entries()]
      .map(([format, v]) => ({
        format,
        avg_engagement: Math.round((v.total / v.count) * 10000) / 10000,
        count: v.count,
      }))
      .sort((a, b) => b.avg_engagement - a.avg_engagement),
  };
}

function detectFormat(text: string): string {
  const t = text.trim();
  if (/^(BREAKING|🚨|⚡|JUST IN)/i.test(t)) return "breaking_news";
  if (/^\d+[.)]\s/m.test(t) || /^-\s/m.test(t)) return "numbered_list";
  if (/\(?\d+\/\d+\)?/.test(t) || /^(1\/|Thread|🧵)/i.test(t)) return "thread";
  if (/\?$|\?\s*$/m.test(t) && t.split("\n").filter(l => l.trim()).length <= 3) return "question";
  if (t.split("\n").filter(l => l.trim()).length === 1 && t.length < 150) return "single_line";
  if (t.split("\n").filter(l => l.trim()).length > 5) return "multi_paragraph";
  if (/\d+%|\$[\d,]+|[\d,]+ (users|customers|people|downloads)/i.test(t)) return "data_driven";
  if (/^(I was|I remember|Last|Yesterday|Today|When I|A few (years|months|weeks))/i.test(t)) return "story";
  if (/unpopular opinion|hot take|controversial|most people don't/i.test(t)) return "hot_take";
  return "standard";
}

// ============================================================
// ANALYSIS 8: Topic Clustering
// ============================================================

function analyzeTopics(posts: ScrapedPost[], followerCount?: number): TopicClusterAnalysis {
  // Simple keyword frequency approach
  const stopWords = new Set([
    "the", "a", "an", "is", "are", "was", "were", "be", "been", "being",
    "have", "has", "had", "do", "does", "did", "will", "would", "could",
    "should", "may", "might", "can", "shall", "to", "of", "in", "for",
    "on", "with", "at", "by", "from", "as", "into", "through", "during",
    "before", "after", "above", "below", "between", "out", "off", "up",
    "down", "it", "its", "this", "that", "these", "those", "i", "you",
    "he", "she", "we", "they", "my", "your", "his", "her", "our", "their",
    "me", "him", "us", "them", "and", "but", "or", "nor", "not", "so",
    "yet", "both", "either", "neither", "each", "every", "all", "any",
    "few", "more", "most", "other", "some", "such", "no", "only", "own",
    "same", "than", "too", "very", "just", "about", "if", "then", "also",
    "how", "what", "when", "where", "why", "who", "which", "there", "here",
    "don't", "doesn't", "didn't", "won't", "wouldn't", "couldn't", "shouldn't",
    "get", "got", "getting", "like", "know", "think", "make", "go", "going",
    "see", "look", "want", "give", "take", "come", "say", "said", "new",
  ]);

  // Extract keywords per post
  const keywordMap = new Map<string, { total: number; count: number; posts: string[] }>();

  for (const post of posts) {
    const words = post.text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter(w => w.length > 3 && !stopWords.has(w));

    const unique = new Set(words);
    const rate = engagementRate(post, followerCount);

    for (const word of unique) {
      const entry = keywordMap.get(word) || { total: 0, count: 0, posts: [] };
      entry.total += rate;
      entry.count += 1;
      if (entry.posts.length < 3) entry.posts.push(post.text.substring(0, 100));
      keywordMap.set(word, entry);
    }
  }

  // Filter to keywords appearing in 3+ posts, sort by engagement
  const topics = [...keywordMap.entries()]
    .filter(([_, v]) => v.count >= 3)
    .map(([keyword, v]) => ({
      topic: keyword,
      keywords: [keyword],
      avg_engagement: Math.round((v.total / v.count) * 10000) / 10000,
      count: v.count,
    }))
    .sort((a, b) => b.avg_engagement - a.avg_engagement)
    .slice(0, 20);

  return { topic_performance: topics };
}

// ============================================================
// ANALYSIS 9: Competitor Comparison
// ============================================================

export function compareWithCompetitors(
  userAnalysis: StatisticalAnalysis,
  competitorAnalyses: StatisticalAnalysis[],
): CompetitorComparison {
  const competitors = competitorAnalyses.map(ca => ({
    handle: ca.account_handle,
    total_posts: ca.total_posts_analyzed,
    avg_engagement_rate: ca.top_performers.avg_engagement_rate,
    top_format: ca.format_detection.format_ranking[0]?.format || "unknown",
    best_posting_time: ca.posting_schedule.optimal_schedule[0]
      ? `${ca.posting_schedule.optimal_schedule[0].day} ${ca.posting_schedule.optimal_schedule[0].hour}:00`
      : "unknown",
    dominant_hook: ca.hook_patterns.dominant_type,
  }));

  const gaps: string[] = [];
  const advantages: string[] = [];

  for (const comp of competitorAnalyses) {
    // Compare engagement rates
    if (comp.top_performers.avg_engagement_rate > userAnalysis.top_performers.avg_engagement_rate * 1.5) {
      gaps.push(
        `@${comp.account_handle} gets ${Math.round(comp.top_performers.avg_engagement_rate / (userAnalysis.top_performers.avg_engagement_rate || 0.001))}x your engagement rate`
      );
    }
    if (userAnalysis.top_performers.avg_engagement_rate > comp.top_performers.avg_engagement_rate * 1.5) {
      advantages.push(
        `You outperform @${comp.account_handle} by ${Math.round(userAnalysis.top_performers.avg_engagement_rate / (comp.top_performers.avg_engagement_rate || 0.001))}x on engagement`
      );
    }

    // Compare topics
    const compTopics = new Set(comp.topic_clusters.topic_performance.slice(0, 5).map(t => t.topic));
    const userTopics = new Set(userAnalysis.topic_clusters.topic_performance.slice(0, 5).map(t => t.topic));
    for (const topic of compTopics) {
      if (!userTopics.has(topic)) {
        const topicData = comp.topic_clusters.topic_performance.find(t => t.topic === topic);
        if (topicData && topicData.count >= 3) {
          gaps.push(`@${comp.account_handle} posts about "${topic}" (${topicData.count} posts) which you don't cover`);
        }
      }
    }

    // Compare formats
    const compTopFormat = comp.format_detection.format_ranking[0];
    const userSameFormat = userAnalysis.format_detection.format_ranking.find(f => f.format === compTopFormat?.format);
    if (compTopFormat && userSameFormat && compTopFormat.avg_engagement > userSameFormat.avg_engagement * 2) {
      gaps.push(
        `@${comp.account_handle} gets ${Math.round(compTopFormat.avg_engagement / (userSameFormat.avg_engagement || 0.001))}x your engagement on "${compTopFormat.format}" format`
      );
    }
  }

  return {
    competitors,
    competitive_gaps: gaps.slice(0, 10),
    competitive_advantages: advantages.slice(0, 10),
  };
}

// ============================================================
// MAIN: Run full statistical analysis
// ============================================================

export function runStatisticalAnalysis(
  posts: ScrapedPost[],
  accountHandle: string,
  platform: Platform,
  followerCount?: number,
): StatisticalAnalysis {
  if (!posts.length) {
    throw new Error("No posts to analyze");
  }

  return {
    account_handle: accountHandle,
    platform,
    total_posts_analyzed: posts.length,
    analysis_date: new Date().toISOString(),

    top_performers: analyzeTopPerformers(posts, followerCount),
    posting_schedule: analyzePostingSchedule(posts, followerCount),
    hook_patterns: analyzeHookPatterns(posts, followerCount),
    post_length: analyzePostLength(posts, followerCount),
    media_performance: analyzeMediaPerformance(posts, followerCount),
    hashtag_strategy: analyzeHashtags(posts, platform, followerCount),
    format_detection: analyzeFormats(posts, followerCount),
    topic_clusters: analyzeTopics(posts, followerCount),
  };
}
