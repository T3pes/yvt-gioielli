import type { MetadataRoute } from "next";
import { getCollections, getPieces } from "@/lib/data";
import { LANGS } from "@/lib/i18n";
import { siteUrl } from "@/lib/config";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const [pieces, collections] = await Promise.all([getPieces({}), getCollections()]);

  const urls: MetadataRoute.Sitemap = [];
  for (const lang of LANGS) {
    urls.push(
      { url: `${base}/${lang}`, priority: 1 },
      { url: `${base}/${lang}/catalogo`, priority: 0.9 },
      { url: `${base}/${lang}/collezioni`, priority: 0.8 },
      { url: `${base}/${lang}/atelier`, priority: 0.6 },
      { url: `${base}/${lang}/contatti`, priority: 0.6 }
    );
    for (const c of collections) urls.push({ url: `${base}/${lang}/collezioni/${c.slug}`, priority: 0.7 });
    for (const p of pieces)
      urls.push({ url: `${base}/${lang}/pezzo/${p.slug}`, priority: 0.8, lastModified: p.updated_at });
  }
  return urls;
}
