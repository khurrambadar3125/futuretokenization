import Head from 'next/head';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import ConnectorNav from '../components/ConnectorNav';
import { getAllEcosystem, getEcosystemMeta, ECOSYSTEM_CATEGORIES } from '../lib/ecosystem';

export async function getStaticProps() {
  return { props: { entities: getAllEcosystem(), meta: getEcosystemMeta() } };
}

export default function Ecosystem({ entities, meta }) {
  const [query, setQuery] = useState('');
  const [activeCat, setActiveCat] = useState('all');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return entities
      .filter((e) => (activeCat === 'all' ? true : e.category === activeCat))
      .filter((e) => (!q ? true : e.name.toLowerCase().includes(q) || (e.description || '').toLowerCase().includes(q)))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [entities, query, activeCat]);

  const hasEntries = entities.length > 0;

  return (
    <>
      <Head>
        <title>UAE Web3 Ecosystem — Directory | FutureTokenization</title>
        <meta
          name="description"
          content="A verified directory of UAE Web3 ecosystem firms — dev studios, infrastructure, DeFi, advisory, VCs. NOT VARA-licensed VASPs. Educational only."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="dir-page">
        <ConnectorNav back={{ href: '/', label: 'Home' }} />

        <h1 className="dir-h1">
          UAE Web3 <em>Ecosystem</em>
        </h1>
        <p className="dir-sub">
          The wider UAE Web3 economy — dev studios, infrastructure, DeFi, NFT/gaming, advisory, market makers,
          and VCs. This is a <strong>separate directory</strong> from the VARA-licensed providers.
        </p>

        <div className="prof-note warn" style={{ marginTop: 16 }}>
          <strong>These firms are NOT VARA-licensed VASPs.</strong> Listing here means a firm is an ecosystem
          participant, not a licensed virtual-asset provider — and is not an endorsement. For licensed providers,
          see the{' '}
          <Link href="/directory" style={{ color: 'var(--gold)' }}>
            VARA directory
          </Link>{' '}
          or check any name with{' '}
          <Link href="/validate" style={{ color: 'var(--gold)' }}>
            Validate a Licence
          </Link>
          .
        </div>

        {hasEntries ? (
          <>
            <div className="dir-controls" style={{ marginTop: 22 }}>
              <input
                className="dir-search"
                type="text"
                placeholder="Search ecosystem firms…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <div className="dir-chips">
                <button
                  className={`dir-chip ${activeCat === 'all' ? 'active' : ''}`}
                  onClick={() => setActiveCat('all')}
                >
                  All
                </button>
                {ECOSYSTEM_CATEGORIES.map((c) => (
                  <button
                    key={c.key}
                    className={`dir-chip ${activeCat === c.key ? 'active' : ''}`}
                    onClick={() => setActiveCat(c.key)}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="dir-count">
              {filtered.length} {filtered.length === 1 ? 'firm' : 'firms'} · verified {meta.pulled}
            </div>
            <div className="dir-grid">
              {filtered.map((e) => (
                <div key={e.slug} className="firm-card" style={{ cursor: 'default' }}>
                  <div className="firm-card-top">
                    <div>
                      <div className="firm-name">{e.name}</div>
                      {e.jurisdiction && <div className="firm-ref">{e.jurisdiction}</div>}
                    </div>
                    <span className="badge badge-grey">Not a VASP</span>
                  </div>
                  {e.description && (
                    <p style={{ fontSize: 12.5, color: 'var(--text-muted)', lineHeight: 1.55 }}>{e.description}</p>
                  )}
                  <div className="firm-chips">
                    <span className="firm-chip">
                      {ECOSYSTEM_CATEGORIES.find((c) => c.key === e.category)?.label || e.category}
                    </span>
                    {e.source && (
                      <span className="firm-chip" style={{ background: 'var(--border2)', color: 'var(--text-dim)' }}>
                        src: {e.source}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="land-banner" style={{ marginTop: 22, alignItems: 'flex-start' }}>
            <span className="soon-tag">Building</span>
            <div>
              <strong>Verified listings are being added.</strong> Unlike the VARA directory (which mirrors an
              official register), the Web3 ecosystem has no single authoritative list — so we add a firm only
              after confirming it from a named source. {meta.verificationStandard} We&rsquo;d rather show fewer
              real firms than a padded count.
            </div>
          </div>
        )}

        <div className="land-section">
          <h2>
            Where the ecosystem <em>lives</em>
          </h2>
          <p className="dir-sub" style={{ marginBottom: 14 }}>
            UAE Web3 firms cluster in a handful of free zones and hubs. These are our verification starting
            points — individual firms appear above only once confirmed.
          </p>
          <div className="land-steps" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
            {meta.hubs.map((h) => (
              <div className="step" key={h.name}>
                <h3 style={{ marginBottom: 4 }}>{h.name}</h3>
                <p>{h.note}</p>
                <a
                  className="val-link"
                  href={h.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ marginTop: 6, display: 'inline-block' }}
                >
                  {h.source} →
                </a>
              </div>
            ))}
          </div>
        </div>

        <div className="dir-disclaimer" style={{ marginTop: 26 }}>
          Ecosystem listings are sourced from named directories and verified per entry. They are{' '}
          <strong>not VARA licences and not endorsements</strong>. Nothing here is financial, investment, or
          legal advice.
        </div>
      </div>
    </>
  );
}
