import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import { Laurel } from "@/components/Ornaments";
import { getCollections, getPieces } from "@/lib/data";
import { L, isLang, t, type Lang } from "@/lib/i18n";

export const revalidate = 60;

export default async function Collezioni({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: raw } = await params;
  if (!isLang(raw)) notFound();
  const lang = raw as Lang;
  const d = t(lang);

  const collections = await getCollections();
  const all = await getPieces({});
  const count = (id: string) => all.filter((p) => p.collection_id === id).length;

  return (
    <>
      <PageHeader title={d.collections.title} lead={d.collections.lead} />

      <section className="bg-[#f7f2e8] px-5 pb-28 md:px-10">
        <div className="mx-auto max-w-[1300px]">
          {collections.length === 0 ? (
            <p className="serif py-20 text-center text-[19px] text-[#7c7365]">{d.collections.empty}</p>
          ) : (
            <div className="space-y-20 md:space-y-28">
              {collections.map((c, i) => (
                <Reveal key={c.id}>
                  <div
                    className={`grid items-center gap-10 md:grid-cols-2 md:gap-16 ${
                      i % 2 ? "md:[&>*:first-child]:order-2" : ""
                    }`}
                  >
                    <Link href={`/${lang}/collezioni/${c.slug}`} className="piece-card block">
                      <div className="piece-frame relative aspect-[5/4] w-full">
                        {c.cover_url ? (
                          <Image
                            src={c.cover_url}
                            alt={L(c, "name", lang)}
                            fill
                            sizes="(max-width: 768px) 92vw, 46vw"
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-[#14110d]">
                            <Laurel className="h-2/3 w-2/3 text-[#c8a75d] opacity-25" />
                          </div>
                        )}
                      </div>
                    </Link>

                    <div className={i % 2 ? "md:pr-6" : "md:pl-6"}>
                      <p className="eyebrow text-[#a8863f]">
                        {count(c.id)} {d.collections.pieces}
                      </p>
                      <h2 className="display mt-4 text-[26px] md:text-[34px]">{L(c, "name", lang)}</h2>
                      <div className="rule-diamond mt-6 w-28">
                        <span />
                      </div>
                      <p className="serif mt-6 text-[17px] leading-relaxed text-[#7c7365]">
                        {L(c, "description", lang)}
                      </p>
                      <Link href={`/${lang}/collezioni/${c.slug}`} className="btn btn-outline mt-8">
                        {d.collections.view}
                      </Link>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
