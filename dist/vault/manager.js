"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.vault = exports.VaultManager = void 0;
const promises_1 = __importDefault(require("node:fs/promises"));
const node_path_1 = __importDefault(require("node:path"));
const glob_1 = require("glob");
const minisearch_1 = __importDefault(require("minisearch"));
// ============================================================
// VAULT MANAGER
// Each client gets an Obsidian-style markdown vault.
// All knowledge, voice profiles, training data, competitor
// intel lives here as plain .md files.
// ============================================================
const VAULTS_ROOT = process.env.VAULTS_ROOT || "./data/vaults";
const VAULT_STRUCTURE = [
    "voice",
    "knowledge",
    "competitors",
    "posts/drafts",
    "posts/published",
    "training",
    "meta",
];
class VaultManager {
    searchIndexes = new Map();
    // --- Vault Lifecycle ---
    async createVault(clientId) {
        const vaultPath = node_path_1.default.join(VAULTS_ROOT, clientId);
        for (const dir of VAULT_STRUCTURE) {
            await promises_1.default.mkdir(node_path_1.default.join(vaultPath, dir), { recursive: true });
        }
        // Seed with algorithm intel (shared across all clients)
        await this.writeFile(clientId, "meta/algorithm_intel.md", ALGORITHM_INTEL_SEED);
        await this.writeFile(clientId, "meta/onboarding_status.md", ONBOARDING_STATUS_SEED);
        await this.writeFile(clientId, "meta/config.md", `# Client Config\n\nclient_id: ${clientId}\ncreated: ${new Date().toISOString()}\n`);
        return vaultPath;
    }
    async deleteVault(clientId) {
        const vaultPath = node_path_1.default.join(VAULTS_ROOT, clientId);
        await promises_1.default.rm(vaultPath, { recursive: true, force: true });
        this.searchIndexes.delete(clientId);
    }
    async vaultExists(clientId) {
        try {
            await promises_1.default.access(node_path_1.default.join(VAULTS_ROOT, clientId));
            return true;
        }
        catch {
            return false;
        }
    }
    // --- File Operations ---
    async writeFile(clientId, relativePath, content) {
        const fullPath = node_path_1.default.join(VAULTS_ROOT, clientId, relativePath);
        await promises_1.default.mkdir(node_path_1.default.dirname(fullPath), { recursive: true });
        await promises_1.default.writeFile(fullPath, content, "utf-8");
        // Invalidate search index for this client
        this.searchIndexes.delete(clientId);
    }
    async readFile(clientId, relativePath) {
        try {
            const fullPath = node_path_1.default.join(VAULTS_ROOT, clientId, relativePath);
            return await promises_1.default.readFile(fullPath, "utf-8");
        }
        catch {
            return null;
        }
    }
    async appendFile(clientId, relativePath, content) {
        const existing = await this.readFile(clientId, relativePath);
        const updated = existing ? `${existing}\n\n${content}` : content;
        await this.writeFile(clientId, relativePath, updated);
    }
    async listFiles(clientId, directory) {
        const searchPath = directory
            ? node_path_1.default.join(VAULTS_ROOT, clientId, directory)
            : node_path_1.default.join(VAULTS_ROOT, clientId);
        const files = await (0, glob_1.glob)("**/*.md", { cwd: searchPath });
        return files;
    }
    // --- Bulk Read (for agent context injection) ---
    async loadVoiceProfile(clientId, role) {
        const content = await this.readFile(clientId, `voice/${role}_voice_profile.md`);
        if (content)
            return content;
        // Fallback to brand guidelines
        const brand = await this.readFile(clientId, "voice/brand_voice_guidelines.md");
        return brand || "No voice profile found. Use a direct, punchy, human tone.";
    }
    async loadKnowledgeBase(clientId) {
        const files = await this.listFiles(clientId, "knowledge");
        const contents = [];
        for (const file of files) {
            const content = await this.readFile(clientId, `knowledge/${file}`);
            if (content) {
                contents.push(`--- ${file} ---\n${content}`);
            }
        }
        return contents.join("\n\n") || "No knowledge base uploaded yet.";
    }
    async loadTrainingData(clientId) {
        const [hooks, triggers, formats, bestPosts] = await Promise.all([
            this.readFile(clientId, "training/hooks_that_worked.md"),
            this.readFile(clientId, "training/triggers_that_worked.md"),
            this.readFile(clientId, "training/formats_that_worked.md"),
            this.readFile(clientId, "training/best_performing_posts.md"),
        ]);
        return {
            hooks: hooks || "No hook training data yet.",
            triggers: triggers || "No trigger training data yet.",
            formats: formats || "No format training data yet.",
            best_posts: bestPosts || "No best posts uploaded yet.",
        };
    }
    async loadCompetitorIntel(clientId) {
        const competitorDirs = await this.listCompetitors(clientId);
        const intel = [];
        for (const handle of competitorDirs) {
            const [profile, topPosts, strategy] = await Promise.all([
                this.readFile(clientId, `competitors/${handle}/profile.md`),
                this.readFile(clientId, `competitors/${handle}/top_posts.md`),
                this.readFile(clientId, `competitors/${handle}/strategy_notes.md`),
            ]);
            intel.push([
                `## @${handle}`,
                profile || "",
                topPosts || "",
                strategy || "",
            ].filter(Boolean).join("\n"));
        }
        return intel.join("\n\n") || "No competitors tracked yet.";
    }
    async listCompetitors(clientId) {
        try {
            const competitorsPath = node_path_1.default.join(VAULTS_ROOT, clientId, "competitors");
            const entries = await promises_1.default.readdir(competitorsPath, { withFileTypes: true });
            return entries.filter((e) => e.isDirectory()).map((e) => e.name);
        }
        catch {
            return [];
        }
    }
    // --- Wikilink Resolution ---
    /**
     * Extract [[wikilink]] references from file content.
     * Returns unique filenames without the brackets.
     */
    extractWikilinks(content) {
        const matches = content.matchAll(/\[\[([^\]]+)\]\]/g);
        const links = new Set();
        for (const match of matches) {
            links.add(match[1]);
        }
        return [...links];
    }
    /**
     * Resolve a wikilink name to a vault file path.
     * Searches all directories for a matching .md file.
     * E.g. "hooks_that_worked" -> "training/hooks_that_worked.md"
     */
    async resolveWikilink(clientId, linkName) {
        const allFiles = await this.listFiles(clientId);
        const target = linkName.toLowerCase().replace(/\.md$/, "");
        // Exact basename match first
        for (const file of allFiles) {
            const basename = node_path_1.default.basename(file, ".md").toLowerCase();
            if (basename === target)
                return file;
        }
        // Partial match fallback (e.g. "audience" matches "knowledge/audience.md")
        for (const file of allFiles) {
            if (file.toLowerCase().includes(target))
                return file;
        }
        return null;
    }
    /**
     * Load a file and all its wikilinked files, up to maxDepth levels.
     * Returns a map of filepath -> content for all resolved files.
     */
    async loadWithWikilinks(clientId, relativePath, maxDepth = 2) {
        const loaded = new Map();
        await this.resolveWikilinksRecursive(clientId, relativePath, loaded, 0, maxDepth);
        return loaded;
    }
    async resolveWikilinksRecursive(clientId, relativePath, loaded, currentDepth, maxDepth) {
        if (loaded.has(relativePath) || currentDepth > maxDepth)
            return;
        const content = await this.readFile(clientId, relativePath);
        if (!content)
            return;
        loaded.set(relativePath, content);
        if (currentDepth >= maxDepth)
            return;
        // Extract and resolve wikilinks
        const links = this.extractWikilinks(content);
        const resolvePromises = links.map(async (linkName) => {
            const resolved = await this.resolveWikilink(clientId, linkName);
            if (resolved && !loaded.has(resolved)) {
                await this.resolveWikilinksRecursive(clientId, resolved, loaded, currentDepth + 1, maxDepth);
            }
        });
        await Promise.all(resolvePromises);
    }
    // --- Full Context Load (for /draft) ---
    async loadDraftContext(clientId, role) {
        // Start from the voice profile and follow wikilinks 2 levels deep
        const voiceProfilePath = `voice/${role}_voice_profile.md`;
        const voiceFallbackPath = "voice/brand_voice_guidelines.md";
        const hasProfile = await this.readFile(clientId, voiceProfilePath);
        const startPath = hasProfile ? voiceProfilePath : voiceFallbackPath;
        // Load voice profile with linked files, plus standard context in parallel
        const [linkedFiles, knowledge, training, competitors] = await Promise.all([
            this.loadWithWikilinks(clientId, startPath, 2),
            this.loadKnowledgeBase(clientId),
            this.loadTrainingData(clientId),
            this.loadCompetitorIntel(clientId),
        ]);
        // Build linked context section from wikilink-resolved files
        const linkedContext = [];
        for (const [filePath, content] of linkedFiles) {
            if (filePath === startPath)
                continue; // voice profile shown separately
            linkedContext.push(`--- [[${node_path_1.default.basename(filePath, ".md")}]] ---\n${content}`);
        }
        const sections = [
            "=== VOICE PROFILE ===",
            linkedFiles.get(startPath) || "No voice profile found.",
            "",
        ];
        if (linkedContext.length > 0) {
            sections.push("=== LINKED CONTEXT (via wikilinks) ===", ...linkedContext, "");
        }
        sections.push("=== KNOWLEDGE BASE ===", knowledge, "", "=== HOOKS THAT WORKED ===", training.hooks, "", "=== TRIGGERS THAT WORKED ===", training.triggers, "", "=== BEST PERFORMING POSTS ===", training.best_posts, "", "=== COMPETITOR INTELLIGENCE ===", competitors);
        return sections.join("\n");
    }
    // --- Search ---
    async search(clientId, query, maxResults = 10) {
        const index = await this.getOrBuildIndex(clientId);
        const results = index.search(query, {
            prefix: true,
            fuzzy: 0.2,
            boost: { title: 2 },
        });
        return results.slice(0, maxResults).map((r) => ({
            file_path: r.id,
            snippet: r.content?.substring(0, 200) || "",
            relevance: r.score,
        }));
    }
    async getOrBuildIndex(clientId) {
        if (this.searchIndexes.has(clientId)) {
            return this.searchIndexes.get(clientId);
        }
        const index = new minisearch_1.default({
            fields: ["title", "content"],
            storeFields: ["content"],
            idField: "path",
        });
        const files = await this.listFiles(clientId);
        const docs = [];
        for (const file of files) {
            const content = await this.readFile(clientId, file);
            if (content) {
                docs.push({
                    path: file,
                    title: node_path_1.default.basename(file, ".md"),
                    content,
                });
            }
        }
        index.addAll(docs);
        this.searchIndexes.set(clientId, index);
        return index;
    }
    // --- Competitor Management ---
    async addCompetitor(clientId, handle) {
        const cleanHandle = handle.replace("@", "").toLowerCase();
        const dir = `competitors/${cleanHandle}`;
        await this.writeFile(clientId, `${dir}/profile.md`, `# @${cleanHandle}\n\nAdded: ${new Date().toISOString()}\nStatus: Pending initial scrape\n`);
        await this.writeFile(clientId, `${dir}/top_posts.md`, `# Top Posts - @${cleanHandle}\n\nAwaiting first scrape.\n`);
        await this.writeFile(clientId, `${dir}/strategy_notes.md`, `# Strategy Notes - @${cleanHandle}\n\nAwaiting analysis.\n`);
    }
}
exports.VaultManager = VaultManager;
// --- Seed Content ---
const ALGORITHM_INTEL_SEED = `# X Algorithm Intelligence (Phoenix, 2026)

## Signal Weights
- Author reply-back: 150x (HIGHEST - reply to people who reply to you)
- Engaged reply: 75x
- Reply: 27x
- Retweet: 20x
- Direct reply: 13.5x
- Profile click + engage: 12x
- Bookmark: 10x
- Like: 1x (nearly worthless)
- Link click: 0.5x (PENALTY)
- Report: -150x
- Block: -300x

## Core Rules
- First 30-60 min engagement velocity determines everything
- Premium: 4x in-network, 2x out-of-network boost
- Text-first (30-50% more reach than images/links)
- External links = 30-50% reach penalty (self-reply after 60 min)
- Max 0-1 hashtags
- Following:follower ratio below 0.6
- Optimal tweet length: 71-100 characters

## Content Mix
- 60% breaking news (short + cashtags)
- 25% hot takes (opinionated, contrarian)
- 15% threads (deep dives)

## Timing (EST)
- 9-11 AM
- 2-4 PM
- 8-10 PM

## 30-Min Playbook
1. Post (text only, no links)
2. Self-reply: source link
3. Self-reply: cashtags
4. Reply to every comment for 30 min
`;
const ONBOARDING_STATUS_SEED = `# Onboarding Status

## Steps
- [ ] Best content uploaded
- [ ] Competitors identified
- [ ] Knowledge base uploaded
- [ ] Platforms selected
- [ ] Role selected
- [ ] Aspiration content uploaded

## Processing
- [ ] Voice profile generated
- [ ] Knowledge base processed
- [ ] Competitor initial scrape complete
- [ ] Training data extracted
`;
exports.vault = new VaultManager();
//# sourceMappingURL=manager.js.map