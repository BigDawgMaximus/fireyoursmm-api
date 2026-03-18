import Anthropic from "@anthropic-ai/sdk";

// ============================================================
// CLAUDE API SERVICE
// Wraps Anthropic SDK with Kai-specific defaults.
// ============================================================

const client = new Anthropic();

export interface AgentCall {
  system: string;
  user: string;
  model?: "sonnet" | "haiku";
  max_tokens?: number;
}

const MODELS = {
  sonnet: "claude-sonnet-4-20250514",
  haiku: "claude-haiku-4-5-20251001",
} as const;

export async function callAgent(call: AgentCall): Promise<string> {
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

export async function callAgentJSON<T>(call: AgentCall): Promise<T> {
  const raw = await callAgent({
    ...call,
    system: call.system + "\n\nRespond ONLY with valid JSON. No preamble, no markdown fences, no explanation.",
  });

  // Strip any markdown fences if model includes them anyway
  const cleaned = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
  return JSON.parse(cleaned) as T;
}

// Run multiple agent calls in parallel
export async function callAgentsParallel(calls: Record<string, AgentCall>): Promise<Record<string, string>> {
  const entries = Object.entries(calls);

  const results = await Promise.allSettled(
    entries.map(([, call]) => callAgent(call))
  );

  const output: Record<string, string> = {};
  entries.forEach(([key], i) => {
    const result = results[i];
    output[key] = result.status === "fulfilled" ? result.value : `ERROR: ${(result as PromiseRejectedResult).reason}`;
  });

  return output;
}

export { client as anthropicClient };
