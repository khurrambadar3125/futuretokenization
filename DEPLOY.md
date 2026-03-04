# FutureTokenization.com — Deployment Guide
## Phase 1: Launch Sequence

---

## STEP 1 — Install the project locally

```bash
cd ~/Downloads
# Copy the futuretokenization folder to wherever you work
# Then:
cd futuretokenization
npm install
```

---

## STEP 2 — Set up your API key locally

```bash
cp .env.local.example .env.local
```

Open `.env.local` and add your Anthropic API key:
```
ANTHROPIC_API_KEY=sk-ant-api03-xxxxxxxxxxxx
```
Get your key from: https://console.anthropic.com/settings/keys

---

## STEP 3 — Test locally

```bash
npm run dev
```
Open http://localhost:3000 — the site should load with the Digital Czar chatbot working.

---

## STEP 4 — Push to GitHub

```bash
git init
git add .
git commit -m "Initial FutureTokenization.com launch"
git remote add origin https://github.com/YOUR_USERNAME/futuretokenization.git
git push -u origin main
```

---

## STEP 5 — Deploy to Vercel

### Option A — Vercel CLI
```bash
npm install -g vercel
vercel --prod
```
When prompted, link to your Vercel account and set project name to `futuretokenization`.

### Option B — Vercel Dashboard
1. Go to https://vercel.com/new
2. Import your GitHub repo
3. Click Deploy

---

## STEP 6 — Add Environment Variable in Vercel

**This is critical — without this the chatbot won't work.**

1. Go to your project in Vercel dashboard
2. Settings → Environment Variables
3. Add:
   - **Name:** `ANTHROPIC_API_KEY`
   - **Value:** your key from console.anthropic.com
   - **Environment:** Production, Preview, Development ✅ all three
4. Click Save
5. Redeploy: `vercel --prod`

---

## STEP 7 — Point GoDaddy DNS to Vercel

1. In Vercel: Settings → Domains → Add `futuretokenization.com` and `www.futuretokenization.com`
2. Vercel will show you the DNS records needed
3. In GoDaddy: DNS → Add Records:
   - **A record:** `@` → Vercel IP (shown in dashboard)
   - **CNAME:** `www` → `cname.vercel-dns.com`
4. DNS propagation takes 15 min–48 hours

---

## Project Structure

```
futuretokenization/
├── pages/
│   ├── _app.jsx          ← App wrapper
│   ├── _document.jsx     ← HTML head, Google Fonts
│   ├── index.jsx         ← Main page (all content)
│   └── api/
│       └── chat.js       ← Digital Czar API proxy ⭐ (API key stays server-side)
├── styles/
│   └── globals.css       ← All CSS from original design
├── public/               ← Static assets (add favicon.ico here)
├── .env.local.example    ← Template for your API key
├── .gitignore
├── next.config.js
└── package.json
```

---

## How the Digital Czar Chatbot Works

**Browser** → POST `/api/chat` → **Vercel server** → Anthropic API → response back

Your `ANTHROPIC_API_KEY` never leaves the server. Users cannot see it in browser dev tools.

---

## Phase 2 Build Sequence (Post-Launch)

From your project guide:

- **Phase 2:** Glossary page (60 terms, individual URLs for SEO)
  - Tell Claude: *"Add a /glossary page to FutureTokenization.com with 60 tokenization terms, each with its own URL like /glossary/tokenization"*

- **Phase 3:** SEO — meta tags, sitemap.xml, Google Search Console
  - Tell Claude: *"Add SEO meta tags to all pages and generate sitemap.xml for FutureTokenization.com"*

- **Phase 4:** Newsletter signup (Mailchimp/ConvertKit)

- **Phase 5:** 8 case study pages (PRYPCO, BlackRock, Franklin Templeton, etc.)

- **Month 2:** Live Regulatory Tracker, Market data page, Comparison tools

- **Month 3:** Tokenization readiness quiz, Developer resources, Podcast section

---

## Commands Reference

| Action | Command |
|--------|---------|
| Run locally | `npm run dev` |
| Build for production | `npm run build` |
| Deploy to Vercel | `npx vercel --prod` |
| View Vercel logs | `vercel logs` |

---

*FutureTokenization.com · Educational content only — not financial advice*
