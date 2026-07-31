import type { Metadata } from "next";

import JsonLd from "@/components/JsonLd";
import ContactContent from "@/components/ui/ContactContent";
import { contactGraph } from "@/lib/schema";
import { SITE, absoluteUrl } from "@/lib/site";

const title = "Contact";
const description =
  "Have a vision? Let's bring it to life through code. Get in touch with Javokhir Shokirov — software engineer in Tashkent, Uzbekistan (UTC+5), currently open for freelance work.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/contact" },
  openGraph: {
    type: "website",
    url: absoluteUrl("/contact"),
    title: `${title} — ${SITE.name}`,
    description,
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
    title: `${title} — ${SITE.name}`,
    description,
    images: [SITE.ogImage.url],
  },
};

export default function ContactPage() {
  return (
    <>
      <JsonLd data={contactGraph()} />
      <ContactContent />
    </>
  );
}
