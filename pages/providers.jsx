import Head from 'next/head';
import Link from 'next/link';
import ConnectorNav from '../components/ConnectorNav';
import { getMeta } from '../lib/registry';

export async function getStaticProps() {
  const meta = getMeta();
  return { props: { firms: meta.counts.activeFirms } };
}

export default function Providers({ firms }) {
  return (
    <>
      <Head>
        <title>For Providers — Get Discovered | FutureTokenization</title>
        <meta
          name="description"
          content="VARA-licensed virtual-asset providers: your register listing is already live. Claim it to add detail and receive qualified investor introductions. Educational platform — not an endorsement."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="land">
        <ConnectorNav back={{ href: '/', label: 'Home' }} />

        <div className="land-hero">
          <div className="land-eyebrow">For Providers</div>
          <h1 className="land-h1">
            Be found by investors looking for <em>licensed</em> firms.
          </h1>
          <p className="land-lede">
            All {firms} VARA-licensed firms are already listed here, sourced from the public register — your basic
            profile is live whether you claim it or not. Claiming it lets you add detail, correct your record, and
            (soon) receive qualified investor introductions. Listing is sourced from the register and is not an
            endorsement.
          </p>
          <div className="land-cta-row">
            <Link href="/directory" className="btn-primary">
              See your listing →
            </Link>
            <Link href="/validate" className="btn-ghost">
              Check your record
            </Link>
          </div>
        </div>

        <div className="land-section">
          <h2>
            Listing <em>tiers</em>
          </h2>
          <div className="tier-grid">
            <div className="tier">
              <h4>Register listing</h4>
              <div className="price">Free · live now</div>
              <ul>
                <li>Auto-generated from the VARA public register</li>
                <li>Licence reference, activities, status</li>
                <li>Appears in the directory and licence validator</li>
              </ul>
            </div>
            <div className="tier">
              <h4>Claimed profile</h4>
              <div className="price">
                Free · <span className="soon-tag">Coming soon</span>
              </div>
              <ul>
                <li>Verify ownership and correct your details</li>
                <li>Add description, focus areas, contact</li>
                <li>&ldquo;Claimed&rdquo; verification marker</li>
              </ul>
            </div>
            <div className="tier feature">
              <h4>Featured</h4>
              <div className="price">
                Paid · <span className="soon-tag">Coming soon</span>
              </div>
              <ul>
                <li>Priority placement in the directory</li>
                <li>Qualified investor introductions</li>
                <li>Profile analytics</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="land-banner">
          <span className="soon-tag">Coming soon</span>
          <div>
            <strong>Claiming and introductions.</strong> Profile claiming (with ownership verification) and
            investor introductions are in build and will launch after UAE regulatory sign-off. We never present a
            firm as more than its register status shows, and an introduction is a marketing connection only — not
            a recommendation. Pricing for paid tiers will be published before launch.
          </div>
        </div>

        <div className="dir-disclaimer" style={{ marginTop: 26 }}>
          FutureTokenization is a discovery and information platform — <strong>not a financial advisor, broker,
          or VARA-licensed provider</strong>. A listing reflects the public register and is not an endorsement.
          Always confirm current licensing on the official VARA register.
        </div>
      </div>
    </>
  );
}
