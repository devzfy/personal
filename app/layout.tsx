import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import Script from "next/script";

import Navbar from "@/components/ui/Navbar";
import ScrollIndicator from "@/components/ui/ScrollIndicator";
import LoadingOverlay from "@/components/ui/LoadingOverlay";
import PageTransition from "@/components/providers/PageTransition";
import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";
import { SITE } from "@/lib/site";

import "./globals.css";

/**
 * Weights are pinned to exactly what the old index.html requested from Google
 * Fonts. This matters: Playfair Display was loaded at 700 only, so every
 * `font-serif` heading resolved to 700 regardless of its CSS font-weight.
 * Loading the full variable range instead would silently render every display
 * heading lighter than it is today.
 */
const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — ${SITE.jobTitle}`,
    template: `%s — ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  authors: [{ name: SITE.name, url: SITE.url }],
  creator: SITE.name,
  publisher: SITE.name,
  keywords: [
    "Javokhir Shokirov",
    "devzfy",
    "software engineer",
    "frontend engineer",
    "React developer",
    "Next.js developer",
    "TypeScript",
    "WebGL",
    "Three.js",
    "Telegram bot development",
    "AI integration",
    "Tashkent",
    "Uzbekistan",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: SITE.name,
    locale: SITE.locale,
    url: SITE.url,
    title: `${SITE.name} — ${SITE.jobTitle}`,
    description: SITE.description,
    images: [
      {
        url: SITE.ogImage.url,
        width: SITE.ogImage.width,
        height: SITE.ogImage.height,
        alt: SITE.ogImage.alt,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — ${SITE.jobTitle}`,
    description: SITE.description,
    images: [SITE.ogImage.url],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body>
        <SmoothScrollProvider />

        <div className="bg-black min-h-screen text-white selection:bg-red-600 selection:text-white">
          <ScrollIndicator />
          <Navbar />
          <main>
            <PageTransition>{children}</PageTransition>
          </main>
        </div>

        <LoadingOverlay />

        {/* Third-party widget carried over verbatim from the old index.html. */}
        <Script
          src="https://uhamkor.uz/widget/widget.js"
          data-project-uuid="c6e0f4f1-887d-407f-b8d3-489dd024ca6a"
          data-language="en"
          data-user=""
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
