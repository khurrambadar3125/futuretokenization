import Head from 'next/head';
import { useRef, useState, useEffect } from 'react';
import { LANGUAGES, T } from '../lib/translations';

const BODY_HTML = `<!-- NAV -->
<nav>
  <div class="nav-inner">
    <div class="logo" onclick="window.location.href='/'">Future<span>Tokenization</span></div>
    <ul class="nav-links">
      <li><a href="/">Home</a></li>
      <li>
        <a href="#pk-strategy" class="active">Pakistan ▾</a>
        <div class="dropdown">
          <a href="#pk-strategy">Sovereign Strategy</a>
          <a href="#pk-custody">Custody Architecture</a>
          <a href="#pk-governance">Governance &amp; Risk Appetite</a>
          <a href="#pk-assurance">Audit &amp; Assurance</a>
          <a href="#pk-aml">AML / CFT</a>
          <a href="#pk-sukuk">Tokenized Sukuk &amp; Bonds</a>
          <a href="#pk-glossary">Glossary</a>
        </div>
      </li>
      <li>
        <a href="/directory">VARA Directory ▾</a>
        <div class="dropdown">
          <a href="/directory">Licensed Providers</a>
          <a href="/validate">Validate a Licence</a>
          <a href="/investors">For Investors</a>
          <a href="/providers">For Providers</a>
        </div>
      </li>
      <li><a href="/#tokenization">Tokenization</a></li>
      <li><a href="/#rwa">Real World Assets</a></li>
      <li><a href="/#stablecoins">Stablecoins</a></li>
      <li><a href="/#cbdc">CBDCs</a></li>
      <li><a href="/#case-studies">Case Studies</a></li>
      <li><a href="/#pakistan">Emerging Markets</a></li>
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
<section id="pk-strategy" style="padding-top:120px;">
  <div class="sec-tag">Pakistan Codex</div>
  <h2 class="sec-h2">Pakistan — <em>Sovereign Digital Asset Infrastructure</em></h2>
  <p class="sec-sub">From announcement to architecture. This section goes beneath the headlines: how a state actually custodies digital assets, how a sovereign custodian is governed, what the audit machinery looks like, and why tokenized sukuk may be Pakistan's most natural on-chain instrument. Educational only — not financial, legal, or investment advice.</p>

  <div class="country-banner">
    <div class="country-flag">🇵🇰</div>
    <div class="country-info">
      <h3>The Strategy in One Paragraph</h3>
      <p>Pakistan's digital-asset build-out runs on five layers: USD1/DeFi rails (World Liberty Financial MOU), sovereign bond tokenization (Binance MOU, up to $2B), real-estate and commercial assets (DAMAC/Punjab), agricultural commodities — and beneath them all, <strong>Layer 0: the Strategic Digital Wallet Company (SDWC)</strong>, a wholly government-owned custodian incorporated October 2025 under the SOE Act 2023. Layers 1–4 are announcement-stage MOUs and pilots; Layer 0 is the only layer that exists as an incorporated legal entity. <a href="/#pakistan" style="color:var(--gold);">See the full five-layer architecture on the home codex →</a></p>
    </div>
  </div>

  <div class="two-col">
    <div class="info-block">
      <h4>Why Custody Is the Story</h4>
      <p>Every MOU in Pakistan's strategy answers "what gets tokenized and with whom." None answered "who holds the keys" — until the SDWC's incorporation. In digital assets, custody is not back-office plumbing: whoever controls the private keys controls the asset, full stop. A state that cannot custody keys safely cannot hold a Bitcoin reserve, issue tokenized bonds, or run digital currency rails. That is why the least glamorous entity in the stack is strategically the most important one.</p>
    </div>
    <div class="info-block">
      <h4>Reality Check — Kept Honest</h4>
      <p>The Strategic Bitcoin Reserve remains announcement-stage: holdings are seized/forfeited assets in state custody, no funded balance sheet has been disclosed, and the State Bank of Pakistan maintains a publicly cautious line. Pakistan's 2026 story is infrastructure and governance, not yet accumulation. The scaffolding went up before the assets went in — which, for long-term credibility, is the right order.</p>
    </div>
  </div>
</section>

<div class="divider"></div>

<!-- ===================== CUSTODY ARCHITECTURE ===================== -->
<section id="pk-custody">
  <div class="sec-tag">Education · Custody</div>
  <h2 class="sec-h2">Sovereign Custody <em>Architecture</em></h2>
  <p class="sec-sub">What it actually takes to hold digital assets at state scale. The reference architecture below is drawn from publicly documented practice at regulated digital-asset custodians worldwide — it is illustrative education, not the internal policy of the SDWC or any other entity.</p>

  <div class="three-col">
    <div class="card">
      <div class="card-icon">🧊</div>
      <div class="card-h">Cold Storage</div>
      <div class="card-p">Private keys generated and held on devices that never touch the internet — "air-gapped." Because the keys are physically unreachable from the network, remote theft of cold-stored assets is close to impossible. The trade-off is speed: moving cold assets is deliberately slow and ceremonial. Sovereign practice keeps the overwhelming share of holdings cold, with only a small operational float in warmer tiers.</div>
      <span class="card-tag tag-gold">Default for Reserves</span>
    </div>
    <div class="card">
      <div class="card-icon">🔑</div>
      <div class="card-h">Multi-Signature</div>
      <div class="card-p">No single key — and therefore no single person — can move assets. An M-of-N scheme (for example, "no fewer than 3-of-5") requires multiple independent key-holders to approve every movement. Well-written custody policy sets multi-sig as a <em>floor</em>, not an architecture: whether it is implemented as on-chain multi-sig, HSM-based signing, or MPC is an implementation decision that can evolve with technology.</div>
      <span class="card-tag tag-blue">No Single Point of Failure</span>
    </div>
    <div class="card">
      <div class="card-icon">🛡️</div>
      <div class="card-h">HSMs &amp; MPC</div>
      <div class="card-p">Hardware Security Modules are tamper-resistant devices that generate and use keys without ever exposing them — the same class of hardware that protects card networks and CBDC pilots. Multi-Party Computation splits a key into shares so it is never assembled in one place at all. Both satisfy the same principle: no complete key on any single machine, ever.</div>
      <span class="card-tag tag-green">Key Isolation</span>
    </div>
  </div>

  <div class="two-col" style="margin-top:24px;">
    <div>
      <div class="info-block">
        <h4>Key Ceremony Governance</h4>
        <p>Keys for sovereign holdings are not created at a desk. A <strong>key ceremony</strong> is a scripted, witnessed, recorded event: independent witnesses attend, every step follows a pre-approved runbook, hardware provenance is verified, key shares are distributed to separately accountable holders, and the entire ceremony is logged and auditable. The ceremony is what turns "we generated keys" into "the state can prove how its keys were generated, by whom, and under whose eyes."</p>
      </div>
      <div class="info-block">
        <h4>Geographic Separation &amp; Disaster Recovery</h4>
        <p>Key shares and backups are held at physically separate, independently secured sites, so that no single fire, flood, or targeted attack can destroy or capture a quorum. Absolute rules break in disasters — which is why mature policy defines in advance, at board level, how recovery works when a site is lost, rather than improvising in a crisis.</p>
      </div>
    </div>
    <div>
      <div class="info-block">
        <h4>Segregation of Duties</h4>
        <p>The person who initiates a transaction is never the person who approves it, and neither of them reconciles the books. Custody failures in every era of finance — long before blockchain — trace back to one person holding too many links of the chain. Digital assets raise the stakes because transfers are irreversible: there is no chargeback on a blockchain.</p>
      </div>
      <div class="info-block">
        <h4>Hot Wallets — Capped and Rare</h4>
        <p>A hot wallet is any wallet whose keys live on an internet-connected system. Operationally necessary for settlement rails, but every unit in a hot wallet is exposed to remote attack. Reference practice caps hot-wallet balances at a small fraction of holdings, replenished from cold storage through the same multi-approval discipline as any other movement.</p>
      </div>
      <div class="info-block">
        <h4>Commingling — Never</h4>
        <p>State assets, client assets, and operational funds live in separate wallets under separate controls. Commingling is how exchange collapses became customer losses. For a sovereign custodian, segregation is not just prudence — it is what makes proof of reserves meaningful at all.</p>
      </div>
    </div>
  </div>
</section>

<div class="divider"></div>

<!-- ===================== GOVERNANCE & RISK APPETITE ===================== -->
<section id="pk-governance">
  <div class="sec-tag">Education · Governance</div>
  <h2 class="sec-h2">Governing a Sovereign Custodian — <em>Oversight, Not Management</em></h2>
  <p class="sec-sub">The board question is never "which wallet software?" It is "what risk are we willing to take, who is allowed to move what, and how do we know?" The framework below reflects published corporate-governance and custody practice — illustrative, not any entity's internal policy.</p>

  <div class="two-col">
    <div class="info-block">
      <h4>The Dividing Line</h4>
      <p><strong>The board sets custody policy and risk appetite, approves strategy, and holds management accountable against attested metrics. It does not operate.</strong> Management proposes the architecture (HSM vs MPC, which chains, which venues); the board challenges it with independent advice and approves or rejects. This division is what lets a custodian survive technology change: policy sets floors and tolerances, and implementations evolve beneath them.</p>
    </div>
    <div class="info-block">
      <h4>Risk Appetite — the Board's Own Language</h4>
      <p>Risk appetite is how much risk the board authorizes management to take, stated in advance and in writing. A reference appetite for a sovereign custodian: <strong>zero tolerance</strong> — single-key custody, unilateral asset movement, commingling of funds; <strong>minimal tolerance</strong> — hot-wallet exposure, tightly capped; <strong>accepted risk</strong> — market price volatility, because a custodian safeguards assets rather than trades them: <em>a custodian, not a trading house</em>.</p>
    </div>
  </div>

  <div class="info-block" style="margin-top:10px;">
    <h4>The Three-Tier Authorization Matrix</h4>
    <p style="margin-bottom:10px;">Every movement of assets maps to a tier, agreed by the board before the first transaction ever occurs:</p>
    <p style="margin-bottom:10px;"><strong>Tier 1 — Routine operations.</strong> Small, pre-defined, within standing limits (e.g. replenishing an operational wallet). Executed by management under dual control, reported upward.</p>
    <p style="margin-bottom:10px;"><strong>Tier 2 — Significant movements.</strong> Above routine limits or outside standing patterns. Requires senior-management dual approval plus risk-function sign-off before execution.</p>
    <p style="margin-bottom:10px;"><strong>Tier 3 — Reserve movements.</strong> Any movement of reserve holdings requires a <strong>full board resolution</strong> — deliberate, minuted, and slow by design. Government-directed transactions route through this tier from day one.</p>
    <p><strong>Emergency freeze authority</strong> sits alongside the matrix: a pre-agreed power to halt all movements instantly when compromise is suspected — because in an irreversible-settlement world, the only good response to doubt is stop.</p>
  </div>

  <div class="two-col" style="margin-top:10px;">
    <div class="info-block">
      <h4>Why Pakistan's Wrapper Is Unusual</h4>
      <p>The SDWC was born under the SOE Act 2023 — enacted under IMF programme conditions — which requires majority-independent boards vetted through fit-and-proper criteria under Schedule IV, with appointments routed through a Board Nomination Committee and a central register held by the Finance Division. Most sovereign Bitcoin experiments (El Salvador, Bhutan) built the asset position first and improvised governance afterward. Pakistan has the governance statute in place before the balance sheet exists — for institutional observers, the single most credible feature of the strategy. <a href="/#pakistan" style="color:var(--gold);">Full governance-wrapper analysis →</a></p>
    </div>
    <div class="info-block">
      <h4>The Biggest Risks — Named Plainly</h4>
      <p>For any sovereign custodian, the two risks that dwarf all others are <strong>custody failure</strong> (lost or stolen keys — irreversible by nature) and <strong>governance ambiguity</strong> (unclear regulatory lanes between the central bank and the virtual-asset regulator). The mitigations are exactly the disciplines on this page: cold storage, multi-sig with key-ceremony governance, independent audits — and a clear regulatory lane agreed before scaling, not discovered during a crisis.</p>
    </div>
  </div>
</section>

<div class="divider"></div>

<!-- ===================== AUDIT & ASSURANCE ===================== -->
<section id="pk-assurance">
  <div class="sec-tag">Education · Assurance</div>
  <h2 class="sec-h2">The Trust Machinery — <em>Audit Trails &amp; Proof</em></h2>
  <p class="sec-sub">Custody claims are worthless unless they can be independently verified. This is the machinery that turns "trust us" into "check for yourself."</p>

  <div class="three-col">
    <div class="card">
      <div class="card-icon">📜</div>
      <div class="card-h">Audit Trails</div>
      <div class="card-p">Every key ceremony, approval, movement, and exception is logged immutably — who, what, when, under which authorization tier. Blockchains help here: on-chain transactions are natively timestamped and tamper-evident. The internal trail must meet the same bar, so that an auditor can reconstruct any asset movement end-to-end without asking anyone to remember anything.</div>
      <span class="card-tag tag-gold">Reconstructable History</span>
    </div>
    <div class="card">
      <div class="card-icon">🧾</div>
      <div class="card-h">Proof of Reserves</div>
      <div class="card-p">Cryptographic demonstration — typically by signing from reserve addresses or publishing attestations verified by an independent firm — that claimed holdings actually exist and are controlled by the custodian. For a state, periodic proof of reserves is what separates a sovereign reserve from a sovereign announcement.</div>
      <span class="card-tag tag-green">Verifiable, Not Claimed</span>
    </div>
    <div class="card">
      <div class="card-icon">🏛️</div>
      <div class="card-h">Three Lines of Defence</div>
      <div class="card-p">Line one: management's own controls, embedded in daily operations. Line two: an independent risk and compliance function that monitors line one. Line three: internal audit, reporting to the board — not to management — plus periodic external audits. Each line checks the one before it; no line marks its own homework.</div>
      <span class="card-tag tag-blue">Standard Model</span>
    </div>
  </div>

  <div class="two-col" style="margin-top:24px;">
    <div class="info-block">
      <h4>Incident Response</h4>
      <p>Written before the incident, rehearsed on a schedule: detection thresholds, the emergency freeze, escalation paths with names attached, communication duties to regulators, and post-incident review. Detection without enforcement is just a log a human must catch — mature frameworks pair every alarm with a pre-authorized action.</p>
    </div>
    <div class="info-block">
      <h4>Review Cadence</h4>
      <p>Custody policy is a living document: reviewed at board level on a fixed cadence and after every material incident, technology change, or regulatory development. Metrics are attested — signed by the executives responsible — so that accountability conversations happen against numbers both sides have already accepted, protecting diligent management as much as the board.</p>
    </div>
  </div>
</section>

<div class="divider"></div>

<!-- ===================== AML / CFT ===================== -->
<section id="pk-aml">
  <div class="sec-tag">Education · Compliance</div>
  <h2 class="sec-h2">AML / CFT for <em>State-Held Virtual Assets</em></h2>
  <p class="sec-sub">Anti-money-laundering and counter-terror-financing discipline is the entry ticket to the global financial system — and for state-held crypto, the bar is higher than for any private firm.</p>

  <div class="two-col">
    <div>
      <div class="info-block">
        <h4>FATF — the Watchdog That Matters</h4>
        <p>The Financial Action Task Force sets the global AML/CFT standards that Pakistan's financial system answers to. FATF's virtual-asset guidance is why the VASP category exists in law at all, and why every serious jurisdiction now licenses exchanges and custodians. For Pakistan, demonstrating FATF-grade discipline in its state digital-asset infrastructure is not optional compliance — it is the credibility layer every other ambition rests on.</p>
      </div>
      <div class="info-block">
        <h4>The Travel Rule</h4>
        <p>VASPs must transmit verified sender and receiver identity alongside virtual-asset transfers above thresholds — the crypto equivalent of wire-transfer information sharing. A sovereign custodian interacting with exchanges and settlement rails must be built to send, receive, and store travel-rule data from day one.</p>
      </div>
    </div>
    <div>
      <div class="info-block">
        <h4>Provenance — the Seized-Asset Question</h4>
        <p>State holdings that originate as seized or forfeited assets carry history. Chain-analytics screening, documented provenance, and clean separation between forfeiture proceedings and reserve accounting are what let a state hold such assets without importing their past. A sovereign custodian must be able to answer "where did every coin come from?" with records, not assurances.</p>
      </div>
      <div class="info-block">
        <h4>Sanctions &amp; Screening</h4>
        <p>Every counterparty address is screened against sanctions lists and known-illicit clusters before assets move — inbound and outbound. For a state actor the standard is absolute: a single transaction touching a sanctioned cluster is a diplomatic incident, not a compliance ticket.</p>
      </div>
    </div>
  </div>
</section>

<div class="divider"></div>

<!-- ===================== TOKENIZED SUKUK & BONDS ===================== -->
<section id="pk-sukuk">
  <div class="sec-tag">Education · Instruments</div>
  <h2 class="sec-h2">Tokenized <em>Sukuk &amp; Sovereign Bonds</em></h2>
  <p class="sec-sub">Pakistan's most natural on-chain instrument may be the one its financial system already prefers.</p>

  <div class="two-col">
    <div class="info-block">
      <h4>What a Sukuk Is — and Why Tokenization Fits</h4>
      <p>A sukuk is a Shariah-compliant certificate representing ownership in underlying assets or their cash flows — structured around real assets rather than interest-bearing debt. That asset-backed structure is precisely what tokenization does best: put a verifiable claim on a real asset on-chain, fractionalize it, and settle it instantly. Tokenized sukuk let smaller investors participate in sovereign issuance at low minimums, with the underlying asset link transparent by design.</p>
    </div>
    <div class="info-block">
      <h4>Atomic Settlement — Why It Matters</h4>
      <p>On-chain settlement can be <strong>atomic</strong>: delivery of the asset and payment for it happen simultaneously or not at all (delivery-versus-payment, DvP). This kills settlement counterparty risk — the risk that one side pays and the other never delivers — which in traditional bond markets is managed with layers of intermediaries and margin. For a developing market, atomic DvP is a leapfrog: world-class settlement without decades of clearing infrastructure.</p>
    </div>
  </div>

  <div class="two-col" style="margin-top:10px;">
    <div class="info-block">
      <h4>The Pakistani Context</h4>
      <p>The Binance MOU contemplates tokenizing up to $2B in sovereign bonds and treasury bills, and the Virtual Asset Act's Shariah Advisory framework — a globally unusual feature — is designed to accommodate Pakistan's Islamic banking system. Any digital rupee settlement leg would integrate with <strong>Raast</strong>, the SBP's instant payment rail. All issuance-side items remain MOU/announcement-stage; the enabling infrastructure (regulator, custodian, Shariah framework) is what exists today.</p>
    </div>
    <div class="info-block">
      <h4>Custody Is Still the Bottleneck</h4>
      <p>A tokenized sovereign bond is only as trustworthy as the entity holding its keys and registry. Issuance without institutional-grade custody re-creates the exact counterparty risk tokenization was meant to remove. This is why the custody architecture above — cold storage, multi-sig, audit trails, proof of reserves — is not a separate topic from tokenized sukuk. It is the prerequisite.</p>
    </div>
  </div>
</section>

<div class="divider"></div>

<!-- ===================== GLOSSARY ===================== -->
<section id="pk-glossary">
  <div class="sec-tag">Reference</div>
  <h2 class="sec-h2">The Regulator's <em>Vocabulary</em></h2>
  <p class="sec-sub">The terms that carry weight in Pakistani and international regulatory rooms — defined plainly.</p>

  <div class="two-col">
    <div>
      <div class="info-block"><h4>VASP</h4><p>Virtual Asset Service Provider — the entity type PVARA licenses: exchanges, custodians, brokers, and transfer services handling virtual assets.</p></div>
      <div class="info-block"><h4>Tokenized Sukuk</h4><p>Shariah-compliant certificates issued on-chain, representing ownership in underlying assets or their cash flows rather than interest-bearing debt.</p></div>
      <div class="info-block"><h4>RWA</h4><p>Real-World Assets brought on-chain — bonds, real estate, commodities, credit — as verifiable digital tokens.</p></div>
      <div class="info-block"><h4>Atomic Settlement / DvP</h4><p>Asset and payment swap simultaneously or not at all (delivery-versus-payment). Eliminates settlement counterparty risk.</p></div>
      <div class="info-block"><h4>AML / CFT</h4><p>Anti-money-laundering / counter-terror-financing controls. FATF is the global standard-setter whose assessments Pakistan's financial system answers to.</p></div>
      <div class="info-block"><h4>Travel Rule</h4><p>The FATF requirement that VASPs share verified sender and receiver identity alongside virtual-asset transfers.</p></div>
      <div class="info-block"><h4>Regulatory Sandbox</h4><p>A supervised testing space where new products operate under regulator observation before full licensing. PVARA operates one.</p></div>
    </div>
    <div>
      <div class="info-block"><h4>Raast</h4><p>The State Bank of Pakistan's instant payment rail. Any digital rupee would integrate with it.</p></div>
      <div class="info-block"><h4>Cold Storage</h4><p>Private keys generated and kept on devices never connected to the internet — the default for reserves.</p></div>
      <div class="info-block"><h4>Multi-Signature (M-of-N)</h4><p>A scheme requiring M approvals out of N independent key-holders for any movement — no single point of failure or unilateral control.</p></div>
      <div class="info-block"><h4>HSM</h4><p>Hardware Security Module — tamper-resistant hardware that uses keys without ever exposing them.</p></div>
      <div class="info-block"><h4>Key Ceremony</h4><p>A scripted, witnessed, fully logged event at which keys are generated and distributed — the auditable origin of custody.</p></div>
      <div class="info-block"><h4>Proof of Reserves</h4><p>Cryptographic or attested demonstration that claimed holdings exist and are controlled by the custodian.</p></div>
      <div class="info-block"><h4>Three Lines of Defence</h4><p>Management controls, independent risk/compliance, and internal audit reporting to the board — each checking the line before it.</p></div>
    </div>
  </div>

  <div class="info-block" style="margin-top:24px;border-left:3px solid var(--gold);">
    <h4>Keep Going</h4>
    <p>Pakistan-first news lives on the <a href="/#news" style="color:var(--gold);">home codex news section</a>; the national strategy case study is under <a href="/#case-studies" style="color:var(--gold);">Case Studies</a>. Questions this page didn't answer? Ask the Digital Czar — bottom right.</p>
  </div>
</section>

<!-- ===================== FOOTER ===================== -->
<div style="background:var(--bg2);border-top:1px solid var(--border);padding:48px 24px;margin-top:64px;">
  <div style="max-width:1400px;margin:0 auto;">
    <div style="display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:40px;margin-bottom:48px;">
      <div>
        <div style="font-family:'Cormorant Garamond',serif;font-size:24px;font-weight:600;color:var(--gold);margin-bottom:4px;">FutureTokenization.com</div>
        <div style="font-size:11px;color:var(--text-dim);margin-bottom:12px;text-transform:uppercase;letter-spacing:1px;">The World's Digital Asset Codex</div>
        <p style="font-size:13px;color:var(--text-muted);line-height:1.7;max-width:280px;">The world's comprehensive educational platform for tokenization, real-world assets, stablecoins, and the digital transformation of global finance. All content is educational only — not financial advice.</p>
      </div>
      <div>
        <div style="font-size:11px;text-transform:uppercase;letter-spacing:1px;color:var(--text-dim);margin-bottom:12px;">Pakistan Codex</div>
        <div style="display:flex;flex-direction:column;gap:8px;">
          <a href="#pk-strategy" style="font-size:13px;color:var(--text-muted);text-decoration:none;">Sovereign Strategy</a>
          <a href="#pk-custody" style="font-size:13px;color:var(--text-muted);text-decoration:none;">Custody Architecture</a>
          <a href="#pk-governance" style="font-size:13px;color:var(--text-muted);text-decoration:none;">Governance &amp; Risk</a>
          <a href="#pk-aml" style="font-size:13px;color:var(--text-muted);text-decoration:none;">AML / CFT</a>
          <a href="#pk-glossary" style="font-size:13px;color:var(--text-muted);text-decoration:none;">Glossary</a>
        </div>
      </div>
      <div>
        <div style="font-size:11px;text-transform:uppercase;letter-spacing:1px;color:var(--text-dim);margin-bottom:12px;">Learn</div>
        <div style="display:flex;flex-direction:column;gap:8px;">
          <a href="/#tokenization" style="font-size:13px;color:var(--text-muted);text-decoration:none;">Tokenization Basics</a>
          <a href="/#rwa" style="font-size:13px;color:var(--text-muted);text-decoration:none;">Real World Assets</a>
          <a href="/#stablecoins" style="font-size:13px;color:var(--text-muted);text-decoration:none;">Stablecoins</a>
          <a href="/#cbdc" style="font-size:13px;color:var(--text-muted);text-decoration:none;">CBDCs</a>
        </div>
      </div>
      <div>
        <div style="font-size:11px;text-transform:uppercase;letter-spacing:1px;color:var(--text-dim);margin-bottom:12px;">Legal</div>
        <div style="display:flex;flex-direction:column;gap:8px;">
          <a href="/#disclaimer" style="font-size:13px;color:var(--text-muted);text-decoration:none;">Disclaimer</a>
          <span style="font-size:13px;color:var(--text-muted);">Educational Only</span>
          <span style="font-size:13px;color:var(--text-muted);">Not Financial Advice</span>
          <span style="font-size:13px;color:var(--text-muted);">Not Legal Advice</span>
        </div>
      </div>
    </div>
    <div style="border-top:1px solid var(--border);padding-top:24px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;">
      <p style="font-size:12px;color:var(--text-dim);">© 2026 FutureTokenization.com. All content is for educational purposes only. Not financial advice.</p>
      <p style="font-size:12px;color:var(--text-dim);">Custody and governance material reflects publicly documented industry practice — illustrative reference only.</p>
    </div>
  </div>
</div>`;

