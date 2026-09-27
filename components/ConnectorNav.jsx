import Link from 'next/link';

// Lightweight shared top bar for the connector pages (directory, provider, validate,
// investors, providers). Deliberately does NOT touch the existing codex (index.jsx).
export default function ConnectorNav({ back }) {
  return (
    <div className="dir-top">
      <Link href="/" className="dir-logo">
        Future<span>Tokenization</span>
      </Link>
      <nav className="cn-links">
        <Link href="/directory">Directory</Link>
        <Link href="/ecosystem">Ecosystem</Link>
        <a href="https://www.vara.ae/en/licenses-and-register/public-register/" target="_blank" rel="noopener noreferrer">VARA register ↗</a>
        <Link href="/investors">For Investors</Link>
        <Link href="/providers">For Providers</Link>
      </nav>
      {back && (
        <Link href={back.href} className="dir-back">
          ← {back.label}
        </Link>
      )}
    </div>
  );
}
