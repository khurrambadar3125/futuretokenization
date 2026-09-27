// Types for ai-chain.mjs (TypeScript repos import "./ai-chain.mjs" and get these). Keep in step with ai-chain.mjs.
export declare const AI_CHAIN_VERSION: string;
export declare const JEV_MODEL: "jev-1.13.0";
export type ProviderName = "deepseek" | "moonshot" | "anthropic";
export interface ProviderConfig { kind: "openai" | "anthropic"; url: string; keyEnv: string; baseEnv?: string; model: string; modelRe?: RegExp; noTemperature?: boolean }
export declare const DEFAULT_PROVIDERS: Record<ProviderName, ProviderConfig>;
export declare const DEFAULT_ORDER: ProviderName[];
export interface Budget { ttftMs: number; totalMs: number }
export declare const DEFAULT_BUDGETS: Record<"chat" | "complete" | "batch" | "deep", Budget>;
export interface Price { in: number; hit: number; write: number; out: number; source: string; checked: string; model: string; known: boolean; peak?: boolean }
export declare const PRICE_BOOK: Record<string, unknown>;
export declare function priceFor(model: string, at?: Date): Price;
export declare function costUsd(model: string, u: { input?: number; output?: number; cacheRead?: number; cacheWrite?: number }, at?: Date): number;
export declare function isDeepSeekPeak(d?: Date): boolean;
export declare function anthropicModel<T extends string>(model: T): T;
export declare function assertModelFor(provider: string, cfg: ProviderConfig, model: string): string;
export declare function redact(s: unknown, env?: Record<string, string | undefined>): string;
export declare function cleanMessages(msgs: ChatMessage[]): ChatMessage[];

export interface ChatMessage { role: "user" | "assistant"; content: string }
export interface SpendRecord { task: string; provider: ProviderName; model: string; input: number; output: number; cacheRead: number; cacheWrite: number; usd: number; estimated: boolean; outcome: string; priceSource: string; priceChecked: string; at: string }
export interface FailoverEvent { task: string; from: ProviderName; to: ProviderName | null; reason: "breaker-open" | "hedge-ttft" | `error:${string}` | string; detail?: string; at: string }
export interface AttemptView { provider: ProviderName; model: string; outcome: "ok" | "error" | "cancelled" | "aborted" | "running"; ttftMs: number | null; totalMs: number | null; reason: string; error?: string }
export interface ChainResult { text: string; json?: any; provider: ProviderName; model: string; degraded: boolean; ttftMs: number; totalMs: number; usage: { input: number; output: number; cacheRead: number; cacheWrite: number }; usd: number; attempts: AttemptView[]; gate?: Promise<GateResult>; preJudge?: Promise<JudgeResult> }
export declare class ChainError extends Error { attempts: AttemptView[] }

export interface BreakerOptions { window?: number; minSamples?: number; errorRate?: number; consecutive?: number; slowTtftMs?: number; cooldownMs?: number; now?: () => number }
export declare class Breaker {
  constructor(o?: BreakerOptions);
  record(s: { ok: boolean; ttftMs?: number; slow?: boolean }): void;
  allow(): boolean;
  state(): "closed" | "open" | "half-open" | "half-open-ready";
  p95(): number | null;
  stats(): { state: string; reason: string; n: number; errorRate: number; p95TtftMs: number | null };
}

export interface ChainOptions {
  env?: Record<string, string | undefined>; fetch?: typeof fetch; order?: ProviderName[]; models?: Partial<Record<ProviderName, string>>;
  providers?: Partial<Record<ProviderName, Partial<ProviderConfig>>>; budgets?: Partial<Record<string, Budget>>; hedge?: boolean;
  breaker?: BreakerOptions; breakers?: Map<string, Breaker>;
  onSpend?: (r: SpendRecord) => void | Promise<void>; onFailover?: (e: FailoverEvent) => void | Promise<void>; onAttempt?: (e: AttemptView & { task: string }) => void | Promise<void>;
  log?: (msg: string) => void; now?: () => number;
}
interface CommonCall { task: string; maxTokens?: number; temperature?: number; json?: boolean; deep?: boolean; latency?: "chat" | "complete" | "batch" | "deep" | string; budget?: Partial<Budget> }
export interface CompleteInput extends CommonCall { system: string | string[]; context?: string; user?: string; messages?: ChatMessage[] }
export interface StreamChatInput extends CommonCall {
  system: string | string[]; messages: ChatMessage[]; onText: (t: string) => void;
  preJudge?: { state: unknown; questions: Record<string, JevQuestion>; fallback?: (state: unknown) => any; timeoutMs?: number };
  shadowGate?: GateOptions; onGate?: (g: GateResult) => void;
}
export interface Chain {
  complete(g: CompleteInput): Promise<ChainResult>;
  streamChat(g: StreamChatInput): Promise<ChainResult>;
  available(): ProviderName[];
  breakers: Record<ProviderName, Breaker>;
  providers: Record<ProviderName, ProviderConfig>;
  order: ProviderName[];
}
export declare function createChain(opts?: ChainOptions): Chain;

export type JevQuestion = { type: "noul"; instructions: string } | { type: "choice"; instructions: string; criteria: Record<string, string> } | { type: "score"; instructions: string; criteria: string[] };
export interface JudgeResult { source: "jev" | "fallback" | "none"; answers: Record<string, any> | null; ms: number; usd: number; model: string | null }
export declare function judge(state: unknown, questions: Record<string, JevQuestion>, o?: { timeoutMs?: number; retries?: number; fallback?: (state: unknown) => any; jevFn?: Function; env?: Record<string, string | undefined>; fetch?: typeof fetch }): Promise<JudgeResult>;
export declare function answerNoul(j: JudgeResult | null, k: string): number | null;
export declare function answerChoice(j: JudgeResult | null, k: string): string | null;
export interface GateOptions {
  rules?: { id: string; re: RegExp }[]; ground?: (text: string) => { ok: boolean; missing?: string[] } | Promise<{ ok: boolean; missing?: string[] }>;
  source?: string; state?: unknown; questions?: Record<string, JevQuestion>; pass?: (answers: Record<string, any>) => boolean;
  mode?: "shadow" | "enforce"; timeoutMs?: number; retries?: number; jevFn?: Function; env?: Record<string, string | undefined>; englishOnly?: boolean;
}
export interface GateResult { verdict: "pass" | "hold" | "unjudged"; publishable: boolean; reasons: string[]; mode: "shadow" | "enforce"; ms: number; jevMs: number | null; source: "jev" | null; answers?: Record<string, any>; usd?: number }
export declare function gate(text: string, o?: GateOptions): Promise<GateResult>;
export declare function holdAndRetry(generate: (attempt: number, lastReasons: string[]) => Promise<string>, gateOpts?: GateOptions, o?: { retries?: number }): Promise<{ published: boolean; text: string | null; lastText: string | null; gate: GateResult; attempts: number }>;
export declare function needsDeeper(prompt: string, o?: { threshold?: number; timeoutMs?: number; jevFn?: Function; env?: Record<string, string | undefined> }): Promise<{ deeper: boolean | null; p: number | null; ms: number; source: string }>;
