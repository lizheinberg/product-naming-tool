import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Platform Brand Architecture and Naming Assessment | Prequel",
  description:
    "Does your roll-up's holding company need a new name? Answer a few strategic questions and get a clear assessment of your holdco name's fitness.",
  openGraph: {
    title: "Platform Brand Architecture and Naming Assessment | Prequel",
    description:
      "Find out if your holdco needs a new name in 2 minutes.",
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
