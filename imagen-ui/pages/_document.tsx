// imagen-ui\pages\_document.tsx

import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="Matrx IMAgen - Comprehensive no-code AI image generation solution" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="Matrx IMAgen" />
        <meta property="og:description" content="Comprehensive no-code AI image generation solution" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <body className="antialiased bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}