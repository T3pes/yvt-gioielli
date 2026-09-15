"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Piece } from "@/lib/types";

const STATUS_LABEL: Record<string, string> = {
  available: "Disponibile",
  reserved: "Riservato",
  sold: "Venduto",
  archived: "Archivio",
};

export default function AdminPieces() {
  const supabase = createClient();
  const [pieces, setPieces] = useState<Piece[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  const load = useCallback(async () => {
    const { data } = await supabase
      .from("pieces")
      .select("*, piece_images(id, url, sort_order), collections(id, slug, name_it, name_en)")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    setPieces((data as unknown as Piece[]) ?? []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    load();
  }, [load]);

  async function toggle(id: string, field: "is_published" | "is_featured", value: boolean) {
    setPieces((prev) => prev.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
    await supabase.from("pieces").update({ [field]: value }).eq("id", id);
  }

  async function setStatus(id: string, status: string) {
    setPieces((prev) => prev.map((p) => (p.id === id ? { ...p, status: status as Piece["status"] } : p)));
    await supabase.from("pieces").update({ status }).eq("id", id);
  }

  async function remove(id: string, code: string) {
    if (!confirm(`Eliminare definitivamente il pezzo ${code}? L'operazione non è reversibile.`)) return;
    await supabase.from("pieces").delete().eq("id", id);
    load();
  }

  const filtered = pieces.filter((p) => {
    const s = q.trim().toLowerCase();
    if (!s) return true;
    return (
      p.code.toLowerCase().includes(s) ||
      p.name_it.toLowerCase().includes(s) ||
      p.name_en.toLowerCase().includes(s)
    );
  });

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="display text-[26px]">Pezzi unici</h1>
          <p className="mt-1 text-[13px] text-[#7c7365]">
            {pieces.length} creazioni in archivio
          </p>
        </div>
        <div className="flex items-center gap-3">
          <input
            placeholder="Cerca codice o nome…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="field w-52"
          />
          <Link href="/admin/pezzi/nuovo" className="btn btn-gold">
            Nuovo pezzo
          </Link>
        </div>
      </div>

      <div className="mt-8 overflow-x-auto border border-[#a8863f]/20 bg-white">
        <table className="w-full min-w-[820px] text-left text-[13.5px]">
          <thead className="border-b border-[#a8863f]/20 bg-[#f7f2e8]">
            <tr className="text-[10.5px] uppercase tracking-[0.15em] text-[#7c7365]">
              <th className="p-3 font-normal">Foto</th>
              <th className="p-3 font-normal">Codice</th>
              <th className="p-3 font-normal">Nome</th>
              <th className="p-3 font-normal">Collezione</th>
              <th className="p-3 font-normal">Stato</th>
              <th className="p-3 text-center font-normal">Online</th>
              <th className="p-3 text-center font-normal">Home</th>
              <th className="p-3 font-normal"></th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={8} className="p-8 text-center text-[#7c7365]">
                  Caricamento…
                </td>
              </tr>
            )}
            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="p-10 text-center text-[#7c7365]">
                  Nessun pezzo. Inizia con “Nuovo pezzo”.
                </td>
              </tr>
            )}
            {filtered.map((p) => {
              const img = [...(p.piece_images ?? [])].sort((a, b) => a.sort_order - b.sort_order)[0];
              return (
                <tr key={p.id} className="border-b border-[#a8863f]/10 last:border-0">
                  <td className="p-3">
                    <div className="h-12 w-12 overflow-hidden bg-[#ece2d1]">
                      {img && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={img.url} alt="" className="h-full w-full object-cover" />
                      )}
                    </div>
                  </td>
                  <td className="p-3 font-mono text-[12px] text-[#a8863f]">{p.code}</td>
                  <td className="p-3">
                    <Link href={`/admin/pezzi/${p.id}`} className="hover:text-[#a8863f]">
                      {p.name_it}
                    </Link>
                  </td>
                  <td className="p-3 text-[#7c7365]">{p.collections?.name_it ?? "—"}</td>
                  <td className="p-3">
                    <select
                      value={p.status}
                      onChange={(e) => setStatus(p.id, e.target.value)}
                      className="field w-32 py-1.5 text-[12.5px]"
                    >
                      {Object.entries(STATUS_LABEL).map(([k, v]) => (
                        <option key={k} value={k}>
                          {v}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="p-3 text-center">
                    <input
                      type="checkbox"
                      checked={p.is_published}
                      onChange={(e) => toggle(p.id, "is_published", e.target.checked)}
                      className="h-4 w-4 accent-[#a8863f]"
                    />
                  </td>
                  <td className="p-3 text-center">
                    <input
                      type="checkbox"
                      checked={p.is_featured}
                      onChange={(e) => toggle(p.id, "is_featured", e.target.checked)}
                      className="h-4 w-4 accent-[#a8863f]"
                    />
                  </td>
                  <td className="p-3 text-right whitespace-nowrap">
                    <Link href={`/admin/pezzi/${p.id}`} className="text-[12px] text-[#a8863f] hover:underline">
                      Modifica
                    </Link>
                    <button
                      onClick={() => remove(p.id, p.code)}
                      className="ml-4 text-[12px] text-[#8c4a34] hover:underline"
                    >
                      Elimina
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
