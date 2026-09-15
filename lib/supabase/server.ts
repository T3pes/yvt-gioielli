import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { SUPABASE_ANON_KEY, SUPABASE_URL } from "@/lib/config";

const url = SUPABASE_URL;
const key = SUPABASE_ANON_KEY;

/** Client per Server Component: legge la sessione dai cookie, non scrive. */
export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // chiamato da un Server Component: il refresh avviene nel middleware
        }
      },
    },
  });
}
