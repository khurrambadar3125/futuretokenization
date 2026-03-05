import Head from 'next/head';
import { useRef, useState, useEffect } from 'react';
import { LANGUAGES, T } from '../lib/translations';

const BODY_HTML = `<!-- NAV -->
<nav>
  <div class="nav-inner">
    <div class="logo" onclick="scrollTo('home')">Future<span>Tokenization</span></div>
    <ul class="nav-links">
      <li><a href="#home" class="active">Home</a></li>
      <li>
        <a href="#tokenization">Tokenization ▾</a>
        <div class="dropdown">
          <a href="#tokenization">What is Tokenization</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#tech-stack">Technology Stack</a>
          <a href="#timeline">History & Timeline</a>
        </div>
      </li>
      <li>
        <a href="#rwa">Real World Assets ▾</a>
        <div class="dropdown">
          <a href="#rwa">Overview</a>
          <a href="#treasuries">Treasuries & Bonds</a>
          <a href="#real-estate">Real Estate</a>
          <a href="#private-credit">Private Credit</a>
          <a href="#commodities">Commodities & Gold</a>
          <a href="#equities">Equities & IP</a>
        </div>
      </li>
      <li>
        <a href="#stablecoins">Stablecoins ▾</a>
        <div class="dropdown">
          <a href="#stablecoins">What Are Stablecoins</a>
          <a href="#stable-vs-crypto">Stablecoins vs Crypto</a>
          <a href="#stable-types">Types & Mechanics</a>
          <a href="#stable-regulation">Regulation (GENIUS Act)</a>
        </div>
      </li>
      <li>
        <a href="#cbdc">CBDCs ▾</a>
        <div class="dropdown">
          <a href="#cbdc">What is a CBDC</a>
          <a href="#cbdc-world">Global CBDC Map</a>
          <a href="#cbdc-vs-stable">Central vs Decentral</a>
        </div>
      </li>
      <li><a href="#case-studies">Case Studies</a></li>
      <li><a href="#players">Major Players</a></li>
      <li><a href="#monetary">Monetary System</a></li>
      <li><a href="#pakistan">Emerging Markets</a></li>
    </ul>
    <div class="nav-right">
      <button class="btn-ai" onclick="document.getElementById('chat-panel').classList.toggle('open')">⚡ Ask the Digital Czar</button>
    </div>
  <button id="hamburger-btn" aria-label="Menu" style="display:flex;flex-direction:column;justify-content:center;gap:5px;width:44px;height:44px;background:rgba(6,9,16,0.9);border:1px solid rgba(212,168,67,0.5);border-radius:8px;cursor:pointer;padding:10px;position:fixed;top:10px;right:14px;z-index:9999;">
    <span style="display:block;width:22px;height:2px;background:#e8eaf0;border-radius:2px;"></span>
    <span style="display:block;width:22px;height:2px;background:#e8eaf0;border-radius:2px;"></span>
    <span style="display:block;width:22px;height:2px;background:#e8eaf0;border-radius:2px;"></span>
  </button>
</div>
</nav>

<!-- ===================== HERO ===================== -->
<div id="home">
  <div class="hero-bg"></div>
  <div class="hero-grid"></div>
  <div class="hero-content">
    <div class="hero-tag">The World's Digital Asset Intelligence Platform</div>
    <h1 class="hero-h1">The Complete <em>Codex</em> of<br>Tokenization &<br>Digital Assets</h1>
    <p class="hero-sub">The $19 trillion revolution is happening now. Master it here.</p>
    <div class="hero-ctas">
      <button class="btn-primary" onclick="document.getElementById('tokenization').scrollIntoView({behavior:'smooth'})">📚 Start Learning</button>
      <button class="btn-czar" onclick="document.getElementById('chat-panel').classList.add('open')">⚡ Ask the Digital Czar</button>
    </div>
  </div>
  <div class="stats-bar" style="padding:0 24px;margin:0 auto 0;max-width:1400px;">
    <div class="stat-item">
      <div class="stat-num">$19T</div>
      <div class="stat-label">Projected RWA Market by 2033</div>
      <div class="stat-trend">↑ from $35B today</div>
    </div>
    <div class="stat-item">
      <div class="stat-num">$250B</div>
      <div class="stat-label">Stablecoin Supply in Circulation</div>
      <div class="stat-trend">↑ 460% YoY growth (Visa)</div>
    </div>
    <div class="stat-item">
      <div class="stat-num">134</div>
      <div class="stat-label">Countries Exploring CBDCs</div>
      <div class="stat-trend">↑ 98% of global GDP</div>
    </div>
    <div class="stat-item">
      <div class="stat-num">$8.7B</div>
      <div class="stat-label">Tokenized Treasuries On-Chain</div>
      <div class="stat-trend">↑ From $100M in 2023</div>
    </div>
  </div>
</div>

<!-- ===================== TOKENIZATION ===================== -->
<section id="tokenization" style="padding-top:100px;">
  <div class="sec-tag">Foundation</div>
  <h2 class="sec-h2">What is <em>Tokenization</em>?</h2>
  <p class="sec-sub">Tokenization is the process of converting rights to a real-world asset into a digital token on a blockchain. Think of it as creating a digital twin of a physical or financial asset — one that can be traded instantly, globally, and in fractions of a cent.</p>

  <div class="highlight-box">
    <h3>"Tokenization will change the way money flows around the world."</h3>
    <p>When any asset — a skyscraper, a US Treasury bond, a bar of gold, or a Hollywood film's royalties — becomes a blockchain token, it gains superpowers: instant settlement, global accessibility, fractional ownership, 24/7 trading, and programmable compliance. Traditional finance required armies of intermediaries to manage what smart contracts can do automatically.</p>
  </div>

  <div class="card-grid">
    <div class="card">
      <div class="card-icon">🏗️</div>
      <div class="card-h">Asset Selection</div>
      <div class="card-p">Any revenue-generating or value-holding asset can be tokenized: real estate, debt, commodities, equity, art, music royalties, carbon credits, or intellectual property.</div>
      <span class="card-tag tag-gold">Step 1</span>
    </div>
    <div class="card">
      <div class="card-icon">⚖️</div>
      <div class="card-h">Legal Structure</div>
      <div class="card-p">A legal wrapper (SPV, trust, or fund) holds the asset. Smart contracts encode the rights: ownership percentage, income distributions, voting rights, and transfer restrictions.</div>
      <span class="card-tag tag-gold">Step 2</span>
    </div>
    <div class="card">
      <div class="card-icon">🔗</div>
      <div class="card-h">On-Chain Issuance</div>
      <div class="card-p">Tokens are minted on a blockchain (Ethereum, Solana, Avalanche, XRP Ledger). Each token represents a precise fractional claim on the underlying asset.</div>
      <span class="card-tag tag-gold">Step 3</span>
    </div>
    <div class="card">
      <div class="card-icon">🛂</div>
      <div class="card-h">KYC / Compliance</div>
      <div class="card-p">Investor whitelisting via KYC/AML ensures only verified, eligible investors can hold tokens. Standards like ERC-3643 (created by Tokeny) enforce this on-chain automatically.</div>
      <span class="card-tag tag-gold">Step 4</span>
    </div>
    <div class="card">
      <div class="card-icon">📊</div>
      <div class="card-h">Primary Offering</div>
      <div class="card-p">Tokens are sold to investors via regulated platforms (Securitize, DigiFT, STOKR) or licensed exchanges. Minimum investments can be as low as $10–$1,000.</div>
      <span class="card-tag tag-gold">Step 5</span>
    </div>
    <div class="card">
      <div class="card-icon">🔄</div>
      <div class="card-h">Secondary Trading</div>
      <div class="card-p">Token holders can trade on compliant secondary markets (ATS, DEX with whitelisting). Settlement is near-instant vs. T+2 days in traditional markets.</div>
      <span class="card-tag tag-gold">Step 6</span>
    </div>
  </div>

  <h3 id="how-it-works" style="font-family:'Cormorant Garamond',serif;font-size:28px;font-weight:400;margin-bottom:24px;color:var(--text);">Why Institutions Are Moving Fast</h3>
  <div class="two-col">
    <div>
      <div class="info-block">
        <h4>Up to 70% Lower Transaction Costs</h4>
        <p>Removing clearinghouses, transfer agents, custodial chains, and reconciliation processes slashes the infrastructure tax on every transaction. Smart contracts automate what entire back-office departments currently do manually.</p>
      </div>
      <div class="info-block">
        <h4>24/7 Global Settlement</h4>
        <p>Traditional markets close evenings, weekends, and holidays. Tokenized assets trade around the clock, across every timezone, with settlement in minutes — not the industry-standard 2 business days (T+2).</p>
      </div>
      <div class="info-block">
        <h4>Fractional Ownership from $10</h4>
        <p>A Manhattan skyscraper worth $500 million previously required institutional capital to access. Tokenization splits it into millions of $10 tokens, democratizing access to asset classes that were exclusive for a century.</p>
      </div>
    </div>
    <div>
      <div class="info-block">
        <h4>Programmable Compliance</h4>
        <p>KYC/AML rules, accreditation checks, transfer restrictions, and reporting requirements are encoded directly into the token's smart contract. Compliance runs automatically, reducing legal overhead by orders of magnitude.</p>
      </div>
      <div class="info-block">
        <h4>DeFi Composability</h4>
        <p>Tokenized assets can be used as collateral for loans, deposited into yield protocols, integrated into decentralized financial products. BlackRock's BUIDL tokens are now used as margin collateral — earning yield while sitting idle as leverage.</p>
      </div>
      <div class="info-block">
        <h4>Immutable Audit Trails</h4>
        <p>Every transaction, ownership transfer, and income distribution is permanently recorded on a public blockchain. Transparency that exceeds any traditional reporting standard, available to auditors, regulators, and investors in real-time.</p>
      </div>
    </div>
  </div>

  <h3 id="tech-stack" style="font-family:'Cormorant Garamond',serif;font-size:28px;font-weight:400;margin-bottom:24px;">Technology Stack</h3>
  <div class="tech-stack">
    <div class="layer">
      <div class="layer-num">L1</div>
      <div class="layer-name">Blockchain Infrastructure</div>
      <div class="layer-detail">Ethereum, Solana, XRP Ledger, Avalanche, Polygon — the base layer providing consensus, security, and immutability. The "internet" of tokenization.</div>
      <div class="layer-badge"><span class="card-tag tag-blue">Foundation</span></div>
    </div>
    <div class="layer">
      <div class="layer-num">L2</div>
      <div class="layer-name">Smart Contract Standards</div>
      <div class="layer-detail">ERC-20 (fungible), ERC-721 (NFT), ERC-1400 (securities), ERC-3643 (compliant tokens by Tokeny). These standards define how tokens behave, transfer, and enforce compliance.</div>
      <div class="layer-badge"><span class="card-tag tag-blue">Protocol</span></div>
    </div>
    <div class="layer">
      <div class="layer-num">L3</div>
      <div class="layer-name">Tokenization Platforms</div>
      <div class="layer-detail">Securitize, Tokeny, Fireblocks, Taurus, Polymath — middleware platforms providing the investor portal, KYC/AML integration, compliance engine, cap table management, and custody tooling.</div>
      <div class="layer-badge"><span class="card-tag tag-gold">Platform</span></div>
    </div>
    <div class="layer">
      <div class="layer-num">L4</div>
      <div class="layer-name">Oracle & Data Layer</div>
      <div class="layer-detail">Chainlink (price feeds, CCIP cross-chain), API3, Pyth Network — bridge real-world data (prices, yields, valuations) onto the blockchain so smart contracts can reflect accurate asset values.</div>
      <div class="layer-badge"><span class="card-tag tag-green">Data</span></div>
    </div>
    <div class="layer">
      <div class="layer-num">L5</div>
      <div class="layer-name">Cross-Chain Interoperability</div>
      <div class="layer-detail">Chainlink CCIP (institutional standard), LayerZero (30+ chains), Cosmos IBC (85+ chains) — allow tokenized assets to move between blockchains without being locked to a single ecosystem.</div>
      <div class="layer-badge"><span class="card-tag tag-blue">Bridge</span></div>
    </div>
    <div class="layer">
      <div class="layer-num">L6</div>
      <div class="layer-name">Custody & Legal Layer</div>
      <div class="layer-detail">BitGo, Anchorage, Copper, Fireblocks — institutional-grade digital asset custody. Paralleled by legal custodians (title registries, notaries, land departments) holding the physical or legal claim.</div>
      <div class="layer-badge"><span class="card-tag tag-gold">Legal</span></div>
    </div>
    <div class="layer">
      <div class="layer-num">L7</div>
      <div class="layer-name">Regulatory & Compliance</div>
      <div class="layer-detail">SEC (US), MiCA (EU), MAS (Singapore), VARA (UAE), HKMA (Hong Kong), FCA (UK), PVARA (Pakistan) — jurisdiction-specific frameworks governing issuance, trading, and custody of tokenized securities.</div>
      <div class="layer-badge"><span class="card-tag tag-red">Compliance</span></div>
    </div>
  </div>

  <h3 id="timeline" style="font-family:'Cormorant Garamond',serif;font-size:28px;font-weight:400;margin:40px 0 24px;">History of Tokenization</h3>
  <div class="timeline">
    <div class="tl-item">
      <div class="tl-dot"></div>
      <div class="tl-year">2009</div>
      <div class="tl-h">Bitcoin — Proof of Concept</div>
      <div class="tl-p">Satoshi Nakamoto demonstrates that digital scarcity is possible without a central authority. The foundation for all tokenization is laid.</div>
    </div>
    <div class="tl-item">
      <div class="tl-dot"></div>
      <div class="tl-year">2015</div>
      <div class="tl-h">Ethereum & Smart Contracts</div>
      <div class="tl-p">Vitalik Buterin's Ethereum enables programmable money. For the first time, complex financial logic can run autonomously on-chain. The ERC-20 standard makes token creation trivial.</div>
    </div>
    <div class="tl-item">
      <div class="tl-dot"></div>
      <div class="tl-year">2017–2019</div>
      <div class="tl-h">First-Generation RWA Attempts</div>
      <div class="tl-p">Early real estate tokenization projects (Harbor, Polymath) prove the concept but struggle with regulatory clarity, thin liquidity, and lack of institutional infrastructure.</div>
    </div>
    <div class="tl-item">
      <div class="tl-dot"></div>
      <div class="tl-year">2021</div>
      <div class="tl-h">NFT Moment — IP & Art Tokenization</div>
      <div class="tl-p">The NFT boom validates the concept of unique digital ownership. Billions flow into tokenized art and collectibles, demonstrating consumer appetite for digital asset ownership.</div>
    </div>
    <div class="tl-item">
      <div class="tl-dot"></div>
      <div class="tl-year">2023</div>
      <div class="tl-h">Institutional RWA Inflection Point</div>
      <div class="tl-p">Franklin Templeton's Benji product (first US-registered mutual fund on blockchain) and Ondo Finance's tokenized Treasuries prove institutional-grade product-market fit. TVL explodes from $100M to $1B+.</div>
    </div>
    <div class="tl-item">
      <div class="tl-dot"></div>
      <div class="tl-year">2024</div>
      <div class="tl-h">BlackRock Enters — BUIDL Fund</div>
      <div class="tl-p">BlackRock (world's largest asset manager, $10T AUM) launches BUIDL on Ethereum via Securitize. This single event legitimizes institutional tokenization at the highest level.</div>
    </div>
    <div class="tl-item">
      <div class="tl-dot"></div>
      <div class="tl-year">2025</div>
      <div class="tl-h">Tokenized Stocks & Regulatory Clarity</div>
      <div class="tl-p">Coinbase launches tokenized stocks for US investors. Nasdaq files with SEC. DTCC pilot for tokenized clearing. The GENIUS Act passes, creating the first federal stablecoin framework.</div>
    </div>
    <div class="tl-item">
      <div class="tl-dot"></div>
      <div class="tl-year">2026</div>
      <div class="tl-h">Mainstream Institutional Adoption</div>
      <div class="tl-p">Tokenized RWA exceeds $35B. UAE, Singapore, and Pakistan lead emerging market adoption. Cross-chain infrastructure matures. The race to $19T by 2033 begins in earnest.</div>
    </div>
  </div>

  <!-- RWA CATALYST DEEP DIVE -->
  <div style="margin-top:60px;" id="rwa-catalyst">
    <div class="sec-tag" style="margin-bottom:12px;">The Real Catalyst</div>
    <h2 class="sec-h2" style="margin-bottom:20px;">Why <em>Right Now</em> Is the Inflection Point</h2>
    <p class="sec-sub" style="margin-bottom:40px;">Tokenization has existed as a concept since 2015. So why is 2025–2027 the era when it actually happens at scale? Six simultaneous catalysts have converged — and the window for first-movers is closing fast.</p>

    <div class="highlight-box" style="margin-bottom:40px;">
      <h3>The $900 Trillion Opportunity</h3>
      <p>The total value of all real-world assets on Earth — real estate ($326T), equities ($100T), bonds ($133T), private credit ($1.5T), gold ($12T), commodities, art, IP — exceeds $900 trillion. Currently, less than $35 billion (0.004%) of this is tokenized on-chain. Every single percentage point of penetration represents $9 trillion in migrating digital assets. The race to capture this historic migration is the defining financial event of the 2020s and 2030s.</p>
    </div>

    <div class="card-grid" style="margin-bottom:48px;">
      <div class="card">
        <div class="card-icon">⚖️</div>
        <div class="card-h">Catalyst 1 — Regulatory Clarity Arrived</div>
        <div class="card-p">For years institutions stayed out because no one knew the rules. Then the GENIUS Act (US stablecoin framework), MiCA (EU), MAS SCS (Singapore), VARA (UAE), and HKMA (Hong Kong) all issued workable frameworks within 18 months of each other. The legal fog lifted. Compliance teams have something to work with. The boardroom objection "it's not regulated" is now obsolete in every major financial center.</div>
        <span class="card-tag tag-green">Resolved 2024–2025</span>
      </div>
      <div class="card">
        <div class="card-icon">🏦</div>
        <div class="card-h">Catalyst 2 — The BlackRock Effect</div>
        <div class="card-p">When the world's largest asset manager ($10 trillion AUM) launches a tokenized fund on Ethereum, the institutional risk committee calculus changes permanently. BUIDL was the signal every pension fund, sovereign wealth fund, and family office needed. If BlackRock can, everyone can. Within 12 months of BUIDL's launch, $8.7B in tokenized Treasuries existed on-chain. That is not coincidence — that is institutional permission granted at the highest level.</div>
        <span class="card-tag tag-gold">2024 Turning Point</span>
      </div>
      <div class="card">
        <div class="card-icon">🔧</div>
        <div class="card-h">Catalyst 3 — Infrastructure Is Now Complete</div>
        <div class="card-p">In 2019, building a tokenized product required custom engineering of every layer. Today, Securitize handles compliance and cap table management, Fireblocks handles custody, Chainlink CCIP handles cross-chain movement, and ERC-3643 handles transfer restrictions. The full stack exists off-the-shelf. Time-to-market for a tokenized fund dropped from 18 months to 6 weeks. The infrastructure tax went from prohibitive to negligible.</div>
        <span class="card-tag tag-blue">Stack Complete 2024</span>
      </div>
      <div class="card">
        <div class="card-icon">💰</div>
        <div class="card-h">Catalyst 4 — Stablecoins Proved the Rails Work</div>
        <div class="card-p">Stablecoins processed $33 trillion in annual transaction volume — more than PayPal, approaching Visa. This proved that blockchain-native money works at civilizational scale. Every tokenized asset settles in stablecoins. The existence of deep, liquid stablecoin markets is the prerequisite for liquid RWA markets. The plumbing was installed by stablecoins. Now the assets flow through it.</div>
        <span class="card-tag tag-blue">$33T Annual Volume</span>
      </div>
      <div class="card">
        <div class="card-icon">📉</div>
        <div class="card-h">Catalyst 5 — Traditional Finance Under Structural Stress</div>
        <div class="card-p">The bond market paradox (yields rising despite rate cuts), gold at $5,111, central banks buying 60 tonnes/month for three years, and BlackRock itself going underweight US Treasuries — institutional capital is actively searching for new vehicles. Tokenized assets offer what traditional markets cannot: 24/7 settlement, fractional access, DeFi composability, and immutable audit trails. Push-out from traditional finance meets pull of digital infrastructure at this precise moment.</div>
        <span class="card-tag tag-red">Macro Pressure 2026</span>
      </div>
      <div class="card">
        <div class="card-icon">🌍</div>
        <div class="card-h">Catalyst 6 — Emerging Market Demand Is Explosive</div>
        <div class="card-p">Pakistan tokenizing $2B in sovereign bonds. Punjab committing to RWA-backed FDI. UAE as the world's most active tokenization sandbox. Latin America using stablecoins for 71% of cross-border payments. The demand is not coming only from Wall Street — it is coming from the 5 billion people who never had efficient access to capital markets. Emerging market governments see tokenization as a leapfrog technology that bypasses 50 years of financial infrastructure they never built.</div>
        <span class="card-tag tag-gold">Global Demand</span>
      </div>
    </div>

    <h3 style="font-family:'Cormorant Garamond',serif;font-size:26px;font-weight:400;margin-bottom:24px;">From Physical Asset to Digital Token: The Complete Journey</h3>
    <div class="tech-stack" style="margin-bottom:40px;">
      <div class="layer">
        <div class="layer-num">01</div>
        <div class="layer-name">Asset Selection</div>
        <div class="layer-detail">Any asset with definable value and legal ownership qualifies. The highest-value candidates are illiquid assets with high barriers to entry: a $200M office tower, a portfolio of SME loans, a gold vault, a crop harvest. The more friction traditional finance creates around an asset, the more value tokenization destroys by removing that friction.</div>
        <div class="layer-badge"><span class="card-tag tag-gold">Day 1</span></div>
      </div>
      <div class="layer">
        <div class="layer-num">02</div>
        <div class="layer-name">Legal Structuring (SPV / Trust)</div>
        <div class="layer-detail">A Special Purpose Vehicle, trust, or regulated fund is created to legally hold the asset. Token holders own shares in this legal wrapper — not the asset directly. Every jurisdiction requires different structures: Dubai uses DLD-registered SPVs; US uses Delaware trusts; EU uses Irish or Luxembourg SPVs. The legal wrapper is the non-negotiable bridge between the physical world and blockchain.</div>
        <div class="layer-badge"><span class="card-tag tag-gold">Weeks 1–4</span></div>
      </div>
      <div class="layer">
        <div class="layer-num">03</div>
        <div class="layer-name">Independent Valuation & Audit</div>
        <div class="layer-detail">Certified appraisers, lawyers, and auditors verify value, title clarity, liabilities, and regulatory compliance. For real estate: property survey, title search, rental income audit. For private credit: borrower creditworthiness, collateral value, loan documentation. For Treasuries: custodian attestation of underlying securities. This valuation anchors token pricing and must be updated regularly — the oracle problem.</div>
        <div class="layer-badge"><span class="card-tag tag-blue">Weeks 2–6</span></div>
      </div>
      <div class="layer">
        <div class="layer-num">04</div>
        <div class="layer-name">Smart Contract Engineering</div>
        <div class="layer-detail">Developers write contracts defining total token supply, fractional ownership math, income distribution (rental yield, coupons, dividends), transfer restrictions (whitelist-only), redemption mechanisms, and governance rights. ERC-3643 and ERC-1400 encode these rules immutably. The smart contract IS the legal agreement — translated into self-executing code that operates without banks, lawyers, or intermediaries.</div>
        <div class="layer-badge"><span class="card-tag tag-blue">Weeks 3–8</span></div>
      </div>
      <div class="layer">
        <div class="layer-num">05</div>
        <div class="layer-name">Regulatory Filing & Approval</div>
        <div class="layer-detail">Jurisdiction-specific: SEC Reg D / Reg A+ (US), VARA license (Dubai), MAS license (Singapore), MiCA registration (EU). This determines who can legally invest and classifies the token as a security, fund share, or novel category. Historically the biggest bottleneck — but 2024–2025 regulatory frameworks have dramatically compressed approval timelines from 12 months to weeks in progressive jurisdictions.</div>
        <div class="layer-badge"><span class="card-tag tag-red">Weeks 4–16</span></div>
      </div>
      <div class="layer">
        <div class="layer-num">06</div>
        <div class="layer-name">KYC / AML Investor Onboarding</div>
        <div class="layer-detail">Every investor completes digital identity verification (passport, facial recognition, sanctions screening) before their wallet is whitelisted. Platforms like Securitize and Tokeny process global onboarding in hours vs. weeks for traditional brokerages. The whitelist is stored on-chain, enforced automatically by the smart contract. Only verified wallets can receive or send tokens — compliance is not a checkbox; it is the infrastructure.</div>
        <div class="layer-badge"><span class="card-tag tag-green">Ongoing</span></div>
      </div>
      <div class="layer">
        <div class="layer-num">07</div>
        <div class="layer-name">Primary Token Issuance</div>
        <div class="layer-detail">Tokens are minted on the chosen blockchain. Investors send USDC or fiat; the smart contract transfers tokens instantly. The cap table updates in real-time, on-chain, permanently. Settlement is immediate — no T+2 clearing period, no custodian chains, no reconciliation delay. The entire primary issuance that took investment banks weeks to manage now completes in minutes through automated smart contract execution.</div>
        <div class="layer-badge"><span class="card-tag tag-green">Launch</span></div>
      </div>
      <div class="layer">
        <div class="layer-num">08</div>
        <div class="layer-name">Automated Income Distribution</div>
        <div class="layer-detail">Rental income, loan repayments, bond coupons, or dividends flow automatically. A tokenized Dubai apartment: rental income arrives monthly, smart contract calculates 500 token holders' pro-rata shares, USDC transfers globally within seconds. No property manager manual calculation. No wire transfer delays. No currency conversion friction. This automation is what makes fractional ownership of income-producing assets economically viable at global scale.</div>
        <div class="layer-badge"><span class="card-tag tag-gold">Monthly/Daily</span></div>
      </div>
      <div class="layer">
        <div class="layer-num">09</div>
        <div class="layer-name">Secondary Market Trading</div>
        <div class="layer-detail">Token holders trade positions on compliant secondary markets: ATS platforms (INX, tZERO), whitelisted DEXs, or OTC desks. The critical variable: secondary market depth. Without active buyers and sellers, tokenization creates more efficient paper — not genuine liquidity. Building secondary market depth (market makers, exchange listings, cross-chain accessibility) is the industry's defining challenge for 2026–2028 and the factor that separates tokenization projects that matter from those that do not.</div>
        <div class="layer-badge"><span class="card-tag tag-blue">Post-Launch</span></div>
      </div>
    </div>

    <div class="two-col">
      <div class="info-block">
        <h4>Why Illiquid Assets Are the Highest-Value Targets</h4>
        <p>The less liquid an asset in traditional finance, the more value tokenization adds. A US Treasury is already highly liquid — tokenization makes it more accessible and composable, but the liquidity premium is modest. A Dubai apartment, a Pakistani wheat harvest, a private equity stake, or a portfolio of SME loans — these are assets where the bid-ask spread in traditional markets is enormous (or there is no market at all). Tokenization's value creation is greatest precisely where traditional finance fails most: illiquid, geographically restricted, high-minimum-investment assets held by owners who cannot efficiently access global capital.</p>
      </div>
      <div class="info-block">
        <h4>The Oracle Problem — Bridging Physical and Digital Reality</h4>
        <p>The most technically complex challenge in RWA tokenization is the "oracle problem": how does a blockchain know what a physical asset is worth in real-time? Blockchains cannot independently verify off-chain data. Solutions are maturing: Chainlink provides tamper-resistant price feeds from multiple independent data sources. Real estate uses automated valuation models updated by certified appraisers. For commodities, exchange-traded reference prices are posted on-chain. For private credit, NAV is computed off-chain by fund administrators and cryptographically signed on-chain. The reliability of these oracles directly determines the trustworthiness of every tokenized asset built on top of them.</p>
      </div>
    </div>
  </div><!-- end rwa-catalyst -->
</section>

<div class="divider"></div>

<!-- ===================== RWA ===================== -->
<section id="rwa">
  <div class="sec-tag">Asset Classes</div>
  <h2 class="sec-h2">Real World <em>Assets</em></h2>
  <p class="sec-sub">Real-world assets (RWAs) are off-chain assets brought onto blockchain through tokenization. Every asset class in the $900+ trillion global asset universe is a candidate. Here is the complete landscape of what is being tokenized today.</p>

  <table class="data-table fade-in">
    <thead>
      <tr>
        <th>Asset Class</th>
        <th>Current Market Size</th>
        <th>On-Chain Value (2026)</th>
        <th>Leaders</th>
        <th>Growth Driver</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>US Treasuries & Money Markets</strong></td>
        <td class="num">$26T</td>
        <td class="num green">$8.7B</td>
        <td>BlackRock BUIDL, Ondo, Franklin Templeton</td>
        <td>Yield-bearing on-chain cash equivalent</td>
      </tr>
      <tr>
        <td><strong>Real Estate</strong></td>
        <td class="num">$300T</td>
        <td class="num green">$20B</td>
        <td>RealT, Propy, Lofty, PRYPCO/DAMAC</td>
        <td>Fractional access, global investor base</td>
      </tr>
      <tr>
        <td><strong>Private Credit & Loans</strong></td>
        <td class="num">$1.5T</td>
        <td class="num green">$12B</td>
        <td>Figure, Maple, Centrifuge, Goldfinch</td>
        <td>Higher yield, DeFi composability</td>
      </tr>
      <tr>
        <td><strong>Gold & Commodities</strong></td>
        <td class="num">$12T</td>
        <td class="num green">$1.5B</td>
        <td>Paxos Gold, Tether Gold, AURUS</td>
        <td>Digital gold standard, collateral layer</td>
      </tr>
      <tr>
        <td><strong>Equities & Funds</strong></td>
        <td class="num">$100T</td>
        <td class="num green">$800M</td>
        <td>Backed, Dinari, Ondo Global Markets</td>
        <td>24/7 trading, global access</td>
      </tr>
      <tr>
        <td><strong>Carbon Credits</strong></td>
        <td class="num">$2T</td>
        <td class="num green">$350M</td>
        <td>Toucan, Flowcarbon, KlimaDAO</td>
        <td>ESG mandates, transparency</td>
      </tr>
      <tr>
        <td><strong>Trade Finance</strong></td>
        <td class="num">$10T</td>
        <td class="num green">$200M</td>
        <td>Contour, TradeFlow, Marco Polo</td>
        <td>Speed, SME access to capital</td>
      </tr>
      <tr>
        <td><strong>Art, IP & Collectibles</strong></td>
        <td class="num">$3T</td>
        <td class="num green">$450M</td>
        <td>Story Protocol, Bolero Music, Kettle</td>
        <td>Royalty automation, provenance</td>
      </tr>
    </tbody>
  </table>

  <h3 id="treasuries" style="font-family:'Cormorant Garamond',serif;font-size:26px;font-weight:400;margin:40px 0 20px;">Tokenized Treasuries — The Killer App</h3>
  <div class="highlight-box">
    <h3>The "Russian Doll" Effect</h3>
    <p>The most sophisticated development in 2026 is the layering of tokenized Treasuries into other financial products. BlackRock's BUIDL fund tokens are used as collateral on DeFi platforms. Ethena has created stablecoins (USDtb) backed by BUIDL, which is backed by Treasuries. Traders post yield-bearing BUIDL tokens as margin instead of non-yielding USDT — effectively halving their cost of leverage. This composability creates deep, structural demand that goes far beyond simple "buy and hold."</p>
  </div>
  <div class="card-grid">
    <div class="card">
      <div class="card-h">BlackRock BUIDL</div>
      <div class="card-p">Launched on Ethereum via Securitize. First tokenized fund from the world's largest asset manager ($10T AUM). Sets the institutional gold standard for tokenized government securities.</div>
      <span class="card-tag tag-gold">$1B+ AUM</span>
    </div>
    <div class="card">
      <div class="card-h">Ondo Finance OUSG</div>
      <div class="card-p">Tokenized US Treasuries and money markets. $2.5B TVL. Pioneer of "yield-bearing" stablecoin alternatives. Provides crypto-native institutions access to risk-free rate.</div>
      <span class="card-tag tag-gold">$2.5B TVL</span>
    </div>
    <div class="card">
      <div class="card-h">Franklin Templeton Benji</div>
      <div class="card-p">First US-registered mutual fund on blockchain ($880M+). Uses Stellar and Polygon. Investors can transfer shares peer-to-peer, 24/7, without a broker.</div>
      <span class="card-tag tag-blue">$880M+</span>
    </div>
    <div class="card">
      <div class="card-h">Superstate USTB</div>
      <div class="card-p">Tokenized short-duration US government securities. Built by Compound Finance founder Robert Leshner. Institutional-grade, SEC-compliant wrapper for on-chain cash management.</div>
      <span class="card-tag tag-blue">SEC Compliant</span>
    </div>
  </div>

  <h3 id="real-estate" style="font-family:'Cormorant Garamond',serif;font-size:26px;font-weight:400;margin:40px 0 20px;">Real Estate Tokenization</h3>
  <div class="info-block">
    <h4>Why Real Estate is the Long Game</h4>
    <p>Real estate is the world's largest asset class at $300+ trillion. Tokenization solves its three fundamental problems: illiquidity (you can't sell 10% of a building), inaccessibility (minimum investments are enormous), and opacity (valuations and cash flows are opaque). While current on-chain real estate is $20B, the TAM is effectively unlimited. The challenges are legal complexity (title transfer laws vary by country), valuation opacity (prices don't update in real-time), and thin secondary markets.</p>
  </div>

  <h3 id="private-credit" style="font-family:'Cormorant Garamond',serif;font-size:26px;font-weight:400;margin:40px 0 20px;">Private Credit — The Yield Engine</h3>
  <div class="two-col">
    <div>
      <div class="info-block">
        <h4>Why Yields Are Higher (8–12%+)</h4>
        <p>Private credit borrowers pay higher rates because they can't access public bond markets — they're too small, too complex, or too specialized. By tokenizing these loans, platforms like Figure and Centrifuge enable global capital pools to fund them, while investors earn yields 3–5x higher than equivalent-duration Treasuries.</p>
      </div>
    </div>
    <div>
      <div class="info-block">
        <h4>Figure Technologies — $10B Milestone</h4>
        <p>Figure Technologies alone has tokenized $10 billion in loans including home equity lines of credit (HELOCs) and mortgage-backed assets. This is not a pilot — it is full-scale institutional deployment of tokenized private credit, proving the model at scale.</p>
      </div>
    </div>
  </div>
</section>

<div class="divider"></div>

<!-- ===================== STABLECOINS ===================== -->
<section id="stablecoins" style="position:relative;">
  <div class="sec-tag">Digital Infrastructure</div>
  <h2 class="sec-h2"><em>Stablecoins</em> — Not Crypto</h2>
  <p class="sec-sub">Stablecoins are digital currencies pegged to a stable asset (usually the US dollar). They are financial infrastructure — the settlement layer of the new digital economy. Understanding why they are fundamentally different from cryptocurrency is essential.</p>

  <div id="stable-vs-crypto">
    <div class="vs-grid">
      <div class="vs-col">
        <div class="vs-head">
          <div class="vs-col-title" style="color:var(--blue);">💵 Stablecoins</div>
          <div class="vs-col-sub">Price-Stable Digital Infrastructure</div>
        </div>
        <div class="vs-items">
          <div class="vs-item">
            <div class="vs-icon">✅</div>
            <div class="vs-text"><strong>Pegged Value:</strong> 1 USDC = $1.00 always. No price volatility.</div>
          </div>
          <div class="vs-item">
            <div class="vs-icon">✅</div>
            <div class="vs-text"><strong>Backed by Real Assets:</strong> USDC is backed 1:1 by US dollars and short-term Treasuries held by regulated custodians.</div>
          </div>
          <div class="vs-item">
            <div class="vs-icon">✅</div>
            <div class="vs-text"><strong>Payment Tool:</strong> Used to pay suppliers, settle trades, send remittances. Visa processed $4.5B annualized in stablecoin card spending (Jan 2026).</div>
          </div>
          <div class="vs-item">
            <div class="vs-icon">✅</div>
            <div class="vs-text"><strong>DeFi Settlement Layer:</strong> The "dollar" of blockchain. All RWA transactions settle in stablecoins. $33T annual transaction volume.</div>
          </div>
          <div class="vs-item">
            <div class="vs-icon">✅</div>
            <div class="vs-text"><strong>Regulated Path:</strong> GENIUS Act (2025) created the first federal US framework. EU MiCA covers stablecoin issuers. Singapore MAS has licensing regime.</div>
          </div>
          <div class="vs-item">
            <div class="vs-icon">✅</div>
            <div class="vs-text"><strong>Treasury Buyers:</strong> USDT and USDC issuers collectively hold $155B+ in US Treasury bills — among the largest T-bill buyers in the world.</div>
          </div>
        </div>
      </div>
      <div class="vs-sep">
        <div class="vs-label">VS</div>
      </div>
      <div class="vs-col">
        <div class="vs-head">
          <div class="vs-col-title" style="color:var(--gold);">₿ Cryptocurrency</div>
          <div class="vs-col-sub">Speculative Digital Assets</div>
        </div>
        <div class="vs-items">
          <div class="vs-item">
            <div class="vs-icon">⚡</div>
            <div class="vs-text"><strong>Volatile Price:</strong> Bitcoin dropped 31% in a year while still being considered a bull market. Daily 5–10% swings are normal.</div>
          </div>
          <div class="vs-item">
            <div class="vs-icon">⚡</div>
            <div class="vs-text"><strong>No Direct Backing:</strong> Bitcoin's value is derived from scarcity (21M supply cap) and network effect, not collateral.</div>
          </div>
          <div class="vs-item">
            <div class="vs-icon">⚡</div>
            <div class="vs-text"><strong>Store of Value / Speculation:</strong> Bitcoin and Ethereum are held as inflation hedges or traded for appreciation. Not used for daily commerce.</div>
          </div>
          <div class="vs-item">
            <div class="vs-icon">⚡</div>
            <div class="vs-text"><strong>Blockchain Infrastructure:</strong> ETH powers smart contracts. BTC is "digital gold." These are foundational layers, not settlement currencies.</div>
          </div>
          <div class="vs-item">
            <div class="vs-icon">⚡</div>
            <div class="vs-text"><strong>Regulatory Gray Area:</strong> SEC vs. CFTC jurisdictional battles continue. Securities vs. commodity classification unresolved for many tokens.</div>
          </div>
          <div class="vs-item">
            <div class="vs-icon">⚡</div>
            <div class="vs-text"><strong>Debasement Hedge:</strong> Goldman Sachs calls Bitcoin/Gold investment "the debasement trade" — a bet against sovereign currency stability.</div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <h3 id="stable-types" style="font-family:'Cormorant Garamond',serif;font-size:26px;font-weight:400;margin:40px 0 20px;">Types of Stablecoins</h3>
  <div class="card-grid">
    <div class="card">
      <div class="card-icon">🏦</div>
      <div class="card-h">Fiat-Backed (Custodial)</div>
      <div class="card-p">1:1 backed by dollars, euros, or government bonds held by a regulated custodian. Most trusted, most regulated. Examples: USDC (Circle), USDT (Tether), USDP (Paxos).</div>
      <span class="card-tag tag-green">Lowest Risk</span>
    </div>
    <div class="card">
      <div class="card-icon">🏛️</div>
      <div class="card-h">Government-Backed</div>
      <div class="card-p">Backed by sovereign debt instruments. USD1 (World Liberty Financial) is 100% backed by US cash and cash equivalents. $5B market cap in under one year of launch (March 2025).</div>
      <span class="card-tag tag-green">Institutional Grade</span>
    </div>
    <div class="card">
      <div class="card-icon">⛓️</div>
      <div class="card-h">Crypto-Backed (Decentralized)</div>
      <div class="card-p">Over-collateralized by cryptocurrency. DAI (MakerDAO) requires $150 in ETH to mint $100 in DAI. Decentralized but more complex, requires active management of collateral ratios.</div>
      <span class="card-tag tag-gold">Medium Risk</span>
    </div>
    <div class="card">
      <div class="card-icon">📊</div>
      <div class="card-h">Algorithmic</div>
      <div class="card-p">Maintain peg through supply/demand algorithms, no backing. Terra/UST collapsed spectacularly in 2022 ($40B destroyed in days). Heavily discouraged by new regulations. High risk.</div>
      <span class="card-tag tag-red">High Risk</span>
    </div>
    <div class="card">
      <div class="card-icon">📈</div>
      <div class="card-h">Yield-Bearing</div>
      <div class="card-p">Next-generation stablecoins that pass yield to holders. Ethena's USDe, backed by delta-neutral positions, delivers 8–15% yields. The "Clarity Act" debate determines if this can reach retail investors.</div>
      <span class="card-tag tag-blue">Emerging</span>
    </div>
    <div class="card">
      <div class="card-icon">🌍</div>
      <div class="card-h">Non-USD Stablecoins</div>
      <div class="card-p">EURC (Euro), XSGD (Singapore Dollar), Zand AED (UAE Dirham). As tokenization globalizes, multi-currency stable settlement becomes essential for cross-border trade finance.</div>
      <span class="card-tag tag-blue">Global Finance</span>
    </div>
  </div>

  <h3 id="stable-regulation" style="font-family:'Cormorant Garamond',serif;font-size:26px;font-weight:400;margin:40px 0 20px;">Regulatory Landscape (GENIUS Act & Beyond)</h3>
  <div class="info-block">
    <h4>United States — GENIUS Act (2025)</h4>
    <p>The GENIUS Act created the first comprehensive federal stablecoin framework in US history. It establishes reserve requirements (full backing by high-quality liquid assets), licensing requirements for issuers, and consumer protection provisions. The unresolved "Clarity Act" question — whether crypto platforms can pay customers yield/interest on stablecoin balances — is considered the single biggest regulatory catalyst for the entire crypto market in 2026. If passed, it could unleash billions in retail stablecoin adoption.</p>
  </div>
  <div class="three-col">
    <div class="info-block">
      <h4>EU — MiCA Framework</h4>
      <p>Markets in Crypto-Assets regulation provides comprehensive licensing for stablecoin issuers and crypto exchanges. "Asset-Referenced Tokens" (backed by baskets) face stricter rules than e-money tokens (single fiat-backed). In force since 2024.</p>
    </div>
    <div class="info-block">
      <h4>Singapore — MAS PSA</h4>
      <p>Monetary Authority of Singapore licenses stablecoin issuers under the Payment Services Act. SCS (Single-Currency Stablecoins) framework requires full reserve backing, mandatory redemption rights, and annual audits.</p>
    </div>
    <div class="info-block">
      <h4>UAE — VARA / CBUAE</h4>
      <p>Dubai's VARA regulates crypto assets including stablecoins. Central Bank of UAE issued AED stablecoin guidance. Zand Bank's Zand AED is the leading UAE-based dirham-pegged stablecoin serving the developer ecosystem.</p>
    </div>
  </div>

  <h3 style="font-family:'Cormorant Garamond',serif;font-size:26px;font-weight:400;margin:40px 0 20px;">Major Stablecoins Dashboard</h3>
  <table class="data-table">
    <thead>
      <tr>
        <th>Stablecoin</th>
        <th>Issuer</th>
        <th>Market Cap</th>
        <th>Backing</th>
        <th>Chain(s)</th>
        <th>Key Use</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>USDT</strong></td>
        <td>Tether</td>
        <td class="num green">$139B+</td>
        <td>Cash, T-Bills, commercial paper</td>
        <td>ETH, Tron, Solana</td>
        <td>Global trading, emerging markets</td>
      </tr>
      <tr>
        <td><strong>USDC</strong></td>
        <td>Circle</td>
        <td class="num green">$55B+</td>
        <td>100% cash & T-Bills (monthly audit)</td>
        <td>ETH, SOL, Avalanche</td>
        <td>Institutional DeFi, B2B payments</td>
      </tr>
      <tr>
        <td><strong>DAI / USDS</strong></td>
        <td>MakerDAO / Sky</td>
        <td class="num green">$8B+</td>
        <td>Crypto overcollateral + RWA</td>
        <td>Ethereum</td>
        <td>Decentralized, DeFi native</td>
      </tr>
      <tr>
        <td><strong>USD1</strong></td>
        <td>World Liberty Financial</td>
        <td class="num green">$5B+</td>
        <td>100% US cash & equivalents (BitGo)</td>
        <td>ETH, BNB</td>
        <td>Binance partnerships, RWA suite</td>
      </tr>
      <tr>
        <td><strong>USDe</strong></td>
        <td>Ethena</td>
        <td class="num green">$5B+</td>
        <td>Delta-neutral crypto positions</td>
        <td>ETH, BNB, Solana</td>
        <td>Yield-bearing (8–15% APY)</td>
      </tr>
      <tr>
        <td><strong>PYUSD</strong></td>
        <td>PayPal</td>
        <td class="num">$1B+</td>
        <td>Cash, T-Bills (Paxos custody)</td>
        <td>ETH, Solana</td>
        <td>Consumer payments (400M users)</td>
      </tr>
      <tr>
        <td><strong>Zand AED</strong></td>
        <td>Zand Bank (UAE)</td>
        <td class="num">Regional</td>
        <td>UAE Dirham deposits</td>
        <td>UAE-compliant chain</td>
        <td>MENA developer ecosystem</td>
      </tr>
    </tbody>
  </table>
</section>

<div class="divider"></div>

<!-- ===================== CBDCs ===================== -->
<section id="cbdc" style="position:relative;">
  <div class="sec-tag">Government Digital Money</div>
  <h2 class="sec-h2">Central Bank Digital <em>Currencies</em></h2>
  <p class="sec-sub">CBDCs are government-issued digital versions of national currency. 134 countries representing 98% of global GDP are actively exploring them. But CBDCs and decentralized stablecoins represent fundamentally opposite visions of digital money — and the tension between them is reshaping geopolitics.</p>

  <div id="cbdc-vs-stable">
    <h3 style="font-family:'Cormorant Garamond',serif;font-size:26px;font-weight:400;margin-bottom:24px;">The Great Divide: Centralized vs. Decentralized</h3>
    <div class="compare-table">
      <div class="ct-cell ct-head">Dimension</div>
      <div class="ct-cell ct-head">CBDC (Central Bank)</div>
      <div class="ct-cell ct-head">Fiat Stablecoin (e.g. USDC)</div>
      <div class="ct-cell ct-head">Decentralized Stablecoin (DAI)</div>

      <div class="ct-cell ct-label">Issuer</div>
      <div class="ct-cell">Government / Central Bank</div>
      <div class="ct-cell">Private company (Circle, Tether)</div>
      <div class="ct-cell">Decentralized protocol (MakerDAO)</div>

      <div class="ct-cell ct-label">Programmability</div>
      <div class="ct-cell">Government-controlled</div>
      <div class="ct-cell">Open (DeFi compatible)</div>
      <div class="ct-cell">Fully open (permissionless)</div>

      <div class="ct-cell ct-label">Privacy</div>
      <div class="ct-cell ct-no">✗ Full surveillance possible</div>
      <div class="ct-cell ct-part">◐ KYC required</div>
      <div class="ct-cell ct-yes">✓ Pseudonymous</div>

      <div class="ct-cell ct-label">Censorship Resistance</div>
      <div class="ct-cell ct-no">✗ None — government can freeze</div>
      <div class="ct-cell ct-no">✗ Issuers can blacklist addresses</div>
      <div class="ct-cell ct-yes">✓ No central control</div>

      <div class="ct-cell ct-label">Yield / Interest</div>
      <div class="ct-cell ct-part">◐ Government decision</div>
      <div class="ct-cell ct-part">◐ Regulatory debate</div>
      <div class="ct-cell ct-yes">✓ Protocol-determined</div>

      <div class="ct-cell ct-label">Cross-Border</div>
      <div class="ct-cell ct-part">◐ Requires bilateral agreements</div>
      <div class="ct-cell ct-yes">✓ Global, permissionless</div>
      <div class="ct-cell ct-yes">✓ Borderless by design</div>

      <div class="ct-cell ct-label">Expiry / Control</div>
      <div class="ct-cell ct-no">✗ Can expire or restrict use</div>
      <div class="ct-cell ct-part">◐ Compliance freezes</div>
      <div class="ct-cell ct-yes">✓ User-controlled</div>

      <div class="ct-cell ct-label">DeFi Compatible</div>
      <div class="ct-cell ct-no">✗ Generally no</div>
      <div class="ct-cell ct-yes">✓ Widely integrated</div>
      <div class="ct-cell ct-yes">✓ Native DeFi</div>
    </div>
  </div>

  <div class="highlight-box">
    <h3>The Surveillance Paradox</h3>
    <p>CBDCs offer governments unprecedented visibility into every citizen's financial transaction. Proponents argue this eliminates crime, tax evasion, and money laundering. Critics warn it enables financial authoritarianism — the ability to instantly freeze accounts, impose spending restrictions, or set expiry dates on money for social engineering. China's Digital Yuan (e-CNY) has already been used in government distribution programs with restrictions on how and where it can be spent. This is not hypothetical. The debate between financial inclusion vs. financial surveillance is the defining policy question of the digital money era.</p>
  </div>

  <h3 id="cbdc-world" style="font-family:'Cormorant Garamond',serif;font-size:26px;font-weight:400;margin:40px 0 20px;">Global CBDC Status Map</h3>
  <div class="cbdc-grid">
    <div class="cbdc-card">
      <div class="cbdc-flag">🇨🇳</div>
      <div class="cbdc-country">China</div>
      <div class="cbdc-name">e-CNY (Digital Yuan)</div>
      <div class="cbdc-desc">World's most advanced CBDC. 260M+ wallets. $250B+ in transactions. Used for government stimulus, retail payments, and cross-border trade with BRI partners. Programmable spending restrictions.</div>
      <span class="cbdc-status status-live">LIVE — Mass Adoption</span>
    </div>
    <div class="cbdc-card">
      <div class="cbdc-flag">🇧🇸</div>
      <div class="cbdc-country">Bahamas</div>
      <div class="cbdc-name">Sand Dollar</div>
      <div class="cbdc-desc">World's first live retail CBDC (2020). Designed for financial inclusion across 700 islands. Lessons learned: adoption is slow without compelling consumer incentive.</div>
      <span class="cbdc-status status-live">LIVE — World's First</span>
    </div>
    <div class="cbdc-card">
      <div class="cbdc-flag">🇳🇬</div>
      <div class="cbdc-country">Nigeria</div>
      <div class="cbdc-name">eNaira</div>
      <div class="cbdc-desc">Launched 2021. Significant uptake challenges. Government offered discounts at Lagos markets to drive adoption. Transaction volumes low vs. mobile money alternatives.</div>
      <span class="cbdc-status status-live">LIVE — Low Adoption</span>
    </div>
    <div class="cbdc-card">
      <div class="cbdc-flag">🇮🇳</div>
      <div class="cbdc-country">India</div>
      <div class="cbdc-name">Digital Rupee (e₹)</div>
      <div class="cbdc-desc">Pilot launched Dec 2022. Retail and wholesale versions. RBI targeting 1M daily transactions. India's existing UPI payments infrastructure creates competition.</div>
      <span class="cbdc-status status-pilot">PILOT — Active</span>
    </div>
    <div class="cbdc-card">
      <div class="cbdc-flag">🇪🇺</div>
      <div class="cbdc-country">European Union</div>
      <div class="cbdc-name">Digital Euro</div>
      <div class="cbdc-desc">ECB in preparation phase (2023–2025). Focus on privacy protections as key design feature. Maximum holding limits proposed (€3,000) to prevent bank deposit flight.</div>
      <span class="cbdc-status status-pilot">Preparation Phase</span>
    </div>
    <div class="cbdc-card">
      <div class="cbdc-flag">🇬🇧</div>
      <div class="cbdc-country">United Kingdom</div>
      <div class="cbdc-name">Digital Pound "Britcoin"</div>
      <div class="cbdc-desc">Bank of England & HM Treasury in design phase. Public consultation showed privacy concerns as top citizen worry. Proposed £10,000–£20,000 per person holding limit.</div>
      <span class="cbdc-status status-research">Design Phase</span>
    </div>
    <div class="cbdc-card">
      <div class="cbdc-flag">🇺🇸</div>
      <div class="cbdc-country">United States</div>
      <div class="cbdc-name">No Federal CBDC</div>
      <div class="cbdc-desc">Trump signed executive order in Jan 2025 prohibiting development of a US retail CBDC. US strategy instead focuses on dollar-backed stablecoin dominance globally.</div>
      <span class="cbdc-status status-cancelled">Prohibited (EO 2025)</span>
    </div>
    <div class="cbdc-card">
      <div class="cbdc-flag">🇦🇪</div>
      <div class="cbdc-country">UAE</div>
      <div class="cbdc-name">Digital Dirham</div>
      <div class="cbdc-desc">Central Bank of UAE launched Digital Dirham strategy 2023. Wholesale CBDC for interbank settlement (mBridge project with BIS, China, HK, Thailand). Retail phase planned.</div>
      <span class="cbdc-status status-pilot">Wholesale Pilot</span>
    </div>
    <div class="cbdc-card">
      <div class="cbdc-flag">🇸🇬</div>
      <div class="cbdc-country">Singapore</div>
      <div class="cbdc-name">Project Orchid / Ubin</div>
      <div class="cbdc-desc">MAS running multiple CBDC experiments. Project Ubin tested wholesale settlement. Orchid explores retail CBDC with "purpose-bound money." One of world's most sophisticated research programs.</div>
      <span class="cbdc-status status-pilot">Advanced Research</span>
    </div>
    <div class="cbdc-card">
      <div class="cbdc-flag">🇧🇷</div>
      <div class="cbdc-country">Brazil</div>
      <div class="cbdc-name">DREX</div>
      <div class="cbdc-desc">Banco Central do Brasil launching DREX (Digital Real). Unique design: programmable wholesale CBDC integrated with tokenized government bonds. Pilots with 9 major banks.</div>
      <span class="cbdc-status status-pilot">Pilot — 2024/25</span>
    </div>
    <div class="cbdc-card">
      <div class="cbdc-flag">🇯🇲</div>
      <div class="cbdc-country">Jamaica</div>
      <div class="cbdc-name">JAM-DEX</div>
      <div class="cbdc-desc">Full national rollout 2022. Government incentivized adoption with $16 "wallet bonuses." Designed specifically for the 15% of population without bank accounts.</div>
      <span class="cbdc-status status-live">LIVE — Full Rollout</span>
    </div>
    <div class="cbdc-card">
      <div class="cbdc-flag">🇵🇰</div>
      <div class="cbdc-country">Pakistan</div>
      <div class="cbdc-name">Digital PKR (Planned)</div>
      <div class="cbdc-desc">State Bank of Pakistan exploring CBDC framework. MOU with World Liberty Financial (USD1) signed Jan 2026. Pakistan Crypto Council active. Unique: pursuing both sovereign digital currency and USD stablecoin partnerships simultaneously.</div>
      <span class="cbdc-status status-research">Research + RWA Strategy</span>
    </div>
  </div>
</section>

<div class="divider"></div>

<!-- ===================== CASE STUDIES ===================== -->
<section id="case-studies">
  <div class="sec-tag">Real World Evidence</div>
  <h2 class="sec-h2">Case <em>Studies</em></h2>
  <p class="sec-sub">The tokenization revolution is not theoretical. These are live deployments, real capital, and proven results from institutions that have moved first.</p>

  <div class="card-grid" style="grid-template-columns:repeat(auto-fill,minmax(320px,1fr));">
    <div class="case-card">
      <div class="case-card-head">
        <div class="case-logo">BlackRock BUIDL</div>
        <div class="case-sub">Tokenized Treasury Fund · Ethereum · 2024</div>
      </div>
      <div class="case-card-body">
        <div class="case-stat-row">
          <div class="case-stat"><div class="cs-num">$1B+</div><div class="cs-lbl">AUM</div></div>
          <div class="case-stat"><div class="cs-num">Securitize</div><div class="cs-lbl">Platform</div></div>
          <div class="case-stat"><div class="cs-num">T+0</div><div class="cs-lbl">Settlement</div></div>
        </div>
        <div class="case-desc">BlackRock, the world's largest asset manager ($10T AUM), launched its first tokenized fund on Ethereum. BUIDL holds US Treasury bills and repo agreements, distributed as ERC-20 tokens. The fund pays daily dividends. Ethena built USDtb — a stablecoin backed by BUIDL tokens. Traders use BUIDL as yield-bearing margin collateral. This "Russian Doll" composability effect demonstrates how tokenized Treasuries become the foundational layer of an entirely new financial stack.</div>
      </div>
    </div>
    <div class="case-card">
      <div class="case-card-head">
        <div class="case-logo">Franklin Templeton Benji</div>
        <div class="case-sub">First US-Registered Mutual Fund on Blockchain · 2021</div>
      </div>
      <div class="case-card-body">
        <div class="case-stat-row">
          <div class="case-stat"><div class="cs-num">$880M+</div><div class="cs-lbl">AUM</div></div>
          <div class="case-stat"><div class="cs-num">Stellar+Polygon</div><div class="cs-lbl">Chain</div></div>
          <div class="case-stat"><div class="cs-num">P2P</div><div class="cs-lbl">Transfer</div></div>
        </div>
        <div class="case-desc">Franklin Templeton's OnChain US Government Money Fund (FOBXX) was the first US-registered mutual fund to use blockchain for ownership records. The blockchain IS the official record. Investors receive BENJI tokens representing fund shares and can transfer them directly peer-to-peer without a broker. A $200 trillion asset manager proving that blockchain and regulatory compliance are fully compatible.</div>
      </div>
    </div>
    <div class="case-card">
      <div class="case-card-head">
        <div class="case-logo">PRYPCO Mint / DAMAC</div>
        <div class="case-sub">Tokenized UAE Real Estate · XRP Ledger · Full Case Study</div>
      </div>
      <div class="case-card-body">
        <div class="case-stat-row">
          <div class="case-stat"><div class="cs-num">224</div><div class="cs-lbl">Launch Investors</div></div>
          <div class="case-stat"><div class="cs-num">44</div><div class="cs-lbl">Countries</div></div>
          <div class="case-stat"><div class="cs-num">24hrs</div><div class="cs-lbl">First Offering Sold Out</div></div>
          <div class="case-stat"><div class="cs-num">$1B</div><div class="cs-lbl">MANTRA Deal Value</div></div>
        </div>
        <div class="case-desc" style="margin-bottom:16px;">
          <strong style="color:var(--gold);">The Opportunity:</strong> DAMAC Group — one of the Middle East's largest real estate developers — identified that the traditional route of selling Dubai property to international investors was slow, expensive, and limited to high-net-worth individuals. A penthouse or commercial unit costing AED 2 million was inaccessible to the 99% of global investors who believe in Dubai real estate but cannot write a million-dollar cheque.
        </div>
        <div class="case-desc" style="margin-bottom:16px;">
          <strong style="color:var(--gold);">The Solution:</strong> PRYPCO Mint — a tokenized real estate platform built on XRP Ledger, using Ctrl Alt Solutions as the full-stack infrastructure provider. Each DAMAC property is divided into fractional tokens with a minimum entry of AED 2,000 (~$545). The Dubai Land Department (DLD) custodies the legal title deed. The smart contract custodies the digital token. Both are synchronized — dual custody providing regulatory legitimacy and digital transparency simultaneously.
        </div>
        <div class="case-desc" style="margin-bottom:16px;">
          <strong style="color:var(--gold);">The Result:</strong> First offering launched May 2025. Sold out in 24 hours. 224 investors across 44 countries participated. The speed and geographic distribution validated the core thesis: fractional entry points unlock global demand that traditional real estate distribution never reaches. In 2026, DAMAC signed a $1 billion deal with MANTRA chain, cementing its position as the MENA region's tokenization anchor institution.
        </div>
        <div style="border-top:1px solid var(--border2);padding-top:16px;margin-top:8px;">
          <div style="font-size:11px;text-transform:uppercase;letter-spacing:1px;color:var(--text-dim);margin-bottom:12px;">Technology & Banking Partner Ecosystem</div>
          <div class="player-grid" style="gap:8px;margin-bottom:0;">
            <div class="player-card" style="padding:12px;">
              <div class="player-name" style="font-size:12px;">XRP Ledger (Ripple)</div>
              <div class="player-cat">Blockchain Infrastructure</div>
              <div class="player-detail">Native token issuance. Low-cost, fast settlement. Built-in DEX for secondary trading. XRPL's native tokenization removes the need for complex third-party smart contracts.</div>
            </div>
            <div class="player-card" style="padding:12px;">
              <div class="player-name" style="font-size:12px;">Ctrl Alt Solutions</div>
              <div class="player-cat">Platform Infrastructure</div>
              <div class="player-detail">Full-stack tokenization platform: investor portal, smart contracts, DLD integration, KYC/AML engine, payment processing, secondary market. The car built to run on XRPL roads.</div>
            </div>
            <div class="player-card" style="padding:12px;">
              <div class="player-name" style="font-size:12px;">Dubai Land Department</div>
              <div class="player-cat">Legal Custodian</div>
              <div class="player-detail">Government authority custodying physical title deeds. DLD's Real Estate Tokenization Pilot officially recognizes blockchain-registered property ownership. Regulatory legitimacy layer.</div>
            </div>
            <div class="player-card" style="padding:12px;">
              <div class="player-name" style="font-size:12px;">Zand Bank (UAE AED)</div>
              <div class="player-cat">Banking & Stablecoin Partner</div>
              <div class="player-detail">UAE's first digital bank. Provides AED banking rails and Zand AED stablecoin for dirham-denominated settlement. Enables fiat on/off ramps without requiring crypto wallets for mainstream investors.</div>
            </div>
            <div class="player-card" style="padding:12px;">
              <div class="player-name" style="font-size:12px;">USDC / Circle</div>
              <div class="player-cat">USD Settlement Layer</div>
              <div class="player-detail">International investors can acquire tokens using USDC, providing USD-denominated entry. Circle's USDC on multiple chains ensures global investor accessibility with stable value settlement.</div>
            </div>
            <div class="player-card" style="padding:12px;">
              <div class="player-name" style="font-size:12px;">MANTRA Chain</div>
              <div class="player-cat">Expansion Partner ($1B)</div>
              <div class="player-detail">DAMAC's $1B deal with MANTRA (RWA-native L1 blockchain, MAS-licensed node operators) signals multi-chain strategy. MANTRA handles additional tokenized product lines beyond PRYPCO Mint.</div>
            </div>
            <div class="player-card" style="padding:12px;">
              <div class="player-name" style="font-size:12px;">VARA (Dubai)</div>
              <div class="player-cat">Regulatory Authority</div>
              <div class="player-detail">Dubai's Virtual Assets Regulatory Authority provides licensing framework for token issuance and trading. VARA's clear framework is a primary reason UAE attracts more tokenization projects than any other MENA jurisdiction.</div>
            </div>
            <div class="player-card" style="padding:12px;">
              <div class="player-name" style="font-size:12px;">Chainlink CCIP</div>
              <div class="player-cat">Cross-Chain Interoperability</div>
              <div class="player-detail">As PRYPCO expands to multiple blockchains, Chainlink CCIP provides the cross-chain bridge so XRPL tokens can move to Ethereum or MANTRA. Endorsed by JPMorgan as the institutional standard.</div>
            </div>
          </div>
        </div>
        <div style="border-top:1px solid var(--border2);padding-top:16px;margin-top:16px;">
          <div style="font-size:11px;text-transform:uppercase;letter-spacing:1px;color:var(--text-dim);margin-bottom:12px;">Key Lessons for the Industry</div>
          <div class="info-block" style="margin-bottom:12px;">
            <h4>Lesson 1: First-Mover Advantage Is Real and Fleeting</h4>
            <p>DAMAC launched PRYPCO in May 2025. Competitor Binghatti announced tokenization intent in September 2024 but had no live product 16 months later. In the time Binghatti hesitated, DAMAC sold out launches to investors across 44 countries, signed a $1B MANTRA deal, and established brand dominance in the UAE tokenized real estate space. In a market growing this fast, 12 months of delay is generational market share loss.</p>
          </div>
          <div class="info-block" style="margin-bottom:12px;">
            <h4>Lesson 2: Minimum Investment Is the Single Biggest Lever</h4>
            <p>PRYPCO's AED 2,000 (~$545) minimum opened Dubai real estate to a global middle class that previously had zero access. The 44-country investor distribution on the first offering was entirely a function of the low entry point. Every existing real estate platform targeting HNWIs is targeting the same 1%. Tokenization's transformational power is in reaching the other 99% — and the platform that prices its minimums for them wins the market.</p>
          </div>
          <div class="info-block">
            <h4>Lesson 3: Dual Custody = Institutional Trust</h4>
            <p>The DLD (physical title deed) + Smart Contract (digital token) dual custody structure was the key to regulatory acceptance and investor confidence. Neither layer alone would suffice: pure on-chain without DLD registration has no legal standing; DLD registration without blockchain tokenization offers no fractional trading capability. The combination creates a product that is simultaneously legally sound and technically superior.</p>
          </div>
        </div>
      </div>
    </div>
    <div class="case-card">
      <div class="case-card-head">
        <div class="case-logo">World Liberty Financial / USD1</div>
        <div class="case-sub">Trump-backed Stablecoin & RWA Platform · 2025</div>
      </div>
      <div class="case-card-body">
        <div class="case-stat-row">
          <div class="case-stat"><div class="cs-num">$5B</div><div class="cs-lbl">Market Cap</div></div>
          <div class="case-stat"><div class="cs-num">#5</div><div class="cs-lbl">Largest Stablecoin</div></div>
          <div class="case-stat"><div class="cs-num">9 months</div><div class="cs-lbl">To reach $5B</div></div>
        </div>
        <div class="case-desc">World Liberty Financial (co-founded by Trump's three sons) launched USD1 in March 2025 — 100% backed by US cash and cash equivalents, custodied by BitGo Trust. By early 2026 it reached $5B market cap (largely via Binance partnership), becoming the world's 5th largest stablecoin in under a year. WLF also partnered with Securitize and DarGlobal to tokenize a Trump-branded Maldives resort. The platform is expanding into tokenized commodities, debt instruments, and institutional DeFi.</div>
      </div>
    </div>
    <div class="case-card">
      <div class="case-card-head">
        <div class="case-logo">Ondo Finance</div>
        <div class="case-sub">Institutional DeFi Yield Layer · Multi-Chain</div>
      </div>
      <div class="case-card-body">
        <div class="case-stat-row">
          <div class="case-stat"><div class="cs-num">$2.5B</div><div class="cs-lbl">TVL</div></div>
          <div class="case-stat"><div class="cs-num">OUSG+USDY</div><div class="cs-lbl">Products</div></div>
          <div class="case-stat"><div class="cs-num">4–5%</div><div class="cs-lbl">Yield</div></div>
        </div>
        <div class="case-desc">Ondo Finance solved a critical problem: crypto-native capital sitting in stablecoins earned zero yield. OUSG (tokenized US Treasuries) lets DeFi protocols and institutions park billions in government-backed, yield-bearing instruments without leaving the blockchain. USDY is a yield-bearing stablecoin alternative. Ondo Global Markets extends this to tokenized stocks. A $2.5B TVL in just a few years validates institutional appetite for on-chain yield.</div>
      </div>
    </div>
    <div class="case-card">
      <div class="case-card-head">
        <div class="case-logo">Figure Technologies</div>
        <div class="case-sub">Tokenized Private Credit at Scale · Provenance BC</div>
      </div>
      <div class="case-card-body">
        <div class="case-stat-row">
          <div class="case-stat"><div class="cs-num">$10B</div><div class="cs-lbl">Loans Tokenized</div></div>
          <div class="case-stat"><div class="cs-num">HELOC</div><div class="cs-lbl">Primary Product</div></div>
          <div class="case-stat"><div class="cs-num">Provenance</div><div class="cs-lbl">Blockchain</div></div>
        </div>
        <div class="case-desc">Figure Technologies has tokenized $10 billion in home equity lines of credit (HELOCs) and mortgage-backed assets on its proprietary Provenance Blockchain. This is private credit tokenization at unprecedented scale. Figure demonstrates that the financial plumbing works: originate a loan, tokenize it, sell it to investors globally in minutes. The company is now expanding into auto loans, student loans, and commercial real estate credit.</div>
      </div>
    </div>
    <div class="case-card">
      <div class="case-card-head">
        <div class="case-logo">Pakistan National Strategy</div>
        <div class="case-sub">Sovereign RWA & Digital Asset Architecture · 2025–26</div>
      </div>
      <div class="case-card-body">
        <div class="case-stat-row">
          <div class="case-stat"><div class="cs-num">$2B</div><div class="cs-lbl">Bond Tokenization MOU</div></div>
          <div class="case-stat"><div class="cs-num">Punjab</div><div class="cs-lbl">DAMAC Agreement</div></div>
          <div class="case-stat"><div class="cs-num">PVARA</div><div class="cs-lbl">New Regulator</div></div>
        </div>
        <div class="case-desc">Pakistan executed a sophisticated multi-partner digital asset strategy: signed MOU with World Liberty Financial (USD1) for DeFi infrastructure; signed Binance MOU to tokenize $2B in sovereign bonds and treasury bills; Punjab province signed DAMAC agreement to tokenize government and commercial assets. Pakistan Crypto Council chairs Bilal Bin Saqib serves dual roles as WLF adviser and PVARA chairman. A $7.2T agricultural economy with 37% workforce in farming presents massive crop tokenization potential.</div>
      </div>
    </div>
    <div class="case-card">
      <div class="case-card-head">
        <div class="case-logo">RealT</div>
        <div class="case-sub">Fractional US Real Estate · Ethereum · Since 2019</div>
      </div>
      <div class="case-card-body">
        <div class="case-stat-row">
          <div class="case-stat"><div class="cs-num">1,500+</div><div class="cs-lbl">Properties</div></div>
          <div class="case-stat"><div class="cs-num">65,000+</div><div class="cs-lbl">Investors</div></div>
          <div class="case-stat"><div class="cs-num">$50</div><div class="cs-lbl">Min. Investment</div></div>
        </div>
        <div class="case-desc">RealT pioneered fractional US real estate tokenization on Ethereum. 1,500+ properties tokenized, 65,000+ global investors. Weekly rental yield distributions paid in USDC directly to token holders' wallets — automatically, every Wednesday. A Detroit rental property investor in Nigeria receives yield the same as one in New York. This is the promise of borderless fractional ownership fully realized at consumer scale.</div>
      </div>
    </div>
  </div>
</section>

<div class="divider"></div>

<!-- ===================== MAJOR PLAYERS ===================== -->
<section id="players">
  <div class="sec-tag">Ecosystem</div>
  <h2 class="sec-h2">Major <em>Players</em></h2>
  <p class="sec-sub">The tokenization ecosystem spans over 200 active companies across 9 categories. Here are the most consequential across each layer of the stack.</p>

  <h3 style="font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:400;margin-bottom:16px;color:var(--gold);">End-to-End Tokenization Platforms</h3>
  <div class="player-grid">
    <div class="player-card">
      <div class="player-name">Securitize</div>
      <div class="player-cat">Primary Platform</div>
      <div class="player-detail">$4B+ tokenized. BlackRock BUIDL, WLF partnership. SEC-registered transfer agent.</div>
    </div>
    <div class="player-card">
      <div class="player-name">Tokeny</div>
      <div class="player-cat">Compliance Infrastructure</div>
      <div class="player-detail">Created ERC-3643 standard. 120+ customers. EU-focused institutional platform.</div>
    </div>
    <div class="player-card">
      <div class="player-name">Fireblocks</div>
      <div class="player-cat">Custody & Infrastructure</div>
      <div class="player-detail">$10T+ secured transactions. Enterprise wallet, tokenization, and DeFi infrastructure.</div>
    </div>
    <div class="player-card">
      <div class="player-name">Centrifuge</div>
      <div class="player-cat">RWA Protocol</div>
      <div class="player-detail">$1.3B+ distributed. Private credit, trade finance, and real estate pools.</div>
    </div>
    <div class="player-card">
      <div class="player-name">Taurus (TAURUS)</div>
      <div class="player-cat">Swiss Infrastructure</div>
      <div class="player-detail">Backed by Deutsche Bank. Enterprise-grade custody and tokenization for regulated institutions.</div>
    </div>
    <div class="player-card">
      <div class="player-name">Ctrl Alt Solutions</div>
      <div class="player-cat">UAE Platform</div>
      <div class="player-detail">XRPL-based tokenization. Powers PRYPCO/DAMAC. DLD integration. KYC/AML + secondary market.</div>
    </div>
    <div class="player-card">
      <div class="player-name">DigiFT</div>
      <div class="player-cat">Singapore Exchange</div>
      <div class="player-detail">MAS-licensed digital asset exchange. Tokenized bonds, structured products, and funds.</div>
    </div>
    <div class="player-card">
      <div class="player-name">Polymath/Polymesh</div>
      <div class="player-cat">Security Token Chain</div>
      <div class="player-detail">Purpose-built blockchain for security tokens. Built-in KYC, compliance, and governance.</div>
    </div>
  </div>

  <h3 style="font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:400;margin:32px 0 16px;color:var(--gold);">Institutional Finance & Banks</h3>
  <div class="player-grid">
    <div class="player-card">
      <div class="player-name">BlackRock</div>
      <div class="player-cat">Asset Manager</div>
      <div class="player-detail">$10T AUM. BUIDL fund. Invested in Securitize. The institutional seal of approval for tokenization.</div>
    </div>
    <div class="player-card">
      <div class="player-name">JP Morgan</div>
      <div class="player-cat">Investment Bank</div>
      <div class="player-detail">Onyx blockchain, JPM Coin (intrabank settlement). Tokenized repo and collateral management.</div>
    </div>
    <div class="player-card">
      <div class="player-name">Goldman Sachs</div>
      <div class="player-cat">Investment Bank</div>
      <div class="player-detail">Digital Asset Platform (DAP). Tokenized bonds, structured products. "Debasement trade" gold thesis.</div>
    </div>
    <div class="player-card">
      <div class="player-name">Franklin Templeton</div>
      <div class="player-cat">Asset Manager</div>
      <div class="player-detail">First US-registered mutual fund on blockchain. Benji product $880M+. Stellar + Polygon.</div>
    </div>
    <div class="player-card">
      <div class="player-name">UBS</div>
      <div class="player-cat">Swiss Bank</div>
      <div class="player-detail">$500M tokenized bond. Tokenized money market fund. Active in tokenized fixed income.</div>
    </div>
    <div class="player-card">
      <div class="player-name">Zand Bank (UAE)</div>
      <div class="player-cat">Digital Bank</div>
      <div class="player-detail">UAE's first digital bank. Zand AED stablecoin. Developer-focused banking for tokenization ecosystem.</div>
    </div>
  </div>

  <h3 style="font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:400;margin:32px 0 16px;color:var(--gold);">Blockchain Infrastructure</h3>
  <div class="player-grid">
    <div class="player-card">
      <div class="player-name">Ethereum</div>
      <div class="player-cat">L1 Blockchain</div>
      <div class="player-detail">Dominant platform for institutional RWAs. BlackRock BUIDL, Ondo, MakerDAO all on ETH. EVM standard.</div>
    </div>
    <div class="player-card">
      <div class="player-name">XRP Ledger (Ripple)</div>
      <div class="player-cat">L1 Blockchain</div>
      <div class="player-detail">Native tokenization built-in. PRYPCO/DAMAC. Low fees. Ripple's CBDC solution for central banks.</div>
    </div>
    <div class="player-card">
      <div class="player-name">Solana</div>
      <div class="player-cat">L1 Blockchain</div>
      <div class="player-detail">High-speed, low-cost. Growing institutional RWA presence. Franklin Templeton expanded to SOL 2024.</div>
    </div>
    <div class="player-card">
      <div class="player-name">Avalanche</div>
      <div class="player-cat">L1 Blockchain</div>
      <div class="player-detail">Subnet architecture ideal for permissioned institutional networks. JPMorgan Onyx pilot. KKR fund on Avalanche.</div>
    </div>
    <div class="player-card">
      <div class="player-name">Chainlink</div>
      <div class="player-cat">Oracle + CCIP</div>
      <div class="player-detail">Institutional data standard. CCIP = cross-chain interoperability protocol. JPMorgan-endorsed standard.</div>
    </div>
    <div class="player-card">
      <div class="player-name">MANTRA Chain</div>
      <div class="player-cat">RWA-Native L1</div>
      <div class="player-detail">Purpose-built for RWAs. $1B deal with DAMAC Group (UAE real estate). MAS-licensed node operators.</div>
    </div>
  </div>
</section>

<div class="divider"></div>

<!-- ===================== MONETARY SYSTEM ===================== -->
<section id="monetary">
  <div class="sec-tag">Macro Context</div>
  <h2 class="sec-h2">The Monetary System <em>Shift</em></h2>
  <p class="sec-sub">The rise of tokenization and digital assets is not happening in a vacuum. It is a direct response to structural instabilities in the fiat monetary system that have been building for decades. Understanding the macro context is essential.</p>

  <div class="two-col">
    <div>
      <div class="info-block">
        <h4>The $76 Question</h4>
        <p>The US government spends $76 to physically print $1,000. This includes special cotton-linen paper, 8.9 tons of specialized ink per day, holograms, microprinting, color-shifting features, and security threads. Meanwhile, your phone can send $1,000 anywhere on Earth in 3 seconds. The physical currency complex is the economic equivalent of maintaining ice delivery infrastructure after everyone bought refrigerators.</p>
      </div>
      <div class="info-block">
        <h4>Gold at $5,111 — The Debasement Signal</h4>
        <p>On January 27, 2026, gold crossed $5,111 per ounce, exceeding every major bank's year-end forecast in just 27 days. Central banks purchased 60 tonnes of gold per month for three consecutive years. Goldman Sachs calls it "the debasement trade" — when the institutions that print money buy gold instead, they are voting against their own product.</p>
      </div>
    </div>
    <div>
      <div class="info-block">
        <h4>The Bond Market Paradox</h4>
        <p>US 10-year Treasury yields are RISING despite the Federal Reserve cutting rates. This should not happen. It means the market is demanding higher compensation for holding government debt — a signal of waning confidence in government's ability to repay. Japan's bond market showed similar stress with 40-year yields at their highest since 2007. Japan holds $1.2 trillion in US Treasuries. When Japanese bonds pay 4%, money comes home — and US yields rise further.</p>
      </div>
      <div class="info-block">
        <h4>100% Historical Failure Rate</h4>
        <p>Wikipedia documents 50+ hyperinflation events. Every fiat currency in history has either already collapsed or continues to lose purchasing power. The US dollar has lost 97%+ of its purchasing power since 1913. The question is not whether fiat currencies debase — it is whether tokenized alternatives (stablecoins, CBDCs, tokenized gold) can provide a more stable foundation for the next global monetary system.</p>
      </div>
    </div>
  </div>

  <h3 style="font-family:'Cormorant Garamond',serif;font-size:26px;font-weight:400;margin:40px 0 20px;">What Wall Street Is Saying</h3>
  <div class="three-col">
    <div class="info-block">
      <h4>Goldman Sachs</h4>
      <p>"Gold's rally reflects the debasement trade — a hedge against currency devaluation and fiscal instability. The structural bid from central banks will continue." Goldman raised their gold target to $5,400 by December 2026. It was nearly reached in January 2026.</p>
    </div>
    <div class="info-block">
      <h4>JP Morgan</h4>
      <p>"Gold now serves a dual role — both as an inflation hedge AND as an alternative to long-term Treasuries. Investors are repositioning for a world where government bonds no longer offer safety." JP Morgan Asset Management, 2026.</p>
    </div>
    <div class="info-block">
      <h4>BlackRock</h4>
      <p>"We are underweight long-term US Treasuries. The market is demanding higher compensation for holding government debt amid ballooning deficits and political dysfunction." The world's largest asset manager is reducing exposure to US government debt — while simultaneously building the infrastructure for tokenized alternatives.</p>
    </div>
  </div>
</section>

<div class="divider"></div>

<!-- ===================== PAKISTAN / EMERGING MARKETS ===================== -->
<section id="pakistan">
  <div class="sec-tag">Emerging Markets</div>
  <h2 class="sec-h2">Emerging Markets & the <em>New Frontier</em></h2>
  <p class="sec-sub">Tokenization's greatest untapped opportunity is not in New York or London — it is in economies with massive real assets, large unbanked populations, and governments bold enough to move first.</p>

  <div class="country-banner">
    <div class="country-flag">🇵🇰</div>
    <div class="country-info">
      <h3>Pakistan — A National Digital Asset Strategy in Motion</h3>
      <p>Multiple MOU signings, a new crypto regulator (PVARA), partnerships with Binance, World Liberty Financial, and DAMAC — Pakistan is building one of the world's most ambitious sovereign digital asset architectures.</p>
    </div>
  </div>

  <div class="two-col">
    <div>
      <div class="info-block">
        <h4>World Liberty Financial MOU (January 2026)</h4>
        <p>Pakistan's Ministry of Finance signed an MOU with SC Financial Technologies (affiliated with World Liberty Financial). CEO Zach Witkoff — son of US Special Envoy Steve Witkoff — visited Islamabad to sign. Signatories included Pakistan's Finance Minister, State Bank Governor, and SECP Chairman. The deal brings USD1 stablecoin infrastructure and DeFi capabilities to Pakistan.</p>
      </div>
      <div class="info-block">
        <h4>Binance MOU — $2B Sovereign Bond Tokenization</h4>
        <p>Pakistan signed an MOU with Binance (world's largest crypto exchange) to tokenize up to $2 billion in sovereign bonds, treasury bills, and commodity reserves. Former Binance CEO Changpeng Zhao (CZ) serves as adviser to Pakistan Crypto Council. Binance and HTX received no-objection certificates to operate in Pakistan.</p>
      </div>
      <div class="info-block">
        <h4>DAMAC / Punjab Government Agreement</h4>
        <p>DAMAC Co-Managing Director Amira Sajwani (CEO of PRYPCO) and delegation visited Islamabad and Lahore. Punjab — Pakistan's agricultural and economic heartland — signed a formal agreement with DAMAC to accelerate tokenization of government and commercial assets. Chief Minister Maryam declared Punjab would be "Pakistan's gateway for foreign direct investment in digital assets."</p>
      </div>
    </div>
    <div>
      <div class="info-block">
        <h4>The Agricultural Tokenization Opportunity</h4>
        <p>Pakistan is among the world's largest producers of wheat, rice, cotton, sugarcane, and mangoes. Agriculture employs 37% of the workforce, contributes 20% of GDP. Smallholder farmers are chronically underfinanced — banks don't accept crops as collateral. Crop tokenization converts physical harvests into digital tokens: farmers gain working capital before harvest; global investors get commodity-backed digital assets. Solar revolution creating 10GW+ of distributed energy — itself tokenizable as carbon credits and energy assets.</p>
      </div>
      <div class="info-block">
        <h4>The Four-Layer National Architecture</h4>
        <p><strong>Layer 1:</strong> USD1 / DeFi infrastructure (World Liberty Financial MOU) — digital dollar settlement layer. <strong>Layer 2:</strong> Sovereign bonds and commodity tokenization (Binance MOU) — government debt on-chain. <strong>Layer 3:</strong> Real estate and commercial asset tokenization (DAMAC/Punjab) — private sector assets. <strong>Layer 4:</strong> Agricultural commodity tokenization (crop-backed digital assets) — base economy assets.</p>
      </div>
    </div>
  </div>

  <h3 style="font-family:'Cormorant Garamond',serif;font-size:26px;font-weight:400;margin:40px 0 20px;">Other Emerging Market Opportunities</h3>
  <div class="three-col">
    <div class="card">
      <div class="card-icon">🏙️</div>
      <div class="card-h">UAE / Dubai</div>
      <div class="card-p">VARA regulatory framework, ADGM financial center, PRYPCO tokenized real estate, Digital Dirham CBDC, Zand Bank AED stablecoin. Most advanced regulatory ecosystem outside Singapore. $800B+ real estate market ideal for tokenization.</div>
      <span class="card-tag tag-gold">Most Active MENA Hub</span>
    </div>
    <div class="card">
      <div class="card-icon">🌴</div>
      <div class="card-h">Southeast Asia</div>
      <div class="card-p">Singapore (MAS licensing, Project Orchid), Thailand (BOT CBDC, tokenized bonds), Vietnam, Philippines (remittance corridors). ASEAN cross-border remittance via stablecoin is $100B+ opportunity annually.</div>
      <span class="card-tag tag-blue">Remittance + Trade Finance</span>
    </div>
    <div class="card">
      <div class="card-icon">🌍</div>
      <div class="card-h">Africa</div>
      <div class="card-p">60%+ unbanked population, massive commodity reserves (gold, copper, cobalt), growing mobile money infrastructure. Tokenized agricultural commodities, land registry on-chain, and stablecoin remittance corridors represent leapfrog opportunities worth trillions.</div>
      <span class="card-tag tag-green">Leapfrog Potential</span>
    </div>
  </div>
</section>

<div class="divider"></div>

<!-- FINTECH & BLOCKCHAIN -->
<section id="fintech" style="padding-top:60px;">
  <div class="sec-tag">Technology Context</div>
  <h2 class="sec-h2">Fintech, Blockchain & the <em>New Stack</em></h2>
  <p class="sec-sub">Blockchain is the infrastructure layer enabling tokenization. But it exists within a broader fintech revolution that is reshaping every aspect of financial services — payments, lending, identity, compliance, and market infrastructure.</p>

  <div class="three-col">
    <div class="info-block">
      <h4>Blockchain vs. Traditional Finance Infrastructure</h4>
      <p>SWIFT processes 42 million messages per day, takes 2–5 business days for cross-border settlement, and costs $25–50 per transaction. A blockchain transfer settles in seconds, costs pennies, and operates 24/7/365. The existing financial system is not broken — it is simply built on 1970s infrastructure that blockchain makes obsolete.</p>
    </div>
    <div class="info-block">
      <h4>Smart Contracts — Automated Finance</h4>
      <p>A smart contract is code that executes automatically when conditions are met. A tokenized mortgage smart contract automatically distributes monthly payments to 10,000 global token holders, calculates taxes, enforces transfer restrictions, and updates the cap table — all in milliseconds, without a bank, lawyer, or accountant.</p>
    </div>
    <div class="info-block">
      <h4>DeFi — Decentralized Finance</h4>
      <p>DeFi protocols offer lending, borrowing, trading, and yield generation without banks or brokers. Aave, Compound, Uniswap, and Curve collectively manage $50B+ in assets. As RWAs come on-chain, DeFi becomes the liquidity layer for institutional finance — not just crypto speculation.</p>
    </div>
  </div>

  <h3 style="font-family:'Cormorant Garamond',serif;font-size:26px;font-weight:400;margin:40px 0 20px;">Investment Considerations & Risk Framework</h3>
  <div class="risk-bars">
    <div style="margin-bottom:8px;font-size:12px;color:var(--text-dim);text-transform:uppercase;letter-spacing:0.8px;">Asset Class Risk Profile</div>
    <div class="risk-row"><div class="risk-name">Tokenized Treasuries</div><div class="risk-bar-bg"><div class="risk-bar-fill" style="width:15%;background:var(--green);"></div></div><div class="risk-val">Low</div></div>
    <div class="risk-row"><div class="risk-name">Fiat Stablecoins</div><div class="risk-bar-bg"><div class="risk-bar-fill" style="width:20%;background:var(--green);"></div></div><div class="risk-val">Low</div></div>
    <div class="risk-row"><div class="risk-name">Tokenized Real Estate</div><div class="risk-bar-bg"><div class="risk-bar-fill" style="width:45%;background:var(--gold);"></div></div><div class="risk-val">Med</div></div>
    <div class="risk-row"><div class="risk-name">Tokenized Private Credit</div><div class="risk-bar-bg"><div class="risk-bar-fill" style="width:55%;background:var(--gold);"></div></div><div class="risk-val">Med-H</div></div>
    <div class="risk-row"><div class="risk-name">Algo Stablecoins</div><div class="risk-bar-bg"><div class="risk-bar-fill" style="width:85%;background:var(--red);"></div></div><div class="risk-val">High</div></div>
    <div class="risk-row"><div class="risk-name">Cryptocurrency</div><div class="risk-bar-bg"><div class="risk-bar-fill" style="width:90%;background:var(--red);"></div></div><div class="risk-val">Very High</div></div>
  </div>

  <div class="info-block">
    <h4>⚠️ Critical Due Diligence: Secondary Market Liquidity</h4>
    <p>A February 2026 academic study of $25B+ in tokenized RWAs found that despite explosive issuance growth, most tokenized assets exhibit critically low secondary-market depth. The technology works — but liquidity does not yet follow automatically. 53.8% of RWA issuers tokenize for capital formation, not liquidity. Before investing in any tokenized asset, evaluate: (1) Number of whitelisted wallets eligible to trade; (2) Daily trading volume vs. total supply; (3) Whether exit mechanism is genuine secondary market or issuer redemption; (4) Chain diversification of the asset; (5) Legal jurisdiction for dispute resolution.</p>
  </div>
</section>

<!-- ===================== DISCLAIMER ===================== -->
<div style="background:var(--bg3);border-top:1px solid var(--border);border-bottom:1px solid var(--border);padding:48px 24px;margin-top:80px;" id="disclaimer">
  <div style="max-width:960px;margin:0 auto;">
    <div style="display:flex;align-items:flex-start;gap:20px;">
      <div style="font-size:28px;flex-shrink:0;margin-top:4px;">⚠️</div>
      <div>
        <div style="font-size:10px;text-transform:uppercase;letter-spacing:2px;color:var(--gold);margin-bottom:10px;font-weight:600;">Important Disclaimer — Please Read</div>
        <h3 style="font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:500;color:var(--text);margin-bottom:16px;">Educational Content Only · Not Financial, Legal, or Investment Advice</h3>
        <p style="font-size:13px;color:var(--text-muted);line-height:1.8;margin-bottom:12px;">
          <strong style="color:var(--text);">FutureTokenization.com</strong> is a purely educational platform. All content published on this website — including articles, case studies, market data, analysis, comparisons, project descriptions, regulatory summaries, and AI-generated responses — is intended solely for general informational and educational purposes.
        </p>
        <p style="font-size:13px;color:var(--text-muted);line-height:1.8;margin-bottom:12px;">
          Nothing on this website constitutes, or should be interpreted as, <strong style="color:var(--text);">financial advice, investment advice, legal advice, tax advice, or any form of professional recommendation</strong>. We do not endorse, recommend, or promote any specific investment, token, platform, protocol, asset, company, product, or financial instrument. References to companies, products, or market figures are for educational illustration only.
        </p>
        <p style="font-size:13px;color:var(--text-muted);line-height:1.8;margin-bottom:12px;">
          <strong style="color:var(--text);">Tokenized assets, stablecoins, digital assets, and related financial instruments carry significant risks</strong>, including but not limited to: loss of principal, smart contract vulnerabilities, regulatory changes, liquidity risk, counterparty risk, and technological failure. Past performance of any asset class discussed herein is not indicative of future results. Market data and statistics cited are based on publicly available sources at the time of publication and may not reflect current conditions.
        </p>
        <p style="font-size:13px;color:var(--text-muted);line-height:1.8;margin-bottom:12px;">
          <strong style="color:var(--text);">AI-generated responses</strong> from the Digital Czar chatbot are provided for educational purposes only. They do not constitute advice of any kind. The AI may make errors, provide outdated information, or mischaracterize complex financial, legal, or regulatory matters. Always verify information independently.
        </p>
        <p style="font-size:13px;color:var(--text-muted);line-height:1.8;margin-bottom:12px;">
          Before making any investment decision, you should <strong style="color:var(--text);">consult a qualified financial adviser, legal counsel, and/or tax professional</strong> who understands your individual circumstances, risk tolerance, and jurisdiction-specific regulatory requirements.
        </p>
        <p style="font-size:13px;color:var(--text-muted);line-height:1.8;">
          By accessing and using FutureTokenization.com, you acknowledge that you have read, understood, and agree to this disclaimer. FutureTokenization.com, its owners, editors, contributors, and technology providers accept no liability whatsoever for any financial loss, damage, or consequence arising from reliance on content published on this platform.
        </p>
      </div>
    </div>
  </div>
</div>

<!-- ===================== FOOTER ===================== -->
<div style="background:var(--bg2);border-top:1px solid var(--border);padding:48px 24px;">
  <div style="max-width:1400px;margin:0 auto;">
    <div style="display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:40px;margin-bottom:48px;">
      <div>
        <div style="font-family:'Cormorant Garamond',serif;font-size:24px;font-weight:600;color:var(--gold);margin-bottom:4px;">FutureTokenization.com</div>
        <div style="font-size:11px;color:var(--text-dim);margin-bottom:12px;text-transform:uppercase;letter-spacing:1px;">The World's Digital Asset Codex</div>
        <p style="font-size:13px;color:var(--text-muted);line-height:1.7;max-width:280px;">The world's comprehensive educational platform for tokenization, real-world assets, stablecoins, and the digital transformation of global finance. All content is educational only — not financial advice.</p>
      </div>
      <div>
        <div style="font-size:11px;text-transform:uppercase;letter-spacing:1px;color:var(--text-dim);margin-bottom:12px;">Learn</div>
        <div style="display:flex;flex-direction:column;gap:8px;">
          <a href="#tokenization" style="font-size:13px;color:var(--text-muted);text-decoration:none;">Tokenization Basics</a>
          <a href="#rwa-catalyst" style="font-size:13px;color:var(--text-muted);text-decoration:none;">The RWA Catalyst</a>
          <a href="#rwa" style="font-size:13px;color:var(--text-muted);text-decoration:none;">Real World Assets</a>
          <a href="#stablecoins" style="font-size:13px;color:var(--text-muted);text-decoration:none;">Stablecoins</a>
          <a href="#cbdc" style="font-size:13px;color:var(--text-muted);text-decoration:none;">CBDCs</a>
        </div>
      </div>
      <div>
        <div style="font-size:11px;text-transform:uppercase;letter-spacing:1px;color:var(--text-dim);margin-bottom:12px;">Research</div>
        <div style="display:flex;flex-direction:column;gap:8px;">
          <a href="#case-studies" style="font-size:13px;color:var(--text-muted);text-decoration:none;">Case Studies</a>
          <a href="#players" style="font-size:13px;color:var(--text-muted);text-decoration:none;">Major Players</a>
          <a href="#monetary" style="font-size:13px;color:var(--text-muted);text-decoration:none;">Monetary System</a>
          <a href="#pakistan" style="font-size:13px;color:var(--text-muted);text-decoration:none;">Emerging Markets</a>
        </div>
      </div>
      <div>
        <div style="font-size:11px;text-transform:uppercase;letter-spacing:1px;color:var(--text-dim);margin-bottom:12px;">Legal</div>
        <div style="display:flex;flex-direction:column;gap:8px;">
          <a href="#disclaimer" style="font-size:13px;color:var(--text-muted);text-decoration:none;">Disclaimer</a>
          <span style="font-size:13px;color:var(--text-muted);">Educational Only</span>
          <span style="font-size:13px;color:var(--text-muted);">Not Financial Advice</span>
          <span style="font-size:13px;color:var(--text-muted);">Not Legal Advice</span>
        </div>
      </div>
    </div>
    <div style="border-top:1px solid var(--border);padding-top:24px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;">
      <p style="font-size:12px;color:var(--text-dim);">© 2026 FutureTokenization.com. All content is for educational purposes only. Not financial advice.</p>
      <p style="font-size:12px;color:var(--text-dim);">Data sourced from RWA.xyz, BIS, Chainlink, academic papers, and public institutional research.</p>
    </div>
  </div>
</div>

<!-- ===================== AI CHATBOT ===================== -->`;

