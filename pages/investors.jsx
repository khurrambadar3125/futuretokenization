import Head from 'next/head';
import Link from 'next/link';
import ConnectorNav from '../components/ConnectorNav';
import { getMeta } from '../lib/registry';

export async function getStaticProps() {
  const meta = getMeta();
  return { props: { firms: meta.counts.activeFirms, licences: meta.headline?.activeLicensedVASPs ?? meta.counts.distinctActiveLicenceRefs } };
}

export default function Investors({ firms, licences }) {
  return (
    <>
      <Head>
        <title>For Investors — Find VARA-Licensed Providers | FutureTokenization</title>
        <meta
          name="description"
          content="Discover and verify VARA-licensed virtual-asset providers in the UAE. A discovery platform — not a broker or advisor. Educational only."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="land">
        <ConnectorNav back={{ href: '/', label: 'Home' }} />

        <div className="land-hero">
          <div className="land-eyebrow">For Investors</div>
          <h1 className="land-h1">
            Find the right <em>VARA-licensed</em> provider.
          </h1>
          <p className="land-lede">
            One verified place to discover, compare, and check every VARA-licensed virtual-asset provider in
            the UAE — {licences} active licences across {firms} firms, straight from the public register. We are
            a discovery platform, not a broker or advisor: we help you find licensed firms and verify them, then
            you deal with them directly.
          </p>
          <div className="land-cta-row">
            <Link href="/directory" className="btn-primary">
              Browse the directory →
            </Link>
            <Link href="/validate" className="btn-ghost">
              Validate a licence
            </Link>
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
                Check any firm with the Validate tool: fully licensed, In-Principle Approval only, or not on the
                register. Status is never blurred.
              </p>
            </div>
            <div className="step">
              <div className="step-n">03</div>
              <h3>Connect</h3>
              <p>
                Reach licensed firms directly from their profile. Guided introductions are coming — see below.
              </p>
            </div>
          </div>
        </div>

        <div className="land-banner">
          <span className="soon-tag">Coming soon</span>
          <div>
            <strong>Guided introductions.</strong> We&rsquo;re building a way to route your interest (asset class,
            ticket size, jurisdiction) to the licensed firms that match — launching after UAE regulatory sign-off.
            It will be a marketing introduction only: <strong>no advice, no custody, no handling of funds</strong>,
            and an introduction is never a recommendation. Until then, contact licensed firms directly from their
            profiles.
          </div>
        </div>

        <div className="dir-disclaimer" style={{ marginTop: 26 }}>
          FutureTokenization is a discovery and information platform — <strong>not a financial advisor, broker,
          or VARA-licensed provider</strong>. Listing or verifying a firm is not an endorsement. Nothing here is
          financial, investment, or legal advice. Always confirm current licensing on the official VARA register.
        </div>
      </div>
    </>
  );
}
