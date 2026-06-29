// StatusBadge — semantic licence status. Color MEANS the status (moat discipline).
// Driven by lib/registry.js statusMeta() output: { tone: green|amber|grey|red, label }.
import s from './proof.module.css';

const TONE_CLASS = {
  green: s.green,   // Licensed (active VARA licence)
  amber: s.amber,   // In-Principle Approval
  grey: s.grey,     // Pending / unknown
  red: s.red,       // Withdrawn
};

export default function StatusBadge({ tone = 'grey', label }) {
  return (
    <span className={`${s.badge} ${TONE_CLASS[tone] || s.grey}`}>
      <span className={s.badgeDot} aria-hidden="true" />
      {label || tone}
    </span>
  );
}
