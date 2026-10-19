import '../styles/globals.css';
import { useRouter } from 'next/router';

// Pages that carry their own full footer (an HTML template inside the page) — the brand line already lives there.
const PAGES_WITH_OWN_FOOTER = ['/', '/pakistan'];

export default function App({ Component, pageProps }) {
  const { pathname } = useRouter();
  const needsFooter = !PAGES_WITH_OWN_FOOTER.includes(pathname);
  return (
    <>
      <Component {...pageProps} />
      {needsFooter && (
        <footer style={{ padding: '24px 20px', textAlign: 'center' }}>
          <p className="powered-by" style={{ fontSize: 12, color: 'var(--text-dim)', margin: 0 }} data-powered-by="khurrambadar.com">
            Powered by <a href="https://khurrambadar.com" target="_blank" rel="noopener" style={{ color: 'inherit' }}>khurrambadar.com</a>
          </p>
        </footer>
      )}
    </>
  );
}
