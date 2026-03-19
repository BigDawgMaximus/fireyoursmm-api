import Anthropic from "@anthropic-ai/sdk";
declare const client: Anthropic;
export interface AgentCall {
    system: string;
    user: string;
    model?: "sonnet" | "haiku";
    max_tokens?: number;
}
export declare function callAgent(call: AgentCall): Promise<string>;
export declare function callAgentJSON<T>(call: AgentCall): Promise<T>;
export declare function callAgentsParallel(calls: Record<string, AgentCall>): Promise<Record<string, string>>;
export { client as anthropicClient };
