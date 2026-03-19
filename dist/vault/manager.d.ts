import type { VaultSearchResult } from "../types/index.js";
export declare class VaultManager {
    private searchIndexes;
    createVault(clientId: string): Promise<string>;
    deleteVault(clientId: string): Promise<void>;
    vaultExists(clientId: string): Promise<boolean>;
    writeFile(clientId: string, relativePath: string, content: string): Promise<void>;
    readFile(clientId: string, relativePath: string): Promise<string | null>;
    appendFile(clientId: string, relativePath: string, content: string): Promise<void>;
    listFiles(clientId: string, directory?: string): Promise<string[]>;
    loadVoiceProfile(clientId: string, role: string): Promise<string>;
    loadKnowledgeBase(clientId: string): Promise<string>;
    loadTrainingData(clientId: string): Promise<{
        hooks: string;
        triggers: string;
        formats: string;
        best_posts: string;
    }>;
    loadCompetitorIntel(clientId: string): Promise<string>;
    listCompetitors(clientId: string): Promise<string[]>;
    /**
     * Extract [[wikilink]] references from file content.
     * Returns unique filenames without the brackets.
     */
    extractWikilinks(content: string): string[];
    /**
     * Resolve a wikilink name to a vault file path.
     * Searches all directories for a matching .md file.
     * E.g. "hooks_that_worked" -> "training/hooks_that_worked.md"
     */
    resolveWikilink(clientId: string, linkName: string): Promise<string | null>;
    /**
     * Load a file and all its wikilinked files, up to maxDepth levels.
     * Returns a map of filepath -> content for all resolved files.
     */
    loadWithWikilinks(clientId: string, relativePath: string, maxDepth?: number): Promise<Map<string, string>>;
    private resolveWikilinksRecursive;
    loadDraftContext(clientId: string, role: string): Promise<string>;
    search(clientId: string, query: string, maxResults?: number): Promise<VaultSearchResult[]>;
    private getOrBuildIndex;
    addCompetitor(clientId: string, handle: string): Promise<void>;
}
export declare const vault: VaultManager;
//# sourceMappingURL=manager.d.ts.map