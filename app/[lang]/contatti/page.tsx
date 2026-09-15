import { notFound } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import { WhatsAppGlyph } from "@/components/Ornaments";
import { getSettings } from "@/lib/data";
import { isLang, t, type Lang } from "@/lib/i18n";
import { waLink } from "@/lib/whatsapp";

export const revalidate = 60;

export default async function Contatti({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: raw } = await params;
  if (!isLang(raw)) notFound();
  const lang = raw as Lang;
  const d = t(lang);
  const s = await getSettings();

  const rows = [
    s.address && { k: d.contact.addressLabel, v: s.address, href: null as string | null },
    s.phone && { k: d.contact.phoneLabel, v: s.phone, href: `tel:${s.phone.replace(/\s/g, "")}` },
    s.email && { k: d.contact.emailLabel, v: s.email, href: `mailto:${s.email}` },
  ].filter(Boolean) as { k: string; v: string; href: string | null }[];

  return (
    <>
      <PageHeader title={d.contact.title} lead={d.contact.lead} />

      <section className="bg-[#f7f2e8] px-5 pb-28 md:px-10">
        <div className="mx-auto max-w-[640px] text-center">
          <Reveal>
            <a
              href={waLink(s.whatsapp_number, d.wa.generic)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-wa"
            >
              <WhatsAppGlyph className="h-4 w-4" />
              {d.contact.whatsapp}
            </a>
            <p className="serif mt-5 text-[15px] italic text-[#7c7365]">{d.contact.hoursNote}</p>
          </Reveal>

          {rows.length > 0 && (
            <Reveal delay={120}>
              <dl className="mt-14 divide-y divide-[#a8863f]/15 border-y border-[#a8863f]/15 text-left">
                {rows.map((r) => (
                  <div key={r.k} className="flex gap-6 py-4">
                    <dt className="w-28 shrink-0 text-[10.5px] uppercase tracking-[0.18em] text-[#7c7365]">
                      {r.k}
                    </dt>
                    <dd className="serif whitespace-pre-line text-[17px] text-[#3a342b]">
                      {r.href ? (
                        <a href={r.href} className="link-underline hover:text-[#a8863f]">
                          {r.v}
                        </a>
                      ) : (
                        r.v
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          )}

          {(s.instagram_url || s.facebook_url) && (
            <Reveal delay={200}>
              <p className="eyebrow mt-12 text-[#a8863f]">{d.contact.social}</p>
              <div className="mt-4 flex justify-center gap-7 text-[12px] uppercase tracking-[0.2em] text-[#7c7365]">
                {s.instagram_url && (
                  <a href={s.instagram_url} target="_blank" rel="noopener noreferrer" className="link-underline hover:text-[#a8863f]">
                    Instagram
                  </a>
                )}
                {s.facebook_url && (
                  <a href={s.facebook_url} target="_blank" rel="noopener noreferrer" className="link-underline hover:text-[#a8863f]">
                    Facebook
                  </a>
                )}
              </div>
            </Reveal>
          )}
        </div>
      </section>
    </>
  );
}
