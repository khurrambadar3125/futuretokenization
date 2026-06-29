// RegistryNav — shared, sticky, scroll-aware. Light registry system.
import { useEffect, useState } from 'react';
import Link from 'next/link';
import s from './RegistryNav.module.css';

const LINKS = [
  { href: '/directory', label: 'Registry' },
  { href: '/validate', label: 'Validate' },
  { href: '/methodology', label: 'Methodology' },
  { href: '/learn', label: 'Learn' },
];

export default function RegistryNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`${s.nav} ${scrolled ? s.scrolled : ''}`}>
      <div className={s.inner}>
        <Link href="/" className={s.brand} aria-label="FutureTokenization home">
          <span className={s.brandFuture}>Future</span>
          <span className={s.brandDot}>·</span>
          <span className={s.brandTok}>Tokenization</span>
        </Link>

        <ul className={s.links}>
          {LINKS.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className={s.link}>{l.label}</Link>
            </li>
          ))}
        </ul>

        <div className={s.actions}>
          <Link href="/directory" className={s.search}>
            <span aria-hidden="true">⌕</span> Search registry
          </Link>
          <Link href="/validate" className={s.cta}>Validate a licence</Link>
          <button
            className={s.burger}
            aria-label="Menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? '✕' : '☰'}
          </button>
        </div>
      </div>

      <div className={`${s.sheet} ${open ? s.sheetOpen : ''}`}>
        {LINKS.map((l) => (
          <Link key={l.href} href={l.href} className={s.sheetLink} onClick={() => setOpen(false)}>
            {l.label}
          </Link>
        ))}
        <Link href="/validate" className={s.sheetCta} onClick={() => setOpen(false)}>
          Validate a licence
        </Link>
      </div>
    </nav>
  );
}
