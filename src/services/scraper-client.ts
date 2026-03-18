import type { ScrapedPost, ScrapedProfile, Platform } from "../types/index.js";

// ============================================================
// SCRAPER CLIENT
// kai-api calls kai-scraper (Python/Scrapling) through this.
// ============================================================

const SCRAPER_URL = process.env.SCRAPER_URL || "http://localhost:8001";

async function scraperFetch<T>(path: string, body?: object): Promise<T> {
  const method = body ? "POST" : "GET";

  const res = await fetch(`${SCRAPER_URL}${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    throw new Error(`Scraper error ${res.status}: ${await res.text()}`);
  }

  return res.json() as Promise<T>;
}

export const scraper = {
  async health(): Promise<{ status: string; active_jobs: number }> {
    return scraperFetch("/health");
  },

  async scrapeProfile(platform: Platform, handle: string): Promise<ScrapedProfile> {
    return scraperFetch("/scrape/profile", { platform, handle });
  },

  async scrapePosts(platform: Platform, handle: string, count = 50): Promise<{ posts: ScrapedPost[] }> {
    return scraperFetch("/scrape/posts", { platform, handle, count });
  },

  async scrapePostDetail(url: string): Promise<ScrapedPost & { replies_sample: string[] }> {
    return scraperFetch("/scrape/post-detail", { url });
  },

  async scrapeTrending(platform: Platform, sector = "crypto"): Promise<{ topics: Array<{ name: string; velocity: number; sample_posts: ScrapedPost[] }> }> {
    return scraperFetch("/scrape/trending", { platform, sector });
  },

  async scrapeSearch(platform: Platform, query: string, count = 100): Promise<{ posts: ScrapedPost[] }> {
    return scraperFetch("/scrape/search", { platform, query, count });
  },
};
