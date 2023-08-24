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
        <meta property="og:title" content="pomo.chat | social pomodoro timer" />
        <meta property="og:description" content="25 min focus + 5 min chat" />
        <meta property="og:url" content="https://pomo.chat" />
        <meta property="og:type" content="website" />
        {/* note: favicon, link preview images handled by app router */}
        {/* https://nextjs.org/docs/app/api-reference/file-conventions/metadata */}
      </Head>
      <body className={nichrome.className}>{children}</body>
    </html>
  );
}
