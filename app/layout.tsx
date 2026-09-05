import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";

import Navbar from "@/components/ui/Navbar";
import ScrollIndicator from "@/components/ui/ScrollIndicator";
import CustomCursor from "@/components/ui/CustomCursor";
import LoadingOverlay from "@/components/ui/LoadingOverlay";
import PageTransition from "@/components/providers/PageTransition";
import RouteTransitionProvider from "@/components/providers/RouteTransitionProvider";
import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";
import LanguageProvider from "@/components/providers/LanguageProvider";
import { getLocale } from "@/lib/locale";
import { getSite } from "@/lib/site";

import "./globals.css";

/**
 * Weights are pinned to exactly what the old index.html requested from Google
 * Fonts. This matters: Playfair Display was loaded at 700 only, so every
 * `font-serif` heading resolved to 700 regardless of its CSS font-weight.
 * Loading the full variable range instead would silently render every display
 * heading lighter than it is today.
 */
const inter = Inter({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin", "cyrillic"],
  weight: ["700"],
  variable: "--font-playfair",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const site = getSite(await getLocale());

  return {
    metadataBase: new URL(site.url),
    title: {
      default: `${site.name} — ${site.jobTitle}`,
      template: `%s — ${site.name}`,
    },
    description: site.description,
    applicationName: site.name,
    authors: [{ name: site.name, url: site.url }],
    creator: site.name,
    publisher: site.name,
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
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      siteName: site.name,
      locale: site.locale,
      url: site.url,
      title: `${site.name} — ${site.jobTitle}`,
      description: site.description,
      images: [site.ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: `${site.name} — ${site.jobTitle}`,
      description: site.description,
      images: [site.ogImage.url],
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
    icons: { icon: "/favicon.ico" },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000000",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const locale = await getLocale();

  return (
    <html lang={locale} className={`${inter.variable} ${playfair.variable}`}>
      <body>
        <LanguageProvider locale={locale}>
          <SmoothScrollProvider />
          <CustomCursor />

          <RouteTransitionProvider>
            <div className="bg-black min-h-screen text-white selection:bg-red-600 selection:text-white">
              <ScrollIndicator />
              <Navbar />
              <main>
                <PageTransition>{children}</PageTransition>
              </main>
            </div>
          </RouteTransitionProvider>

          <LoadingOverlay />
        </LanguageProvider>
      </body>
    </html>
  );
}
