import { notFound } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import { Laurel, MeanderCorner } from "@/components/Ornaments";
import { getSettings } from "@/lib/data";
import { isLang, t, type Lang } from "@/lib/i18n";

export const revalidate = 60;

export default async function Atelier({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: raw } = await params;
  if (!isLang(raw)) notFound();
  const lang = raw as Lang;
  const d = t(lang);
  const settings = await getSettings();
  const about = lang === "it" ? settings.about_it : settings.about_en;

  return (
    <>
      <PageHeader title={d.atelierPage.title} lead={d.atelierPage.lead} />

      <section className="bg-[#f7f2e8] px-5 pb-24 md:px-10">
        <div className="mx-auto max-w-[780px]">
          {about && (
            <Reveal>
              <p className="serif mb-14 text-[20px] leading-relaxed text-[#3a342b]">{about}</p>
            </Reveal>
          )}

          <div className="space-y-14">
            {d.atelierPage.sections.map((s, i) => (
              <Reveal key={s.h} delay={i * 110}>
                <div className="grid gap-4 md:grid-cols-[150px_1fr] md:gap-10">
                  <h2 className="display text-[15px] uppercase tracking-[0.16em] text-[#a8863f] md:pt-1.5">
                    {s.h}
                  </h2>
                  <p className="serif text-[18px] leading-relaxed text-[#3a342b]">{s.p}</p>
                </div>
                <div className="hairline mt-14" />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#14110d] px-5 py-28 text-center text-[#f7f2e8] md:px-10">
        <Laurel className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 text-[#c8a75d] opacity-[0.12]" />
        <MeanderCorner className="absolute left-6 top-8 hidden h-10 w-10 text-[#c8a75d]/25 md:block" />
        <MeanderCorner className="absolute bottom-8 right-6 hidden h-10 w-10 -scale-x-100 -scale-y-100 text-[#c8a75d]/25 md:block" />
        <Reveal className="relative z-10">
          <p className="serif mx-auto max-w-2xl text-[22px] italic leading-relaxed text-[#f7f2e8]/80 md:text-[27px]">
            {lang === "it"
              ? "«Un gioiello non si misura in grammi: si misura nel tempo che qualcuno ha scelto di dedicargli.»"
              : "“A jewel is not measured in grams: it is measured by the time someone chose to give it.”"}
          </p>
        </Reveal>
      </section>
    </>
  );
}
