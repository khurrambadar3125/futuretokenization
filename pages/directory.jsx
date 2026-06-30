import Head from 'next/head';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import ConnectorNav from '../components/ConnectorNav';
import {
  getAllProviders,
  getCategoryCounts,
  getMeta,
  CATEGORIES,
} from '../lib/registry';

export async function getStaticProps() {
  return {
    props: {
      providers: getAllProviders(),
      categoryCounts: getCategoryCounts(),
      meta: getMeta(),
    },
  };
}

function FirmCard({ p }) {
  return (
    <Link href={`/provider/${p.slug}`} className="firm-card">
      <div className="firm-card-top">
        <div>
          <div className="firm-name">{p.name}</div>
          <div className="firm-ref">{p.reference}</div>
        </div>
        <span className={`badge badge-${p.tone}`}>{p.label}</span>
      </div>
      <div className="firm-chips">
        {p.categories.map((c) => {
          const cat = CATEGORIES.find((x) => x.key === c);
          return (
            <span key={c} className="firm-chip">
              {cat ? cat.label : c}
            </span>
          );
        })}
      </div>
    </Link>
  );
}

export default function Directory({ providers, categoryCounts, meta }) {
  const [query, setQuery] = useState('');
  const [activeCat, setActiveCat] = useState('all');
  const [tier, setTier] = useState('licensed'); // 'licensed' | 'ipa'

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return providers
      .filter((p) =>
        tier === 'ipa' ? !p.licensed && p.label === 'In-Principle Approval' : p.licensed || p.label === 'Pending'
      )
      .filter((p) => (activeCat === 'all' ? true : p.categories.includes(activeCat)))
      .filter((p) =>
        !q
          ? true
          : p.name.toLowerCase().includes(q) ||
            p.reference.toLowerCase().includes(q) ||
            (p.activities || []).join(' ').toLowerCase().includes(q)
      )
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [providers, query, activeCat, tier]);

  const licences = meta.headline?.activeLicensedVASPs ?? meta.counts.distinctActiveLicenceRefs;
  const firms = meta.counts.activeFirms;

  return (
    <>
      <Head>
        <title>VARA-Licensed Providers — Directory | FutureTokenization</title>
        <meta
          name="description"
          content="Every VARA-licensed virtual-asset provider in the UAE, filterable by activity. Sourced from the VARA public register, last verified at the date shown. Educational only — not financial advice."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="dir-page">
        <ConnectorNav back={{ href: '/', label: 'Home' }} />

        <h1 className="dir-h1">
          VARA-Licensed <em>Providers</em>
        </h1>
        <p className="dir-sub">
          {licences} active VARA licences across {firms} licensed firms in the UAE, plus In-Principle
          Approval holders. Sourced from the VARA public register — every record traces back to it, as last
          verified on the date shown below.
        </p>
        <div className="dir-stamp">
          <span className="dir-dot" />
          Last verified {meta.pulled} · source:{' '}
          <a href={meta.sourceUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit' }}>
            vara.ae public register
          </a>
        </div>

        <div className="dir-disclaimer">
          A VARA licence authorises specific activities and is <strong>not an endorsement</strong> of any firm
          or investment. In-Principle Approval (IPA) holders are <strong>not yet licensed</strong> to operate.
          This directory is a discovery tool and is educational only — not financial, investment, or legal advice.
        </div>

        <div className="dir-controls">
          <input
            className="dir-search"
            type="text"
            placeholder="Search by firm name, licence reference, or activity…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="dir-chips">
            <button
              className={`dir-chip ${tier === 'licensed' ? 'active' : ''}`}
              onClick={() => setTier('licensed')}
            >
              Licensed
            </button>
            <button className={`dir-chip ${tier === 'ipa' ? 'active' : ''}`} onClick={() => setTier('ipa')}>
              In-Principle Approval
            </button>
          </div>
          {tier === 'licensed' && (
            <div className="dir-chips">
              <button
                className={`dir-chip ${activeCat === 'all' ? 'active' : ''}`}
                onClick={() => setActiveCat('all')}
              >
                All activities
              </button>
              {CATEGORIES.map((c) => (
                <button
                  key={c.key}
                  className={`dir-chip ${activeCat === c.key ? 'active' : ''}`}
                  onClick={() => setActiveCat(c.key)}
                >
                  {c.label}
                  {categoryCounts[c.key] ? <span className="n">{categoryCounts[c.key]}</span> : null}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="dir-count">
          {filtered.length} {filtered.length === 1 ? 'provider' : 'providers'}
          {activeCat !== 'all' && tier === 'licensed'
            ? ` · ${CATEGORIES.find((c) => c.key === activeCat)?.label}`
            : ''}
        </div>

        <div className="dir-grid">
          {filtered.map((p) => (
            <FirmCard key={p.slug} p={p} />
          ))}
        </div>
        {filtered.length === 0 && (
          <p style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 20 }}>
            No providers match this filter.
          </p>
        )}
      </div>
    </>
  );
}
