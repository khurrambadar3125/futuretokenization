import Head from 'next/head';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import ConnectorNav from '../components/ConnectorNav';
import { getAllProviders, getMeta, CATEGORIES } from '../lib/registry';

export async function getStaticProps() {
  // Only the fields the validator needs (keep the client payload small).
  const providers = getAllProviders().map((p) => ({
    name: p.name,
    slug: p.slug,
    reference: p.reference,
    label: p.label,
    tone: p.tone,
    licensed: p.licensed,
    categories: p.categories,
  }));
  return { props: { providers, meta: getMeta() } };
}

const LEGAL = /\b(fze|fzco|fzc|dmcc|llc|l\.l\.c|ltd|limited|p\.j\.s\.c|pjsc|holding|technologies|solutions|capital|digital|fintech|global|brokerage|services)\b/gi;
const norm = (s) =>
  (s || '')
    .toLowerCase()
    .replace(/\(.*?\)/g, ' ')
    .replace(LEGAL, ' ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

export default function Validate({ providers, meta }) {
  const [query, setQuery] = useState('');

  const matches = useMemo(() => {
    const raw = query.trim();
    if (raw.length < 2) return null;
    const nq = norm(raw);
    if (!nq) return [];
    return providers
      .map((p) => {
        const np = norm(p.name);
        let score = 0;
        if (np === nq) score = 100;
        else if (np.startsWith(nq) || nq.startsWith(np)) score = 80;
        else if (np.includes(nq) || nq.includes(np)) score = 60;
        else {
          const qt = new Set(nq.split(' ').filter(Boolean));
          const overlap = np.split(' ').filter((t) => qt.has(t)).length;
          if (overlap) score = 30 + overlap * 5;
        }
        return { p, score };
      })
      .filter((m) => m.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
      .map((m) => m.p);
  }, [query, providers]);

  return (
    <>
      <Head>
        <title>Validate a Licence — VARA Register Check | FutureTokenization</title>
        <meta
          name="description"
          content="Check any firm against the live VARA public register: licensed, in-principle approval, or not on the register. Educational only — not financial advice."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="dir-page" style={{ maxWidth: 760 }}>
        <ConnectorNav back={{ href: '/', label: 'Home' }} />

        <h1 className="dir-h1">
          Validate a <em>Licence</em>
        </h1>
        <p className="dir-sub">
          Check whether a firm is on the VARA public register — fully licensed, holding In-Principle Approval,
          or not listed. Cross-checked against the register on {meta.pulled}.
        </p>

        <div className="dir-controls" style={{ marginTop: 22 }}>
          <input
            className="dir-search"
            type="text"
            autoFocus
            placeholder="Type a firm name — e.g. Binance, Ctrl Alt, Komainu…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {matches === null && (
          <p className="val-hint">
            Enter at least two characters. This tool reads only the VARA register — being listed elsewhere
            (or in a Web3 ecosystem directory) is <strong>not</strong> a VARA licence.
          </p>
        )}

        {matches !== null && matches.length === 0 && (
          <div className="val-result red">
            <div className="val-firm">No match on the VARA register</div>
            <div className="val-msg">
              &ldquo;{query.trim()}&rdquo; does not match any firm on the VARA public register. That is{' '}
              <strong>not</strong> proof a firm is unlicensed — names vary, and the register changes. Confirm
              directly on the{' '}
              <a href={meta.sourceUrl} target="_blank" rel="noopener noreferrer">
                official VARA register
              </a>
              . Note: appearing in a Web3 ecosystem directory is not a VARA licence.
            </div>
          </div>
        )}

        {matches !== null &&
          matches.map((p) => {
            const cats = p.categories
              .map((c) => CATEGORIES.find((x) => x.key === c)?.label || c)
              .join(', ');
            const verdict = p.licensed
              ? `Licensed by VARA for ${cats || 'the activities listed on its profile'}.`
              : p.label === 'In-Principle Approval'
              ? 'Holds In-Principle Approval only — not yet permitted to operate as a licensed VASP.'
              : p.label === 'Pending'
              ? 'Application pending — not an active licence.'
              : `Status on the register: ${p.label}.`;
            return (
              <div key={p.slug} className={`val-result ${p.tone}`} style={{ marginBottom: 12 }}>
                <div className="val-result-top">
                  <span className="val-firm">{p.name}</span>
                  <span className={`badge badge-${p.tone}`}>{p.label}</span>
                  <span className="firm-ref">{p.reference}</span>
                </div>
                <div className="val-msg">
                  {verdict} A VARA licence covers specific activities and is{' '}
                  <strong>not an endorsement</strong> of the firm or any investment.
                </div>
                <Link href={`/provider/${p.slug}`} className="val-link">
                  View full register details →
                </Link>
              </div>
            );
          })}

        <div className="dir-disclaimer" style={{ marginTop: 26 }}>
          This validator reflects the VARA public register as last verified on {meta.pulled}. It is a discovery
          tool, educational only — not financial, investment, or legal advice. Always confirm current licensing
          on the official register at vara.ae.
        </div>
      </div>
    </>
  );
}
