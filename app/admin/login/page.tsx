"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Laurel } from "@/components/Ornaments";

function LoginForm() {
  const router = useRouter();
  const search = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await createClient().auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError("Credenziali non valide.");
      return;
    }
    router.push(search.get("next") || "/admin");
    router.refresh();
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#14110d] px-5 text-[#f7f2e8]">
      <Laurel className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 text-[#c8a75d] opacity-[0.10]" />
      <form onSubmit={onSubmit} className="relative z-10 w-full max-w-sm">
        <h1 className="display text-center text-[20px] uppercase tracking-[0.24em] text-[#e4cf9f]">
          Area riservata
        </h1>
        <p className="mt-3 text-center text-[12px] tracking-[0.1em] text-[#f7f2e8]/45">
          Accesso al gestionale dell&apos;atelier
        </p>

        <div className="mt-10 space-y-4">
          <div>
            <label className="label text-[#f7f2e8]/50">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="field border-[#a8863f]/40 bg-transparent text-[#f7f2e8]"
              autoComplete="username"
            />
          </div>
          <div>
            <label className="label text-[#f7f2e8]/50">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="field border-[#a8863f]/40 bg-transparent text-[#f7f2e8]"
              autoComplete="current-password"
            />
          </div>
        </div>

        {error && <p className="mt-4 text-center text-[13px] text-[#d98b74]">{error}</p>}

        <button type="submit" disabled={loading} className="btn btn-gold mt-8 w-full disabled:opacity-50">
          {loading ? "Accesso…" : "Entra"}
        </button>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
