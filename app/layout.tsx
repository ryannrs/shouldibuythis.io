import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const APP_URL = "https://shouldibuythis.io";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "ShouldIBuyThis.io",
  url: APP_URL,
  description:
    "AI-assisted purchase research. Analyzes any product and returns a Buy, Skip, Buy Better, or You Don't Need It verdict with full reasoning and source links.",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    availability: "https://schema.org/PreOrder",
    description: "Currently in private beta. Free early access for waitlist members.",
  },
};

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: "ShouldIBuyThis.io: AI-Assisted Purchase Research",
    template: "%s | ShouldIBuyThis.io",
  },
  description:
    "AI agents analyze any product you're considering and ask whether you need it at all. Get a Buy, Skip, Buy Better, or You Don't Need It verdict with the full reasoning and sources.",
  openGraph: {
    title: "ShouldIBuyThis.io: AI-Assisted Purchase Research",
    description:
      "AI agents analyze any product you're considering and ask whether you need it at all. Get a structured verdict with full reasoning before you spend a dollar.",
    type: "website",
    url: APP_URL,
    siteName: "ShouldIBuyThis.io",
  },
  twitter: {
    card: "summary_large_image",
    title: "ShouldIBuyThis.io: AI-Assisted Purchase Research",
    description:
      "AI agents analyze any product you're considering and ask whether you need it at all. Get a structured verdict before you spend a dollar.",
  },
  robots: { index: true, follow: true },
  alternates: { canonical: APP_URL },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className="bg-zinc-950 text-white antialiased font-sans"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
