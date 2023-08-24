import "./globals.css";
import type { Metadata } from "next";
import localFont from "next/font/local";
import Head from "next/head";
import type { OpenGraph } from "next/dist/lib/metadata/types/opengraph-types";
import type { Twitter } from "next/dist/lib/metadata/types/twitter-types";

// Fonts
const nichrome = localFont({
  src: "../public/fonts/MDNichrome-Variable.woff2",
  display: "swap",
  variable: "--font-nichrome",
});

const openGraph: OpenGraph = {
  title: "pomo.chat | social pomodoro timer",
  description: "25 min focus + 5 min chat",
  url: "https://pomo.chat",
  type: "website",
};

const twitter: Twitter = {
  card: "summary_large_image",
  site: "https://pomo.chat",
  creator: "kelin",
  description: "25 min focus + 5 min chat",
};

export const metadata: Metadata = {
  title: "pomo.chat | social pomodoro timer",
  description: "25 min focus + 5 min chat",
  keywords:
    "pomodoro, pomodoro timer, study with me, productivity, study group",
  creator: "kelin",
  openGraph: openGraph,
  twitter: twitter,
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
        {/* <meta property="og:title" content="pomo.chat | social pomodoro timer" />
        <meta property="og:description" content="25 min focus + 5 min chat" />
        <meta property="og:url" content="https://pomo.chat" />
        <meta property="og:type" content="website" /> */}
        {/* <meta name="twitter:card" content="summary_large_image" /> */}
        {/* note: favicon, link preview images handled by app router */}
        {/* https://nextjs.org/docs/app/api-reference/file-conventions/metadata */}
      </Head>
      <body className={nichrome.className}>{children}</body>
    </html>
  );
}
