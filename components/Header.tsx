"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Wordmark from "./Wordmark";
import { WhatsAppGlyph } from "./Ornaments";
import { t, type Lang } from "@/lib/i18n";
import { waLink } from "@/lib/whatsapp";

export default function Header({
  lang,
  brand,
  whatsapp,
}: {
  lang: Lang;
  brand: string;
  whatsapp: string;
}) {
  const d = t(lang);
  const pathname = usePathname();
  const overlay = pathname === `/${lang}` || pathname === `/${lang}/`;
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const nav = [
    { href: `/${lang}/collezioni`, label: d.nav.collections },
    { href: `/${lang}/catalogo`, label: d.nav.catalog },
    { href: `/${lang}/atelier`, label: d.nav.atelier },
    { href: `/${lang}/contatti`, label: d.nav.contact },
  ];

  const other: Lang = lang === "it" ? "en" : "it";
  const switchHref = (() => {
    const segs = (pathname || `/${lang}`).split("/");
    segs[1] = other;
    return segs.join("/") || `/${other}`;
  })();

  const light = overlay && !scrolled;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          light
            ? "bg-transparent text-[#f7f2e8]"
            : "bg-[#f7f2e8]/95 text-[#14110d] backdrop-blur-sm shadow-[0_1px_0_rgba(168,134,63,0.18)]"
        }`}
      >
        <div
          className={`mx-auto flex max-w-[1400px] items-center justify-between px-5 transition-all duration-500 md:px-10 ${
            scrolled ? "h-[68px]" : "h-[84px] md:h-[104px]"
          }`}
        >
          {/* sinistra: nav desktop / menu mobile */}
          <nav className="hidden flex-1 items-center gap-8 lg:flex">
            {nav.slice(0, 2).map((i) => (
              <Link
                key={i.href}
                href={i.href}
                className={`nav-link link-underline ${
                  pathname === i.href ? "text-[#a8863f]" : "hover:text-[#a8863f]"
                }`}
              >
                {i.label}
              </Link>
            ))}
          </nav>

          <button
            onClick={() => setOpen(true)}
            aria-label="Menu"
            className="flex flex-1 items-center lg:hidden"
          >
            <span className="flex flex-col gap-[5px]">
              <span className="block h-px w-[22px] bg-current" />
              <span className="block h-px w-[22px] bg-current" />
              <span className="block h-px w-[14px] bg-current" />
            </span>
          </button>

          {/* centro: marchio */}
          <Link href={`/${lang}`} className="shrink-0 px-4" aria-label={brand}>
            <Wordmark brand={brand} size={scrolled ? "sm" : "md"} />
          </Link>

          {/* destra */}
          <div className="flex flex-1 items-center justify-end gap-6">
            <nav className="hidden items-center gap-8 lg:flex">
              {nav.slice(2).map((i) => (
                <Link
                  key={i.href}
                  href={i.href}
                  className={`nav-link link-underline ${
                    pathname === i.href ? "text-[#a8863f]" : "hover:text-[#a8863f]"
                  }`}
                >
                  {i.label}
                </Link>
              ))}
            </nav>

            <div className="hidden items-center gap-2 text-[11px] tracking-[0.18em] md:flex">
              <span className={lang === "it" ? "text-[#a8863f]" : "opacity-45"}>IT</span>
              <span className="opacity-30">/</span>
              <Link href={switchHref} className={lang === "en" ? "text-[#a8863f]" : "opacity-45 hover:opacity-100"}>
                EN
              </Link>
            </div>

            <a
              href={waLink(whatsapp, d.wa.generic)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="transition-colors hover:text-[#a8863f]"
            >
              <WhatsAppGlyph className="h-[19px] w-[19px]" />
            </a>
          </div>
        </div>
        {!light && <div className="hairline" />}
      </header>

      {/* drawer mobile */}
      <div
        className={`fixed inset-0 z-[60] transition-opacity duration-400 lg:hidden ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="absolute inset-0 bg-[#14110d]/95 backdrop-blur-sm" onClick={() => setOpen(false)} />
        <div className="relative flex h-full flex-col items-center justify-center gap-9 text-[#f7f2e8]">
          <button
            onClick={() => setOpen(false)}
            aria-label="Chiudi"
            className="absolute right-6 top-7 text-2xl font-light text-[#e4cf9f]"
          >
            ×
          </button>
          <Wordmark brand={brand} size="md" className="mb-4 text-[#e4cf9f]" />
          {[{ href: `/${lang}`, label: d.nav.home }, ...nav].map((i) => (
            <Link
              key={i.href}
              href={i.href}
              className="display text-xl uppercase tracking-[0.2em] hover:text-[#e4cf9f]"
            >
              {i.label}
            </Link>
          ))}
          <div className="mt-4 flex items-center gap-3 text-[11px] tracking-[0.22em]">
            <Link href={`/it${(pathname || "").slice(3)}`} className={lang === "it" ? "text-[#e4cf9f]" : "opacity-50"}>
              ITALIANO
            </Link>
            <span className="opacity-30">/</span>
            <Link href={`/en${(pathname || "").slice(3)}`} className={lang === "en" ? "text-[#e4cf9f]" : "opacity-50"}>
              ENGLISH
            </Link>
          </div>
          <a
            href={waLink(whatsapp, d.wa.generic)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline-light mt-2"
          >
            <WhatsAppGlyph className="h-4 w-4" />
            WhatsApp
          </a>
        </div>
      </div>
    </>
  );
}
