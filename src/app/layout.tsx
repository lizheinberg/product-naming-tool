import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Product Naming Tool | Prequel",
  description:
    "Find out what kind of name your product needs. Answer a few strategic questions and get a clear recommendation on name type, architecture, and investment level.",
  openGraph: {
    title: "Product Naming Tool | Prequel",
    description:
      "Find out what kind of name your product needs in 2 minutes.",
    type: "website",
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
    </html>
  );
}
