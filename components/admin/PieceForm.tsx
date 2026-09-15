"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { fileExt, slugify } from "@/lib/slug";
import type { Collection, Piece, PieceImage } from "@/lib/types";

type FormState = {
  code: string;
  slug: string;
  collection_id: string;
  status: string;
  is_published: boolean;
  is_featured: boolean;
  sort_order: number;
  name_it: string;
  name_en: string;
  description_it: string;
  description_en: string;
  story_it: string;
  story_en: string;
  materials_it: string;
  materials_en: string;
  technique_it: string;
  technique_en: string;
  dimensions: string;
  weight_grams: string;
  price_eur: string;
  currency: string;
};

const EMPTY: FormState = {
  code: "",
  slug: "",
  collection_id: "",
  status: "available",
  is_published: true,
  is_featured: false,
  sort_order: 0,
  name_it: "",
  name_en: "",
  description_it: "",
  description_en: "",
  story_it: "",
  story_en: "",
  materials_it: "",
  materials_en: "",
  technique_it: "",
  technique_en: "",
  dimensions: "",
  weight_grams: "",
  price_eur: "",
  currency: "EUR",
};

function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div>
      <label className="label">{label}</label>
      {children}
      {hint && <p className="mt-1 text-[11.5px] text-[#7c7365]">{hint}</p>}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border border-[#a8863f]/20 bg-white p-6">
      <h2 className="display mb-5 text-[15px] uppercase tracking-[0.16em] text-[#a8863f]">{title}</h2>
      {children}
    </section>
  );
}

