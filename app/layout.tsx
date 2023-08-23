import "./globals.css";
import type { Metadata } from "next";
import localFont from "next/font/local";
import Head from "next/head";

// Fonts
const nichrome = localFont({
  src: "../public/fonts/MDNichrome-Variable.woff2",
  display: "swap",
  variable: "--font-nichrome",
});

export const metadata: Metadata = {
  title: "pomo.chat",
  description: "25 minutes of focus, 5 minutes of chat",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Head>
        <title>🍅 pomo.chat 💬</title>
        <meta property="og:title" content="pomo.chat" />
        <meta
          property="og:description"
          content="social pomodoro timer · 25 min focus + 5 min chat"
        />
        <meta property="og:url" content="https://pomo.chat" />
        {/* <meta property="og:image" content="/images/link-preview.png" />
        <meta
          property="og:image:secure_url"
          content="/images/link-preview.png"
        />
        <meta name="thumbnail" content="/images/link-preview.png" /> */}

        {/* on favicon declarations:
         https://loqbooq.app/blog/add-favicon-modern-browser-guide */}

        <link rel="icon" href="/images/favicon_io/favicon.ico" />

        {/* for all browsers */}
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/images/favicon_io/favicon-16x16.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/images/favicon_io/favicon-32x32.png"
        />

        {/* for Android and Chrome */}
        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href="/images/favicon_io/android-chrome-192x192.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="512x512"
          href="/images/favicon_io/android-chrome-512x512.png"
        />

        {/* for Safari on Mac OS */}
        <link
          rel="apple-touch-icon"
          type="image/png"
          sizes="180x180"
          href="/images/favicon_io/apple-touch-icon-180x180.png"
        />
        <link
          rel="apple-touch-icon"
          type="image/png"
          sizes="167x167"
          href="/images/favicon_io/apple-touch-icon-167x167.png"
        />
      </Head>
      <body className={nichrome.className}>{children}</body>
    </html>
  );
}
