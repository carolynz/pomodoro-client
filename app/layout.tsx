import "./globals.css";
import type { Metadata } from "next";
// import { Inter } from 'next/font/google'

// const inter = Inter({ subsets: ['latin'] })

import localFont from "next/font/local";

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
      <body className={nichrome.className}>{children}</body>
    </html>
  );
}
