"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { SiteSettings } from "@/lib/types";

export default function Impostazioni() {
  const supabase = createClient();
  const [s, setS] = useState<SiteSettings | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("site_settings").select("*").single();
      setS(data as SiteSettings);
    })();
  }, [supabase]);

  function set<K extends keyof SiteSettings>(k: K, v: SiteSettings[K]) {
    setS((prev) => (prev ? { ...prev, [k]: v } : prev));
  }

  async function save() {
    if (!s) return;
    setBusy(true);
    setError(null);
    setMsg(null);
    const { error } = await supabase
      .from("site_settings")
      .update({
        brand_name: s.brand_name,
        tagline_it: s.tagline_it,
        tagline_en: s.tagline_en,
        about_it: s.about_it,
        about_en: s.about_en,
        whatsapp_number: (s.whatsapp_number || "").replace(/\D/g, ""),
        email: s.email,
        phone: s.phone,
        address: s.address,
        instagram_url: s.instagram_url,
        facebook_url: s.facebook_url,
        show_prices: s.show_prices,
      })
      .eq("id", true);
    setBusy(false);
    if (error) return setError(error.message);
    setMsg("Impostazioni salvate. Il sito si aggiorna entro un minuto.");
  }

  if (!s) return <p className="text-[#7c7365]">Caricamento…</p>;

  const box = "border border-[#a8863f]/20 bg-white p-6";

  return (
    <div className="space-y-7 pb-24">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="display text-[26px]">Impostazioni</h1>
        <div className="flex items-center gap-4">
          {msg && <span className="text-[13px] text-[#4a7a52]">{msg}</span>}
          {error && <span className="text-[13px] text-[#8c4a34]">{error}</span>}
          <button onClick={save} disabled={busy} className="btn btn-gold disabled:opacity-50">
            {busy ? "Salvataggio…" : "Salva"}
          </button>
        </div>
      </div>

      <section className={box}>
        <h2 className="display mb-5 text-[15px] uppercase tracking-[0.16em] text-[#a8863f]">
          WhatsApp e prezzi
        </h2>
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="label">Numero WhatsApp del titolare</label>
            <input
              value={s.whatsapp_number ?? ""}
              onChange={(e) => set("whatsapp_number", e.target.value)}
              className="field"
            />
            <p className="mt-1 text-[11.5px] text-[#7c7365]">
              Formato internazionale senza “+” né spazi. Esempio: 393883670273. Tutti i pulsanti del
              sito scrivono a questo numero.
            </p>
          </div>
          <div>
            <label className="label">Prezzi</label>
            <label className="mt-2 flex items-center gap-3 text-[13.5px]">
              <input
                type="checkbox"
                checked={s.show_prices}
                onChange={(e) => set("show_prices", e.target.checked)}
                className="h-4 w-4 accent-[#a8863f]"
              />
              Mostra i prezzi sul sito
            </label>
            <p className="mt-2 text-[11.5px] text-[#7c7365]">
              Spento: ogni pezzo mostra “Prezzo su richiesta”. Acceso: compare il prezzo dei pezzi
              che ne hanno uno; gli altri restano su richiesta.
            </p>
          </div>
        </div>
      </section>

      <section className={box}>
        <h2 className="display mb-5 text-[15px] uppercase tracking-[0.16em] text-[#a8863f]">
          Identità
        </h2>
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="label">Nome della gioielleria</label>
            <input
              value={s.brand_name ?? ""}
              onChange={(e) => set("brand_name", e.target.value)}
              className="field"
            />
            <p className="mt-1 text-[11.5px] text-[#7c7365]">
              La prima parola diventa il marchio grande, il resto la riga sottile sotto.
            </p>
          </div>
          <div />
          <div>
            <label className="label">Motto (IT)</label>
            <input
              value={s.tagline_it ?? ""}
              onChange={(e) => set("tagline_it", e.target.value)}
              className="field"
            />
          </div>
          <div>
            <label className="label">Motto (EN)</label>
            <input
              value={s.tagline_en ?? ""}
              onChange={(e) => set("tagline_en", e.target.value)}
              className="field"
            />
          </div>
          <div>
            <label className="label">Chi siamo (IT)</label>
            <textarea
              rows={5}
              value={s.about_it ?? ""}
              onChange={(e) => set("about_it", e.target.value)}
              className="field"
            />
          </div>
          <div>
            <label className="label">About (EN)</label>
            <textarea
              rows={5}
              value={s.about_en ?? ""}
              onChange={(e) => set("about_en", e.target.value)}
              className="field"
            />
          </div>
        </div>
      </section>

      <section className={box}>
        <h2 className="display mb-5 text-[15px] uppercase tracking-[0.16em] text-[#a8863f]">
          Contatti
        </h2>
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="label">Email</label>
            <input value={s.email ?? ""} onChange={(e) => set("email", e.target.value)} className="field" />
          </div>
          <div>
            <label className="label">Telefono</label>
            <input value={s.phone ?? ""} onChange={(e) => set("phone", e.target.value)} className="field" />
          </div>
          <div>
            <label className="label">Indirizzo atelier</label>
            <textarea
              rows={3}
              value={s.address ?? ""}
              onChange={(e) => set("address", e.target.value)}
              className="field"
            />
          </div>
          <div className="space-y-5">
            <div>
              <label className="label">Instagram (URL)</label>
              <input
                value={s.instagram_url ?? ""}
                onChange={(e) => set("instagram_url", e.target.value)}
                className="field"
              />
            </div>
            <div>
              <label className="label">Facebook (URL)</label>
              <input
                value={s.facebook_url ?? ""}
                onChange={(e) => set("facebook_url", e.target.value)}
                className="field"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
