"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scraper = void 0;
// ============================================================
// SCRAPER CLIENT
// kai-api calls kai-scraper (Python/Scrapling) through this.
// ============================================================
const SCRAPER_URL = process.env.SCRAPER_URL || "http://localhost:8001";
async function scraperFetch(path, body) {
    const method = body ? "POST" : "GET";
    const res = await fetch(`${SCRAPER_URL}${path}`, {
        method,
        headers: { "Content-Type": "application/json" },
        body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) {
        throw new Error(`Scraper error ${res.status}: ${await res.text()}`);
    }
    return res.json();
}
exports.scraper = {
    async health() {
        return scraperFetch("/health");
    },
    async scrapeProfile(platform, handle) {
        return scraperFetch("/scrape/profile", { platform, handle });
    },
    async scrapePosts(platform, handle, count = 50) {
        return scraperFetch("/scrape/posts", { platform, handle, count });
    },
    async scrapePostDetail(url) {
        return scraperFetch("/scrape/post-detail", { url });
    },
    async scrapeTrending(platform, sector = "crypto") {
        return scraperFetch("/scrape/trending", { platform, sector });
    },
    async scrapeSearch(platform, query, count = 100) {
        return scraperFetch("/scrape/search", { platform, query, count });
    },
};
//# sourceMappingURL=scraper-client.js.map