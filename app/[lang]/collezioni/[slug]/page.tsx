import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import PieceCard from "@/components/PieceCard";
import Reveal from "@/components/Reveal";
import { getCollectionBySlug, getPieces, getSettings } from "@/lib/data";
import { L, isLang, t, type Lang } from "@/lib/i18n";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  const c = await getCollectionBySlug(slug);
  if (!c) return {};
  const l = (isLang(lang) ? lang : "it") as Lang;
  return { title: L(c, "name", l), description: L(c, "description", l) || undefined };
}

export default async function CollezionePage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang: raw, slug } = await params;
  if (!isLang(raw)) notFound();
  const lang = raw as Lang;
  const d = t(lang);

  const collection = await getCollectionBySlug(slug);
  if (!collection) notFound();

  const [settings, pieces] = await Promise.all([
    getSettings(),
    getPieces({ collectionId: collection.id }),
  ]);

  return (
    <>
      <PageHeader
        eyebrow={d.collections.title}
        title={L(collection, "name", lang)}
        lead={L(collection, "description", lang)}
      />

      <section className="bg-[#f7f2e8] px-5 pb-28 md:px-10">
        <div className="mx-auto max-w-[1300px]">
          {pieces.length === 0 ? (
            <p className="serif py-16 text-center text-[19px] text-[#7c7365]">{d.catalog.empty}</p>
          ) : (
            <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {pieces.map((p, i) => (
                <Reveal key={p.id} delay={(i % 3) * 100}>
                  <PieceCard piece={p} lang={lang} showPrices={settings.show_prices} priority={i < 3} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
