// DeepSeek via the gateway, behind the Anthropic SDK's `messages.create` shape — his /goal 2026-09-17: "for all my
// platforms i want to use deep seek api". Every text call goes to DeepSeek through khurrambadar.com/api/gateway (the
// one project holding the key). Calls the gateway cannot serve yet — tools, images/documents, streaming — fall back
// to the Anthropic client passed in, so nothing breaks while those paths are converted. Set on this platform:
//   DEEPSEEK_API_KEY   = this platform's gateway bearer (a gateway-only secret, not a DeepSeek key)
//   DEEPSEEK_BASE_URL  = https://khurrambadar.com/api/gateway   (default)
// Model mapping: haiku → deepseek-flash · sonnet/opus → deepseek-v4-pro (thinking off) · deepseek-* passes through.
const BASE = (process.env.DEEPSEEK_BASE_URL || 'https://khurrambadar.com/api/gateway').replace(/\/$/, '');
const mapModel = (m) => { const s = String(m || ''); if (/^deepseek-/.test(s)) return s; if (/sonnet|opus/i.test(s)) return 'deepseek-v4-pro'; return 'deepseek-flash'; };
const textOnly = (msgs) => (msgs || []).every((m) => typeof m.content === 'string' || (Array.isArray(m.content) && m.content.every((b) => b && b.type === 'text')));
const flat = (c) => (typeof c === 'string' ? c : (c || []).map((b) => b.text || '').join('\n'));
async function viaGateway(params, opts) {
  const key = process.env.DEEPSEEK_API_KEY; if (!key) throw new Error('DEEPSEEK_API_KEY not set');
  const system = flat(params.system);
  const messages = [...(system ? [{ role: 'system', content: system }] : []), ...params.messages.map((m) => ({ role: m.role, content: flat(m.content) }))];
  const ctl = new AbortController(); const timer = setTimeout(() => ctl.abort(), (opts && opts.timeout) || 60000);
  try {
    const r = await fetch(`${BASE}/chat/completions`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` }, body: JSON.stringify({ model: mapModel(params.model), messages, max_tokens: params.max_tokens || 1024, temperature: params.temperature }), signal: ctl.signal });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) { const e = new Error(`gateway ${r.status}: ${(j.error && j.error.message) || ''}`); e.status = r.status; throw e; }
    const ch = j.choices && j.choices[0]; const u = j.usage || {};
    return { id: j.id || 'gw', type: 'message', role: 'assistant', model: j.model || mapModel(params.model), content: [{ type: 'text', text: (ch && ch.message && ch.message.content) || '' }], stop_reason: ch && ch.finish_reason === 'length' ? 'max_tokens' : 'end_turn', stop_sequence: null, usage: { input_tokens: (u.prompt_tokens || 0), output_tokens: (u.completion_tokens || 0), cache_read_input_tokens: u.prompt_cache_hit_tokens || 0 }, _provider: 'deepseek' };
  } finally { clearTimeout(timer); }
}
/** Streaming: DeepSeek SSE → Anthropic-shaped events (message_start · content_block_delta/text_delta · message_delta.usage · message_stop). */
async function* viaGatewayStream(params, opts) {
  const key = process.env.DEEPSEEK_API_KEY; if (!key) throw new Error('DEEPSEEK_API_KEY not set');
  const system = flat(params.system);
  const messages = [...(system ? [{ role: 'system', content: system }] : []), ...params.messages.map((m) => ({ role: m.role, content: flat(m.content) }))];
  const model = mapModel(params.model);
  const r = await fetch(`${BASE}/chat/completions`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` }, body: JSON.stringify({ model, messages, max_tokens: params.max_tokens || 1024, temperature: params.temperature, stream: true, stream_options: { include_usage: true } }) });
  if (!r.ok || !r.body) { const j = await r.json().catch(() => ({})); const e = new Error(`gateway ${r.status}: ${(j.error && j.error.message) || ''}`); e.status = r.status; throw e; }
  yield { type: 'message_start', message: { id: 'gw', type: 'message', role: 'assistant', model, content: [], usage: { input_tokens: 0, output_tokens: 0 } } };
  yield { type: 'content_block_start', index: 0, content_block: { type: 'text', text: '' } };
  const reader = r.body.getReader(); const dec = new TextDecoder(); let buf = ''; let usage = null; let finish = 'end_turn';
  for (;;) {
    const { value, done } = await reader.read(); if (done) break;
    buf += dec.decode(value, { stream: true }); const lines = buf.split('\n'); buf = lines.pop();
    for (const line of lines) {
      if (!line.startsWith('data:')) continue; const payload = line.slice(5).trim(); if (payload === '[DONE]') continue;
      let ev; try { ev = JSON.parse(payload); } catch { continue; }
      const ch = ev.choices && ev.choices[0]; const t = ch && ch.delta && ch.delta.content;
      if (t) yield { type: 'content_block_delta', index: 0, delta: { type: 'text_delta', text: t } };
      if (ch && ch.finish_reason === 'length') finish = 'max_tokens';
      if (ev.usage) usage = ev.usage;
    }
  }
  yield { type: 'content_block_stop', index: 0 };
  yield { type: 'message_delta', delta: { stop_reason: finish, stop_sequence: null }, usage: { input_tokens: (usage && usage.prompt_tokens) || 0, output_tokens: (usage && usage.completion_tokens) || 0 } };
  yield { type: 'message_stop' };
}
/** Wrap an Anthropic client: `messages.create` prefers DeepSeek (streaming included); tools and images stay with the real client. */
export function withDeepSeek(anthropic) {
  const create = async (params, opts) => {
    const eligible = process.env.DEEPSEEK_API_KEY && !params.tools && !params.tool_choice && textOnly(params.messages) && process.env.DEEPSEEK_DISABLED !== '1';
    if (eligible) { try { return params.stream ? viaGatewayStream(params, opts) : await viaGateway(params, opts); } catch (e) { console.error('[deepseek-shim] gateway failed, falling back to anthropic:', String(e.message).slice(0, 120)); if (!anthropic) throw e; } }
    if (!anthropic) throw new Error('no fallback client');
    return anthropic.messages.create(params, opts);
  };
  return new Proxy(anthropic || {}, { get(t, k) { if (k === 'messages') return new Proxy(t.messages || {}, { get(m, mk) { if (mk === 'create') return create; return m[mk]; } }); return t[k]; } });
}
export default withDeepSeek;
