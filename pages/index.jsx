import Head from 'next/head';
import Link from 'next/link';
import s from '../styles/home.module.css';
import RegistryNav from '../components/RegistryNav';
import Footer from '../components/Footer';
import CzarWidget from '../components/CzarWidget';
import CountStat from '../components/proof/CountStat';
import ProofLine from '../components/proof/ProofLine';
import StatusBadge from '../components/proof/StatusBadge';
import { fmtDate } from '../components/proof/util';
import { getAllProviders, getMeta } from '../lib/registry';

export async function getStaticProps() {
  const meta = getMeta();
  const all = getAllProviders();
  const d =
    all.find((p) => p.name.includes('Binance')) ||
    all.find((p) => p.licensed) ||
    all[0];
  const demo = {
    name: d.name,
    slug: d.slug,
    reference: d.reference,
    label: d.label,
    tone: d.tone,
    issuanceDate: d.issuanceDate || null,
    activities: d.activities || [],
  };
  return { props: { meta, demo } };
}

export default function Home({ meta, demo }) {
  const c = meta.counts || {};
  const proofBase = {
    source: 'VARA Public Register',
    verifiedAt: meta.pulled,
    url: meta.sourceUrl,
  };

  return (
    <div className="ft ft-page">
      <Head>
        <title>FutureTokenization — The verified VARA registry of record</title>
        <meta
          name="description"
          content="Verify who holds an active VARA licence in the UAE. Every fact traceable to its source. Educational only — not investment advice."
        />
      </Head>

      <RegistryNav />

      <main className={s.page}>
        {/* ---------- Hero ---------- */}
        <section className={`${s.wrap} ${s.hero}`}>
          <div className={s.heroGrid}>
            <div>
              <div className={s.eyebrow}>The verified registry of record</div>
              <h1 className={s.heroH1}>Who is actually licensed in the UAE? Now you can prove it.</h1>
              <p className={s.heroLede}>
                Every virtual-asset provider VARA has licensed — traceable to source, updated to the
                register, and nothing we can&rsquo;t show you. A discovery and verification platform,
                not a broker or advisor.
              </p>
              <div className={s.ctaRow}>
                <Link href="/directory" className={s.btnPrimary}>Search the registry</Link>
                <Link href="/validate" className={s.btnGhost}>Validate a licence</Link>
              </div>
            </div>

            <div className={s.heroStats}>
              <CountStat value={c.distinctActiveLicenceRefs} label="Active licences" proof={{ ...proofBase, rows: [{ key: 'Basis', val: 'distinct active VL references' }] }} />
              <CountStat value={c.activeFirms} label="Licensed firms" proof={{ ...proofBase, rows: [{ key: 'Basis', val: 'firms with an active licence' }] }} />
              <CountStat value={c.inPrincipleApproval} label="In-principle approvals" proof={{ ...proofBase, rows: [{ key: 'Basis', val: 'IPA holders, shown separately' }] }} />
            </div>
          </div>
        </section>

        {/* ---------- Disclaimer strip ---------- */}
        <section className={s.wrap}>
          <div className={s.disclaimerStrip}>
            <span aria-hidden="true">&#9432;</span>
            <span>
              <strong>Educational and informational purposes only.</strong> This platform helps you
              verify and discover VARA-licensed providers. It is not investment, legal, or tax advice,
              and not an offer or solicitation to buy, sell, or invest in any virtual asset.
            </span>
          </div>
        </section>

        {/* ---------- Proof demo ---------- */}
        <section className={s.sectionAlt}>
          <div className={`${s.wrap} ${s.section}`}>
            <div className={s.secEyebrow}>The signature</div>
            <h2 className={s.secH2}>This is the only kind of fact we show.</h2>
            <p className={s.secLede}>
              Every number, status and claim on the platform carries a proof line — click it and it
              resolves to the exact VARA source. If we can&rsquo;t prove it, we don&rsquo;t show it.
            </p>

            <div className={s.demoCard}>
              <div className={s.demoTop}>
                <div className={s.demoName}>{demo.name}</div>
                <StatusBadge tone={demo.tone} label={demo.label} />
              </div>
              <div className={s.demoMeta}>
                <div className={s.demoRow}>
                  <span className={s.demoKey}>Licence reference</span>
                  <span className={`${s.demoVal} ft-mono`}>{demo.reference}</span>
                </div>
                {demo.issuanceDate && (
                  <div className={s.demoRow}>
                    <span className={s.demoKey}>Licensed since</span>
                    <span className={s.demoVal}>{fmtDate(demo.issuanceDate)}</span>
                  </div>
                )}
                {demo.activities.length > 0 && (
                  <div className={s.demoRow}>
                    <span className={s.demoKey}>Permitted activities</span>
                    <span className={s.demoVal}>{demo.activities.join(', ')}</span>
                  </div>
                )}
              </div>
              <ProofLine id={demo.reference} source="VARA Public Register" verifiedAt={meta.pulled} url={meta.sourceUrl} />
              <p className={s.demoCaption}>↑ Click the proof line — it opens the VARA register entry.</p>
            </div>
          </div>
        </section>

        {/* ---------- Verification steps ---------- */}
        <section className={`${s.wrap} ${s.section}`}>
          <div className={s.secEyebrow}>How we verify</div>
          <h2 className={s.secH2}>Sourced, checked, and re-proven on every build.</h2>
          <p className={s.secLede}>
            The data integrity isn&rsquo;t a promise — it&rsquo;s enforced by the build itself.
          </p>
          <div className={s.steps}>
            <div className={s.step}>
              <div className={s.stepNum}>01</div>
              <h3 className={s.stepH3}>Pulled from VARA</h3>
              <p className={s.stepBody}>
                Sourced directly from VARA&rsquo;s public register — the official record of who is
                licensed in the UAE.
              </p>
            </div>
            <div className={s.step}>
              <div className={s.stepNum}>02</div>
              <h3 className={s.stepH3}>Parsed &amp; cross-checked</h3>
              <p className={s.stepBody}>
                Every entry is cross-checked against the live register. Counts are derived from the
                data, never typed by hand.
              </p>
            </div>
            <div className={s.step}>
              <div className={s.stepNum}>03</div>
              <h3 className={s.stepH3}>Re-verified on every build</h3>
              <p className={s.stepBody}>
                A build-time gate blocks any number that can&rsquo;t resolve to its source. A wrong
                figure can&rsquo;t ship.
              </p>
            </div>
          </div>
        </section>

        {/* ---------- Browse by status ---------- */}
        <section className={s.sectionAlt}>
          <div className={`${s.wrap} ${s.section}`}>
            <div className={s.secEyebrow}>Browse the register</div>
            <h2 className={s.secH2}>Start where you need to.</h2>
            <div className={s.cards} style={{ marginTop: 'var(--ft-s6)' }}>
              <Link href="/directory" className={s.card}>
                <span className={`${s.cardNum} ft-mono`}>{c.distinctActiveLicenceRefs}</span>
                <span className={s.cardTitle}>Licensed providers</span>
                <span className={s.cardDesc}>Firms holding an active VARA licence.</span>
                <span className={s.cardArrow}>Browse →</span>
              </Link>
              <Link href="/directory" className={s.card}>
                <span className={`${s.cardNum} ft-mono`}>{c.inPrincipleApproval}</span>
                <span className={s.cardTitle}>In-principle approvals</span>
                <span className={s.cardDesc}>Holders progressing toward a full licence — not yet licensed.</span>
                <span className={s.cardArrow}>Browse →</span>
              </Link>
              <Link href="/validate" className={s.card}>
                <span className={`${s.cardNum} ft-mono`}>✓</span>
                <span className={s.cardTitle}>Validate a licence</span>
                <span className={s.cardDesc}>Check a specific firm or licence number against the register.</span>
                <span className={s.cardArrow}>Validate →</span>
              </Link>
            </div>
          </div>
        </section>

        {/* ---------- Czar ---------- */}
        <section className={`${s.wrap} ${s.section}`}>
          <div className={s.czarGrid}>
            <div>
              <div className={s.secEyebrow}>Ask the Digital Czar</div>
              <h2 className={s.secH2}>It only answers what the register can prove.</h2>
              <p className={s.secLede}>
                The Czar is grounded in the verified register and knowledge corpus. It cites its
                sources, and it will say &ldquo;I don&rsquo;t know&rdquo; rather than invent an answer.
                Educational only — never investment advice.
              </p>
            </div>
            <CzarWidget />
          </div>
        </section>

        {/* ---------- Methodology teaser ---------- */}
        <section className={s.sectionAlt}>
          <div className={`${s.wrap} ${s.section}`}>
            <div className={s.methodTeaser}>
              <div className={s.secEyebrow}>The moat, shown</div>
              <h2 className={s.secH2}>How we verify — and what we refuse to show.</h2>
              <p className={s.secLede} style={{ margin: '0 auto' }}>
                Absent data is shown as absent, never fabricated. Read exactly how the register is
                sourced, checked, and gated.
              </p>
              <Link href="/methodology" className={s.methodLink}>Read the methodology →</Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
