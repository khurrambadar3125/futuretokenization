# RECOMMENDATIONS — futuretokenization (SEO + security pass, 2026-08-30)

Nothing in this file has been applied. Content changes are for Khurram to decide.

## SEO / content

- **Homepage `<title>` renders a stray backslash**: `pages/index.jsx` line ~2311 has `The World\'s Digital Asset Codex` inside JSX text, so the served title is literally `FutureTokenization.com — The World\'s Digital Asset Codex` (confirmed in the built HTML). Fix = remove the backslash. Not changed because title text is out of scope for this pass.
- `pages/_document.jsx` links `/favicon.ico` but `public/` contains no `favicon.ico` (only `audio/`, `privacy.html`, `terms.html`, `robots.txt`). Every page load 404s on the favicon; add one.
- No `og:image` exists anywhere in the repo, so OpenGraph tags were left without an image. A 1200x630 image in `public/` would improve social/link previews.
- `og:url` in `_document.jsx` is the homepage URL on every page. Self-referencing canonicals were added per page; consider moving `og:url`/`og:title` into each page's `<Head>` so social previews match the page.
- `public/privacy.html` and `public/terms.html` have `<title>… — futuretokenization</title>` (lowercase brand) and no description/canonical; they were included in the sitemap as they are real public pages.
- The homepage is one ~2,500-line client-rendered HTML string (`dangerouslySetInnerHTML`) with 15 `<h2>` sections. It indexes, but splitting the big sections (RWA, Stablecoins, CBDC, Case Studies) into their own routes would give each topic its own title/URL.
- `/provider/[slug]` pages: 73 pages with template titles/descriptions from the VARA register. Thin by design; fine for now.
- `sitemap.xml` is static; re-run `node scripts/gen-sitemap.mjs` whenever `data/vara-register.json` changes (e.g., from `scripts/pull-vara-register.py`). Consider calling it from the build step.

## Security / config

- `next.config.js` already carried an enforcing CSP plus HSTS, X-Frame-Options DENY, nosniff, Referrer-Policy and Permissions-Policy. Only `payment=()` was appended to Permissions-Policy. The enforcing CSP was left untouched per the spec.
- The enforcing CSP has `connect-src 'self'`; `/api/chat` calls Anthropic server-side so this is fine — just keep any future client-side third-party fetches in mind.
- `furetokenization--vercel.json` (note the typo) is a leftover static-site Vercel config (`outputDirectory: "."`, catch-all route to `/index.html`). It is not read by Vercel (only `vercel.json` is). Looks like junk — see ruling.
- `vercel.json` only sets `ignoreCommand`; all headers come from `next.config.js`. Nothing to add there.

## Needs Khurram's ruling

1. Delete or keep `furetokenization--vercel.json` (misspelled, unused)? Not touched.
2. Fix the `\'` in the homepage title? One-character change to existing title text — outside this pass's rules.
3. Should `/privacy.html` and `/terms.html` stay in the sitemap (they are included now)?
4. Should `og:url`/`og:title` become per-page (would mean editing existing `_document.jsx` tags)?
