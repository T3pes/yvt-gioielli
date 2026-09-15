import { WHATSAPP_NUMBER } from "@/lib/config";

/** Normalizza un numero in formato wa.me: solo cifre, senza + né spazi. */
export function normalizeWhatsApp(raw?: string | null): string {
  const fallback = WHATSAPP_NUMBER;
  const n = (raw || fallback).replace(/\D/g, "");
  return n || fallback;
}

export function waLink(number: string | null | undefined, message: string): string {
  return `https://wa.me/${normalizeWhatsApp(number)}?text=${encodeURIComponent(message)}`;
}
