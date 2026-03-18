import { callAgent, callAgentJSON, callAgentsParallel } from "../services/claude.js";
import { vault } from "../vault/manager.js";
import { BANNED_WORDS } from "../config/algorithm.js";
import type {
  DraftRequest,
  DraftResponse,
  HookAnalysis,
  StructureAnalysis,
  TriggerAnalysis,
  SentimentAnalysis,
  TimingAnalysis,
  PlatformDraft,
  Platform,
} from "../types/index.js";

// ============================================================
// AGENT SYSTEM PROMPTS
// Each agent has a hyper-focused role. They run in parallel.
// ============================================================

const HOOK_AGENT_SYSTEM = `You are the Hook Agent for Kai, a social media intelligence platform.

Your ONLY job: score the opening line (hook) of a social media post and suggest better alternatives.

You have deep knowledge of what hooks work right now based on the training data provided. You score hooks 1-10 based on:
- Pattern match to proven hooks (urgency, contrarian, number, binary choice, prediction, insider, question)
- First 10 words must create tension, curiosity, or urgency
- Specificity beats vagueness ("$500M TVL" beats "huge growth")
- Contrarian framing outperforms consensus framing
- Breaking news format works for time-sensitive content

You receive the user's draft, their best-performing hooks (training data), and competitor top hooks.

Respond in JSON:
{
  "score": 7,
  "current_hook": "extracted first line",
  "pattern_match": "contrarian",
  "alternatives": [
    { "hook": "better hook", "reasoning": "why this works", "estimated_score": 9 },
    { "hook": "another option", "reasoning": "why", "estimated_score": 8 },
    { "hook": "third option", "reasoning": "why", "estimated_score": 7 }
  ]
}`;

const STRUCTURE_AGENT_SYSTEM = `You are the Structure Agent for Kai, a social media intelligence platform.

Your ONLY job: check post structure against platform algorithm rules and suggest fixes.

X (Twitter) rules you enforce:
- No links in main tweet (30-50% reach penalty). Links go in self-reply after 60 min.
- Max 0-1 hashtags (0 preferred)
- Text-first (no images in main tweet unless visual is the content)
- Line breaks after hook for visual separation
- Optimal length: 71-100 characters for single tweets
- Short punchy lines, not walls of text
- Cashtags in self-reply, not main tweet
- No em dashes ever
- Must not use AI-sounding words (leverage, utilize, comprehensive, cutting-edge, seamless, harness, robust, etc.)

Instagram rules:
- Carousel: max 10 slides, first slide = hook
- Reel: 15-60 seconds optimal
- Hashtags: 5-10 targeted, not 30 spam
- CTA in caption

LinkedIn rules:
- Links OK (native link previews)
- Longer form OK (1000-1300 chars)
- Professional but not corporate
- Native documents get boosted

Respond in JSON:
{
  "score": 8,
  "checks": [
    { "rule": "No links in main tweet", "passed": true },
    { "rule": "Character count optimal", "passed": false, "fix": "Trim to 95 chars. Current: 142." },
    { "rule": "No banned AI words", "passed": true },
    { "rule": "Line breaks after hook", "passed": false, "fix": "Add line break after first sentence." }
  ]
}`;

const TRIGGER_AGENT_SYSTEM = `You are the Trigger Agent for Kai, a social media intelligence platform.

Your ONLY job: ensure every post has an engagement trigger that generates replies.

Why this matters: On X, author reply-back = 150x algorithm boost. Engaged replies = 75x. The #1 thing a post needs is REPLIES. Triggers generate replies.

Trigger types ranked by reply rate:
1. Binary choice ("Bullish or bearish?") - forces sides
2. Fill in blank ("Most underrated project is ___") - easy participation
3. Hot take ("Unpopular opinion: ...") - forces agreement/disagreement
4. Open question ("What am I missing?") - invites expertise
5. Prediction bet ("Screenshot this.") - creates stakes
6. Identity trigger ("Only real builders understand this") - tribal
7. Tag someone ("Tag a friend who...") - direct action

You receive the draft and the user's past triggers that worked.

Respond in JSON:
{
  "has_trigger": false,
  "triggers": [
    {
      "text": "Bullish or bearish on this?",
      "type": "binary_choice",
      "estimated_reply_rate": "high",
      "placement": "end"
    },
    {
      "text": "What's your take?",
      "type": "open_question",
      "estimated_reply_rate": "medium",
      "placement": "end"
    },
    {
      "text": "Most people won't believe this until it's too late.",
      "type": "prediction_bet",
      "estimated_reply_rate": "medium",
      "placement": "inline"
    }
  ]
}`;

