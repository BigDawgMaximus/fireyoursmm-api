import { Router, type Request, type Response } from "express";
import { execFile } from "child_process";
import { readFile, unlink } from "fs/promises";
import { tmpdir } from "os";
import { join } from "path";
import { randomUUID } from "crypto";
import { requireAuth } from "../middleware/auth.js";
import { prisma } from "../lib/prisma.js";
import { callAgentJSON } from "../services/claude.js";

export const youtubeRouter = Router();

youtubeRouter.use(requireAuth);

// ============================================================
// TRANSCRIPT FETCHER (no external dependency)
// Fetches YouTube captions directly from YouTube's timedtext API
// ============================================================

async function fetchYouTubeTranscript(videoId: string): Promise<TranscriptSegment[]> {
  // Use yt-dlp to download auto-generated subtitles in json3 format
  const tempId = randomUUID().slice(0, 8);
  const outputPath = join(tmpdir(), `yt-transcript-${tempId}`);

  return new Promise((resolve, reject) => {
    execFile(
      "yt-dlp",
      [
        "--write-auto-sub",
        "--sub-lang", "en",
        "--skip-download",
        "--sub-format", "json3",
        "-o", outputPath,
        `https://www.youtube.com/watch?v=${videoId}`,
      ],
      { timeout: 30000 },
      async (error) => {
        if (error) {
          reject(new Error("Failed to extract subtitles: " + error.message));
          return;
        }

        try {
          const jsonPath = `${outputPath}.en.json3`;
          const raw = await readFile(jsonPath, "utf-8");
          const data = JSON.parse(raw) as {
            events: Array<{
              tStartMs?: number;
              dDurationMs?: number;
              segs?: Array<{ utf8: string }>;
            }>;
          };

          const segments = data.events
            .filter((e) => e.segs && e.tStartMs !== undefined)
            .map((e) => ({
              text: (e.segs || []).map((s) => s.utf8).join("").trim(),
              offset: e.tStartMs || 0,
              duration: e.dDurationMs || 0,
            }))
            .filter((s) => s.text.length > 0);

          // Clean up temp file
          unlink(jsonPath).catch(() => {});

          resolve(segments);
        } catch (readErr) {
          reject(new Error("Failed to parse subtitles"));
        }
      },
    );
  });
}

// ============================================================
// YOUTUBE TRANSCRIPT ANALYSIS
// Extract and analyze any YouTube video's content DNA
// ============================================================

interface TranscriptSegment {
  text: string;
  offset: number;
  duration: number;
}

interface VideoAnalysis {
  key_topics: string[];
  hooks_used_in_first_30_seconds: string[];
  content_structure: string;
  recurring_phrases: string[];
  cta_patterns: string[];
  audience_engagement_triggers: string[];
  video_style: string;
  estimated_target_audience: string;
  key_quotes: string[];
  content_pillars: string[];
}

interface ClipSuggestion {
  start_time_seconds: number;
  end_time_seconds: number;
  hook: string;
  why_viral: string;
  suggested_caption: string;
  virality_score: number;
  category: string;
}

function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

