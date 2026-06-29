import Head from 'next/head';
import Link from 'next/link';
import s from '../../styles/methodology.module.css';
import home from '../../styles/home.module.css';
import RegistryNav from '../../components/RegistryNav';
import Footer from '../../components/Footer';

// Honest placeholder. The educational codex (tokenization / RWA / stablecoins) is being
// migrated from the legacy monolith into the new system as dedicated /learn/* chapters (P2).
export default function Learn() {
  return (
    <div className="ft ft-page">
      <Head>
        <title>Learn tokenization — FutureTokenization</title>
        <meta name="description" content="Educational guides to tokenization, real-world assets, and stablecoins. Being rebuilt into the new system." />
      </Head>
      <RegistryNav />
      <main className={home.wrap}>
        <section className={s.head}>
          <h1 className={s.h1}>Learn tokenization</h1>
          <p className={s.lede}>
            Our educational chapters — tokenization, real-world assets, stablecoins, and CBDCs — are
            being rebuilt into this new system. While that&rsquo;s underway, the fastest way to get a
            grounded, sourced answer is to ask the Digital Czar, or browse the verified register.
          </p>
        </section>
        <section className={s.block} style={{ paddingTop: 0 }}>
          <p className={s.p}>
            <Link href="/" className={s.no} style={{ color: 'var(--ft-registry)', fontWeight: 600 }}>
              Ask the Digital Czar →
            </Link>
          </p>
          <p className={s.p}>
            <Link href="/directory" style={{ color: 'var(--ft-registry)', fontWeight: 600, textDecoration: 'none' }}>
              Browse the VARA registry →
            </Link>
          </p>
          <p className={s.p} style={{ color: 'var(--ft-void)', fontStyle: 'italic' }}>
            Educational and informational purposes only — not investment advice.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