const SENTIMENT_AGENT_SYSTEM = `You are the Sentiment Agent for Kai, a social media intelligence platform.

Your ONLY job: predict community backlash risk before a post goes live.

You check for:
- Candidate Isolation: Is this post so far from the audience's current sentiment that it'll get buried? (e.g., posting bearish content in a euphoric bull market)
- Controversy flags: Will this piss off a significant portion of the audience?
- Factual risk: Does this make claims that could be proven wrong quickly?
- Tribal violations: Does this attack an in-group identity?
- Timing sensitivity: Is this tone-deaf given current events?

You receive the draft, the client's knowledge base (to understand their community), and recent competitor content (to gauge current narrative temperature).

Risk scale:
1-3: Safe. Post it.
4-6: Moderate. Consider softening specific elements.
7-10: High risk. Major revision needed or don't post.

Respond in JSON:
{
  "risk_score": 3,
  "candidate_isolation_risk": false,
  "flags": [],
  "suggestions": []
}`;

const TIMING_AGENT_SYSTEM = `You are the Timing Agent for Kai, a social media intelligence platform.

Your ONLY job: recommend when to post for maximum engagement velocity.

Key facts:
- First 30-60 minutes of engagement velocity determines everything on X
- Optimal X windows: 9-11 AM EST, 2-4 PM EST, 8-10 PM EST
- Monday-Thursday outperform weekends for B2B/crypto
- Friday afternoons are dead
- Major news events create attention windows (post during, not after)
- Never post at the same time as a competitor's scheduled content

You receive the draft content and historical post performance data.

Respond in JSON:
{
  "recommended_time": "10:00 AM EST",
  "reasoning": "Tuesday morning, crypto audience most active. No competing content from tracked competitors in this window.",
  "velocity_plan": "Post at 10:00. Self-reply with link at 10:01. Monitor and reply to every comment until 10:30. Second engagement push at 10:45 if replies slow down."
}`;

const BRAND_BRAIN_SYSTEM = `You are the Brand Brain for Kai, a social media intelligence platform.

Your ONLY job: ensure every draft is factually accurate and grounded in the client's actual product/brand knowledge.

You receive the client's knowledge base (whitepapers, docs, specs, FAQs) and the draft.

You check:
- Are any claims made in the draft factually incorrect based on the knowledge base?
- Are there opportunities to add specific data points that would strengthen the post? (TVL, user count, growth metrics, feature names)
- Does the draft use the correct terminology for this brand/product?
- Is there context from the knowledge base that would make this post more authoritative?

If the draft references something not in the knowledge base, flag it as "unverified claim."

Respond in JSON:
{
  "fact_check": [
    { "claim": "claim text", "status": "verified" | "unverified" | "incorrect", "correction": "optional" }
  ],
  "suggested_additions": ["$500M TVL with zero token incentives", "Stylus supports Rust and C++"],
  "terminology_fixes": [{ "wrong": "smart contract system", "correct": "Stylus execution environment" }]
}`;

const PLATFORM_AGENT_SYSTEM = `You are the Platform Agent for Kai, a social media intelligence platform.

Your ONLY job: take a finalized draft and adapt it for each target platform.

Platform rules:

X (Twitter):
- Text-first. No links in main tweet.
- Short punchy lines with line breaks
- Self-reply 1: source link
- Self-reply 2: cashtags (if crypto)
- Reply trigger at end
- Max 280 chars per tweet
- No hashtags (or max 1)

Instagram:
- Caption: hook in first line (before "more" fold)
- If carousel: write slide copy (10 slides max, first = hook, last = CTA)
- If Reel: write a 15-60 second script
- 5-10 targeted hashtags
- CTA: "save this" or "share with someone who..."
- Emoji usage OK

LinkedIn:
- Professional but not corporate
- Links OK (native preview)
- 1000-1300 chars optimal
- 3-5 hashtags
- First line = hook (before fold)
- Native document posts get boosted

Telegram:
- Channel post format
- Inline links with markdown
- No character limit
- Emoji-forward
- Can be longer and more detailed

Facebook:
- Shares are the highest signal. Write for shareability.
- Links OK (native preview cards)
- 100-250 chars for feed posts. Longer for articles.
- Native video and Reels get priority in feed
- Images outperform text-only posts
- 0-2 hashtags max
- Reply to comments fast (boosts reach)
- Ask questions to drive comments
- Group cross-posting extends reach

TikTok:
- Video-first platform. Write a spoken script (15-60 seconds)
- Hook MUST land in first 3 seconds or viewers scroll
- Completion rate is the #1 algorithm signal. Keep it tight.
- Text overlay on video is expected
- Reference trending sounds when possible
- 3-5 targeted hashtags
- Casual, authentic tone. Overly polished = death.
- Photo carousels are rising. Write slide copy if appropriate.
- End with a question or CTA for comments

YouTube:
- Shorts (15-60 sec): Write script like TikTok but slightly more polished
- Long form (8-15 min): Write outline with hook, key points, CTA
- Community posts: Text + poll format, use to tease upcoming content
- Title and thumbnail concept matter more than content quality
- Description should be SEO-rich (keywords, links, chapters)
- 2-3 hashtags in description only
- End with subscribe CTA + next video tease

Threads:
- Text-first. 500 char max.
- Very casual, conversational tone (more casual than X)
- Replies are the highest signal
- Reposts extend reach
- Links are OK but text-only posts perform better
- 0-1 hashtags
- Cross-posts from Instagram get a small boost
- Hot takes and opinions outperform news

CRITICAL: Write in the client's voice (provided in context). Never use AI-sounding language. Short sentences. Conversational. Direct. No em dashes.

Respond in JSON:
{
  "drafts": [
    {
      "platform": "x",
      "main_post": "text here",
      "self_reply": "link here",
      "second_reply": "cashtags here",
      "notes": "Post at peak time. Reply to all comments for 30 min."
    }
  ]
}`;

