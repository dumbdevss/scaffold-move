import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/react";
import RootLayoutClient from "./context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Movement Labs | DApp Starter",
  description: "A starter template for building decentralized applications with Movement Labs.",
  keywords: [
    "Web3",
    "DApp",
    "Blockchain",
    "Movement Labs",
    "Starter Template"
  ],
  authors: [
    {
      name: "Movement Labs",
      url: "https://movementlabs.xyz",
    },
  ],
  openGraph: {
    title: "Movement Labs DApp Starter",
    description: "A starter template for building decentralized applications with Movement Labs.",
    type: "website",
    siteName: "Movement Labs",
  },
  twitter: {
    card: "summary_large_image",
    title: "Movement Labs DApp Starter",
    description: "A starter template for building decentralized applications with Movement Labs.",
    creator: "@movementlabs",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <RootLayoutClient>
        {/* <meta property="og:image" content="/logo.svg" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta
          property="og:site_name"
          content="Movement Labs — DApp Starter"
        />
        <meta
          property="og:url"
          content="https://movementlabs.xyz/"
        />
        <meta name="twitter:image" content="/movement-labs.png" />
        <meta name="twitter:image:type" content="image/png" />
        <meta name="twitter:image:width" content="1200" />
        <meta name="twitter:image:height" content="630" /> */}
        <body className={inter.className}>
          {children}
          <Toaster richColors position="top-center" />
          <Analytics />
        </body>
      </RootLayoutClient>
    </html>
  );
}