function formatTimestamp(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

// ============================================================
// POST /api/v1/youtube/analyze
// Analyze a YouTube video transcript
// ============================================================

youtubeRouter.post("/analyze", async (req: Request, res: Response) => {
  try {
    const { url } = req.body;
    const userId = req.user!.id;

    if (!url) {
      res.status(400).json({ success: false, error: "Missing url" });
      return;
    }

    const videoId = extractVideoId(url);
    if (!videoId) {
      res.status(400).json({ success: false, error: "Invalid YouTube URL" });
      return;
    }

    // Check credits (2 credits for video analysis)
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { credits_remaining: true },
    });

    if (!user || user.credits_remaining < 2) {
      res.status(402).json({ success: false, error: "Not enough credits. Video analysis costs 2 credits." });
      return;
    }

    // Fetch transcript using raw YouTube API
    let segments: TranscriptSegment[];
    try {
      segments = await fetchYouTubeTranscript(videoId);
    } catch (err) {
      res.status(422).json({
        success: false,
        error: "Could not fetch transcript. The video may not have captions enabled.",
      });
      return;
    }

    if (!segments || segments.length === 0) {
      res.status(422).json({ success: false, error: "No transcript available for this video." });
      return;
    }

    // Build full transcript with timestamps
    const fullTranscript = segments
      .map((s) => `[${formatTimestamp(s.offset / 1000)}] ${s.text}`)
      .join("\n");

    const transcriptText = segments.map((s) => s.text).join(" ");
    const wordCount = transcriptText.split(/\s+/).length;
    const durationSeconds = segments.length > 0
      ? (segments[segments.length - 1].offset + segments[segments.length - 1].duration) / 1000
      : 0;

    // Send to Claude for analysis
    const analysis = await callAgentJSON<VideoAnalysis>({
      system: `You are a content strategist who reverse-engineers successful YouTube videos. Analyze the transcript and extract structured insights. Be specific and actionable. Do not use these words: leverage, utilize, comprehensive, cutting-edge, seamless, harness, robust, elevate, craft, delve, foster, landscape, navigate, paradigm, streamline, synergy, empower, innovative, transform, revolutionize.`,
      user: `Analyze this YouTube video transcript (${wordCount} words, ${formatTimestamp(durationSeconds)} long).

Extract as JSON:
{
  "key_topics": ["list of main topics covered"],
  "hooks_used_in_first_30_seconds": ["exact phrases or techniques used to grab attention in the opening"],
  "content_structure": "description of how the video is organized (intro > problem > solution > CTA, etc)",
  "recurring_phrases": ["phrases the creator uses repeatedly across the content"],
  "cta_patterns": ["how they ask viewers to subscribe, like, comment, or take action"],
  "audience_engagement_triggers": ["questions asked, polls mentioned, controversy raised, etc"],
  "video_style": "educational | entertainment | news | tutorial | commentary | interview | reaction",
  "estimated_target_audience": "who this video is made for",
  "key_quotes": ["3-5 most impactful or quotable lines from the transcript"],
  "content_pillars": ["the 3-5 core themes this creator builds content around"]
}

TRANSCRIPT:
${fullTranscript.substring(0, 12000)}`,
      model: "haiku",
      max_tokens: 2048,
    });

    // Deduct credits
    await prisma.user.update({
      where: { id: userId },
      data: { credits_remaining: { decrement: 2 } },
    });

    // Save to generated content
    await prisma.generatedContent.create({
      data: {
        user_id: userId,
        type: "youtube_analysis",
        input: url,
        output: JSON.stringify(analysis),
        credits_used: 2,
      },
    });

    res.json({
      success: true,
      data: {
        video_id: videoId,
        url,
        transcript_word_count: wordCount,
        duration: formatTimestamp(durationSeconds),
        analysis,
      },
      credits_used: 2,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("YouTube analyze error:", err);
    res.status(500).json({ success: false, error: "Failed to analyze video" });
  }
});

// ============================================================
// POST /api/v1/youtube/clips
// Find viral clip moments in a YouTube video
// ============================================================

youtubeRouter.post("/clips", async (req: Request, res: Response) => {
  try {
    const { url, num_clips = 5, clip_length = 60 } = req.body;
    const userId = req.user!.id;

    if (!url) {
      res.status(400).json({ success: false, error: "Missing url" });
      return;
    }

    const videoId = extractVideoId(url);
    if (!videoId) {
      res.status(400).json({ success: false, error: "Invalid YouTube URL" });
      return;
    }

    // Check credits (5 credits for clip extraction)
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { credits_remaining: true },
    });

    if (!user || user.credits_remaining < 5) {
      res.status(402).json({ success: false, error: "Not enough credits. Clip extraction costs 5 credits." });
      return;
    }

    // Fetch transcript
    let segments: TranscriptSegment[];
    try {
      segments = await fetchYouTubeTranscript(videoId);
    } catch {
      res.status(422).json({
        success: false,
        error: "Could not fetch transcript. The video may not have captions enabled.",
      });
      return;
    }

    // Build timestamped transcript
    const fullTranscript = segments
      .map((s) => `[${formatTimestamp(s.offset / 1000)}] ${s.text}`)
      .join("\n");

    // Find viral moments
    const clips = await callAgentJSON<{ clips: ClipSuggestion[] }>({
      system: `You are a viral content expert who finds the best moments in long-form videos to turn into short-form clips for TikTok, Reels, and YouTube Shorts. You know what makes people stop scrolling.`,
      user: `Analyze this transcript with timestamps. Find the top ${num_clips} moments most likely to go viral as short-form clips (${clip_length} seconds each).

For each moment return JSON:
{
  "clips": [
    {
      "start_time_seconds": number,
      "end_time_seconds": number,
      "hook": "the first sentence that grabs attention",
      "why_viral": "why this moment works as a standalone clip",
      "suggested_caption": "caption for posting on social media",
      "virality_score": 1-100,
      "category": "hot_take | surprising_stat | emotional_moment | contrarian | funny | educational_nugget"
    }
  ]
}

Rules:
- Each clip should be roughly ${clip_length} seconds
- Clips must work as standalone content (no context needed)
- Prioritize moments with strong hooks in the first 3 seconds
- Hot takes and surprising stats score highest
- The hook should make someone stop scrolling

TRANSCRIPT:
${fullTranscript.substring(0, 15000)}`,
      model: "haiku",
      max_tokens: 2048,
    });

    // Deduct credits
    await prisma.user.update({
      where: { id: userId },
      data: { credits_remaining: { decrement: 5 } },
    });

    // Save to generated content
    await prisma.generatedContent.create({
      data: {
        user_id: userId,
        type: "clip_extraction",
        input: url,
        output: JSON.stringify(clips),
        credits_used: 5,
      },
    });

    res.json({
      success: true,
      data: {
        video_id: videoId,
        url,
        clips: clips.clips.sort((a, b) => b.virality_score - a.virality_score),
        note: "Clip timestamps are ready. Video download and cutting requires ffmpeg (coming soon).",
      },
      credits_used: 5,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("YouTube clips error:", err);
    res.status(500).json({ success: false, error: "Failed to extract clips" });
  }
});

// ============================================================
// POST /api/v1/youtube/batch-analyze
// Analyze multiple videos (for voice extraction from a channel)
// ============================================================

youtubeRouter.post("/batch-analyze", async (req: Request, res: Response) => {
  try {
    const { urls } = req.body;
    const userId = req.user!.id;

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      res.status(400).json({ success: false, error: "Missing urls array" });
      return;
    }

    if (urls.length > 10) {
      res.status(400).json({ success: false, error: "Maximum 10 videos per batch" });
      return;
    }

    const creditCost = urls.length * 2;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { credits_remaining: true },
    });

    if (!user || user.credits_remaining < creditCost) {
      res.status(402).json({
        success: false,
        error: `Not enough credits. Batch analysis costs ${creditCost} credits (2 per video).`,
      });
      return;
    }

    const { YoutubeTranscript } = await import("youtube-transcript");

    const results = [];
    let successCount = 0;

    for (const url of urls) {
      const videoId = extractVideoId(url);
      if (!videoId) {
        results.push({ url, success: false, error: "Invalid URL" });
        continue;
      }

      try {
        const segments = await fetchYouTubeTranscript(videoId);
        const fullTranscript = segments
          .map((s: TranscriptSegment) => `[${formatTimestamp(s.offset / 1000)}] ${s.text}`)
          .join("\n");

        const analysis = await callAgentJSON<VideoAnalysis>({
          system: "You are a content strategist. Analyze the transcript and extract structured insights as JSON.",
          user: `Extract from this transcript: key_topics, hooks_used_in_first_30_seconds, content_structure, recurring_phrases, cta_patterns, audience_engagement_triggers, video_style, estimated_target_audience, key_quotes (3-5 best lines), content_pillars.

TRANSCRIPT (first 8000 chars):
${fullTranscript.substring(0, 8000)}`,
          model: "haiku",
          max_tokens: 1500,
        });

        results.push({ url, video_id: videoId, success: true, analysis });
        successCount++;
      } catch {
        results.push({ url, success: false, error: "Transcript unavailable" });
      }
    }

    // Deduct credits for successful analyses only
    const actualCost = successCount * 2;
    if (actualCost > 0) {
      await prisma.user.update({
        where: { id: userId },
        data: { credits_remaining: { decrement: actualCost } },
      });
    }

    res.json({
      success: true,
      data: {
        total: urls.length,
        analyzed: successCount,
        failed: urls.length - successCount,
        results,
      },
      credits_used: actualCost,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("YouTube batch error:", err);
    res.status(500).json({ success: false, error: "Batch analysis failed" });
  }
});
