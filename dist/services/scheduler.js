"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startScheduler = startScheduler;
exports.getSchedulerStatus = getSchedulerStatus;
const node_cron_1 = __importDefault(require("node-cron"));
const prisma_js_1 = require("../lib/prisma.js");
const intelligence_js_1 = require("./intelligence.js");
const autoresearch_js_1 = require("./autoresearch.js");
const manager_js_1 = require("../vault/manager.js");
const scraper_client_js_1 = require("./scraper-client.js");
const jobStatuses = {
    daily_brief: { name: "daily_brief", schedule: "every hour", last_run: null, next_run: null, running: false },
    competitor_scrape: { name: "competitor_scrape", schedule: "every 6 hours", last_run: null, next_run: null, running: false },
    credit_reset: { name: "credit_reset", schedule: "daily midnight UTC", last_run: null, next_run: null, running: false },
    rss_news: { name: "rss_news", schedule: "every 15 minutes", last_run: null, next_run: null, running: false },
    autoresearch: { name: "autoresearch", schedule: "every hour (2 AM user tz)", last_run: null, next_run: null, running: false },
};
function markRunning(job) {
    jobStatuses[job].running = true;
}
function markDone(job) {
    jobStatuses[job].running = false;
    jobStatuses[job].last_run = new Date().toISOString();
}
// ============================================================
// 1. DAILY BRIEF JOB - Runs every hour, checks who needs a brief
// ============================================================
async function dailyBriefJob() {
    if (jobStatuses.daily_brief.running)
        return;
    markRunning("daily_brief");
    try {
        const now = new Date();
        // Get all eligible users
        const users = await prisma_js_1.prisma.user.findMany({
            where: {
                onboarding_complete: true,
                OR: [
                    { plan: { not: "free" } },
                    { plan: "free", credits_remaining: { gt: 0 } },
                ],
            },
            select: {
                id: true,
                brief_time: true,
                timezone: true,
                priority_platform: true,
            },
        });
        for (const user of users) {
            try {
                // Check if current hour matches user's brief_time in their timezone
                const userTime = new Date(now.toLocaleString("en-US", { timeZone: user.timezone }));
                const userHour = String(userTime.getHours()).padStart(2, "0");
                const userMinute = String(userTime.getMinutes()).padStart(2, "0");
                const currentTimeStr = `${userHour}:${userMinute}`;
                // brief_time is stored as "HH:MM", match on the hour
                const briefHour = user.brief_time.split(":")[0];
                if (userHour !== briefHour)
                    continue;
                // Check if we already generated a brief today for this user
                const dateStr = now.toISOString().split("T")[0];
                const existingBrief = await prisma_js_1.prisma.generatedContent.findFirst({
                    where: {
                        user_id: user.id,
                        type: "brief",
                        created_at: { gte: new Date(dateStr) },
                    },
                });
                if (existingBrief)
                    continue;
                const start = Date.now();
                const platforms = [
                    user.priority_platform || "x",
                ];
                const brief = await (0, intelligence_js_1.generateIntelligenceBrief)(user.id, platforms, "marketing");
                // Save to vault
                await manager_js_1.vault.writeFile(user.id, `posts/briefs/${dateStr}.md`, brief);
                // Save to GeneratedContent
                await prisma_js_1.prisma.generatedContent.create({
                    data: {
                        user_id: user.id,
                        type: "brief",
                        platform: platforms[0],
                        input: `Daily brief for ${dateStr}`,
                        output: brief,
                        credits_used: 0,
                    },
                });
                console.log(`[BRIEF] Generated for user ${user.id} in ${Date.now() - start}ms`);
            }
            catch (err) {
                console.error(`[BRIEF] Failed for user ${user.id}:`, err);
            }
        }
    }
    catch (err) {
        console.error("[BRIEF] Job error:", err);
    }
    finally {
        markDone("daily_brief");
    }
}
// ============================================================
// 2. COMPETITOR SCRAPE JOB - Runs every 6 hours
// ============================================================
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
async function competitorScrapeJob() {
    if (jobStatuses.competitor_scrape.running)
        return;
    markRunning("competitor_scrape");
    try {
        const competitors = await prisma_js_1.prisma.competitor.findMany({
            select: {
                id: true,
                platform: true,
                username: true,
            },
        });
        for (const competitor of competitors) {
            try {
                const result = await scraper_client_js_1.scraper.scrapePosts(competitor.platform, competitor.username, 50);
                let savedCount = 0;
                for (const post of result.posts) {
                    // Skip if already exists based on post_url
                    if (post.url) {
                        const existing = await prisma_js_1.prisma.scrapeResult.findFirst({
                            where: { post_url: post.url },
                            select: { id: true },
                        });
                        if (existing)
                            continue;
                    }
                    await prisma_js_1.prisma.scrapeResult.create({
                        data: {
                            platform: competitor.platform,
                            username: competitor.username,
                            post_text: post.text,
                            post_url: post.url || null,
                            likes: post.metrics.likes,
                            replies: post.metrics.replies,
                            retweets: post.metrics.retweets || 0,
                            bookmarks: post.metrics.bookmarks || 0,
                            views: post.metrics.views || 0,
                            posted_at: post.date ? new Date(post.date) : null,
                        },
                    });
                    savedCount++;
                }
                // Update last_scraped timestamp
                await prisma_js_1.prisma.competitor.update({
                    where: { id: competitor.id },
                    data: { last_scraped: new Date() },
                });
                console.log(`[SCRAPE] Scraped ${savedCount} posts from @${competitor.username} on ${competitor.platform}`);
                // Rate limit: 3 seconds between scrapes
                await sleep(3000);
            }
            catch (err) {
                console.error(`[SCRAPE] Failed for @${competitor.username} on ${competitor.platform}:`, err);
            }
        }
    }
    catch (err) {
        console.error("[SCRAPE] Job error:", err);
    }
    finally {
        markDone("competitor_scrape");
    }
}
// ============================================================
// 3. CREDIT RESET JOB - Runs daily at midnight UTC
// ============================================================
async function creditResetJob() {
    if (jobStatuses.credit_reset.running)
        return;
    markRunning("credit_reset");
    try {
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const users = await prisma_js_1.prisma.user.findMany({
            where: {
                credits_reset_at: { lt: thirtyDaysAgo },
                plan: { not: "free" },
            },
            select: {
                id: true,
                credits_remaining: true,
                credits_monthly: true,
            },
        });
        for (const user of users) {
            try {
                const rollover = Math.min(user.credits_remaining, user.credits_monthly);
                const newAmount = user.credits_monthly + rollover;
                await prisma_js_1.prisma.user.update({
                    where: { id: user.id },
                    data: {
                        credits_remaining: newAmount,
                        credits_reset_at: new Date(),
                    },
                });
                console.log(`[CREDITS] Reset for user ${user.id}: ${newAmount} credits (${rollover} rolled over)`);
            }
            catch (err) {
                console.error(`[CREDITS] Failed for user ${user.id}:`, err);
            }
        }
    }
    catch (err) {
        console.error("[CREDITS] Job error:", err);
    }
    finally {
        markDone("credit_reset");
    }
}
// ============================================================
// 4. AUTORESEARCH JOB - Runs at 2 AM in each user's timezone
// ============================================================
async function autoresearchJob() {
    if (jobStatuses.autoresearch.running)
        return;
    markRunning("autoresearch");
    try {
        const now = new Date();
        // Get eligible users (Growth plan or above = nightly, Starter = weekly on Sundays)
        const users = await prisma_js_1.prisma.user.findMany({
            where: {
                onboarding_complete: true,
                plan: { in: ["starter", "growth", "scale", "enterprise"] },
            },
            select: {
                id: true,
                plan: true,
                timezone: true,
            },
        });
        for (const user of users) {
            try {
                // Check if it's 2 AM in user's timezone
                const userTime = new Date(now.toLocaleString("en-US", { timeZone: user.timezone }));
                const userHour = userTime.getHours();
                if (userHour !== 2)
                    continue;
                // Starter plan: only run on Sundays (weekly)
                if (user.plan === "starter" && userTime.getDay() !== 0)
                    continue;
                // Check if already ran today
                const dateStr = now.toISOString().split("T")[0];
                const existing = await manager_js_1.vault.readFile(user.id, `research/autoresearch_${dateStr}.md`);
                if (existing)
                    continue;
                const start = Date.now();
                const result = await (0, autoresearch_js_1.runContentResearch)(user.id);
                const elapsed = Date.now() - start;
                console.log(`[AUTORESEARCH] Ran ${result.total_experiments} experiments for user ${user.id} in ${elapsed}ms. Cost: $${result.cost_usd.toFixed(3)}`);
            }
            catch (err) {
                console.error(`[AUTORESEARCH] Failed for user ${user.id}:`, err);
            }
        }
    }
    catch (err) {
        console.error("[AUTORESEARCH] Job error:", err);
    }
    finally {
        markDone("autoresearch");
    }
}
// ============================================================
// 5. RSS NEWS JOB - Runs every 15 minutes (STUB)
// ============================================================
async function rssNewsJob() {
    if (jobStatuses.rss_news.running)
        return;
    markRunning("rss_news");
    try {
        console.log("[RSS] Job triggered");
        // TODO: Full implementation will:
        // 1. Load RSS feed URLs from a config table or user preferences
        // 2. Fetch each feed using rss-parser
        // 3. For each article, score relevance against user topics/industry keywords
        // 4. Store high-relevance articles in a NewsItem table
        // 5. Make articles available for trending_query intent in chat
        // 6. Include top articles in the daily brief's MARKET INTELLIGENCE section
    }
    catch (err) {
        console.error("[RSS] Job error:", err);
    }
    finally {
        markDone("rss_news");
    }
}
// ============================================================
// SCHEDULER START
// ============================================================
function startScheduler() {
    console.log("[SCHEDULER] Starting background jobs...");
    // Daily brief: every hour at minute 0
    node_cron_1.default.schedule("0 * * * *", () => {
        dailyBriefJob();
    });
    jobStatuses.daily_brief.next_run = getNextCronRun("0 * * * *");
    // Competitor scrape: every 6 hours (0:00, 6:00, 12:00, 18:00 UTC)
    node_cron_1.default.schedule("0 */6 * * *", () => {
        competitorScrapeJob();
    });
    jobStatuses.competitor_scrape.next_run = getNextCronRun("0 */6 * * *");
    // Credit reset: daily at midnight UTC
    node_cron_1.default.schedule("0 0 * * *", () => {
        creditResetJob();
    });
    jobStatuses.credit_reset.next_run = getNextCronRun("0 0 * * *");
    // RSS news: every 15 minutes
    node_cron_1.default.schedule("*/15 * * * *", () => {
        rssNewsJob();
    });
    jobStatuses.rss_news.next_run = getNextCronRun("*/15 * * * *");
    // Autoresearch: every hour (checks if 2 AM in each user's timezone)
    node_cron_1.default.schedule("0 * * * *", () => {
        autoresearchJob();
    });
    jobStatuses.autoresearch.next_run = getNextCronRun("0 * * * *");
    console.log("[SCHEDULER] All jobs registered:");
    console.log("  - daily_brief:      every hour at :00");
    console.log("  - competitor_scrape: every 6 hours");
    console.log("  - credit_reset:     daily at midnight UTC");
    console.log("  - rss_news:         every 15 minutes");
    console.log("  - autoresearch:     every hour (2 AM user tz)");
}
function getSchedulerStatus() {
    // Refresh next_run estimates
    jobStatuses.daily_brief.next_run = getNextCronRun("0 * * * *");
    jobStatuses.competitor_scrape.next_run = getNextCronRun("0 */6 * * *");
    jobStatuses.credit_reset.next_run = getNextCronRun("0 0 * * *");
    jobStatuses.rss_news.next_run = getNextCronRun("*/15 * * * *");
    jobStatuses.autoresearch.next_run = getNextCronRun("0 * * * *");
    return Object.values(jobStatuses);
}
// ============================================================
// HELPERS
// ============================================================
function getNextCronRun(cronExpr) {
    const now = new Date();
    const parts = cronExpr.split(" ");
    const [minPart, hourPart] = parts;
    const next = new Date(now);
    next.setSeconds(0);
    next.setMilliseconds(0);
    if (minPart.startsWith("*/")) {
        // Every N minutes
        const interval = parseInt(minPart.slice(2), 10);
        const currentMin = now.getMinutes();
        const nextMin = Math.ceil((currentMin + 1) / interval) * interval;
        if (nextMin >= 60) {
            next.setHours(now.getHours() + 1);
            next.setMinutes(nextMin - 60);
        }
        else {
            next.setMinutes(nextMin);
        }
    }
    else if (minPart === "0" && hourPart === "*") {
        // Every hour at :00
        next.setMinutes(0);
        if (now.getMinutes() >= 0 && now.getSeconds() > 0) {
            next.setHours(now.getHours() + 1);
        }
    }
    else if (minPart === "0" && hourPart?.startsWith("*/")) {
        // Every N hours at :00
        const interval = parseInt(hourPart.slice(2), 10);
        const currentHour = now.getHours();
        const nextHour = Math.ceil((currentHour + 1) / interval) * interval;
        next.setMinutes(0);
        if (nextHour >= 24) {
            next.setDate(now.getDate() + 1);
            next.setHours(nextHour - 24);
        }
        else {
            next.setHours(nextHour);
        }
    }
    else if (minPart === "0" && hourPart === "0") {
        // Daily at midnight
        next.setHours(0);
        next.setMinutes(0);
        if (now.getHours() > 0 || now.getMinutes() > 0) {
            next.setDate(now.getDate() + 1);
        }
    }
    return next.toISOString();
}
//# sourceMappingURL=scheduler.js.map