import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,600&family=DM+Sans:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <meta name="description" content="The world's comprehensive educational platform for tokenization, real-world assets, stablecoins, CBDCs, and the digital transformation of global finance." />
        <meta property="og:title" content="FutureTokenization.com — The World's Digital Asset Codex" />
        <meta property="og:description" content="Authoritative education on tokenization, RWAs, stablecoins, and digital finance. Not financial advice." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.futuretokenization.com" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
