export type PieceStatus = "available" | "reserved" | "sold" | "archived";

export type Collection = {
  id: string;
  slug: string;
  name_it: string;
  name_en: string;
  description_it: string | null;
  description_en: string | null;
  cover_url: string | null;
  sort_order: number;
  is_published: boolean;
  created_at: string;
};

export type PieceImage = {
  id: string;
  piece_id: string;
  url: string;
  storage_path: string | null;
  alt_it: string | null;
  alt_en: string | null;
  sort_order: number;
};

export type Piece = {
  id: string;
  code: string;
  slug: string;
  collection_id: string | null;
  name_it: string;
  name_en: string;
  description_it: string | null;
  description_en: string | null;
  story_it: string | null;
  story_en: string | null;
  materials_it: string | null;
  materials_en: string | null;
  technique_it: string | null;
  technique_en: string | null;
  dimensions: string | null;
  weight_grams: number | null;
  price_cents: number | null;
  currency: string;
  status: PieceStatus;
  is_published: boolean;
  is_featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  piece_images?: PieceImage[];
  collections?: Pick<Collection, "id" | "slug" | "name_it" | "name_en"> | null;
};

export type SiteSettings = {
  id: boolean;
  brand_name: string;
  tagline_it: string | null;
  tagline_en: string | null;
  about_it: string | null;
  about_en: string | null;
  whatsapp_number: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  instagram_url: string | null;
  facebook_url: string | null;
  show_prices: boolean;
};
