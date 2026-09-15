import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SetLang from "@/components/SetLang";
import { getSettings } from "@/lib/data";
import { isLang, LANGS, type Lang } from "@/lib/i18n";

export const revalidate = 60;

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const settings = await getSettings();
  const tagline = lang === "en" ? settings.tagline_en : settings.tagline_it;
  return {
    title: { default: settings.brand_name, template: `%s — ${settings.brand_name}` },
    description: tagline || undefined,
    alternates: {
      languages: { it: "/it", en: "/en" },
    },
  };
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();

  const settings = await getSettings();

  return (
    <>
      <SetLang lang={lang} />
      <Header
        lang={lang as Lang}
        brand={settings.brand_name}
        whatsapp={settings.whatsapp_number}
      />
      <main>{children}</main>
      <Footer lang={lang as Lang} settings={settings} />
    </>
  );
}
