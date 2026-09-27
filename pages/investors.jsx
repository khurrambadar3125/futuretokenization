import Head from 'next/head';
import Link from 'next/link';
import ConnectorNav from '../components/ConnectorNav';
import { getMeta } from '../lib/registry';

export async function getStaticProps() {
  const meta = getMeta();
  return { props: { asOf: meta.asOf, firms: meta.counts.activeFirms, licences: meta.headline?.activeLicensedVASPs ?? meta.counts.distinctActiveLicenceRefs } };
}

export default function Investors({ asOf, firms, licences }) {
  return (
    <>
      <Head>
        <title>For Investors — Find Providers Listed on VARA&apos;s Register | FutureTokenization</title>
        <link rel="canonical" href="https://www.futuretokenization.com/investors" />
        <meta
          name="description"
          content="Discover virtual-asset providers listed on VARA&apos;s public register in the UAE. A discovery platform — not a broker or advisor. Educational only."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="land">
        <ConnectorNav back={{ href: '/', label: 'Home' }} />

        <div className="land-hero">
          <div className="land-eyebrow">For Investors</div>
          <h1 className="land-h1">
            Find the right provider <em>listed on VARA&apos;s register</em>.
          </h1>
          <p className="land-lede">
            One place to discover and compare the virtual-asset providers listed on VARA&apos;s public register —
            {licences} active licence references across {firms} firms, as of {asOf}. We are a discovery platform,
            not a broker or advisor, and we do not validate licences: check any firm&apos;s current status on
            VARA&apos;s official register, then deal with it directly.
          </p>
          <div className="land-cta-row">
            <Link href="/directory" className="btn-primary">
              Browse the directory →
            </Link>
            <a href="https://www.vara.ae/en/licenses-and-register/public-register/" target="_blank" rel="noopener noreferrer" className="btn-ghost">
              Check VARA&apos;s official register ↗
            </a>
          </div>
        </div>

        <div className="land-section">
          <h2>
            How it <em>works</em>
          </h2>
          <div className="land-steps">
            <div className="step">
              <div className="step-n">01</div>
              <h3>Discover</h3>
              <p>
                Browse the live VARA register by activity — Broker-Dealer, Exchange, Custody, Management &
                Investment, and more. Every record traces back to the register.
              </p>
            </div>
            <div className="step">
              <div className="step-n">02</div>
              <h3>Verify</h3>
              <p>
                Check any firm on VARA&apos;s official public register. Only VARA can confirm a licence — this site
                does not validate licences.
              </p>
            </div>
            <div className="step">
              <div className="step-n">03</div>
              <h3>Connect</h3>
              <p>
                Reach listed firms directly from their profile. Guided introductions are coming — see below.
              </p>
            </div>
          </div>
        </div>

        <div className="land-banner">
          <span className="soon-tag">Coming soon</span>
          <div>
            <strong>Guided introductions.</strong> We&rsquo;re building a way to route your interest (asset class,
            ticket size, jurisdiction) to the listed firms that match — launching after UAE regulatory sign-off.
            It will be a marketing introduction only: <strong>no advice, no custody, no handling of funds</strong>,
            and an introduction is never a recommendation. Until then, contact listed firms directly from their
            profiles.
          </div>
        </div>

        <div className="dir-disclaimer" style={{ marginTop: 26 }}>
          FutureTokenization is a discovery and information platform — <strong>not a financial advisor, broker,
          or VARA-licensed provider</strong>. Listing a firm is not an endorsement, and this site does not validate licences. Nothing here is
          financial, investment, or legal advice. Always confirm current licensing on the official VARA register.
        </div>
      </div>
    </>
  );
}
