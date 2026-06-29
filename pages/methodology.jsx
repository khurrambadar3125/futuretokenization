import Head from 'next/head';
import s from '../styles/methodology.module.css';
import home from '../styles/home.module.css';
import RegistryNav from '../components/RegistryNav';
import Footer from '../components/Footer';
import ProofLine from '../components/proof/ProofLine';
import { getMeta } from '../lib/registry';

export async function getStaticProps() {
  return { props: { meta: getMeta() } };
}

export default function Methodology({ meta }) {
  const c = meta.counts || {};
  return (
    <div className="ft ft-page">
      <Head>
        <title>Methodology — How we verify | FutureTokenization</title>
        <meta
          name="description"
          content="How FutureTokenization sources, checks, and gates VARA licence data — and what it refuses to show. Educational only — not investment advice."
        />
      </Head>

      <RegistryNav />

      <main>
        <section className={`${home.wrap} ${s.head}`}>
          <h1 className={s.h1}>How we verify — and what we refuse to show.</h1>
          <p className={s.lede}>
            Trust is the product. So every fact on this platform is traceable to its source, and the
            data integrity is enforced by the build itself — not by a promise. Here is exactly how.
          </p>
        </section>

        <section className={home.wrap}>
          <div className={s.block}>
            <div className={s.kicker}>01 · One source of truth</div>
            <h2 className={s.h2}>The VARA public register</h2>
            <p className={s.p}>
              All licence data comes from <strong>VARA&rsquo;s public register</strong> — the official
              record of virtual-asset providers licensed in Dubai. We hold a single canonical dataset,
              and every page derives from it. Today: <strong>{c.distinctActiveLicenceRefs} active
              licences</strong>, <strong>{c.activeFirms} licensed firms</strong>, and{' '}
              <strong>{c.inPrincipleApproval} in-principle approvals</strong>.
            </p>
            <ProofLine source="VARA Public Register" verifiedAt={meta.pulled} url={meta.sourceUrl} />
          </div>

          <div className={s.block}>
            <div className={s.kicker}>02 · Derived, never typed</div>
            <h2 className={s.h2}>Counts come from the data</h2>
            <p className={s.p}>
              We never hand-type a headline number. Counts — active licences, firms, IPAs — are
              <strong> computed from the register entries</strong> at build time. When the register
              changes, the numbers change with it. There is no separate &ldquo;marketing&rdquo; figure
              that can drift from reality.
            </p>
          </div>

          <div className={s.block}>
            <div className={s.kicker}>03 · The build-time gate</div>
            <h2 className={s.h2}>A wrong number can&rsquo;t ship</h2>
            <p className={s.p}>
              Before every deployment, a data-integrity validator re-derives the counts from the
              register and compares them to what the platform claims. <strong>If anything
              disagrees, the build fails</strong> — the change never goes live. This is the digital
              twin: the published site must match the verified source, checked automatically.
            </p>
            <pre className={s.code}>
              <span className={s.codeOk}>✓ data-integrity OK</span> — {c.totalFirms} entities · {c.activeFirms} active firms ·{' '}
              {c.distinctActiveLicenceRefs} distinct active licences (headline {c.distinctActiveLicenceRefs}) · {c.inPrincipleApproval} IPA.{'\n'}
              <span className={s.codeMuted}>{'// on any mismatch:'}</span>{'\n'}
              <span className={s.codeBad}>✗ data-integrity FAILED — Build blocked.</span>
            </pre>
          </div>

          <div className={s.block}>
            <div className={s.kicker}>04 · The void</div>
            <h2 className={s.h2}>Absent data is shown as absent</h2>
            <p className={s.p}>
              When we don&rsquo;t have a verified value, we say so — a plain &ldquo;not verified&rdquo;
              state. We never fill a gap with an estimate, an interpolation, or a guess. Fewer real
              facts beat more fabricated ones.
            </p>
          </div>

          <div className={s.block}>
            <div className={s.kicker}>05 · What we refuse to do</div>
            <h2 className={s.h2}>The lines we won&rsquo;t cross</h2>
            <ul className={s.list}>
              <li className={s.li}><span className={s.no}>✕</span> We do not invent licence data, dates, or numbers — ever.</li>
              <li className={s.li}><span className={s.no}>✕</span> We do not reproduce copy-protected directories; Tier-2 firms are verified via their own official sources.</li>
              <li className={s.li}><span className={s.no}>✕</span> We do not give investment, legal, or tax advice, or make recommendations.</li>
              <li className={s.li}><span className={s.no}>✕</span> We are not a broker, dealer, exchange, custodian, or advisor, and we are not regulated by VARA.</li>
              <li className={s.li}><span className={s.yes}>✓</span> We do tell you where every fact came from, and when it was verified.</li>
            </ul>
          </div>

          <div className={s.block}>
            <div className={s.kicker}>Important</div>
            <h2 className={s.h2}>Educational purposes only</h2>
            <p className={s.p}>
              <strong>FutureTokenization is for educational and informational purposes only.</strong>{' '}
              It is a discovery and verification tool, not investment advice and not an offer or
              solicitation to buy, sell, or invest in any virtual asset. Licence status can change at
              any time — always confirm directly with VARA and the provider before acting.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
