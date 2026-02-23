import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "ShouldIBuyThis.io: AI-Assisted Purchase Research",
  description:
    "Three AI agents analyze any product you're considering. Get a Buy, Skip, or Buy Better recommendation with the full reasoning and sources behind it.",
  openGraph: {
    title: "ShouldIBuyThis.io: AI-Assisted Purchase Research",
    description:
      "Three AI agents analyze any product you're considering. One builds the case for buying, one looks for red flags, and one checks whether you're getting a fair price.",
    type: "website",
    url: "https://shouldibuythis.io",
  },
  twitter: {
    card: "summary_large_image",
    title: "ShouldIBuyThis.io: AI-Assisted Purchase Research",
    description:
      "Three AI agents analyze any product you're considering. Get a Buy, Skip, or Buy Better recommendation with the full reasoning behind it.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-zinc-950 text-white antialiased font-sans" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