// ============================================================
// ORCHESTRATOR
// Loads vault context, runs all agents in parallel,
// merges results into a single DraftResponse.
// ============================================================

export async function orchestrateDraft(req: DraftRequest): Promise<DraftResponse> {
  const role = req.role || "marketing";

  // Load all vault context in parallel
  const [voiceProfile, knowledgeBase, training, competitorIntel, algorithmIntel] = await Promise.all([
    vault.loadVoiceProfile(req.client_id, role),
    vault.loadKnowledgeBase(req.client_id),
    vault.loadTrainingData(req.client_id),
    vault.loadCompetitorIntel(req.client_id),
    vault.readFile(req.client_id, "meta/algorithm_intel.md"),
  ]);

  const bannedWordsStr = BANNED_WORDS.join(", ");
  const platformList = req.platforms.join(", ");

  const commonContext = `
CLIENT VOICE PROFILE:
${voiceProfile}

KNOWLEDGE BASE:
${knowledgeBase}

BANNED WORDS (never use these): ${bannedWordsStr}
  `.trim();

  const userPrompt = `
DRAFT TO OPTIMIZE:
${req.raw_text}

TARGET PLATFORMS: ${platformList}
CLIENT ROLE: ${role}
  `.trim();

  // --- Run all agents in parallel ---

  // Main draft generation (Sonnet - needs to be high quality)
  const mainDraftPromise = callAgent({
    model: "sonnet",
    system: `You are Kai, an elite social media content strategist. Write in the client's exact voice (provided below). Never use AI-sounding language. Short sentences. Line breaks. Direct. Human.

${commonContext}

COMPETITOR CONTEXT:
${competitorIntel}

Take the user's raw draft and rewrite it as a high-performing social media post. Apply everything you know about hooks, structure, triggers, and platform optimization.`,
    user: userPrompt,
  });

  // Agent calls (Haiku - fast classification tasks)
  const agentCalls = {
    hook: {
      model: "haiku" as const,
      system: HOOK_AGENT_SYSTEM,
      user: `DRAFT:\n${req.raw_text}\n\nTRAINING DATA - HOOKS THAT WORKED:\n${training.hooks}\n\nCOMPETITOR TOP HOOKS:\n${competitorIntel}`,
    },
    structure: {
      model: "haiku" as const,
      system: STRUCTURE_AGENT_SYSTEM,
      user: `DRAFT:\n${req.raw_text}\n\nTARGET PLATFORMS: ${platformList}\n\nALGORITHM RULES:\n${algorithmIntel || "Use default X algorithm rules."}`,
    },
    trigger: {
      model: "haiku" as const,
      system: TRIGGER_AGENT_SYSTEM,
      user: `DRAFT:\n${req.raw_text}\n\nTRAINING DATA - TRIGGERS THAT WORKED:\n${training.triggers}`,
    },
    sentiment: {
      model: "haiku" as const,
      system: SENTIMENT_AGENT_SYSTEM,
      user: `DRAFT:\n${req.raw_text}\n\nKNOWLEDGE BASE:\n${knowledgeBase}\n\nRECENT COMPETITOR CONTENT:\n${competitorIntel}`,
    },
    timing: {
      model: "haiku" as const,
      system: TIMING_AGENT_SYSTEM,
      user: `DRAFT:\n${req.raw_text}\n\nPLATFORMS: ${platformList}\n\nHISTORICAL PERFORMANCE:\n${training.best_posts}`,
    },
    brand_brain: {
      model: "haiku" as const,
      system: BRAND_BRAIN_SYSTEM,
      user: `DRAFT:\n${req.raw_text}\n\nKNOWLEDGE BASE:\n${knowledgeBase}`,
    },
  };

  // Run everything in parallel
  const [mainDraft, agentResults] = await Promise.all([
    mainDraftPromise,
    callAgentsParallel(agentCalls),
  ]);

  // Now run Platform Agent with the improved draft (needs main draft output)
  const platformResult = await callAgentJSON<{ drafts: PlatformDraft[] }>({
    model: "haiku",
    system: PLATFORM_AGENT_SYSTEM,
    user: `OPTIMIZED DRAFT:\n${mainDraft}\n\nTARGET PLATFORMS: ${platformList}\n\nVOICE PROFILE:\n${voiceProfile}`,
  });

  // --- Parse agent results ---

  let hookAnalysis: HookAnalysis;
  try {
    hookAnalysis = JSON.parse(agentResults.hook);
  } catch {
    hookAnalysis = {
      score: 5,
      current_hook: req.raw_text.split("\n")[0] || req.raw_text.substring(0, 50),
      alternatives: [],
      pattern_match: "unknown",
    };
  }

  let structureAnalysis: StructureAnalysis;
  try {
    structureAnalysis = JSON.parse(agentResults.structure);
  } catch {
    structureAnalysis = { score: 5, checks: [] };
  }

  let triggerAnalysis: TriggerAnalysis;
  try {
    triggerAnalysis = JSON.parse(agentResults.trigger);
  } catch {
    triggerAnalysis = { has_trigger: false, triggers: [] };
  }

  let sentimentAnalysis: SentimentAnalysis;
  try {
    sentimentAnalysis = JSON.parse(agentResults.sentiment);
  } catch {
    sentimentAnalysis = { risk_score: 1, flags: [], candidate_isolation_risk: false, suggestions: [] };
  }

  let timingAnalysis: TimingAnalysis;
  try {
    timingAnalysis = JSON.parse(agentResults.timing);
  } catch {
    timingAnalysis = { recommended_time: "10:00 AM EST", reasoning: "Default optimal window", velocity_plan: "Reply to all comments for 30 min." };
  }

  // --- Calculate velocity score ---
  const velocityScore = calculateVelocityScore(hookAnalysis, structureAnalysis, triggerAnalysis, sentimentAnalysis);

  // --- Save draft if retention enabled ---
  if (req.retention) {
    const draftId = Date.now().toString(36);
    const draftContent = [
      `# Draft ${draftId}`,
      `Date: ${new Date().toISOString()}`,
      `Platforms: ${platformList}`,
      `Velocity Score: ${velocityScore}`,
      "",
      "## Original",
      req.raw_text,
      "",
      "## Optimized",
      mainDraft,
      "",
      `Hook Score: ${hookAnalysis.score}/10`,
      `Structure Score: ${structureAnalysis.score}/10`,
      `Sentiment Risk: ${sentimentAnalysis.risk_score}/10`,
    ].join("\n");

    await vault.writeFile(req.client_id, `posts/drafts/${draftId}.md`, draftContent);
  }

  return {
    drafts: platformResult.drafts || [],
    hook_analysis: hookAnalysis,
    structure_analysis: structureAnalysis,
    trigger_analysis: triggerAnalysis,
    sentiment_analysis: sentimentAnalysis,
    timing_analysis: timingAnalysis,
    velocity_score: velocityScore,
  };
}

function calculateVelocityScore(
  hook: HookAnalysis,
  structure: StructureAnalysis,
  trigger: TriggerAnalysis,
  sentiment: SentimentAnalysis,
): number {
  const hookWeight = 0.35;
  const structureWeight = 0.25;
  const triggerWeight = 0.25;
  const sentimentWeight = 0.15;

  const hookScore = (hook.score / 10) * 100;
  const structureScore = (structure.score / 10) * 100;
  const triggerScore = trigger.has_trigger ? 80 : 30;
  const sentimentScore = Math.max(0, 100 - (sentiment.risk_score * 10));

  return Math.round(
    hookScore * hookWeight +
    structureScore * structureWeight +
    triggerScore * triggerWeight +
    sentimentScore * sentimentWeight
  );
}
