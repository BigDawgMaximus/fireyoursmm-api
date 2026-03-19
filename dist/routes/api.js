"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const orchestrator_js_1 = require("../agents/orchestrator.js");
const manager_js_1 = require("../vault/manager.js");
const scraper_client_js_1 = require("../services/scraper-client.js");
const claude_js_1 = require("../services/claude.js");
const intelligence_js_1 = require("../services/intelligence.js");
const voice_analyzer_js_1 = require("../services/voice-analyzer.js");
const scheduler_js_1 = require("../services/scheduler.js");
exports.router = (0, express_1.Router)();
// ============================================================
// HEALTH
// ============================================================
exports.router.get("/health", (_req, res) => {
    res.json({ status: "ok", version: "0.1.0", timestamp: new Date().toISOString() });
});
// ============================================================
// SCHEDULER STATUS
// ============================================================
exports.router.get("/scheduler/status", (_req, res) => {
    res.json({
        success: true,
        data: { jobs: (0, scheduler_js_1.getSchedulerStatus)() },
        timestamp: new Date().toISOString(),
    });
});
// ============================================================
// DRAFT - Core feature. Runs all 7 agents.
// ============================================================
exports.router.post("/draft", async (req, res) => {
    try {
        const { client_id, raw_text, platforms, role, retention } = req.body;
        if (!client_id || !raw_text || !platforms?.length) {
            res.status(400).json({ success: false, error: "Missing client_id, raw_text, or platforms" });
            return;
        }
        // Verify client vault exists
        if (!(await manager_js_1.vault.vaultExists(client_id))) {
            res.status(404).json({ success: false, error: "Client vault not found. Run /onboard first." });
            return;
        }
        const result = await (0, orchestrator_js_1.orchestrateDraft)({
            client_id,
            raw_text,
            platforms: platforms,
            role: role,
            retention,
        });
        const response = {
            success: true,
            data: result,
            timestamp: new Date().toISOString(),
        };
        res.json(response);
    }
    catch (err) {
        console.error("Draft error:", err);
        res.status(500).json({ success: false, error: String(err) });
    }
});
// ============================================================
// DECODE - Reverse-engineer any post
// ============================================================
exports.router.post("/decode", async (req, res) => {
    try {
        const { client_id, url } = req.body;
        if (!url) {
            res.status(400).json({ success: false, error: "Missing url" });
            return;
        }
        // Scrape the post
        const post = await scraper_client_js_1.scraper.scrapePostDetail(url);
        // Load client context for personalized replication playbook
        let clientContext = "";
        if (client_id && await manager_js_1.vault.vaultExists(client_id)) {
            const [voice, knowledge] = await Promise.all([
                manager_js_1.vault.loadVoiceProfile(client_id, "marketing"),
                manager_js_1.vault.loadKnowledgeBase(client_id),
            ]);
            clientContext = `\nCLIENT VOICE:\n${voice}\n\nCLIENT KNOWLEDGE:\n${knowledge}`;
        }
        const analysis = await (0, claude_js_1.callAgent)({
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
    }
    catch (err) {
        console.error("Decode error:", err);
        res.status(500).json({ success: false, error: String(err) });
    }
});
// ============================================================
// SCOREBOARD
// ============================================================
exports.router.get("/scoreboard/:client_id", async (req, res) => {
    try {
        const client_id = req.params.client_id;
        const period = req.query.period || "7d";
        const competitors = await manager_js_1.vault.listCompetitors(client_id);
        const entries = [];
        for (const handle of competitors) {
            const profile = await manager_js_1.vault.readFile(client_id, `competitors/${handle}/profile.md`);
            const topPosts = await manager_js_1.vault.readFile(client_id, `competitors/${handle}/top_posts.md`);
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
    }
    catch (err) {
        console.error("Scoreboard error:", err);
        res.status(500).json({ success: false, error: String(err) });
    }
});
// ============================================================
// TRENDING
// ============================================================
exports.router.get("/trending", async (req, res) => {
    try {
        const platform = req.query.platform || "x";
        const sector = req.query.sector || "crypto";
        const data = await scraper_client_js_1.scraper.scrapeTrending(platform, sector);
        res.json({
            success: true,
            data,
            timestamp: new Date().toISOString(),
        });
    }
    catch (err) {
        console.error("Trending error:", err);
        res.status(500).json({ success: false, error: String(err) });
    }
});
// ============================================================
// TRAIN - Ongoing training data input
// ============================================================
exports.router.post("/train", async (req, res) => {
    try {
        const { client_id, posts, role } = req.body;
        if (!client_id || !posts?.length) {
            res.status(400).json({ success: false, error: "Missing client_id or posts" });
            return;
        }
        // Append to existing training data and re-analyze voice
        await Promise.all([
            (0, voice_analyzer_js_1.analyzeVoice)(client_id, role || "marketing", posts),
            (0, voice_analyzer_js_1.extractTrainingPatterns)(client_id, posts),
        ]);
        res.json({
            success: true,
            data: { message: `Voice profile and training data updated with ${posts.length} new posts.` },
            timestamp: new Date().toISOString(),
        });
    }
    catch (err) {
        console.error("Train error:", err);
        res.status(500).json({ success: false, error: String(err) });
    }
});
// ============================================================
// INTELLIGENCE - Hybrid generation (patterns + Haiku)
// ============================================================
// Hook generation ($0.003 per call)
exports.router.post("/intelligence/generate/hook", async (req, res) => {
    try {
        const { client_id, topic, platform, role } = req.body;
        if (!client_id || !topic) {
            res.status(400).json({ success: false, error: "Missing client_id or topic" });
            return;
        }
        if (!(await manager_js_1.vault.vaultExists(client_id))) {
            res.status(404).json({ success: false, error: "Client vault not found. Run /onboard first." });
            return;
        }
        const hook = await (0, intelligence_js_1.generateWithPatterns)(client_id, `Topic: ${topic}. Platform: ${platform || "x"}.`, platform || "x", "hook", role || "marketing");
        res.json({
            success: true,
            data: { hook, topic, platform: platform || "x" },
            timestamp: new Date().toISOString(),
        });
    }
    catch (err) {
        console.error("Hook generation error:", err);
        res.status(500).json({ success: false, error: String(err) });
    }
});
// Full post generation ($0.005 per call)
exports.router.post("/intelligence/generate/post", async (req, res) => {
    try {
        const { client_id, topic, platform, role } = req.body;
        if (!client_id || !topic) {
            res.status(400).json({ success: false, error: "Missing client_id or topic" });
            return;
        }
        if (!(await manager_js_1.vault.vaultExists(client_id))) {
            res.status(404).json({ success: false, error: "Client vault not found. Run /onboard first." });
            return;
        }
        const post = await (0, intelligence_js_1.generateWithPatterns)(client_id, `Topic: ${topic}. Write a post reacting to this. Platform: ${platform || "x"}.`, platform || "x", "post", role || "marketing");
        res.json({
            success: true,
            data: { post, topic, platform: platform || "x" },
            timestamp: new Date().toISOString(),
        });
    }
    catch (err) {
        console.error("Post generation error:", err);
        res.status(500).json({ success: false, error: String(err) });
    }
});
// Voice rewriting ($0.004 per call)
exports.router.post("/intelligence/rewrite", async (req, res) => {
    try {
        const { client_id, text, platform, role } = req.body;
        if (!client_id || !text) {
            res.status(400).json({ success: false, error: "Missing client_id or text" });
            return;
        }
        if (!(await manager_js_1.vault.vaultExists(client_id))) {
            res.status(404).json({ success: false, error: "Client vault not found. Run /onboard first." });
            return;
        }
        const rewritten = await (0, intelligence_js_1.generateWithPatterns)(client_id, `Original: ${text}`, platform || "x", "rewrite", role || "marketing");
        res.json({
            success: true,
            data: { original: text, rewritten, platform: platform || "x" },
            timestamp: new Date().toISOString(),
        });
    }
    catch (err) {
        console.error("Rewrite error:", err);
        res.status(500).json({ success: false, error: String(err) });
    }
});
// Daily intelligence brief ($0.01 per call)
exports.router.post("/intelligence/brief", async (req, res) => {
    try {
        const { client_id, platforms, role } = req.body;
        if (!client_id) {
            res.status(400).json({ success: false, error: "Missing client_id" });
            return;
        }
        if (!(await manager_js_1.vault.vaultExists(client_id))) {
            res.status(404).json({ success: false, error: "Client vault not found. Run /onboard first." });
            return;
        }
        const brief = await (0, intelligence_js_1.generateIntelligenceBrief)(client_id, platforms || ["x"], role || "marketing");
        // Save to vault
        const dateStr = new Date().toISOString().split("T")[0];
        await manager_js_1.vault.writeFile(client_id, `posts/briefs/${dateStr}_intelligence.md`, brief);
        res.json({
            success: true,
            data: { brief, generated_at: new Date().toISOString() },
            timestamp: new Date().toISOString(),
        });
    }
    catch (err) {
        console.error("Intelligence brief error:", err);
        res.status(500).json({ success: false, error: String(err) });
    }
});
// ============================================================
// DAILY BRIEF - The killer feature (legacy, full orchestrated)
// ============================================================
exports.router.post("/brief/generate", async (req, res) => {
    try {
        const { client_id } = req.body;
        if (!client_id) {
            res.status(400).json({ success: false, error: "Missing client_id" });
            return;
        }
        if (!(await manager_js_1.vault.vaultExists(client_id))) {
            res.status(404).json({ success: false, error: "Client vault not found." });
            return;
        }
        // Import here to avoid circular deps
        const { generateDailyBrief } = await Promise.resolve().then(() => __importStar(require("../services/daily-brief.js")));
        const brief = await generateDailyBrief(client_id);
        res.json({
            success: true,
            data: brief,
            timestamp: new Date().toISOString(),
        });
    }
    catch (err) {
        console.error("Brief generation error:", err);
        res.status(500).json({ success: false, error: String(err) });
    }
});
// Manual competitor refresh
exports.router.post("/scrape/refresh", async (req, res) => {
    try {
        const { client_id } = req.body;
        if (!client_id) {
            res.status(400).json({ success: false, error: "Missing client_id" });
            return;
        }
        const competitors = await manager_js_1.vault.listCompetitors(client_id);
        // Trigger scrapes for all competitors
        const results = await Promise.allSettled(competitors.map(async (handle) => {
            const posts = await scraper_client_js_1.scraper.scrapePosts("x", handle, 20);
            const profile = await scraper_client_js_1.scraper.scrapeProfile("x", handle);
            await manager_js_1.vault.writeFile(client_id, `competitors/${handle}/profile.md`, `# @${handle}\nFollowers: ${profile.followers}\nFollowing: ${profile.following}\nBio: ${profile.bio}\nUpdated: ${new Date().toISOString()}\n`);
            return { handle, posts_count: posts.posts.length };
        }));
        res.json({
            success: true,
            data: {
                refreshed: results.filter(r => r.status === "fulfilled").length,
                failed: results.filter(r => r.status === "rejected").length,
            },
            timestamp: new Date().toISOString(),
        });
    }
    catch (err) {
        res.status(500).json({ success: false, error: String(err) });
    }
});
// ============================================================
// VAULT - Direct vault access (for web dashboard)
// ============================================================
exports.router.get("/vault/:client_id/files", async (req, res) => {
    try {
        const files = await manager_js_1.vault.listFiles(req.params.client_id);
        res.json({ success: true, data: { files } });
    }
    catch (err) {
        res.status(500).json({ success: false, error: String(err) });
    }
});
exports.router.get("/vault/:client_id/file", async (req, res) => {
    try {
        const filePath = req.query.path;
        if (!filePath) {
            res.status(400).json({ success: false, error: "Missing path query param" });
            return;
        }
        const content = await manager_js_1.vault.readFile(req.params.client_id, filePath);
        res.json({ success: true, data: { path: filePath, content } });
    }
    catch (err) {
        res.status(500).json({ success: false, error: String(err) });
    }
});
exports.router.get("/vault/:client_id/search", async (req, res) => {
    try {
        const query = req.query.q;
        if (!query) {
            res.status(400).json({ success: false, error: "Missing q query param" });
            return;
        }
        const results = await manager_js_1.vault.search(req.params.client_id, query);
        res.json({ success: true, data: { results } });
    }
    catch (err) {
        res.status(500).json({ success: false, error: String(err) });
    }
});
//# sourceMappingURL=api.js.map