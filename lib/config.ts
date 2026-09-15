/**
 * Configurazione dell'installazione.
 * I valori arrivano dalle variabili d'ambiente; i fallback qui sotto corrispondono
 * al progetto Supabase di questa vetrina, così il sito funziona anche se una
 * variabile non è impostata. La chiave "publishable" è pubblica per definizione:
 * l'accesso reale ai dati è governato dalle policy RLS del database.
 */
export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://dxuefrkgncrqxipvglqa.supabase.co";

export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_3CxqJeJpQV7_zFk_hIpEpg_uYrqXohP";

export const BRAND_NAME = process.env.NEXT_PUBLIC_BRAND_NAME || "YVT Gioielli";

export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "393883670273";

/** URL pubblico del sito (solo lato server). */
export function siteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3000";
}
