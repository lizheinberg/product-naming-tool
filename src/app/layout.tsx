import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

const SITE_TITLE = "Platform Brand Architecture and Naming Assessment | Prequel";
const SITE_DESCRIPTION =
  "A short assessment to help you decide how to organize platform brands and whether to keep, leverage, or replace your holdco name.";

export const metadata: Metadata = {
  metadataBase: new URL("https://holdco.prequel.agency"),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: "https://holdco.prequel.agency",
    siteName: "Prequel",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
      <Script
        defer
        data-domain="holdco.prequel.agency"
        src="https://plausible.io/js/script.tagged-events.js"
      />
      <Script id="plausible-init">
        {`window.plausible = window.plausible || function() { (window.plausible.q = window.plausible.q || []).push(arguments) }`}
      </Script>
    </html>
  );
}
