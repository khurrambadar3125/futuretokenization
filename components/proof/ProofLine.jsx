// ProofLine — the platform's signature gesture.
// A quiet mono hairline under any datum; click to expand its exact VARA source.
// Uses native <details> so it works without JS (SSG-friendly, accessible).
//
// THE RULE: a fact that cannot supply a ProofLine does not get rendered. Use <Void> instead.
import s from './proof.module.css';
import { fmtDate } from './util';

const VARA_REGISTER = 'https://www.vara.ae/en/licenses-and-register/public-register/';

export default function ProofLine({
  id,                       // e.g. "VL/23/06/001" — the licence reference
  source = 'VARA Register',
  url = VARA_REGISTER,      // canonical source URL
  verifiedAt,               // ISO date string, e.g. "2026-06-25"
  rows = [],                // optional [{ key, val }] extra evidence in the expanded body
}) {
  const date = fmtDate(verifiedAt);
  return (
    <details className={s.proof}>
      <summary className={s.summary}>
        <span className={s.tick} aria-hidden="true">✓</span>
        {id && <span className={`${s.id} ft-mono`}>{id}</span>}
        <span className={s.sep} aria-hidden="true">·</span>
        <span className={s.src}>{source}</span>
        {date && (
          <>
            <span className={s.sep} aria-hidden="true">·</span>
            <span className={s.date}>verified {date}</span>
          </>
        )}
        <span className={s.caret} aria-hidden="true">▸</span>
      </summary>
      <div className={s.body}>
        {id && (
          <div className={s.bodyRow}>
            <span className={s.bodyKey}>Reference</span>
            <span className={`${s.bodyVal} ft-mono`}>{id}</span>
          </div>
        )}
        {rows.map((r) => (
          <div className={s.bodyRow} key={r.key}>
            <span className={s.bodyKey}>{r.key}</span>
            <span className={s.bodyVal}>{r.val}</span>
          </div>
        ))}
        <div className={s.bodyRow}>
          <span className={s.bodyKey}>Source</span>
          <a className={s.link} href={url} target="_blank" rel="noopener noreferrer">
            {source} ↗
          </a>
        </div>
        {date && (
          <div className={s.bodyRow}>
            <span className={s.bodyKey}>Verified</span>
            <span className={s.bodyVal}>{date}</span>
          </div>
        )}
      </div>
    </details>
  );
}
