import Anthropic from "@anthropic-ai/sdk";

// ============================================================
// THUMBNAIL ANALYZER & GENERATOR
// Decodes visual structure of thumbnails and generates new concepts.
// Uses Claude's vision capabilities for analysis.
// ============================================================

const client = new Anthropic();

const DECODE_PROMPT = `You are a Visual Data Extraction Engine. Convert this image into exhaustive JSON that captures every element needed to recreate it.

Analyze:
1. MACRO: Layout, lighting, environment, atmosphere
2. MICRO: Textures, colors (exact hex codes), shadows, text (exact fonts/cases)
3. SPATIAL: Element positions, overlaps, hierarchy

Output ONLY this JSON structure:
{
  "scene": {
    "description": "One paragraph describing the full scene",
    "background": { "type": "solid|gradient|image|pattern", "colors": ["#hex"], "style": "string" },
    "lighting": { "direction": "string", "intensity": "string", "color_temp": "warm|cool|neutral" },
    "mood": "string"
  },
  "layout": {
    "composition": "rule-of-thirds|centered|asymmetric|split",
    "focal_point": "left|center|right|upper-left|upper-right|lower-left|lower-right",
    "negative_space": "minimal|moderate|generous"
  },
  "text_elements": [
    {
      "content": "exact text shown",
      "position": "top-left|top-center|top-right|center|bottom-left|bottom-center|bottom-right",
      "size": "headline|subheadline|body|small",
      "font_style": "bold-sans|thin-sans|serif|script|monospace|impact",
      "color": "#hex",
      "stroke_outline": { "has_outline": true, "color": "#hex", "width": "thin|medium|thick" },
      "effects": "shadow|glow|3d|gradient|none",
      "case": "uppercase|lowercase|titlecase|mixed"
    }
  ],
  "visual_elements": [
    {
      "type": "person|object|icon|shape|emoji|logo",
      "description": "detailed description",
      "position": "string",
      "size_pct": 0.0,
      "style": "photo|illustration|3d-render|cutout|cartoon",
      "expression": "string (if person)",
      "action": "string (if person)"
    }
  ],
  "color_palette": {
    "primary": "#hex",
    "secondary": "#hex",
    "accent": "#hex",
    "text_primary": "#hex",
    "text_secondary": "#hex"
  },
  "platform_analysis": {
    "likely_platform": "youtube|instagram|tiktok|x|linkedin",
    "effectiveness_score": 0,
    "what_makes_it_work": "string",
    "hook_type": "curiosity|shock|authority|fomo|contrast|before-after|listicle"
  },
  "reconstruction_prompt": "A complete image generation prompt that would recreate this thumbnail from scratch"
}`;

export const PLATFORM_DIMENSIONS: Record<string, { width: number; height: number; label: string }> = {
  youtube: { width: 1280, height: 720, label: "YouTube (16:9)" },
  instagram_post: { width: 1080, height: 1080, label: "Instagram Post (1:1)" },
  instagram_story: { width: 1080, height: 1920, label: "Instagram Story (9:16)" },
  instagram_reel: { width: 1080, height: 1920, label: "Instagram Reel (9:16)" },
  tiktok: { width: 1080, height: 1920, label: "TikTok (9:16)" },
  x: { width: 1200, height: 675, label: "X / Twitter (16:9)" },
  linkedin: { width: 1200, height: 627, label: "LinkedIn (1.91:1)" },
  facebook: { width: 1200, height: 630, label: "Facebook (1.91:1)" },
  podcast: { width: 3000, height: 3000, label: "Podcast Cover (1:1)" },
  youtube_shorts: { width: 1080, height: 1920, label: "YouTube Shorts (9:16)" },
};

export interface ThumbnailAnalysis {
  scene: { description: string; background: object; lighting: object; mood: string };
  layout: { composition: string; focal_point: string; negative_space: string };
  text_elements: Array<{ content: string; position: string; size: string; font_style: string; color: string; effects: string; case: string }>;
  visual_elements: Array<{ type: string; description: string; position: string; style: string }>;
  color_palette: { primary: string; secondary: string; accent: string; text_primary: string; text_secondary: string };
  platform_analysis: { likely_platform: string; effectiveness_score: number; what_makes_it_work: string; hook_type: string };
  reconstruction_prompt: string;
}

export interface ThumbnailConfig {
  title: string;
  subtitle?: string;
  brandColors: { primary: string; secondary: string; accent: string };
  platform: string;
  style?: string;
  includeFace?: boolean;
  faceDescription?: string;
}

export interface ThumbnailConcept {
  image_prompt: string;
  text_overlay: {
    headline: { text: string; position: string; font: string; color: string; size_px: number; effects: string };
    subtitle?: { text: string; position: string; font: string; color: string; size_px: number };
  };
  dimensions: string;
  platform: string;
  design_notes: string;
  css_mockup: string;
}

