"use client";

import Image from "next/image";
import { useState } from "react";
import { PiecePlaceholder } from "./Ornaments";
import type { PieceImage } from "@/lib/types";
import type { Lang } from "@/lib/i18n";

export default function Gallery({
  images,
  alt,
  lang,
}: {
  images: PieceImage[];
  alt: string;
  lang: Lang;
}) {
  const [active, setActive] = useState(0);

  if (!images.length) {
    return (
      <div className="aspect-[4/5] w-full">
        <PiecePlaceholder />
      </div>
    );
  }

  const current = images[Math.min(active, images.length - 1)];
  const altText = (lang === "it" ? current.alt_it : current.alt_en) || alt;

  return (
    <div>
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#ece2d1]">
        <Image
          key={current.id}
          src={current.url}
          alt={altText}
          fill
          sizes="(max-width: 1024px) 96vw, 52vw"
          className="object-cover"
          priority
        />
        <div className="pointer-events-none absolute inset-4 border border-[#e4cf9f]/25" />
      </div>

      {images.length > 1 && (
        <div className="mt-4 grid grid-cols-5 gap-3">
          {images.map((im, i) => (
            <button
              key={im.id}
              onClick={() => setActive(i)}
              aria-label={`${alt} — ${i + 1}`}
              className={`relative aspect-square overflow-hidden bg-[#ece2d1] transition-all duration-300 ${
                i === active ? "ring-1 ring-[#a8863f]" : "opacity-65 hover:opacity-100"
              }`}
            >
              <Image src={im.url} alt="" fill sizes="120px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
