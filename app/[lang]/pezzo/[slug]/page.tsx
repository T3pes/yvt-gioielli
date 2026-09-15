import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Gallery from "@/components/Gallery";
import PieceCard from "@/components/PieceCard";
import Reveal from "@/components/Reveal";
import { Palmette, WhatsAppGlyph } from "@/components/Ornaments";
import { formatPrice, getPieceBySlug, getPieces, getSettings } from "@/lib/data";
import { L, isLang, t, type Lang } from "@/lib/i18n";
import { waLink } from "@/lib/whatsapp";
import { siteUrl } from "@/lib/config";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  const p = await getPieceBySlug(slug);
  if (!p) return {};
  const l = (isLang(lang) ? lang : "it") as Lang;
  const img = p.piece_images?.[0]?.url;
  return {
    title: L(p, "name", l),
    description: L(p, "description", l) || undefined,
    openGraph: { images: img ? [img] : undefined },
  };
}

export default async function PiecePage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang: raw, slug } = await params;
  if (!isLang(raw)) notFound();
  const lang = raw as Lang;
  const d = t(lang);

  const piece = await getPieceBySlug(slug);
  if (!piece) notFound();

  const [settings, related] = await Promise.all([
    getSettings(),
    getPieces({ limit: 3, excludeId: piece.id, collectionId: piece.collection_id ?? undefined }),
  ]);

  const name = L(piece, "name", lang);
  const price = settings.show_prices ? formatPrice(piece.price_cents, piece.currency, lang) : null;
  const site = siteUrl();
  const url = `${site}/${lang}/pezzo/${piece.slug}`;
  const wa = waLink(settings.whatsapp_number, d.wa.piece(name, piece.code, url));

  const specs = [
    { k: d.piece.materials, v: L(piece, "materials", lang) },
    { k: d.piece.technique, v: L(piece, "technique", lang) },
    { k: d.piece.dimensions, v: piece.dimensions || "" },
    {
      k: d.piece.weight,
      v: piece.weight_grams ? `${piece.weight_grams} g` : "",
    },
    {
      k: d.piece.collection,
      v: piece.collections ? L(piece.collections, "name", lang) : "",
    },
  ].filter((s) => s.v);

  const story = L(piece, "story", lang);

  return (
    <>
      <section className="bg-[#f7f2e8] px-5 pb-20 pt-[110px] md:px-10 md:pt-[150px]">
        <div className="mx-auto max-w-[1300px]">
          <Link
            href={`/${lang}/catalogo`}
            className="eyebrow link-underline text-[#a8863f] hover:opacity-80"
          >
            ← {d.piece.back}
          </Link>

          <div className="mt-8 grid gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-20">
            <Gallery images={piece.piece_images ?? []} alt={name} lang={lang} />

            <div className="lg:pt-6">
              <p className="eyebrow text-[#a8863f]">
                {d.piece.code} {piece.code}
              </p>
              <h1 className="display mt-4 text-[30px] leading-tight md:text-[42px]">{name}</h1>

              <div className="mt-5 flex items-center gap-4">
                <span className="badge text-[#a8863f]">{d.piece.unique}</span>
                {piece.status !== "available" && (
                  <span className="badge text-[#8c4a34]">{d.status[piece.status]}</span>
                )}
              </div>

              <div className="hairline my-8" />

              <p className="serif text-[18px] leading-relaxed text-[#3a342b]">
                {L(piece, "description", lang)}
              </p>

              {specs.length > 0 && (
                <dl className="mt-9 divide-y divide-[#a8863f]/15 border-y border-[#a8863f]/15">
                  {specs.map((s) => (
                    <div key={s.k} className="flex gap-6 py-3.5">
                      <dt className="w-32 shrink-0 text-[10.5px] uppercase tracking-[0.18em] text-[#7c7365]">
                        {s.k}
                      </dt>
                      <dd className="serif text-[16px] text-[#3a342b]">{s.v}</dd>
                    </div>
                  ))}
                </dl>
              )}

              <p className="display mt-8 text-[22px] text-[#a8863f]">
                {price ?? d.piece.priceOnRequest}
              </p>

              <a
                href={wa}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-wa mt-7 w-full sm:w-auto"
              >
                <WhatsAppGlyph className="h-4 w-4" />
                {d.piece.inquire}
              </a>

              <p className="serif mt-6 text-[14px] italic leading-relaxed text-[#7c7365]">
                {d.piece.note}
              </p>
            </div>
          </div>
        </div>
      </section>

      {story && (
        <section className="bg-[#14110d] px-5 py-24 text-[#f7f2e8] md:px-10">
          <div className="mx-auto max-w-[760px] text-center">
            <Reveal>
              <Palmette className="mx-auto h-8 w-11 text-[#c8a75d]/70" />
              <h2 className="display mt-7 text-[24px] md:text-[32px]">{d.piece.story}</h2>
              <p className="serif mt-7 whitespace-pre-line text-[19px] leading-relaxed text-[#f7f2e8]/72">
                {story}
              </p>
            </Reveal>
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="bg-[#f7f2e8] px-5 py-24 md:px-10">
          <div className="mx-auto max-w-[1300px]">
            <Reveal className="text-center">
              <h2 className="display text-[24px] md:text-[32px]">{d.piece.related}</h2>
            </Reveal>
            <div className="mt-12 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p, i) => (
                <Reveal key={p.id} delay={i * 100}>
                  <PieceCard piece={p} lang={lang} showPrices={settings.show_prices} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
