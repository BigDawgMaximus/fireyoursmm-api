import { Router, type Request, type Response } from "express";
import multer from "multer";
import { requireAuth } from "../middleware/auth.js";
import { prisma } from "../lib/prisma.js";
import {
  analyzeThumbnail,
  generateThumbnailPrompt,
  generateFromScratch,
  PLATFORM_DIMENSIONS,
  type ThumbnailAnalysis,
  type ThumbnailConfig,
} from "../services/thumbnail-analyzer.js";

export const thumbnailsRouter = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

// ============================================================
// GET /dimensions — Supported platforms and their dimensions
// ============================================================

thumbnailsRouter.get("/dimensions", (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: { dimensions: PLATFORM_DIMENSIONS },
    timestamp: new Date().toISOString(),
  });
});

// ============================================================
// POST /analyze — Upload and analyze a thumbnail
// ============================================================

thumbnailsRouter.post(
  "/analyze",
  requireAuth,
  upload.single("image"),
  async (req: Request, res: Response) => {
    try {
      const file = req.file;
      if (!file) {
        res.status(400).json({ success: false, error: "No image uploaded. Send as multipart form with field name 'image'." });
        return;
      }

      // Check credits
      const user = await prisma.user.findUnique({
        where: { id: req.user!.id },
        select: { credits_remaining: true },
      });
      if (!user || user.credits_remaining < 2) {
        res.status(402).json({ success: false, error: "Insufficient credits. Thumbnail analysis costs 2 credits." });
        return;
      }

      const base64 = file.buffer.toString("base64");
      const mimeType = file.mimetype;

      const analysis = await analyzeThumbnail(base64, mimeType);

      // Deduct credits
      await prisma.user.update({
        where: { id: req.user!.id },
        data: { credits_remaining: { decrement: 2 } },
      });

      res.json({
        success: true,
        data: { analysis, credits_used: 2 },
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      console.error("Thumbnail analyze error:", err);
      res.status(500).json({ success: false, error: err instanceof Error ? err.message : "Analysis failed" });
    }
  },
);

// ============================================================
// POST /generate — Generate a new thumbnail concept
// ============================================================

thumbnailsRouter.post("/generate", requireAuth, async (req: Request, res: Response) => {
  try {
    const { analysis, title, subtitle, brand_colors, platform, style, include_face, face_description } = req.body;

    if (!title || !platform) {
      res.status(400).json({ success: false, error: "Missing title or platform" });
      return;
    }

    // Check credits
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: { credits_remaining: true },
    });
    if (!user || user.credits_remaining < 3) {
      res.status(402).json({ success: false, error: "Insufficient credits. Thumbnail generation costs 3 credits." });
      return;
    }

    const config: ThumbnailConfig = {
      title,
      subtitle,
      brandColors: brand_colors || { primary: "#00D4AA", secondary: "#0A0A0A", accent: "#FFFFFF" },
      platform,
      style,
      includeFace: include_face,
      faceDescription: face_description,
    };

    let concept;
    if (analysis) {
      concept = await generateThumbnailPrompt(analysis as ThumbnailAnalysis, config);
    } else {
      concept = await generateFromScratch(config);
    }

    // Deduct credits
    await prisma.user.update({
      where: { id: req.user!.id },
      data: { credits_remaining: { decrement: 3 } },
    });

    // Save to GeneratedContent
    await prisma.generatedContent.create({
      data: {
        user_id: req.user!.id,
        type: "thumbnail",
        platform,
        input: title,
        output: JSON.stringify(concept),
        credits_used: 3,
      },
    });

    res.json({
      success: true,
      data: { concept, credits_used: 3 },
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Thumbnail generate error:", err);
    res.status(500).json({ success: false, error: err instanceof Error ? err.message : "Generation failed" });
  }
});

// ============================================================
// POST /batch — Generate concepts for multiple titles
// ============================================================

thumbnailsRouter.post("/batch", requireAuth, async (req: Request, res: Response) => {
  try {
    const { analysis, titles, platform, brand_colors, style } = req.body;

    if (!titles?.length || !platform) {
      res.status(400).json({ success: false, error: "Missing titles array or platform" });
      return;
    }

    const titleList = titles as string[];
    const creditCost = titleList.length * 2;

    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: { credits_remaining: true },
    });
    if (!user || user.credits_remaining < creditCost) {
      res.status(402).json({ success: false, error: `Insufficient credits. Batch of ${titleList.length} costs ${creditCost} credits.` });
      return;
    }

    const concepts = await Promise.all(
      titleList.map((title) => {
        const config: ThumbnailConfig = {
          title,
          brandColors: brand_colors || { primary: "#00D4AA", secondary: "#0A0A0A", accent: "#FFFFFF" },
          platform,
          style,
        };
        return analysis
          ? generateThumbnailPrompt(analysis as ThumbnailAnalysis, config)
          : generateFromScratch(config);
      }),
    );

    await prisma.user.update({
      where: { id: req.user!.id },
      data: { credits_remaining: { decrement: creditCost } },
    });

    res.json({
      success: true,
      data: { concepts, count: concepts.length, credits_used: creditCost },
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Thumbnail batch error:", err);
    res.status(500).json({ success: false, error: err instanceof Error ? err.message : "Batch generation failed" });
  }
});
