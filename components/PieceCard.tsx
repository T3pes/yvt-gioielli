import Image from "next/image";
import Link from "next/link";
import { PiecePlaceholder } from "./Ornaments";
import { L, t, type Lang } from "@/lib/i18n";
import { formatPrice } from "@/lib/data";
import type { Piece } from "@/lib/types";

export default function PieceCard({
  piece,
  lang,
  showPrices,
  priority = false,
}: {
  piece: Piece;
  lang: Lang;
  showPrices: boolean;
  priority?: boolean;
}) {
  const d = t(lang);
  const img = piece.piece_images?.[0];
  const name = L(piece, "name", lang);
  const price = showPrices ? formatPrice(piece.price_cents, piece.currency, lang) : null;
  const unavailable = piece.status === "sold" || piece.status === "reserved";

  return (
    <Link href={`/${lang}/pezzo/${piece.slug}`} className="piece-card group block">
      <div className="piece-frame relative aspect-[4/5] w-full">
        {img ? (
          <Image
            src={img.url}
            alt={L(img as unknown as Record<string, unknown>, "alt", lang) || name}
            fill
            sizes="(max-width: 768px) 92vw, (max-width: 1280px) 45vw, 30vw"
            className="object-cover"
            priority={priority}
          />
        ) : (
          <PiecePlaceholder />
        )}

        {unavailable && (
          <span className="badge absolute left-4 top-4 z-10 bg-[#f7f2e8]/90 text-[#8c4a34]">
            {d.status[piece.status]}
          </span>
        )}
      </div>

      <div className="pt-5 text-center">
        <p className="eyebrow text-[#a8863f]/80">{piece.code}</p>
        <h3 className="display mt-2 text-[17px] leading-snug transition-colors group-hover:text-[#a8863f]">
          {name}
        </h3>
        <p className="serif mt-2 text-[15px] text-[#7c7365]">
          {price ?? d.piece.priceOnRequest}
        </p>
      </div>
    </Link>
  );
}
