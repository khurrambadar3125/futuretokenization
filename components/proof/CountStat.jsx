// CountStat — a large mono figure that counts up on reveal, ALWAYS wrapping a ProofLine.
// Enforces the rule: no naked numbers. Every headline figure carries its proof.
//
// Correctness over flourish: SSR / no-JS render the REAL number. On the client we set the
// start value BEFORE paint (isomorphic layout effect) so the figure counts up from 0 with
// NO flash of the real-number-then-reset — a "0 licences" flash would undermine a trust product.
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import s from './proof.module.css';
import ProofLine from './ProofLine';

const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export default function CountStat({ value, label, proof }) {
  const target = Number(value) || 0;
  const [display, setDisplay] = useState(target); // SSR/no-JS shows the real number
  const ref = useRef(null);

  useIsoLayoutEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || target === 0) return; // leave the real number in place
    const node = ref.current;
    if (!node) return;

    setDisplay(0); // before paint → no flash of the real value

    let raf;
    const run = () => {
      const duration = 900;
      const start = performance.now();
      const tick = (now) => {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
        setDisplay(Math.round(eased * target));
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          run();
          io.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    io.observe(node);
    return () => {
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [target]);

  return (
    <div className={s.count} ref={ref}>
      <span className={s.countValue}>{display}</span>
      <span className={s.countLabel}>{label}</span>
      {proof && (
        <div className={s.countProof}>
          <ProofLine {...proof} />
        </div>
      )}
    </div>
  );
}
