import Link from "next/link";
import Wordmark from "./Wordmark";
import { Palmette, WhatsAppGlyph } from "./Ornaments";
import { t, type Lang } from "@/lib/i18n";
import { waLink } from "@/lib/whatsapp";
import type { SiteSettings } from "@/lib/types";

export default function Footer({ lang, settings }: { lang: Lang; settings: SiteSettings }) {
  const d = t(lang);
  const tagline = (lang === "it" ? settings.tagline_it : settings.tagline_en) || d.footer.tagline;

  const nav = [
    { href: `/${lang}/collezioni`, label: d.nav.collections },
    { href: `/${lang}/catalogo`, label: d.nav.catalog },
    { href: `/${lang}/atelier`, label: d.nav.atelier },
    { href: `/${lang}/contatti`, label: d.nav.contact },
  ];

  return (
    <footer className="bg-[#14110d] text-[#f7f2e8]">
      <div className="meander-band opacity-60" />
      <div className="mx-auto max-w-[1400px] px-5 py-16 md:px-10 md:py-20">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Wordmark brand={settings.brand_name} size="md" className="text-[#e4cf9f]" />
            <p className="serif mt-6 max-w-sm text-[17px] leading-relaxed text-[#f7f2e8]/65">
              {tagline}
            </p>
            <Palmette className="mt-7 h-8 w-11 text-[#a8863f]/60" />
          </div>

          <div>
            <h3 className="eyebrow text-[#a8863f]">{d.footer.nav}</h3>
            <ul className="mt-5 space-y-3">
              {nav.map((i) => (
                <li key={i.href}>
                  <Link href={i.href} className="link-underline text-[13px] text-[#f7f2e8]/75 hover:text-[#e4cf9f]">
                    {i.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="eyebrow text-[#a8863f]">{d.footer.contact}</h3>
            <ul className="mt-5 space-y-3 text-[13px] text-[#f7f2e8]/75">
              {settings.address && <li className="max-w-[240px] whitespace-pre-line">{settings.address}</li>}
              {settings.phone && (
                <li>
                  <a href={`tel:${settings.phone.replace(/\s/g, "")}`} className="link-underline hover:text-[#e4cf9f]">
                    {settings.phone}
                  </a>
                </li>
              )}
              {settings.email && (
                <li>
                  <a href={`mailto:${settings.email}`} className="link-underline hover:text-[#e4cf9f]">
                    {settings.email}
                  </a>
                </li>
              )}
            </ul>

            <a
              href={waLink(settings.whatsapp_number, d.wa.generic)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline-light mt-7"
            >
              <WhatsAppGlyph className="h-4 w-4" />
              WhatsApp
            </a>

            {(settings.instagram_url || settings.facebook_url) && (
              <div className="mt-6 flex gap-5 text-[11px] uppercase tracking-[0.2em] text-[#f7f2e8]/55">
                {settings.instagram_url && (
                  <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" className="hover:text-[#e4cf9f]">
                    Instagram
                  </a>
                )}
                {settings.facebook_url && (
                  <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" className="hover:text-[#e4cf9f]">
                    Facebook
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-[#a8863f]/20 pt-7 text-[11px] tracking-[0.14em] text-[#f7f2e8]/40 md:flex-row">
          <span>
            © {new Date().getFullYear()} {settings.brand_name} — {d.footer.rights}
          </span>
          <Link href="/admin" className="hover:text-[#e4cf9f]/70">
            {lang === "it" ? "Area riservata" : "Private area"}
          </Link>
        </div>
      </div>
    </footer>
  );
}
