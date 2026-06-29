// Void — the honest absent-data state. The literal "void" of the thesis.
// Renders wherever we genuinely lack a verified value. NEVER a fabricated number.
import s from './proof.module.css';

export default function Void({ label = 'Not verified', title }) {
  return (
    <span className={s.void} title={title || 'No verified data — shown as absent, never fabricated.'}>
      <span className={s.voidDash} aria-hidden="true">—</span>
      {label}
    </span>
  );
}
