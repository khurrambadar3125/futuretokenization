import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <meta name="description" content="The verified registry of record for the UAE's tokenized economy. Every VARA-licensed virtual-asset provider — traceable to source. Not financial advice." />
        <meta property="og:title" content="FutureTokenization — The verified VARA registry" />
        <meta property="og:description" content="Verify who holds an active VARA licence in the UAE. Every fact traceable to its source. Not financial advice." />
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
