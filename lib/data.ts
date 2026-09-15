import { createClient } from "@/lib/supabase/server";
import { BRAND_NAME, WHATSAPP_NUMBER } from "@/lib/config";
import type { Collection, Piece, SiteSettings } from "@/lib/types";

const FALLBACK_SETTINGS: SiteSettings = {
  id: true,
  brand_name: BRAND_NAME,
  tagline_it: "Gioielleria artigianale — ogni pezzo è unico",
  tagline_en: "Handcrafted jewellery — every piece is unique",
  about_it: null,
  about_en: null,
  whatsapp_number: WHATSAPP_NUMBER,
  email: null,
  phone: null,
  address: null,
  instagram_url: null,
  facebook_url: null,
  show_prices: false,
};

const PIECE_SELECT =
  "*, piece_images(id, piece_id, url, storage_path, alt_it, alt_en, sort_order), collections(id, slug, name_it, name_en)";

function sortImages(p: Piece): Piece {
  if (p.piece_images) {
    p.piece_images = [...p.piece_images].sort((a, b) => a.sort_order - b.sort_order);
  }
  return p;
}

export async function getSettings(): Promise<SiteSettings> {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("site_settings").select("*").single();
    return (data as SiteSettings) ?? FALLBACK_SETTINGS;
  } catch {
    return FALLBACK_SETTINGS;
  }
}

export async function getCollections(): Promise<Collection[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("collections")
      .select("*")
      .eq("is_published", true)
      .order("sort_order", { ascending: true });
    return (data as Collection[]) ?? [];
  } catch {
    return [];
  }
}

export async function getCollectionBySlug(slug: string): Promise<Collection | null> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("collections")
      .select("*")
      .eq("slug", slug)
      .eq("is_published", true)
      .maybeSingle();
    return (data as Collection) ?? null;
  } catch {
    return null;
  }
}

export async function getPieces(opts?: {
  collectionId?: string;
  status?: string;
  featured?: boolean;
  limit?: number;
  excludeId?: string;
}): Promise<Piece[]> {
  try {
    const supabase = await createClient();
    let q = supabase
      .from("pieces")
      .select(PIECE_SELECT)
      .eq("is_published", true)
      .neq("status", "archived")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (opts?.collectionId) q = q.eq("collection_id", opts.collectionId);
    if (opts?.status) q = q.eq("status", opts.status);
    if (opts?.featured) q = q.eq("is_featured", true);
    if (opts?.excludeId) q = q.neq("id", opts.excludeId);
    if (opts?.limit) q = q.limit(opts.limit);

    const { data } = await q;
    return ((data as unknown as Piece[]) ?? []).map(sortImages);
  } catch {
    return [];
  }
}

export async function getPieceBySlug(slug: string): Promise<Piece | null> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("pieces")
      .select(PIECE_SELECT)
      .eq("slug", slug)
      .eq("is_published", true)
      .maybeSingle();
    return data ? sortImages(data as unknown as Piece) : null;
  } catch {
    return null;
  }
}

export function formatPrice(cents: number | null, currency = "EUR", lang = "it") {
  if (cents == null) return null;
  return new Intl.NumberFormat(lang === "it" ? "it-IT" : "en-GB", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}
