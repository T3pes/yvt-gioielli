import Link from "next/link";
import { notFound } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import PieceCard from "@/components/PieceCard";
import Reveal from "@/components/Reveal";
import { getCollections, getPieces, getSettings } from "@/lib/data";
import { L, isLang, t, type Lang } from "@/lib/i18n";

export const revalidate = 60;

export default async function Catalogo({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ c?: string; s?: string }>;
}) {
  const { lang: raw } = await params;
  const { c, s } = await searchParams;
  if (!isLang(raw)) notFound();
  const lang = raw as Lang;
  const d = t(lang);

  const [settings, collections] = await Promise.all([getSettings(), getCollections()]);
  const active = collections.find((x) => x.slug === c);
  const pieces = await getPieces({
    collectionId: active?.id,
    status: s && ["available", "reserved", "sold"].includes(s) ? s : undefined,
  });

  const qs = (next: { c?: string; s?: string }) => {
    const p = new URLSearchParams();
    const cc = next.c ?? c;
    const ss = next.s ?? s;
    if (cc) p.set("c", cc);
    if (ss) p.set("s", ss);
    const q = p.toString();
    return `/${lang}/catalogo${q ? `?${q}` : ""}`;
  };

  return (
    <>
      <PageHeader eyebrow={d.piece.unique} title={d.catalog.title} lead={d.catalog.lead} />

      <section className="bg-[#f7f2e8] px-5 pb-28 md:px-10">
        <div className="mx-auto max-w-[1300px]">
          {/* filtri */}
          <div className="flex flex-col items-center gap-5 border-y border-[#a8863f]/15 py-6">
            <div className="flex flex-wrap items-center justify-center gap-x-7 gap-y-3">
              <Link
                href={`/${lang}/catalogo${s ? `?s=${s}` : ""}`}
                className={`nav-link ${!c ? "text-[#a8863f]" : "text-[#7c7365] hover:text-[#a8863f]"}`}
              >
                {d.catalog.all}
              </Link>
              {collections.map((col) => (
                <Link
                  key={col.id}
                  href={qs({ c: col.slug })}
                  className={`nav-link ${
                    c === col.slug ? "text-[#a8863f]" : "text-[#7c7365] hover:text-[#a8863f]"
                  }`}
                >
                  {L(col, "name", lang)}
                </Link>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[10.5px] uppercase tracking-[0.2em] text-[#7c7365]">
              <span className="opacity-60">{d.catalog.filterStatus}:</span>
              <Link href={`/${lang}/catalogo${c ? `?c=${c}` : ""}`} className={!s ? "text-[#a8863f]" : "hover:text-[#a8863f]"}>
                {d.catalog.anyStatus}
              </Link>
              {(["available", "reserved", "sold"] as const).map((st) => (
                <Link
                  key={st}
                  href={qs({ s: st })}
                  className={s === st ? "text-[#a8863f]" : "hover:text-[#a8863f]"}
                >
                  {d.status[st]}
                </Link>
              ))}
            </div>
          </div>

          {pieces.length === 0 ? (
            <p className="serif py-28 text-center text-[19px] text-[#7c7365]">{d.catalog.empty}</p>
          ) : (
            <div className="mt-14 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
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
