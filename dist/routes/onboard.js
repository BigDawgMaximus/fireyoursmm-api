"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onboardRouter = void 0;
const express_1 = require("express");
const auth_js_1 = require("../middleware/auth.js");
const prisma_js_1 = require("../lib/prisma.js");
const manager_js_1 = require("../vault/manager.js");
const voice_analyzer_js_1 = require("../services/voice-analyzer.js");
const intelligence_js_1 = require("../services/intelligence.js");
const scraper_client_js_1 = require("../services/scraper-client.js");
exports.onboardRouter = (0, express_1.Router)();
// All onboarding routes require auth
exports.onboardRouter.use(auth_js_1.requireAuth);
// ============================================================
// HELPERS
// ============================================================
const TOTAL_STEPS = 12;
const REQUIRED_FOR_COMPLETION = [1, 4, 7];
async function updateStep(userId, step) {
    const user = await prisma_js_1.prisma.user.findUnique({
        where: { id: userId },
        select: { onboarding_step: true },
    });
    // Only advance the step marker if this step is higher than current
    if (!user || step > user.onboarding_step) {
        await prisma_js_1.prisma.user.update({
            where: { id: userId },
            data: { onboarding_step: step },
        });
    }
}
async function getCompletedSteps(userId) {
    const completed = [];
    const checks = [
        { step: 1, check: () => manager_js_1.vault.readFile(userId, "knowledge/brand_description.md").then((c) => !!c).catch(() => false) },
        { step: 2, check: () => manager_js_1.vault.readFile(userId, "knowledge/audience.md").then((c) => !!c).catch(() => false) },
        { step: 3, check: () => manager_js_1.vault.readFile(userId, "voice/brand_voice_guidelines.md").then((c) => !!c).catch(() => false) },
        { step: 4, check: () => manager_js_1.vault.readFile(userId, "training/best_performing_posts.md").then((c) => !!c).catch(() => false) },
        { step: 5, check: () => manager_js_1.vault.readFile(userId, "training/flopped_posts.md").then((c) => !!c).catch(() => false) },
        { step: 6, check: () => manager_js_1.vault.readFile(userId, "training/aspiration_posts.md").then((c) => !!c).catch(() => false) },
        { step: 7, check: () => prisma_js_1.prisma.competitor.count({ where: { user_id: userId } }).then((c) => c > 0) },
        { step: 8, check: () => manager_js_1.vault.readFile(userId, "meta/industry.md").then((c) => !!c).catch(() => false) },
        { step: 9, check: () => manager_js_1.vault.listFiles(userId, "knowledge").then((f) => f.length > 1).catch(() => false) },
        { step: 10, check: () => manager_js_1.vault.readFile(userId, "meta/goals.md").then((c) => !!c).catch(() => false) },
        { step: 11, check: () => manager_js_1.vault.readFile(userId, "meta/content_preferences.md").then((c) => !!c).catch(() => false) },
        { step: 12, check: () => prisma_js_1.prisma.user.findUnique({ where: { id: userId }, select: { onboarding_complete: true } }).then((u) => !!u?.onboarding_complete) },
    ];
    const results = await Promise.all(checks.map((c) => c.check()));
    results.forEach((passed, i) => {
        if (passed)
            completed.push(checks[i].step);
    });
    return completed;
}
function ok(res, data) {
    res.json({ success: true, data, timestamp: new Date().toISOString() });
}
function fail(res, status, error) {
    res.status(status).json({ success: false, error });
}
// ============================================================
// GET /status - Current onboarding state
// ============================================================
exports.onboardRouter.get("/status", async (req, res) => {
    try {
        const user = await prisma_js_1.prisma.user.findUnique({
            where: { id: req.user.id },
            select: { onboarding_step: true, onboarding_complete: true },
        });
        const completedSteps = await getCompletedSteps(req.user.id);
        const missingRequired = REQUIRED_FOR_COMPLETION.filter((s) => !completedSteps.includes(s));
        ok(res, {
            current_step: user?.onboarding_step || 0,
            completed_steps: completedSteps,
            total_steps: TOTAL_STEPS,
            onboarding_complete: user?.onboarding_complete || false,
            missing_required: missingRequired.length > 0
                ? missingRequired.map((s) => ({ step: s, label: STEP_LABELS[s] }))
                : [],
            next_step: completedSteps.length < TOTAL_STEPS
                ? Math.min(...Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).filter((s) => !completedSteps.includes(s)))
                : null,
        });
    }
    catch (err) {
        console.error("Onboard status error:", err);
        fail(res, 500, String(err));
    }
});
const STEP_LABELS = {
    1: "Brand Identity",
    2: "Audience",
    3: "Voice Personality",
    4: "Best Content",
    5: "Flopped Content",
    6: "Aspiration Content",
    7: "Competitors",
    8: "Industry & Keywords",
    9: "Knowledge Base",
    10: "Goals",
    11: "Content Preferences",
    12: "Platform Config",
};
// ============================================================
// POST /skip/:step - Skip a step
// ============================================================
exports.onboardRouter.post("/skip/:step", async (req, res) => {
    try {
        const step = parseInt(req.params.step, 10);
        if (isNaN(step) || step < 1 || step > TOTAL_STEPS) {
            fail(res, 400, `Invalid step number. Must be 1-${TOTAL_STEPS}.`);
            return;
        }
        if (REQUIRED_FOR_COMPLETION.includes(step)) {
            fail(res, 400, `Step ${step} (${STEP_LABELS[step]}) is required and cannot be skipped.`);
            return;
        }
        await updateStep(req.user.id, step);
        ok(res, {
            skipped: step,
            label: STEP_LABELS[step],
            message: `Step ${step} skipped. You can come back to it later.`,
        });
    }
    catch (err) {
        console.error("Onboard skip error:", err);
        fail(res, 500, String(err));
    }
});
// ============================================================
// STEP 1 - Brand Identity
// ============================================================
exports.onboardRouter.post("/step1", async (req, res) => {
    try {
        const { description } = req.body;
        if (!description?.trim()) {
            fail(res, 400, "Missing description. Tell us about your brand, product, or personal brand.");
            return;
        }
        await manager_js_1.vault.writeFile(req.user.id, "knowledge/brand_description.md", `# Brand Identity\n\n${description}\n\nUpdated: ${new Date().toISOString()}\n\nRelated: [[audience]] | [[brand_voice_guidelines]] | [[goals]]\n`);
        await updateStep(req.user.id, 1);
        ok(res, {
            step: 1,
            label: "Brand Identity",
            message: "Brand identity saved. Next: tell us about your audience.",
        });
    }
    catch (err) {
        console.error("Onboard step1 error:", err);
        fail(res, 500, String(err));
    }
});
// ============================================================
// STEP 2 - Audience
// ============================================================
exports.onboardRouter.post("/step2", async (req, res) => {
    try {
        const { audience_types, age_range, geo_focus, cares_about } = req.body;
        if (!audience_types?.length) {
            fail(res, 400, "Missing audience_types. Who are you trying to reach? (e.g., ['founders', 'developers', 'marketers'])");
            return;
        }
        const content = [
            "# Target Audience",
            "",
            "## Audience Types",
            ...audience_types.map((t) => `- ${t}`),
            "",
            `## Age Range`,
            age_range || "Not specified",
            "",
            "## Geographic Focus",
            geo_focus || "Global",
            "",
            "## What They Care About",
            cares_about || "Not specified",
            "",
            `Updated: ${new Date().toISOString()}`,
            "",
            "Related: [[brand_description]] | [[brand_voice_guidelines]] | [[content_preferences]]",
        ].join("\n");
        await manager_js_1.vault.writeFile(req.user.id, "knowledge/audience.md", content);
        await updateStep(req.user.id, 2);
        ok(res, {
            step: 2,
            label: "Audience",
            message: "Audience profile saved. Next: define your voice personality.",
        });
    }
    catch (err) {
        console.error("Onboard step2 error:", err);
        fail(res, 500, String(err));
    }
});
// ============================================================
// STEP 3 - Voice Personality
// ============================================================
exports.onboardRouter.post("/step3", async (req, res) => {
    try {
        const { traits, never_sounds_like } = req.body;
        if (!traits?.length) {
            fail(res, 400, "Missing traits. How should your content sound? (e.g., ['direct', 'witty', 'technical'])");
            return;
        }
        const content = [
            "# Brand Voice Guidelines",
            "",
            "## Voice Traits",
            ...traits.map((t) => `- ${t}`),
            "",
            "## Never Sounds Like",
            never_sounds_like || "No restrictions specified",
            "",
            `Updated: ${new Date().toISOString()}`,
            "",
            "Related: [[best_performing_posts]] | [[hooks_that_worked]] | [[audience]]",
        ].join("\n");
        await manager_js_1.vault.writeFile(req.user.id, "voice/brand_voice_guidelines.md", content);
        await updateStep(req.user.id, 3);
        ok(res, {
            step: 3,
            label: "Voice Personality",
            message: "Voice guidelines saved. Next: share your best-performing content.",
        });
    }
    catch (err) {
        console.error("Onboard step3 error:", err);
        fail(res, 500, String(err));
    }
});
// ============================================================
// STEP 4 - Best Content (REQUIRED)
// ============================================================
exports.onboardRouter.post("/step4", async (req, res) => {
    try {
        const { posts } = req.body;
        if (!posts?.length || posts.length < 5) {
            fail(res, 400, "Need at least 5 of your best-performing posts. The more you give us, the better we learn your voice.");
            return;
        }
        const userId = req.user.id;
        // Save raw posts
        const postsContent = posts
            .map((p, i) => `## Post ${i + 1}\n\n${p}\n`)
            .join("\n---\n\n");
        await manager_js_1.vault.writeFile(userId, "training/best_performing_posts.md", `# Best Performing Posts\n\nCount: ${posts.length}\nUploaded: ${new Date().toISOString()}\n\n${postsContent}\n\nRelated: [[brand_voice_guidelines]] | [[triggers_that_worked]] | [[formats_that_worked]]\n`);
        // Run voice analysis and pattern extraction in parallel
        const [voiceProfile] = await Promise.all([
            (0, voice_analyzer_js_1.analyzeVoice)(userId, "marketing", posts),
            (0, voice_analyzer_js_1.extractTrainingPatterns)(userId, posts),
        ]);
        await updateStep(userId, 4);
        ok(res, {
            step: 4,
            label: "Best Content",
            posts_analyzed: posts.length,
            voice_profile_preview: voiceProfile.substring(0, 300) + "...",
            message: "Voice profile generated and training patterns extracted. This is the foundation of your AI clone.",
        });
    }
    catch (err) {
        console.error("Onboard step4 error:", err);
        fail(res, 500, String(err));
    }
});
// ============================================================
// STEP 5 - Flopped Content
// ============================================================
exports.onboardRouter.post("/step5", async (req, res) => {
    try {
        const { posts } = req.body;
        if (!posts?.length) {
            fail(res, 400, "Missing posts. Share content that underperformed so we know what to avoid.");
            return;
        }
        const postsContent = posts
            .map((p, i) => `## Flop ${i + 1}\n\n${p}\n`)
            .join("\n---\n\n");
        await manager_js_1.vault.writeFile(req.user.id, "training/flopped_posts.md", `# Flopped Posts (What NOT To Do)\n\nCount: ${posts.length}\nUploaded: ${new Date().toISOString()}\n\n${postsContent}\n\nRelated: [[best_performing_posts]] | [[brand_voice_guidelines]]\n`);
        await updateStep(req.user.id, 5);
        ok(res, {
            step: 5,
            label: "Flopped Content",
            posts_saved: posts.length,
            message: "Noted. We'll learn what doesn't work for your audience. Next: show us posts you wish you'd written.",
        });
    }
    catch (err) {
        console.error("Onboard step5 error:", err);
        fail(res, 500, String(err));
    }
});
// ============================================================
// STEP 6 - Aspiration Content
// ============================================================
exports.onboardRouter.post("/step6", async (req, res) => {
    try {
        const { posts } = req.body;
        if (!posts?.length) {
            fail(res, 400, "Missing posts. Share posts from others that you wish you'd written.");
            return;
        }
        const userId = req.user.id;
        // Save raw posts
        const postsContent = posts
            .map((p, i) => `## Aspiration ${i + 1}\n\n${p}\n`)
            .join("\n---\n\n");
        await manager_js_1.vault.writeFile(userId, "training/aspiration_posts.md", `# Aspiration Posts (Voice I Want To Move Toward)\n\nCount: ${posts.length}\nUploaded: ${new Date().toISOString()}\n\n${postsContent}\n\nRelated: [[best_performing_posts]] | [[brand_voice_guidelines]] | [[hooks_that_worked]]\n`);
        // Blend aspiration into voice profile
        const updatedProfile = await (0, voice_analyzer_js_1.analyzeAspirationVoice)(userId, "marketing", posts);
        await updateStep(userId, 6);
        ok(res, {
            step: 6,
            label: "Aspiration Content",
            posts_analyzed: posts.length,
            voice_profile_preview: updatedProfile.substring(0, 300) + "...",
            message: "Voice profile updated with aspirational elements. Your content will blend your proven patterns with the style you admire.",
        });
    }
    catch (err) {
        console.error("Onboard step6 error:", err);
        fail(res, 500, String(err));
    }
});
// ============================================================
// STEP 7 - Competitors (REQUIRED)
// ============================================================
exports.onboardRouter.post("/step7", async (req, res) => {
    try {
        const { competitors } = req.body;
        if (!competitors?.length) {
            fail(res, 400, "Missing competitors. Add at least one competitor to track. Format: [{ platform: 'x', username: 'elonmusk' }]");
            return;
        }
        const userId = req.user.id;
        // Save each to Competitor table and vault
        for (const comp of competitors) {
            const platform = comp.platform.toLowerCase();
            const username = comp.username.replace("@", "").toLowerCase();
            // Upsert to avoid duplicates
            await prisma_js_1.prisma.competitor.upsert({
                where: {
                    user_id_platform_username: {
                        user_id: userId,
                        platform,
                        username,
                    },
                },
                update: {},
                create: {
                    user_id: userId,
                    platform,
                    username,
                },
            });
            await manager_js_1.vault.addCompetitor(userId, username);
        }
        // Trigger background scrapes (don't await)
        for (const comp of competitors) {
            const username = comp.username.replace("@", "").toLowerCase();
            const platform = comp.platform.toLowerCase();
            scraper_client_js_1.scraper.scrapePosts(platform, username, 50).then(async (result) => {
                try {
                    const topPosts = result.posts
                        .sort((a, b) => (b.metrics.likes + b.metrics.replies) - (a.metrics.likes + a.metrics.replies))
                        .slice(0, 20)
                        .map((p, i) => `## Post ${i + 1}\n${p.text}\nLikes: ${p.metrics.likes} | Replies: ${p.metrics.replies}\n`)
                        .join("\n");
                    await manager_js_1.vault.writeFile(userId, `competitors/${username}/top_posts.md`, `# Top Posts - @${username}\n\n${topPosts}`);
                    console.log(`[ONBOARD] Background scrape complete for @${username}`);
                }
                catch (err) {
                    console.error(`[ONBOARD] Background scrape save failed for @${username}:`, err);
                }
            }).catch((err) => {
                console.error(`[ONBOARD] Background scrape failed for @${username}:`, err);
            });
        }
        await updateStep(userId, 7);
        ok(res, {
            step: 7,
            label: "Competitors",
            competitors_added: competitors.length,
            message: `${competitors.length} competitor(s) added. Initial scrapes running in background. Next: tell us about your industry.`,
        });
    }
    catch (err) {
        console.error("Onboard step7 error:", err);
        fail(res, 500, String(err));
    }
});
// ============================================================
// STEP 8 - Industry & Keywords
// ============================================================
exports.onboardRouter.post("/step8", async (req, res) => {
    try {
        const { industry, keywords } = req.body;
        if (!industry?.trim()) {
            fail(res, 400, "Missing industry. What space are you in? (e.g., 'DeFi', 'B2B SaaS', 'fitness coaching')");
            return;
        }
        const content = [
            "# Industry & Keywords",
            "",
            `## Industry`,
            industry,
            "",
            "## Keywords",
            ...(keywords?.length ? keywords.map((k) => `- ${k}`) : ["No specific keywords set"]),
            "",
            `Updated: ${new Date().toISOString()}`,
            "",
            "Related: [[goals]] | [[content_preferences]] | [[audience]]",
        ].join("\n");
        await manager_js_1.vault.writeFile(req.user.id, "meta/industry.md", content);
        await updateStep(req.user.id, 8);
        ok(res, {
            step: 8,
            label: "Industry & Keywords",
            message: "Industry profile saved. Next: upload your knowledge base.",
        });
    }
    catch (err) {
        console.error("Onboard step8 error:", err);
        fail(res, 500, String(err));
    }
});
// ============================================================
// STEP 9 - Knowledge Base Upload
// ============================================================
exports.onboardRouter.post("/step9", async (req, res) => {
    try {
        const { documents } = req.body;
        if (!documents?.length) {
            fail(res, 400, "Missing documents. Upload docs, guidelines, specs, or any reference material. Format: [{ filename: 'guide.md', content: '...' }]");
            return;
        }
        const savedFiles = [];
        for (const doc of documents) {
            if (!doc.filename || !doc.content)
                continue;
            const safeName = doc.filename
                .replace(/[^a-zA-Z0-9._-]/g, "_")
                .replace(/\.(pdf|txt|doc|docx)$/i, ".md");
            await manager_js_1.vault.writeFile(req.user.id, `knowledge/${safeName}`, doc.content);
            savedFiles.push(safeName);
        }
        await updateStep(req.user.id, 9);
        ok(res, {
            step: 9,
            label: "Knowledge Base",
            files_saved: savedFiles.length,
            filenames: savedFiles,
            message: "Knowledge base updated. Next: set your goals.",
        });
    }
    catch (err) {
        console.error("Onboard step9 error:", err);
        fail(res, 500, String(err));
    }
});
// ============================================================
// STEP 10 - Goals
// ============================================================
exports.onboardRouter.post("/step10", async (req, res) => {
    try {
        const { goals, ninety_day_target } = req.body;
        if (!goals?.length) {
            fail(res, 400, "Missing goals. What are you trying to achieve? (e.g., ['grow to 10k followers', 'generate leads', 'build thought leadership'])");
            return;
        }
        const content = [
            "# Goals",
            "",
            "## Objectives",
            ...goals.map((g) => `- ${g}`),
            "",
            "## 90-Day Target",
            ninety_day_target || "Not specified",
            "",
            `Updated: ${new Date().toISOString()}`,
            "",
            "Related: [[industry]] | [[content_preferences]] | [[brand_description]]",
        ].join("\n");
        await manager_js_1.vault.writeFile(req.user.id, "meta/goals.md", content);
        await updateStep(req.user.id, 10);
        ok(res, {
            step: 10,
            label: "Goals",
            message: "Goals locked in. Next: set your content preferences.",
        });
    }
    catch (err) {
        console.error("Onboard step10 error:", err);
        fail(res, 500, String(err));
    }
});
// ============================================================
// STEP 11 - Content Preferences
// ============================================================
exports.onboardRouter.post("/step11", async (req, res) => {
    try {
        const { posting_frequency, content_types, content_restrictions } = req.body;
        if (!posting_frequency && !content_types?.length) {
            fail(res, 400, "Missing posting_frequency or content_types. How often do you post and what type of content?");
            return;
        }
        const freqLines = posting_frequency
            ? Object.entries(posting_frequency).map(([platform, count]) => `- ${platform}: ${count}x/week`)
            : ["Not specified"];
        const content = [
            "# Content Preferences",
            "",
            "## Posting Frequency",
            ...freqLines,
            "",
            "## Content Types",
            ...(content_types?.length
                ? content_types.map((t) => `- ${t}`)
                : ["No preference"]),
            "",
            "## Content Restrictions",
            ...(content_restrictions?.length
                ? content_restrictions.map((r) => `- ${r}`)
                : ["None"]),
            "",
            `Updated: ${new Date().toISOString()}`,
            "",
            "Related: [[goals]] | [[industry]] | [[brand_voice_guidelines]]",
        ].join("\n");
        await manager_js_1.vault.writeFile(req.user.id, "meta/content_preferences.md", content);
        await updateStep(req.user.id, 11);
        ok(res, {
            step: 11,
            label: "Content Preferences",
            message: "Content preferences saved. Final step: configure your platforms.",
        });
    }
    catch (err) {
        console.error("Onboard step11 error:", err);
        fail(res, 500, String(err));
    }
});
// ============================================================
// STEP 12 - Platform Config (FINAL)
// ============================================================
exports.onboardRouter.post("/step12", async (req, res) => {
    try {
        const { platforms, timezone, brief_time } = req.body;
        if (!platforms?.length) {
            fail(res, 400, "Missing platforms. Which platforms are you active on? Format: [{ platform: 'x', handle: 'yourhandle', is_priority: true }]");
            return;
        }
        const userId = req.user.id;
        // Check that required steps are complete
        const completedSteps = await getCompletedSteps(userId);
        const missingRequired = REQUIRED_FOR_COMPLETION.filter((s) => !completedSteps.includes(s));
        if (missingRequired.length > 0) {
            fail(res, 400, `Cannot complete onboarding. Required steps missing: ${missingRequired.map((s) => `Step ${s} (${STEP_LABELS[s]})`).join(", ")}`);
            return;
        }
        // Save platforms to UserPlatform table
        const priorityPlatform = platforms.find((p) => p.is_priority)?.platform || platforms[0].platform;
        for (const plat of platforms) {
            await prisma_js_1.prisma.userPlatform.upsert({
                where: {
                    user_id_platform: {
                        user_id: userId,
                        platform: plat.platform.toLowerCase(),
                    },
                },
                update: {
                    handle: plat.handle.replace("@", ""),
                    is_priority: plat.is_priority,
                },
                create: {
                    user_id: userId,
                    platform: plat.platform.toLowerCase(),
                    handle: plat.handle.replace("@", ""),
                    is_priority: plat.is_priority,
                },
            });
        }
        // Update user settings and mark onboarding complete
        await prisma_js_1.prisma.user.update({
            where: { id: userId },
            data: {
                timezone: timezone || "America/New_York",
                brief_time: brief_time || "08:00",
                priority_platform: priorityPlatform,
                onboarding_step: 12,
                onboarding_complete: true,
            },
        });
        // Generate first daily brief immediately
        let firstBrief = "";
        try {
            const briefPlatforms = platforms.map((p) => p.platform.toLowerCase());
            firstBrief = await (0, intelligence_js_1.generateIntelligenceBrief)(userId, briefPlatforms, "marketing");
            // Save to vault
            const dateStr = new Date().toISOString().split("T")[0];
            await manager_js_1.vault.writeFile(userId, `posts/briefs/${dateStr}.md`, firstBrief);
            // Save to GeneratedContent
            await prisma_js_1.prisma.generatedContent.create({
                data: {
                    user_id: userId,
                    type: "brief",
                    platform: priorityPlatform,
                    input: "First daily brief (onboarding)",
                    output: firstBrief,
                    credits_used: 0,
                },
            });
        }
        catch (err) {
            console.error(`[ONBOARD] First brief generation failed for user ${userId}:`, err);
            firstBrief = "Brief generation failed. Your first brief will arrive at your scheduled time tomorrow.";
        }
        ok(res, {
            step: 12,
            label: "Platform Config",
            complete: true,
            platforms: platforms.map((p) => p.platform),
            timezone: timezone || "America/New_York",
            brief_time: brief_time || "08:00",
            first_brief: firstBrief,
            message: "Onboarding complete. Your AI social media manager is ready. First brief attached.",
        });
    }
    catch (err) {
        console.error("Onboard step12 error:", err);
        fail(res, 500, String(err));
    }
});
//# sourceMappingURL=onboard.js.map