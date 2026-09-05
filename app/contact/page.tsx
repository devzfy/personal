import type { Metadata } from "next";

import JsonLd from "@/components/JsonLd";
import ContactContent from "@/components/ui/ContactContent";
import { contactGraph } from "@/lib/schema";
import { absoluteUrl, getSite } from "@/lib/site";
import { getDictionary } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const dictionary = getDictionary(locale);
  const site = getSite(locale);
  const title = dictionary.nav.contact;
  const description = `${dictionary.contact.intro} ${dictionary.contact.locationValue}. ${dictionary.contact.statusValue}.`;

  return {
    title,
    description,
    alternates: { canonical: "/contact" },
    openGraph: {
      type: "website",
      url: absoluteUrl("/contact"),
      title: `${title} — ${site.name}`,
      description,
      images: [site.ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} — ${site.name}`,
      description,
      images: [site.ogImage.url],
    },
  };
}

export default async function ContactPage() {
  const locale = await getLocale();

  return (
    <>
      <JsonLd data={contactGraph(locale)} />
      <ContactContent />
    </>
  );
}
