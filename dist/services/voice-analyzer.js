"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeVoice = analyzeVoice;
exports.analyzeAspirationVoice = analyzeAspirationVoice;
exports.extractTrainingPatterns = extractTrainingPatterns;
const claude_js_1 = require("./claude.js");
const manager_js_1 = require("../vault/manager.js");
// ============================================================
// VOICE ANALYZER
// Takes a client's best posts and generates a voice profile.
// This runs during onboarding and when /train adds new posts.
// ============================================================
const VOICE_ANALYSIS_SYSTEM = `You are a voice analysis expert for Kai, a social media intelligence platform.

Your job: analyze a set of high-performing social media posts and extract a detailed voice profile that can be used to write new content in the same voice.

Analyze and extract:

1. SENTENCE PATTERNS
   - Average sentence length (words)
   - Do they use fragments? Full sentences? Mix?
   - Line break patterns (every sentence? Every 2-3?)

2. VOCABULARY
   - Words they use frequently
   - Words they never use
   - Industry jargon vs plain language ratio
   - Emoji usage (which ones, how often)

3. TONE MARKERS
   - Authoritative vs conversational vs provocative
   - Level of formality (1-10, where 1 = texting a friend, 10 = corporate press release)
   - Humor style (if any)
   - Use of numbers/data vs opinions

4. STRUCTURAL PATTERNS
   - Hook style (question? statement? breaking news?)
   - Body structure (bullets? paragraphs? one-liners?)
   - Closing style (CTA? question? mic drop?)
   - Thread vs single post preference

5. SIGNATURE MOVES
   - Any recurring phrases or cadences
   - Unique punctuation habits
   - Capitalization patterns
   - How they handle controversy

6. ENGAGEMENT TRIGGERS
   - How they invite replies
   - Binary choices, questions, hot takes
   - What reply triggers performed best

Write the profile as a concise document that another AI could use to perfectly mimic this voice. Be specific. Use examples from the posts.

Output format: Markdown document with clear sections.`;
async function analyzeVoice(clientId, role, posts) {
    const postsText = posts.map((p, i) => `--- Post ${i + 1} ---\n${p}`).join("\n\n");
    const profile = await (0, claude_js_1.callAgent)({
        model: "sonnet",
        system: VOICE_ANALYSIS_SYSTEM,
        user: `Analyze these ${posts.length} high-performing posts and generate a voice profile:\n\n${postsText}`,
        max_tokens: 4096,
    });
    // Save to vault
    await manager_js_1.vault.writeFile(clientId, `voice/${role}_voice_profile.md`, profile);
    return profile;
}
async function analyzeAspirationVoice(clientId, role, aspirationPosts) {
    // Load existing voice profile
    const existingProfile = await manager_js_1.vault.readFile(clientId, `voice/${role}_voice_profile.md`);
    const postsText = aspirationPosts.map((p, i) => `--- Aspiration Post ${i + 1} ---\n${p}`).join("\n\n");
    const aspirationAnalysis = await (0, claude_js_1.callAgent)({
        model: "sonnet",
        system: `You are a voice calibration expert. You have a client's current voice profile and a set of posts they WISH they had written (aspiration posts).

Your job: analyze the gap between their current voice and their aspirational voice, then update the voice profile to blend both. The goal is evolution, not replacement. Keep their authentic voice but incorporate the elements they admire.

Current voice profile:
${existingProfile || "No existing profile yet."}

Identify:
1. What elements from the aspiration posts should be adopted
2. What elements from the current voice should be preserved
3. Specific style shifts to make (with examples)

Output: An updated voice profile document (markdown) that blends current + aspirational.`,
        user: `ASPIRATION POSTS:\n\n${postsText}`,
        max_tokens: 4096,
    });
    // Save updated profile
    await manager_js_1.vault.writeFile(clientId, `voice/${role}_voice_profile.md`, aspirationAnalysis);
    return aspirationAnalysis;
}
async function extractTrainingPatterns(clientId, posts) {
    const postsText = posts.map((p, i) => `--- Post ${i + 1} ---\n${p}`).join("\n\n");
    // Extract hooks
    const hooks = await (0, claude_js_1.callAgent)({
        model: "haiku",
        system: `Extract the opening hooks from each post. For each hook, classify its pattern (urgency, contrarian, number, binary_choice, prediction, insider, question, statement). Format as markdown list with the hook text and pattern type.`,
        user: postsText,
    });
    await manager_js_1.vault.writeFile(clientId, "training/hooks_that_worked.md", `# Hooks That Worked\n\n${hooks}`);
    // Extract triggers
    const triggers = await (0, claude_js_1.callAgent)({
        model: "haiku",
        system: `Extract the engagement triggers from each post (questions, binary choices, CTAs, reply invitations). For each, classify the type and note its position (inline, end, self_reply). Format as markdown list.`,
        user: postsText,
    });
    await manager_js_1.vault.writeFile(clientId, "training/triggers_that_worked.md", `# Triggers That Worked\n\n${triggers}`);
    // Extract format patterns
    const formats = await (0, claude_js_1.callAgent)({
        model: "haiku",
        system: `Analyze the structural format of each post: line break patterns, length, use of emojis, thread vs single, media inclusion. Identify the top 3 recurring format patterns. Format as markdown.`,
        user: postsText,
    });
    await manager_js_1.vault.writeFile(clientId, "training/formats_that_worked.md", `# Formats That Worked\n\n${formats}`);
    // Save raw posts
    await manager_js_1.vault.writeFile(clientId, "training/best_performing_posts.md", `# Best Performing Posts\n\n${postsText}`);
}
//# sourceMappingURL=voice-analyzer.js.map