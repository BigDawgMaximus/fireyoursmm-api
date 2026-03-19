"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.anthropicClient = void 0;
exports.callAgent = callAgent;
exports.callAgentJSON = callAgentJSON;
exports.callAgentsParallel = callAgentsParallel;
const sdk_1 = __importDefault(require("@anthropic-ai/sdk"));
// ============================================================
// CLAUDE API SERVICE
// Wraps Anthropic SDK with Kai-specific defaults.
// ============================================================
const client = new sdk_1.default();
exports.anthropicClient = client;
const MODELS = {
    sonnet: "claude-sonnet-4-20250514",
    haiku: "claude-haiku-4-5-20251001",
};
async function callAgent(call) {
    const model = MODELS[call.model || "haiku"];
    const response = await client.messages.create({
        model,
        max_tokens: call.max_tokens || 2048,
        system: call.system,
        messages: [{ role: "user", content: call.user }],
    });
    const textBlock = response.content.find((b) => b.type === "text");
    return textBlock?.text || "";
}
async function callAgentJSON(call) {
    const raw = await callAgent({
        ...call,
        system: call.system + "\n\nRespond ONLY with valid JSON. No preamble, no markdown fences, no explanation.",
    });
    // Strip any markdown fences if model includes them anyway
    const cleaned = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    return JSON.parse(cleaned);
}
// Run multiple agent calls in parallel
async function callAgentsParallel(calls) {
    const entries = Object.entries(calls);
    const results = await Promise.allSettled(entries.map(([, call]) => callAgent(call)));
    const output = {};
    entries.forEach(([key], i) => {
        const result = results[i];
        output[key] = result.status === "fulfilled" ? result.value : `ERROR: ${result.reason}`;
    });
    return output;
}
//# sourceMappingURL=claude.js.map