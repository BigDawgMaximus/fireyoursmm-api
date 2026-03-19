"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatRouter = void 0;
const express_1 = require("express");
const auth_js_1 = require("../middleware/auth.js");
const prisma_js_1 = require("../lib/prisma.js");
const claude_js_1 = require("../services/claude.js");
const intelligence_js_1 = require("../services/intelligence.js");
const manager_js_1 = require("../vault/manager.js");
const scraper_client_js_1 = require("../services/scraper-client.js");
exports.chatRouter = (0, express_1.Router)();
// All chat routes require auth
exports.chatRouter.use(auth_js_1.requireAuth);
const INTENT_RULES = [
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
];
function detectIntent(message) {
    for (const rule of INTENT_RULES) {
        if (rule.test(message))
            return rule.intent;
    }
    return "general_chat";
}
// ============================================================
// CREDIT COSTS PER INTENT
// ============================================================
const CREDIT_COSTS = {
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
    general_chat: 0,
};
// ============================================================
// FOLLOW-UP SUGGESTIONS PER INTENT
// ============================================================
const SUGGESTIONS = {
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
    general_chat: [
        "Generate my morning brief",
        "What did my competitors post?",
        "Draft a post about something trending",
    ],
};
// ============================================================
// CONTEXT LOADERS
// ============================================================
async function loadVoiceContext(userId) {
    const user = await prisma_js_1.prisma.user.findUnique({
        where: { id: userId },
        select: { vault_path: true },
    });
    if (!user?.vault_path)
        return "";
    const clientId = userId;
    try {
        const [voice, knowledge] = await Promise.all([
            manager_js_1.vault.loadVoiceProfile(clientId, "marketing"),
            manager_js_1.vault.loadKnowledgeBase(clientId),
        ]);
        return `VOICE PROFILE:\n${voice || "Not set up yet."}\n\nKNOWLEDGE BASE:\n${knowledge || "No knowledge base yet."}`;
    }
    catch {
        return "";
    }
}
async function loadTrainingContext(userId) {
    try {
        const training = await manager_js_1.vault.loadTrainingData(userId);
        const parts = [];
        if (training.hooks)
            parts.push(`HOOKS THAT WORK:\n${training.hooks}`);
        if (training.triggers)
            parts.push(`TRIGGERS THAT WORK:\n${training.triggers}`);
        if (training.formats)
            parts.push(`FORMAT PATTERNS:\n${training.formats}`);
        return parts.join("\n\n");
    }
    catch {
        return "";
    }
}
async function loadChatHistory(userId, limit = 10) {
    const messages = await prisma_js_1.prisma.chatMessage.findMany({
        where: { user_id: userId },
        orderBy: { created_at: "desc" },
        take: limit,
    });
    if (!messages.length)
        return "";
    return messages
        .reverse()
        .map((m) => `${m.role === "user" ? "User" : "Kai"}: ${m.content}`)
        .join("\n\n");
}
async function loadCompetitorContext(userId) {
    try {
        const competitors = await manager_js_1.vault.listCompetitors(userId);
        if (!competitors.length)
            return "No competitors tracked yet.";
        const entries = [];
        for (const handle of competitors.slice(0, 5)) {
            const topPosts = await manager_js_1.vault.readFile(userId, `competitors/${handle}/top_posts.md`);
            const latestActivity = await manager_js_1.vault.readFile(userId, `competitors/${handle}/latest_activity.md`);
            entries.push(`@${handle}:\n${latestActivity || topPosts?.substring(0, 500) || "No data yet."}`);
        }
        return entries.join("\n\n");
    }
    catch {
        return "No competitor data available.";
    }
}
// ============================================================
// INTENT HANDLERS
// ============================================================
async function handleIntent(intent, message, userId) {
    switch (intent) {
        case "generate_content": {
            const [voice, training, history] = await Promise.all([
                loadVoiceContext(userId),
                loadTrainingContext(userId),
                loadChatHistory(userId),
            ]);
            return (0, claude_js_1.callAgent)({
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
            return (0, claude_js_1.callAgent)({
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
                const post = await scraper_client_js_1.scraper.scrapePostDetail(url);
                postContent = `Text: ${post.text}\nLikes: ${post.metrics.likes} | Replies: ${post.metrics.replies} | Retweets: ${post.metrics.retweets || 0} | Bookmarks: ${post.metrics.bookmarks || 0} | Views: ${post.metrics.views || "N/A"}`;
            }
            catch {
                postContent = `URL: ${url}\n(Could not scrape - analyzing based on URL context)`;
            }
            const voice = await loadVoiceContext(userId);
            return (0, claude_js_1.callAgent)({
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
            return (0, claude_js_1.callAgent)({
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
                const data = await scraper_client_js_1.scraper.scrapeTrending("x", "general");
                trendingData = JSON.stringify(data, null, 2);
            }
            catch {
                trendingData = "Trending data unavailable right now.";
            }
            return (0, claude_js_1.callAgent)({
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
                const content = await prisma_js_1.prisma.generatedContent.findMany({
                    where: { user_id: userId },
                    orderBy: { created_at: "desc" },
                    take: 20,
                    select: { type: true, input: true, output: true, velocity_score: true, created_at: true },
                });
                postHistory = content
                    .map((c) => `[${c.type}] Score: ${c.velocity_score ?? "N/A"}\nInput: ${c.input.substring(0, 100)}\nOutput: ${c.output.substring(0, 200)}`)
                    .join("\n\n");
            }
            catch {
                postHistory = "No post history available.";
            }
            return (0, claude_js_1.callAgent)({
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
            return (0, claude_js_1.callAgent)({
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
            return (0, claude_js_1.callAgent)({
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
                const user = await prisma_js_1.prisma.user.findUnique({
                    where: { id: userId },
                    select: { priority_platform: true },
                });
                const platforms = [
                    user?.priority_platform || "x",
                ];
                const brief = await (0, intelligence_js_1.generateIntelligenceBrief)(userId, platforms, "marketing");
                return brief;
            }
            catch (err) {
                return `Could not generate brief: ${String(err)}. Make sure onboarding is complete.`;
            }
        }
        case "score_content": {
            const [voice, training, history] = await Promise.all([
                loadVoiceContext(userId),
                loadTrainingContext(userId),
                loadChatHistory(userId),
            ]);
            return (0, claude_js_1.callAgent)({
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
        case "general_chat":
        default: {
            const history = await loadChatHistory(userId);
            return (0, claude_js_1.callAgent)({
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
// POST /api/v1/chat/message - Send a message, get a response
// ============================================================
exports.chatRouter.post("/message", async (req, res) => {
    try {
        const user = req.user;
        const { message, type } = req.body;
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
        await prisma_js_1.prisma.chatMessage.create({
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
                ? prisma_js_1.prisma.user.update({
                    where: { id: user.id },
                    data: { credits_remaining: { decrement: creditCost } },
                    select: { credits_remaining: true },
                })
                : Promise.resolve({ credits_remaining: user.credits_remaining }),
            prisma_js_1.prisma.chatMessage.create({
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
    }
    catch (err) {
        console.error("Chat error:", err);
        res.status(500).json({ success: false, error: String(err) });
    }
});
// ============================================================
// GET /api/v1/chat/history - Returns last 50 messages
// ============================================================
exports.chatRouter.get("/history", async (req, res) => {
    try {
        const messages = await prisma_js_1.prisma.chatMessage.findMany({
            where: { user_id: req.user.id },
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
    }
    catch (err) {
        console.error("Chat history error:", err);
        res.status(500).json({ success: false, error: String(err) });
    }
});
// ============================================================
// DELETE /api/v1/chat/clear - Clear chat history
// ============================================================
exports.chatRouter.delete("/clear", async (req, res) => {
    try {
        const result = await prisma_js_1.prisma.chatMessage.deleteMany({
            where: { user_id: req.user.id },
        });
        res.json({
            success: true,
            data: { deleted: result.count },
            timestamp: new Date().toISOString(),
        });
    }
    catch (err) {
        console.error("Chat clear error:", err);
        res.status(500).json({ success: false, error: String(err) });
    }
});
//# sourceMappingURL=chat.js.map