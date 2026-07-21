import type { Metadata, Viewport } from "next";
import { Instrument_Sans, Newsreader, Geist_Mono } from "next/font/google";
import "./globals.css";

/* All three are variable fonts — next/font throws if you pin weights on
   these, so we don't. Instrument runs the console, Newsreader sets the
   transcript, Geist Mono handles measurements. */
const instrument = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
});
const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  display: "swap",
});
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Magppie · Call Monitor",
  description: "Watching Pooja work a live call.",
};

export const viewport: Viewport = {
  themeColor: "#0B0A08",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${instrument.variable} ${newsreader.variable} ${geistMono.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
