import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import Reveal from "@/components/Reveal";
import PieceCard from "@/components/PieceCard";
import { Laurel, Palmette, WhatsAppGlyph, MeanderCorner } from "@/components/Ornaments";
import { getCollections, getPieces, getSettings } from "@/lib/data";
import { L, isLang, t, type Lang } from "@/lib/i18n";
import { waLink } from "@/lib/whatsapp";

export const revalidate = 60;

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: raw } = await params;
  if (!isLang(raw)) notFound();
  const lang = raw as Lang;
  const d = t(lang);

  const [settings, featured, fallback, collections] = await Promise.all([
    getSettings(),
    getPieces({ featured: true, limit: 6 }),
    getPieces({ limit: 6 }),
    getCollections(),
  ]);

  const pieces = featured.length ? featured : fallback;
  const tagline = (lang === "it" ? settings.tagline_it : settings.tagline_en) || "";

  return (
    <>
      {/* ——————————— HERO ——————————— */}
      <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-[#14110d] px-5 text-center text-[#f7f2e8]">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 55% at 50% 42%, rgba(200,167,93,0.16), transparent 70%)",
          }}
        />
        <Laurel className="pointer-events-none absolute left-1/2 top-1/2 h-[min(78vh,760px)] w-[min(78vh,760px)] -translate-x-1/2 -translate-y-1/2 text-[#c8a75d] opacity-[0.16]" />

        <MeanderCorner className="absolute left-6 top-24 hidden h-12 w-12 text-[#c8a75d]/30 md:block" />
        <MeanderCorner className="absolute bottom-10 right-6 hidden h-12 w-12 -scale-x-100 -scale-y-100 text-[#c8a75d]/30 md:block" />

        <div className="relative z-10 mx-auto max-w-4xl pt-24">
          <Reveal>
            <p className="eyebrow text-[#c8a75d]">{d.hero.eyebrow}</p>
          </Reveal>
          <Reveal delay={120}>
            <h1 className="display mt-7 whitespace-pre-line text-[34px] leading-[1.18] md:text-[60px]">
              {d.hero.title}
            </h1>
          </Reveal>
          <Reveal delay={240}>
            <p className="lead mx-auto mt-8 max-w-xl text-[#f7f2e8]/70">{d.hero.lead}</p>
          </Reveal>
          <Reveal delay={360}>
            <div className="mt-11 flex flex-wrap items-center justify-center gap-4">
              <Link href={`/${lang}/catalogo`} className="btn btn-gold">
                {d.hero.ctaPrimary}
              </Link>
              <a
                href={waLink(settings.whatsapp_number, d.wa.generic)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline-light"
              >
                <WhatsAppGlyph className="h-4 w-4" />
                {d.hero.ctaSecondary}
              </a>
            </div>
          </Reveal>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[#c8a75d]/50">
          <span className="block h-12 w-px bg-current" />
        </div>
      </section>

      {/* ——————————— TECNICHE ——————————— */}
      <section className="bg-[#f7f2e8] px-5 py-24 md:px-10 md:py-32">
        <div className="mx-auto max-w-[1200px]">
          <Reveal className="text-center">
            <p className="eyebrow text-[#a8863f]">{tagline}</p>
            <h2 className="display mt-5 text-[28px] md:text-[40px]">{d.home.pillarsTitle}</h2>
            <p className="lead mx-auto mt-5 max-w-2xl text-[#7c7365]">{d.home.pillarsLead}</p>
          </Reveal>

          <div className="mt-16 grid gap-12 md:mt-20 md:grid-cols-3 md:gap-10">
            {d.home.pillars.map((p, i) => (
              <Reveal key={p.name} delay={i * 130}>
                <div className="text-center md:px-3">
                  <span className="display text-[26px] text-[#a8863f]/70">
                    {["I", "II", "III"][i]}
                  </span>
                  <div className="rule-diamond mx-auto mt-5 w-24">
                    <span />
                  </div>
                  <h3 className="display mt-6 text-[19px] uppercase tracking-[0.12em]">{p.name}</h3>
                  <p className="serif mt-4 text-[16px] leading-relaxed text-[#7c7365]">{p.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ——————————— PEZZI IN EVIDENZA ——————————— */}
      {pieces.length > 0 && (
        <section className="bg-[#ece2d1]/45 px-5 py-24 md:px-10 md:py-32">
          <div className="mx-auto max-w-[1300px]">
            <Reveal className="text-center">
              <h2 className="display text-[28px] md:text-[40px]">{d.home.featuredTitle}</h2>
              <p className="lead mx-auto mt-5 max-w-2xl text-[#7c7365]">{d.home.featuredLead}</p>
            </Reveal>

            <div className="mt-14 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {pieces.map((p, i) => (
                <Reveal key={p.id} delay={(i % 3) * 110}>
                  <PieceCard piece={p} lang={lang} showPrices={settings.show_prices} priority={i < 3} />
                </Reveal>
              ))}
            </div>

            <Reveal className="mt-16 text-center">
              <Link href={`/${lang}/catalogo`} className="btn btn-outline">
                {d.home.featuredCta}
              </Link>
            </Reveal>
          </div>
        </section>
      )}

      {/* ——————————— COLLEZIONI ——————————— */}
      {collections.length > 0 && (
        <section className="bg-[#f7f2e8] px-5 py-24 md:px-10 md:py-32">
          <div className="mx-auto max-w-[1300px]">
            <Reveal className="text-center">
              <h2 className="display text-[28px] md:text-[40px]">{d.home.collectionsTitle}</h2>
              <p className="lead mx-auto mt-5 max-w-2xl text-[#7c7365]">{d.home.collectionsLead}</p>
            </Reveal>

            <div className="mt-14 grid gap-8 md:grid-cols-3">
              {collections.slice(0, 3).map((c, i) => (
                <Reveal key={c.id} delay={i * 120}>
                  <Link href={`/${lang}/collezioni/${c.slug}`} className="piece-card group block">
                    <div className="piece-frame relative aspect-[3/4] w-full">
                      {c.cover_url ? (
                        <Image
                          src={c.cover_url}
                          alt={L(c, "name", lang)}
                          fill
                          sizes="(max-width: 768px) 92vw, 30vw"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-[#14110d]">
                          <Laurel className="h-2/3 w-2/3 text-[#c8a75d] opacity-25" />
                        </div>
                      )}
                    </div>
                    <div className="pt-5 text-center">
                      <h3 className="display text-[19px] uppercase tracking-[0.1em] transition-colors group-hover:text-[#a8863f]">
                        {L(c, "name", lang)}
                      </h3>
                      <p className="eyebrow mt-3 text-[#a8863f]/80">{d.collections.view}</p>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ——————————— ATELIER ——————————— */}
      <section className="relative overflow-hidden bg-[#14110d] text-[#f7f2e8]">
        <div className="meander-band opacity-45" />
        <div className="mx-auto max-w-[900px] px-5 py-24 text-center md:px-10 md:py-32">
          <Reveal>
            <Palmette className="mx-auto h-9 w-12 text-[#c8a75d]/70" />
            <h2 className="display mt-8 text-[26px] md:text-[36px]">{d.home.atelierTitle}</h2>
            <p className="serif mx-auto mt-7 max-w-2xl text-[19px] leading-relaxed text-[#f7f2e8]/70">
              {(lang === "it" ? settings.about_it : settings.about_en) || d.home.atelierText}
            </p>
            <Link href={`/${lang}/atelier`} className="btn btn-outline-light mt-10">
              {d.home.atelierCta}
            </Link>
          </Reveal>
        </div>
        <div className="meander-band rotate-180 opacity-45" />
      </section>

      {/* ——————————— CTA WHATSAPP ——————————— */}
      <section className="bg-[#f7f2e8] px-5 py-24 text-center md:px-10 md:py-32">
        <Reveal>
          <h2 className="display mx-auto max-w-2xl text-[26px] md:text-[38px]">{d.home.ctaTitle}</h2>
          <p className="lead mx-auto mt-6 max-w-xl text-[#7c7365]">{d.home.ctaText}</p>
          <a
            href={waLink(settings.whatsapp_number, d.wa.generic)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-wa mt-10"
          >
            <WhatsAppGlyph className="h-4 w-4" />
            {d.contact.whatsapp}
          </a>
        </Reveal>
      </section>
    </>
  );
}