export async function analyzeThumbnail(
  imageBase64: string,
  mimeType: string = "image/jpeg",
): Promise<ThumbnailAnalysis> {
  const response = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 4000,
    messages: [{
      role: "user",
      content: [
        {
          type: "image",
          source: {
            type: "base64",
            media_type: mimeType as "image/jpeg" | "image/png" | "image/gif" | "image/webp",
            data: imageBase64,
          },
        },
        { type: "text", text: DECODE_PROMPT },
      ],
    }],
  });

  const text = response.content.find((b) => b.type === "text");
  const raw = text?.type === "text" ? text.text : "";
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("Failed to extract analysis JSON from response");
  return JSON.parse(jsonMatch[0]) as ThumbnailAnalysis;
}

export async function generateThumbnailPrompt(
  analysis: ThumbnailAnalysis,
  config: ThumbnailConfig,
): Promise<ThumbnailConcept> {
  const dim = PLATFORM_DIMENSIONS[config.platform] || PLATFORM_DIMENSIONS.youtube;
  const dimStr = `${dim.width}x${dim.height}`;

  const prompt = `You analyzed a reference thumbnail and got this JSON:
${JSON.stringify(analysis, null, 2)}

Now generate a NEW thumbnail concept using the same layout/composition/hook style but with:
- Title: "${config.title}"
${config.subtitle ? `- Subtitle: "${config.subtitle}"` : ""}
- Brand colors: Primary ${config.brandColors.primary}, Secondary ${config.brandColors.secondary}, Accent ${config.brandColors.accent}
- Platform: ${config.platform} (dimensions: ${dimStr})
${config.style ? `- Style preference: ${config.style}` : ""}
${config.includeFace ? `- Include a person: ${config.faceDescription || "professional looking person with expressive face"}` : ""}

Output a JSON with:
{
  "image_prompt": "Complete prompt for an image generation model. Include exact colors, layout, text placement, style, lighting.",
  "text_overlay": {
    "headline": { "text": "string", "position": "string", "font": "string", "color": "#hex", "size_px": 0, "effects": "string" },
    "subtitle": { "text": "string", "position": "string", "font": "string", "color": "#hex", "size_px": 0 }
  },
  "dimensions": "${dimStr}",
  "platform": "${config.platform}",
  "design_notes": "Brief explanation of why this design will perform well",
  "css_mockup": "Complete HTML/CSS code for a static mockup using only CSS gradients, shapes, and text. Use exact dimensions ${dimStr}, colors, fonts."
}

Output ONLY the JSON.`;

  const response = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 3000,
    messages: [{ role: "user", content: prompt }],
  });

  const text = response.content.find((b) => b.type === "text");
  const raw = text?.type === "text" ? text.text : "";
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("Failed to generate thumbnail concept");
  return JSON.parse(jsonMatch[0]) as ThumbnailConcept;
}

export async function generateFromScratch(config: ThumbnailConfig): Promise<ThumbnailConcept> {
  const dim = PLATFORM_DIMENSIONS[config.platform] || PLATFORM_DIMENSIONS.youtube;
  const dimStr = `${dim.width}x${dim.height}`;

  const prompt = `Design a high-performing thumbnail for:
- Title: "${config.title}"
${config.subtitle ? `- Subtitle: "${config.subtitle}"` : ""}
- Platform: ${config.platform} (dimensions: ${dimStr})
- Brand colors: Primary ${config.brandColors.primary}, Secondary ${config.brandColors.secondary}, Accent ${config.brandColors.accent}
${config.style ? `- Style: ${config.style}` : "- Style: bold, high-contrast, attention-grabbing"}
${config.includeFace ? `- Include a person: ${config.faceDescription || "professional looking person"}` : ""}

Design a thumbnail that will get high CTR. Use proven patterns: high contrast, clear text, emotional triggers, curiosity gaps.

Output ONLY JSON:
{
  "image_prompt": "Complete prompt for an image generation model. Be extremely specific about colors, layout, text, lighting, style.",
  "text_overlay": {
    "headline": { "text": "string", "position": "string", "font": "string", "color": "#hex", "size_px": 0, "effects": "string" },
    "subtitle": { "text": "string", "position": "string", "font": "string", "color": "#hex", "size_px": 0 }
  },
  "dimensions": "${dimStr}",
  "platform": "${config.platform}",
  "design_notes": "Why this design will get clicks",
  "css_mockup": "Complete HTML/CSS code for a static mockup using only CSS. Dimensions ${dimStr}."
}`;

  const response = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 3000,
    messages: [{ role: "user", content: prompt }],
  });

  const text = response.content.find((b) => b.type === "text");
  const raw = text?.type === "text" ? text.text : "";
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("Failed to generate thumbnail concept");
  return JSON.parse(jsonMatch[0]) as ThumbnailConcept;
}