export default function PieceForm({ pieceId }: { pieceId?: string }) {
  const supabase = createClient();
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<FormState>(EMPTY);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [images, setImages] = useState<PieceImage[]>([]);
  const [loading, setLoading] = useState(!!pieceId);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [slugTouched, setSlugTouched] = useState(!!pieceId);

  useEffect(() => {
    (async () => {
      const { data: cols } = await supabase
        .from("collections")
        .select("*")
        .order("sort_order", { ascending: true });
      setCollections((cols as Collection[]) ?? []);

      if (!pieceId) return;
      const { data } = await supabase
        .from("pieces")
        .select("*, piece_images(*)")
        .eq("id", pieceId)
        .single();
      if (data) {
        const p = data as unknown as Piece;
        setForm({
          code: p.code,
          slug: p.slug,
          collection_id: p.collection_id ?? "",
          status: p.status,
          is_published: p.is_published,
          is_featured: p.is_featured,
          sort_order: p.sort_order,
          name_it: p.name_it ?? "",
          name_en: p.name_en ?? "",
          description_it: p.description_it ?? "",
          description_en: p.description_en ?? "",
          story_it: p.story_it ?? "",
          story_en: p.story_en ?? "",
          materials_it: p.materials_it ?? "",
          materials_en: p.materials_en ?? "",
          technique_it: p.technique_it ?? "",
          technique_en: p.technique_en ?? "",
          dimensions: p.dimensions ?? "",
          weight_grams: p.weight_grams != null ? String(p.weight_grams) : "",
          price_eur: p.price_cents != null ? (p.price_cents / 100).toFixed(2) : "",
          currency: p.currency ?? "EUR",
        });
        setImages([...(p.piece_images ?? [])].sort((a, b) => a.sort_order - b.sort_order));
      }
      setLoading(false);
    })();
  }, [pieceId, supabase]);

  function set<K extends keyof FormState>(k: K, v: FormState[K]) {
    setForm((f) => {
      const next = { ...f, [k]: v };
      if (k === "name_it" && !slugTouched) next.slug = slugify(String(v));
      return next;
    });
  }

  async function save(e?: React.FormEvent) {
    e?.preventDefault();
    setSaving(true);
    setError(null);
    setMsg(null);

    const payload = {
      code: form.code.trim(),
      slug: (form.slug || slugify(form.name_it)).trim(),
      collection_id: form.collection_id || null,
      status: form.status,
      is_published: form.is_published,
      is_featured: form.is_featured,
      sort_order: Number(form.sort_order) || 0,
      name_it: form.name_it.trim(),
      name_en: (form.name_en || form.name_it).trim(),
      description_it: form.description_it || null,
      description_en: form.description_en || null,
      story_it: form.story_it || null,
      story_en: form.story_en || null,
      materials_it: form.materials_it || null,
      materials_en: form.materials_en || null,
      technique_it: form.technique_it || null,
      technique_en: form.technique_en || null,
      dimensions: form.dimensions || null,
      weight_grams: form.weight_grams ? Number(form.weight_grams.replace(",", ".")) : null,
      price_cents: form.price_eur
        ? Math.round(Number(form.price_eur.replace(",", ".")) * 100)
        : null,
      currency: form.currency || "EUR",
    };

    if (pieceId) {
      const { error } = await supabase.from("pieces").update(payload).eq("id", pieceId);
      setSaving(false);
      if (error) return setError(error.message);
      setMsg("Modifiche salvate.");
      router.refresh();
    } else {
      const { data, error } = await supabase.from("pieces").insert(payload).select("id").single();
      setSaving(false);
      if (error) return setError(error.message);
      router.push(`/admin/pezzi/${(data as { id: string }).id}`);
    }
  }

  async function upload(files: FileList | null) {
    if (!files || !files.length || !pieceId) return;
    setUploading(true);
    setError(null);
    let order = images.length;

    for (const file of Array.from(files)) {
      const path = `${pieceId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${fileExt(file.name)}`;
      const { error: upErr } = await supabase.storage.from("pieces").upload(path, file, {
        cacheControl: "31536000",
        upsert: false,
      });
      if (upErr) {
        setError(`Caricamento non riuscito: ${upErr.message}`);
        continue;
      }
      const { data: pub } = supabase.storage.from("pieces").getPublicUrl(path);
      const { data: row, error: insErr } = await supabase
        .from("piece_images")
        .insert({
          piece_id: pieceId,
          url: pub.publicUrl,
          storage_path: path,
          sort_order: order++,
        })
        .select("*")
        .single();
      if (insErr) setError(insErr.message);
      if (row) setImages((prev) => [...prev, row as PieceImage]);
    }

    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  }

  async function removeImage(img: PieceImage) {
    if (!confirm("Eliminare questa fotografia?")) return;
    await supabase.from("piece_images").delete().eq("id", img.id);
    if (img.storage_path) await supabase.storage.from("pieces").remove([img.storage_path]);
    setImages((prev) => prev.filter((i) => i.id !== img.id));
  }

  async function move(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= images.length) return;
    const next = [...images];
    [next[index], next[target]] = [next[target], next[index]];
    setImages(next);
    await Promise.all(
      next.map((im, i) => supabase.from("piece_images").update({ sort_order: i }).eq("id", im.id))
    );
  }

  if (loading) return <p className="text-[#7c7365]">Caricamento…</p>;

  return (
    <form onSubmit={save} className="space-y-7 pb-24">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Link href="/admin" className="text-[11px] uppercase tracking-[0.18em] text-[#a8863f] hover:underline">
            ← Tutti i pezzi
          </Link>
          <h1 className="display mt-2 text-[26px]">
            {pieceId ? form.name_it || "Pezzo" : "Nuovo pezzo unico"}
          </h1>
        </div>
        <div className="flex items-center gap-4">
          {msg && <span className="text-[13px] text-[#4a7a52]">{msg}</span>}
          {error && <span className="text-[13px] text-[#8c4a34]">{error}</span>}
          <button type="submit" disabled={saving} className="btn btn-gold disabled:opacity-50">
            {saving ? "Salvataggio…" : pieceId ? "Salva modifiche" : "Crea pezzo"}
          </button>
        </div>
      </div>

      <Section title="Identità">
        <div className="grid gap-5 md:grid-cols-3">
          <Field label="Codice *" hint="Es. ET-014. Univoco, inciso sul pezzo.">
            <input
              required
              value={form.code}
              onChange={(e) => set("code", e.target.value)}
              className="field"
            />
          </Field>
          <Field label="Indirizzo web (slug)" hint="Compilato in automatico dal nome.">
            <input
              value={form.slug}
              onChange={(e) => {
                setSlugTouched(true);
                set("slug", slugify(e.target.value));
              }}
              className="field"
            />
          </Field>
          <Field label="Collezione">
            <select
              value={form.collection_id}
              onChange={(e) => set("collection_id", e.target.value)}
              className="field"
            >
              <option value="">— nessuna —</option>
              {collections.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name_it}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Stato">
            <select value={form.status} onChange={(e) => set("status", e.target.value)} className="field">
              <option value="available">Disponibile</option>
              <option value="reserved">Riservato</option>
              <option value="sold">Venduto</option>
              <option value="archived">Archivio (nascosto)</option>
            </select>
          </Field>
          <Field label="Ordine" hint="Numero più basso = più in alto.">
            <input
              type="number"
              value={form.sort_order}
              onChange={(e) => set("sort_order", Number(e.target.value))}
              className="field"
            />
          </Field>
          <div className="flex items-end gap-6 pb-1">
            <label className="flex items-center gap-2 text-[13px]">
              <input
                type="checkbox"
                checked={form.is_published}
                onChange={(e) => set("is_published", e.target.checked)}
                className="h-4 w-4 accent-[#a8863f]"
              />
              Visibile sul sito
            </label>
            <label className="flex items-center gap-2 text-[13px]">
              <input
                type="checkbox"
                checked={form.is_featured}
                onChange={(e) => set("is_featured", e.target.checked)}
                className="h-4 w-4 accent-[#a8863f]"
              />
              In home page
            </label>
          </div>
        </div>
      </Section>

      <Section title="Testi">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-5">
            <p className="eyebrow text-[#7c7365]">Italiano</p>
            <Field label="Nome *">
              <input required value={form.name_it} onChange={(e) => set("name_it", e.target.value)} className="field" />
            </Field>
            <Field label="Descrizione">
              <textarea
                rows={4}
                value={form.description_it}
                onChange={(e) => set("description_it", e.target.value)}
                className="field"
              />
            </Field>
            <Field label="Materiali">
              <input value={form.materials_it} onChange={(e) => set("materials_it", e.target.value)} className="field" />
            </Field>
            <Field label="Tecnica">
              <input value={form.technique_it} onChange={(e) => set("technique_it", e.target.value)} className="field" />
            </Field>
            <Field label="La storia" hint="Sezione narrativa a fondo scheda. Facoltativa.">
              <textarea rows={4} value={form.story_it} onChange={(e) => set("story_it", e.target.value)} className="field" />
            </Field>
          </div>

          <div className="space-y-5">
            <p className="eyebrow text-[#7c7365]">English</p>
            <Field label="Name" hint="Se vuoto, viene usato il nome italiano.">
              <input value={form.name_en} onChange={(e) => set("name_en", e.target.value)} className="field" />
            </Field>
            <Field label="Description">
              <textarea
                rows={4}
                value={form.description_en}
                onChange={(e) => set("description_en", e.target.value)}
                className="field"
              />
            </Field>
            <Field label="Materials">
              <input value={form.materials_en} onChange={(e) => set("materials_en", e.target.value)} className="field" />
            </Field>
            <Field label="Technique">
              <input value={form.technique_en} onChange={(e) => set("technique_en", e.target.value)} className="field" />
            </Field>
            <Field label="The story">
              <textarea rows={4} value={form.story_en} onChange={(e) => set("story_en", e.target.value)} className="field" />
            </Field>
          </div>
        </div>
      </Section>

      <Section title="Dettagli tecnici e prezzo">
        <div className="grid gap-5 md:grid-cols-4">
          <Field label="Dimensioni" hint="Es. Ø 18 mm — lunghezza 42 cm">
            <input value={form.dimensions} onChange={(e) => set("dimensions", e.target.value)} className="field" />
          </Field>
          <Field label="Peso (grammi)">
            <input value={form.weight_grams} onChange={(e) => set("weight_grams", e.target.value)} className="field" />
          </Field>
          <Field label="Prezzo" hint="In euro, es. 1450. Lascia vuoto per “su richiesta”.">
            <input value={form.price_eur} onChange={(e) => set("price_eur", e.target.value)} className="field" />
          </Field>
          <Field label="Valuta">
            <select value={form.currency} onChange={(e) => set("currency", e.target.value)} className="field">
              <option value="EUR">EUR €</option>
              <option value="USD">USD $</option>
              <option value="GBP">GBP £</option>
              <option value="CHF">CHF</option>
            </select>
          </Field>
        </div>
        <p className="mt-4 text-[12px] text-[#7c7365]">
          I prezzi compaiono sul sito solo se attivi l&apos;interruttore in{" "}
          <Link href="/admin/impostazioni" className="text-[#a8863f] underline">
            Impostazioni
          </Link>
          . Finché è spento, ogni pezzo mostra “Prezzo su richiesta”.
        </p>
      </Section>

      <Section title="Fotografie">
        {!pieceId ? (
          <p className="text-[13px] text-[#7c7365]">
            Salva prima il pezzo: subito dopo potrai caricare le fotografie.
          </p>
        ) : (
          <>
            <div className="flex flex-wrap items-center gap-4">
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif"
                multiple
                onChange={(e) => upload(e.target.files)}
                className="text-[13px] file:mr-3 file:border file:border-[#a8863f]/40 file:bg-transparent file:px-4 file:py-2 file:text-[11px] file:uppercase file:tracking-[0.18em] file:text-[#a8863f]"
              />
              {uploading && <span className="text-[13px] text-[#7c7365]">Caricamento…</span>}
            </div>
            <p className="mt-2 text-[11.5px] text-[#7c7365]">
              JPG, PNG o WebP fino a 10 MB. La prima immagine è quella di copertina; consigliato
              formato verticale 4:5, fondo neutro.
            </p>

            {images.length > 0 && (
              <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-5">
                {images.map((im, i) => (
                  <div key={im.id} className="group relative">
                    <div className="relative aspect-[4/5] overflow-hidden bg-[#ece2d1]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={im.url} alt="" className="h-full w-full object-cover" />
                      {i === 0 && (
                        <span className="absolute left-2 top-2 bg-[#a8863f] px-2 py-1 text-[9px] uppercase tracking-[0.15em] text-white">
                          Copertina
                        </span>
                      )}
                    </div>
                    <div className="mt-2 flex items-center justify-between text-[11px]">
                      <div className="flex gap-2">
                        <button type="button" onClick={() => move(i, -1)} className="text-[#a8863f] hover:underline">
                          ←
                        </button>
                        <button type="button" onClick={() => move(i, 1)} className="text-[#a8863f] hover:underline">
                          →
                        </button>
                      </div>
                      <button type="button" onClick={() => removeImage(im)} className="text-[#8c4a34] hover:underline">
                        Elimina
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </Section>

      <div className="flex items-center gap-4">
        <button type="submit" disabled={saving} className="btn btn-gold disabled:opacity-50">
          {saving ? "Salvataggio…" : pieceId ? "Salva modifiche" : "Crea pezzo"}
        </button>
        {pieceId && form.slug && (
          <Link
            href={`/it/pezzo/${form.slug}`}
            target="_blank"
            className="text-[12px] uppercase tracking-[0.16em] text-[#a8863f] hover:underline"
          >
            Vedi sul sito ↗
          </Link>
        )}
      </div>
    </form>
  );
}
