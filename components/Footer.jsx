// Footer — shared. Register summary + the persistent educational/no-advice disclaimer.
import Link from 'next/link';
import s from './Footer.module.css';
import ProofLine from './proof/ProofLine';
import { getMeta } from '../lib/registry';

export default function Footer() {
  const meta = getMeta();
  const c = meta.counts || {};
  return (
    <footer className={s.footer}>
      <div className={s.inner}>
        <div>
          <div className={s.brand}>
            Future<span className={s.brandTok}>Tokenization</span>
          </div>
          <p className={s.summary}>
            The verified registry of record for the UAE&rsquo;s tokenized economy.
          </p>
          <p className={s.summary}>
            <span className={s.summaryNums}>{c.distinctActiveLicenceRefs}</span> active licences ·{' '}
            <span className={s.summaryNums}>{c.activeFirms}</span> firms ·{' '}
            <span className={s.summaryNums}>{c.inPrincipleApproval}</span> in-principle
          </p>
          <ProofLine source="VARA Public Register" verifiedAt={meta.pulled} url={meta.sourceUrl} />
        </div>

        <div className={s.col}>
          <div className={s.colTitle}>Registry</div>
          <Link href="/directory">All providers</Link>
          <Link href="/validate">Validate a licence</Link>
          <Link href="/ecosystem">Ecosystem (Tier 2)</Link>
          <Link href="/methodology">Methodology</Link>
        </div>

        <div className={s.col}>
          <div className={s.colTitle}>For</div>
          <Link href="/investors">Investors</Link>
          <Link href="/providers">Providers</Link>
          <Link href="/learn">Learn tokenization</Link>
        </div>
      </div>

      <div className={s.disclaimer}>
        <span className={s.disclaimerIcon} aria-hidden="true">&#9432;</span>
        <p className={s.disclaimerText}>
          <strong>Educational and informational purposes only.</strong> FutureTokenization is a
          discovery and verification platform &mdash; <strong>not</strong> a broker, dealer, exchange,
          custodian, or financial advisor, and <strong>not</strong> regulated by VARA. Nothing here is
          investment, legal, or tax advice, an offer, or a solicitation to buy, sell, or invest in any
          virtual asset. Licence data is sourced from VARA&rsquo;s public register and may change &mdash;
          always confirm directly with VARA and the provider before acting.
        </p>
      </div>

      <div className={s.legal}>
        <span>&copy; {new Date().getFullYear()} FutureTokenization. All rights reserved.</span>
        <span>Data source: VARA Public Register · verified {meta.pulled}</span>
      </div>
    </footer>
  );
}
