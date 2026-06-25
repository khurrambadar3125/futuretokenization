import Head from 'next/head';
import Link from 'next/link';
import ConnectorNav from '../../components/ConnectorNav';
import {
  getAllProviders,
  getProviderBySlug,
  getSharedRefPartners,
  getMeta,
  CATEGORIES,
} from '../../lib/registry';

export async function getStaticPaths() {
  return {
    paths: getAllProviders().map((p) => ({ params: { slug: p.slug } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const provider = getProviderBySlug(params.slug);
  if (!provider) return { notFound: true };
  return {
    props: {
      provider,
      sharedRef: getSharedRefPartners(provider),
      meta: getMeta(),
    },
  };
}

function Field({ k, v, href }) {
  if (!v) return null;
  return (
    <div className="prof-field">
      <div className="k">{k}</div>
      <div className="v">
        {href ? (
          <a href={href} target="_blank" rel="noopener noreferrer">
            {v}
          </a>
        ) : (
          v
        )}
      </div>
    </div>
  );
}

export default function Provider({ provider, sharedRef, meta }) {
  const p = provider;
  const catLabels = p.categories
    .map((c) => CATEGORIES.find((x) => x.key === c)?.label || c)
    .join(', ');

  return (
    <>
      <Head>
        <title>{p.name} — VARA Register | FutureTokenization</title>
        <meta
          name="description"
          content={`${p.name} — ${p.label} on the VARA public register (${p.reference}). Activities: ${catLabels}. Educational only — not financial advice.`}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="prof">
        <ConnectorNav back={{ href: '/directory', label: 'Directory' }} />

        <div className="prof-head">
          <div className="prof-name">{p.name}</div>
          <div className="prof-meta-row">
            <span className={`badge badge-${p.tone}`}>{p.label}</span>
            <span className="firm-ref">{p.reference}</span>
          </div>
        </div>

        {!p.licensed && p.label === 'In-Principle Approval' && (
          <div className="prof-note warn" style={{ marginTop: 18 }}>
            This firm holds an <strong>In-Principle Approval</strong>, not a full VASP licence. It is{' '}
            <strong>not yet permitted to operate</strong> as a licensed provider — a full licence must be
            granted first. Confirm current status on the{' '}
            <a href={meta.sourceUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gold)' }}>
              VARA register
            </a>
            .
          </div>
        )}

        {sharedRef.length > 0 && (
          <div className="prof-note" style={{ marginTop: 14 }}>
            Note: the VARA register lists reference <strong>{p.reference}</strong> against more than one firm
            {' '}({sharedRef.map((s, i) => (
              <span key={s.slug}>
                {i > 0 ? ', ' : ''}
                <Link href={`/provider/${s.slug}`} style={{ color: 'var(--gold)' }}>
                  {s.name}
                </Link>
              </span>
            ))}). Verify the exact entity on the live register.
          </div>
        )}

        <div className="prof-section">
          <div className="prof-label">Licensed activities</div>
          <div className="firm-chips">
            {(p.activities || []).map((a) => (
              <span key={a} className="firm-chip" style={{ fontSize: 11, padding: '5px 9px' }}>
                {a}
              </span>
            ))}
          </div>
        </div>

        <div className="prof-section">
          <div className="prof-label">Register details</div>
          <div className="prof-grid">
            <Field k="VARA reference" v={p.reference} />
            <Field k="Status" v={p.label} />
            <Field k="Licence type" v={p.licenseType} />
            <Field k="Issued" v={p.issuanceDate} />
            <Field k="SCA number" v={p.scaNumber} />
            <Field k="Website" v={p.website ? p.website.replace(/^https?:\/\//, '') : ''} href={p.website} />
          </div>
        </div>

        {p.permittedInvestors && (
          <div className="prof-section">
            <div className="prof-label">Permitted investors</div>
            <p style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.7 }}>{p.permittedInvestors}</p>
          </div>
        )}

        {p.address && (
          <div className="prof-section">
            <div className="prof-label">Registered address</div>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7 }}>{p.address}</p>
          </div>
        )}

        <div className="prof-note" style={{ marginTop: 28 }}>
          A VARA licence authorises the specific activities listed above and is <strong>not an endorsement</strong>{' '}
          of the firm or any investment. This page is sourced from the VARA public register (last verified{' '}
          {meta.pulled}) and is educational only — not financial, investment, or legal advice. Always confirm
          current licensing on the{' '}
          <a href={meta.sourceUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gold)' }}>
            official VARA register
          </a>
          .
        </div>
      </div>
    </>
  );
}