export default function Pakistan() {
  const [lang, setLang]           = useState('en');
  const [langOpen, setLangOpen]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const [chatOpen, setChatOpen]   = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);

  // ── SESSION LIMIT: 3 per day (shared with home via same localStorage key) ──
  function getSessionData() {
    try {
      if (typeof window === 'undefined') return { date: '', count: 0 };
      const today = new Date().toISOString().slice(0, 10);
      const raw = window.localStorage.getItem('czar_sessions');
      const data = raw ? JSON.parse(raw) : {};
      if (data.date !== today) return { date: today, count: 0 };
      return data;
    } catch { return { date: new Date().toISOString().slice(0, 10), count: 0 }; }
  }
  function incrementSession() {
    try {
      if (typeof window === 'undefined') return 1;
      const data = getSessionData();
      data.count += 1;
      window.localStorage.setItem('czar_sessions', JSON.stringify(data));
      return data.count;
    } catch { return 1; }
  }
  function getSessionCount() { return getSessionData().count; }
  const chatHistoryRef = useRef([]);
  const messagesEndRef = useRef(null);

  const t = T[lang] || T['en'];
  const langMeta = LANGUAGES.find(l => l.code === lang) || LANGUAGES[0];

  const [messages, setMessages] = useState([
    { role: 'ai', text: T['en'].chatWelcome }
  ]);

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
    return () => observer.disconnect();
  }, []);

  async function sendMessage(userMsg) {
    if (!userMsg.trim()) return;
    if (getSessionCount() >= 3) {
      setShowLimitModal(true);
      return;
    }
    if (chatHistoryRef.current.length === 0) {
      incrementSession();
    }
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
        <title>Pakistan — Sovereign Custody, Governance &amp; Tokenized Sukuk | FutureTokenization</title>
        <meta
          name="description"
          content="How a state custodies digital assets: cold storage, multi-sig, key ceremonies, risk appetite, audit trails, proof of reserves, AML/CFT, and tokenized sukuk — Pakistan's sovereign digital asset infrastructure, explained. Educational only."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div dangerouslySetInnerHTML={{ __html: BODY_HTML }} />

      {/* ── MOBILE MENU BUTTON ── */}
      <button
        className="ham-top"
        onClick={() => setMenuOpen(o => !o)}
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={menuOpen}
        style={{
          position:'fixed', top:'11px', right:'14px', zIndex:99999,
          alignItems:'center', justifyContent:'center',
          width:'46px', height:'46px',
          background:'#d4a843',
          border:'none', borderRadius:'10px',
          cursor:'pointer', fontSize:'22px', color:'#000', fontWeight:700,
          boxShadow:'0 4px 16px rgba(0,0,0,0.5)',
        }}
      >
        {menuOpen ? '✕' : '☰'}
      </button>

      <div className={`mobile-nav${menuOpen ? ' open' : ''}`} onClick={() => setMenuOpen(false)}>
        <div className="mobile-nav-label">Pakistan Codex</div>
        <a href="#pk-strategy" className="sub">Sovereign Strategy</a>
        <a href="#pk-custody" className="sub">Custody Architecture</a>
        <a href="#pk-governance" className="sub">Governance &amp; Risk Appetite</a>
        <a href="#pk-assurance" className="sub">Audit &amp; Assurance</a>
        <a href="#pk-aml" className="sub">AML / CFT</a>
        <a href="#pk-sukuk" className="sub">Tokenized Sukuk &amp; Bonds</a>
        <a href="#pk-glossary" className="sub">Glossary</a>
        <div className="mobile-nav-label">Site</div>
        <a href="/">Home</a>
        <a href="/directory">VARA Directory</a>
        <a href="/#pakistan">Emerging Markets</a>
        <a href="/#news">News</a>
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
              {['What is the Strategic Digital Wallet Company?', 'What is a key ceremony?', 'What are tokenized sukuk?'].map((q, i) => (
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

      {/* ── SESSION LIMIT MODAL ── */}
      {showLimitModal && (
        <div style={{
          position:'fixed', inset:0, background:'rgba(6,9,16,0.92)', zIndex:999999,
          display:'flex', alignItems:'center', justifyContent:'center', padding:'20px',
        }}>
          <div style={{
            background:'#111620', border:'1px solid rgba(212,168,67,0.5)',
            borderRadius:'16px', padding:'36px 32px', maxWidth:'420px', width:'100%',
            textAlign:'center', boxShadow:'0 20px 60px rgba(0,0,0,0.8)',
          }}>
            <div style={{fontSize:'48px', marginBottom:'16px'}}>⏳</div>
            <h3 style={{fontFamily:"'Cormorant Garamond',serif", fontSize:'24px', color:'#d4a843', marginBottom:'12px', fontWeight:600}}>
              Daily Limit Reached
            </h3>
            <p style={{color:'#7a8090', fontSize:'14px', lineHeight:1.7, marginBottom:'24px'}}>
              You've used your <strong style={{color:'#e8eaf0'}}>3 free sessions</strong> for today.
              Sessions reset at midnight. Come back tomorrow — or request additional access from Khurram directly.
            </p>

            <a
              href="mailto:khurrambadar@gmail.com?subject=Request%20for%20Additional%20Digital%20Czar%20Sessions&body=Hi%20Khurram%2C%0A%0AI%27ve%20used%20my%203%20daily%20sessions%20on%20FutureTokenization.com%20and%20would%20like%20to%20request%20additional%20access.%0A%0AMy%20reason%3A%20"
              style={{
                display:'block', background:'#d4a843', color:'#060910',
                borderRadius:'8px', padding:'12px 20px', fontWeight:700,
                fontSize:'14px', textDecoration:'none', marginBottom:'12px',
              }}
            >
              ✉️ Email Khurram for More Access
            </a>

            <button
              onClick={() => setShowLimitModal(false)}
              style={{
                width:'100%', background:'transparent', border:'1px solid rgba(255,255,255,0.1)',
                color:'#7a8090', borderRadius:'8px', padding:'10px 20px',
                fontSize:'13px', cursor:'pointer',
              }}
            >
              Visit Again Tomorrow 🔄
            </button>

            <p style={{color:'#4a5060', fontSize:'11px', marginTop:'16px'}}>
              Sessions reset daily at 00:00 UTC
            </p>
          </div>
        </div>
      )}
    </>
  );
}