export default function Home() {
  const [lang, setLang]           = useState('en');
  const [langOpen, setLangOpen]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const [chatOpen, setChatOpen]   = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const chatHistoryRef = useRef([]);
  const messagesEndRef = useRef(null);

  const t = T[lang] || T['en'];
  const langMeta = LANGUAGES.find(l => l.code === lang) || LANGUAGES[0];

  const [messages, setMessages] = useState([
    { role: 'ai', text: T['en'].chatWelcome }
  ]);

  // When language changes, update welcome message & document dir
  useEffect(() => {
    setMessages([{ role: 'ai', text: t.chatWelcome }]);
    chatHistoryRef.current = [];
    if (typeof document !== 'undefined') {
      document.documentElement.dir = langMeta.dir;
      document.documentElement.lang = lang;
    }
  }, [lang]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  // Wire the HTML hamburger button to React state
  useEffect(() => {
    const btn = document.getElementById('hamburger-btn');
    if (btn) {
      btn.style.display = 'flex';
      btn.onclick = () => setMenuOpen(o => !o);
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.1 }
    );
    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
    const handleScroll = () => {
      const sections = document.querySelectorAll('section[id], div[id="home"]');
      const navLinks = document.querySelectorAll('.nav-links > li > a');
      let current = '';
      sections.forEach(s => { if (window.scrollY >= s.offsetTop - 100) current = s.id; });
      navLinks.forEach(a => {
        a.classList.remove('active');
        if (a.getAttribute('href') === '#' + current) a.classList.add('active');
      });
    };
    window.addEventListener('scroll', handleScroll);
    return () => { observer.disconnect(); window.removeEventListener('scroll', handleScroll); };
  }, []);

  async function sendMessage(userMsg) {
    if (!userMsg.trim()) return;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsThinking(true);
    setInputValue('');
    const history = chatHistoryRef.current;
    history.push({ role: 'user', content: userMsg });
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history, language: lang }),
      });
      const data = await res.json();
      const reply = data.reply || t.chatError;
      history.push({ role: 'assistant', content: reply });
      chatHistoryRef.current = history;
      setMessages(prev => [...prev, { role: 'ai', text: reply }]);
    } catch {
      setMessages(prev => [...prev, { role: 'ai', text: t.chatError }]);
    } finally {
      setIsThinking(false);
    }
  }

  return (
    <>
      <Head>
        <title>FutureTokenization.com — The World\'s Digital Asset Codex</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div dangerouslySetInnerHTML={{ __html: BODY_HTML }} />

      {/* ── HAMBURGER ── */}
      <button
        onClick={() => setMenuOpen(o => !o)}
        aria-label="Menu"
        style={{
          position:'fixed', bottom:'90px', right:'16px', zIndex:99999,
          display:'flex', alignItems:'center', justifyContent:'center',
          width:'52px', height:'52px',
          background:'#d4a843',
          border:'none', borderRadius:'50%',
          cursor:'pointer', fontSize:'24px', color:'#000',
          boxShadow:'0 4px 20px rgba(0,0,0,0.8)',
        }}
      >
        {menuOpen ? '✕' : '☰'}
      </button>

      <div className={`mobile-nav${menuOpen ? ' open' : ''}`} onClick={() => setMenuOpen(false)}>
        <div className="mobile-nav-label">Navigation</div>
        <a href="#home">Home</a>
        <div className="mobile-nav-label">Tokenization</div>
        <a href="#tokenization" className="sub">What is Tokenization</a>
        <a href="#how-it-works" className="sub">How It Works</a>
        <a href="#tech-stack" className="sub">Technology Stack</a>
        <a href="#timeline" className="sub">History &amp; Timeline</a>
        <div className="mobile-nav-label">Real World Assets</div>
        <a href="#rwa" className="sub">Overview</a>
        <a href="#treasuries" className="sub">Treasuries &amp; Bonds</a>
        <a href="#real-estate" className="sub">Real Estate</a>
        <a href="#private-credit" className="sub">Private Credit</a>
        <a href="#commodities" className="sub">Commodities &amp; Gold</a>
        <div className="mobile-nav-label">More</div>
        <a href="#stablecoins">Stablecoins</a>
        <a href="#cbdc">CBDCs</a>
        <a href="#case-studies">Case Studies</a>
        <a href="#players">Major Players</a>
        <a href="#monetary">Monetary System</a>
        <a href="#pakistan">Emerging Markets</a>
        <button className="mobile-ask" onClick={() => { setChatOpen(true); setMenuOpen(false); }}>
          {t.ask}
        </button>
      </div>

      {/* ── LANGUAGE SWITCHER ── */}
      <div className='lang-switcher' style={{position:'fixed',top:'9px',right:'66px',zIndex:'1100',display:'flex'}}>
        <button
          onClick={() => setLangOpen(o => !o)}
          style={{
            background:'var(--bg2)', border:'1px solid var(--border)',
            color:'var(--text)', padding:'6px 10px', borderRadius:'var(--radius)',
            cursor:'pointer', fontSize:'13px', display:'flex', alignItems:'center', gap:'6px'
          }}
        >
          <span>{langMeta.flag}</span>
          <span style={{display:'none'}} className="lang-code">{langMeta.code.toUpperCase()}</span>
          <span style={{fontSize:'10px',opacity:0.6}}>▼</span>
        </button>

        {langOpen && (
          <div style={{
            position:'absolute', top:'38px', right:'0',
            background:'var(--bg2)', border:'1px solid var(--border)',
            borderRadius:'var(--radius)', width:'200px',
            maxHeight:'320px', overflowY:'auto',
            boxShadow:'0 8px 32px rgba(0,0,0,0.5)', zIndex:'999'
          }}>
            {LANGUAGES.map(l => (
              <button key={l.code} onClick={() => { setLang(l.code); setLangOpen(false); }}
                style={{
                  display:'flex', alignItems:'center', gap:'10px',
                  width:'100%', padding:'10px 14px',
                  background: lang === l.code ? 'var(--gold-dim)' : 'transparent',
                  border:'none', borderBottom:'1px solid var(--border2)',
                  color: lang === l.code ? 'var(--gold)' : 'var(--text-muted)',
                  cursor:'pointer', fontSize:'13px', textAlign:'left',
                  transition:'background 0.15s',
                }}
              >
                <span style={{fontSize:'18px'}}>{l.flag}</span>
                <span>{l.name}</span>
                {lang === l.code && <span style={{marginLeft:'auto',color:'var(--gold)'}}>✓</span>}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── DIGITAL CZAR CHATBOT ── */}
      <div id="chat-widget">
        <button id="chat-toggle" onClick={() => setChatOpen(o => !o)} aria-label="Open Digital Czar">🤖</button>

        {chatOpen && (
          <div id="chat-panel" className="open" dir={langMeta.dir}>
            <div id="chat-header">
              <div className="chat-avatar">A</div>
              <div>
                <div className="chat-title">{t.chatTitle}</div>
                <div className="chat-status">{t.chatStatus}</div>
              </div>
              <button id="chat-close" onClick={() => setChatOpen(false)}>×</button>
            </div>

            <div id="chat-messages">
              {messages.map((msg, i) => (
                <div key={i}
                  className={msg.role === 'user' ? 'msg msg-user' : 'msg msg-ai'}
                  dangerouslySetInnerHTML={{ __html: msg.text }}
                />
              ))}
              {isThinking && <div className="msg msg-thinking">{t.chatThinking}</div>}
              <div ref={messagesEndRef} />
            </div>

            <div className="quick-asks">
              {t.quickAsks.map((q, i) => (
                <button key={i} className="qa-btn" onClick={() => sendMessage(q)}>{q}</button>
              ))}
            </div>

            <div id="chat-input-row">
              <input
                type="text"
                placeholder={t.chatPlaceholder}
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage(inputValue)}
                dir={langMeta.dir}
              />
              <button id="chat-send" onClick={() => sendMessage(inputValue)}>➤</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
