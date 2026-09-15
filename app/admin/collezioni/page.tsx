"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { fileExt, slugify } from "@/lib/slug";
import type { Collection } from "@/lib/types";

const BLANK = {
  id: "",
  slug: "",
  name_it: "",
  name_en: "",
  description_it: "",
  description_en: "",
  cover_url: "",
  sort_order: 0,
  is_published: true,
};
type Draft = typeof BLANK;

export default function AdminCollezioni() {
  const supabase = createClient();
  const [items, setItems] = useState<Collection[]>([]);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const { data } = await supabase.from("collections").select("*").order("sort_order");
    setItems((data as Collection[]) ?? []);
  }, [supabase]);

  useEffect(() => {
    load();
  }, [load]);

  function edit(c: Collection) {
    setDraft({
      id: c.id,
      slug: c.slug,
      name_it: c.name_it,
      name_en: c.name_en ?? "",
      description_it: c.description_it ?? "",
      description_en: c.description_en ?? "",
      cover_url: c.cover_url ?? "",
      sort_order: c.sort_order,
      is_published: c.is_published,
    });
  }

  async function save() {
    if (!draft) return;
    setBusy(true);
    setError(null);
    const payload = {
      slug: draft.slug || slugify(draft.name_it),
      name_it: draft.name_it,
      name_en: draft.name_en || draft.name_it,
      description_it: draft.description_it || null,
      description_en: draft.description_en || null,
      cover_url: draft.cover_url || null,
      sort_order: Number(draft.sort_order) || 0,
      is_published: draft.is_published,
    };
    const res = draft.id
      ? await supabase.from("collections").update(payload).eq("id", draft.id)
      : await supabase.from("collections").insert(payload);
    setBusy(false);
    if (res.error) return setError(res.error.message);
    setDraft(null);
    load();
  }

  async function remove(c: Collection) {
    if (!confirm(`Eliminare la collezione “${c.name_it}”? I pezzi resteranno, senza collezione.`)) return;
    await supabase.from("collections").delete().eq("id", c.id);
    load();
  }

  async function uploadCover(file: File) {
    setBusy(true);
    const path = `collezioni/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${fileExt(file.name)}`;
    const { error: upErr } = await supabase.storage.from("pieces").upload(path, file);
    if (upErr) {
      setBusy(false);
      return setError(upErr.message);
    }
    const { data } = supabase.storage.from("pieces").getPublicUrl(path);
    setDraft((d) => (d ? { ...d, cover_url: data.publicUrl } : d));
    setBusy(false);
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="display text-[26px]">Collezioni</h1>
          <p className="mt-1 text-[13px] text-[#7c7365]">
            Raggruppano i pezzi per repertorio: Etrusca, Magna Grecia, Bizantina…
          </p>
        </div>
        <button onClick={() => setDraft({ ...BLANK })} className="btn btn-gold">
          Nuova collezione
        </button>
      </div>

      {error && <p className="mt-4 text-[13px] text-[#8c4a34]">{error}</p>}

      {draft && (
        <div className="mt-7 border border-[#a8863f]/25 bg-white p-6">
          <h2 className="display mb-5 text-[15px] uppercase tracking-[0.16em] text-[#a8863f]">
            {draft.id ? "Modifica collezione" : "Nuova collezione"}
          </h2>
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="label">Nome (IT) *</label>
              <input
                value={draft.name_it}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    name_it: e.target.value,
                    slug: draft.id ? draft.slug : slugify(e.target.value),
                  })
                }
                className="field"
              />
            </div>
            <div>
              <label className="label">Name (EN)</label>
              <input
                value={draft.name_en}
                onChange={(e) => setDraft({ ...draft, name_en: e.target.value })}
                className="field"
              />
            </div>
            <div>
              <label className="label">Descrizione (IT)</label>
              <textarea
                rows={3}
                value={draft.description_it}
                onChange={(e) => setDraft({ ...draft, description_it: e.target.value })}
                className="field"
              />
            </div>
            <div>
              <label className="label">Description (EN)</label>
              <textarea
                rows={3}
                value={draft.description_en}
                onChange={(e) => setDraft({ ...draft, description_en: e.target.value })}
                className="field"
              />
            </div>
            <div>
              <label className="label">Slug</label>
              <input
                value={draft.slug}
                onChange={(e) => setDraft({ ...draft, slug: slugify(e.target.value) })}
                className="field"
              />
            </div>
            <div>
              <label className="label">Ordine</label>
              <input
                type="number"
                value={draft.sort_order}
                onChange={(e) => setDraft({ ...draft, sort_order: Number(e.target.value) })}
                className="field"
              />
            </div>
            <div className="md:col-span-2">
              <label className="label">Immagine di copertina</label>
              <div className="flex flex-wrap items-center gap-4">
                {draft.cover_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={draft.cover_url} alt="" className="h-20 w-20 object-cover" />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && uploadCover(e.target.files[0])}
                  className="text-[13px] file:mr-3 file:border file:border-[#a8863f]/40 file:bg-transparent file:px-4 file:py-2 file:text-[11px] file:uppercase file:tracking-[0.18em] file:text-[#a8863f]"
                />
                {draft.cover_url && (
                  <button
                    type="button"
                    onClick={() => setDraft({ ...draft, cover_url: "" })}
                    className="text-[12px] text-[#8c4a34] hover:underline"
                  >
                    Rimuovi
                  </button>
                )}
              </div>
            </div>
            <label className="flex items-center gap-2 text-[13px]">
              <input
                type="checkbox"
                checked={draft.is_published}
                onChange={(e) => setDraft({ ...draft, is_published: e.target.checked })}
                className="h-4 w-4 accent-[#a8863f]"
              />
              Visibile sul sito
            </label>
          </div>

          <div className="mt-6 flex gap-4">
            <button onClick={save} disabled={busy} className="btn btn-gold disabled:opacity-50">
              {busy ? "Salvataggio…" : "Salva"}
            </button>
            <button onClick={() => setDraft(null)} className="btn btn-outline">
              Annulla
            </button>
          </div>
        </div>
      )}

      <div className="mt-8 divide-y divide-[#a8863f]/15 border border-[#a8863f]/20 bg-white">
        {items.length === 0 && (
          <p className="p-8 text-center text-[13px] text-[#7c7365]">Nessuna collezione.</p>
        )}
        {items.map((c) => (
          <div key={c.id} className="flex items-center gap-4 p-4">
            <div className="h-14 w-14 shrink-0 overflow-hidden bg-[#ece2d1]">
              {c.cover_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={c.cover_url} alt="" className="h-full w-full object-cover" />
              )}
            </div>
            <div className="flex-1">
              <p className="text-[14px]">{c.name_it}</p>
              <p className="text-[12px] text-[#7c7365]">
                /{c.slug} {c.is_published ? "" : "— nascosta"}
              </p>
            </div>
            <button onClick={() => edit(c)} className="text-[12px] text-[#a8863f] hover:underline">
              Modifica
            </button>
            <button onClick={() => remove(c)} className="text-[12px] text-[#8c4a34] hover:underline">
              Elimina
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
