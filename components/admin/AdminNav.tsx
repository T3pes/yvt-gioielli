"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const links = [
  { href: "/admin", label: "Pezzi" },
  { href: "/admin/collezioni", label: "Collezioni" },
  { href: "/admin/impostazioni", label: "Impostazioni" },
];

export default function AdminNav({ email }: { email: string }) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await createClient().auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <header className="border-b border-[#a8863f]/20 bg-[#14110d] text-[#f7f2e8]">
      <div className="mx-auto flex max-w-[1180px] flex-wrap items-center gap-x-8 gap-y-3 px-5 py-4 md:px-8">
        <Link href="/admin" className="display text-[15px] uppercase tracking-[0.24em] text-[#e4cf9f]">
          Atelier
        </Link>
        <nav className="flex flex-1 items-center gap-6">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-[11px] uppercase tracking-[0.18em] transition-colors ${
                pathname === l.href ? "text-[#e4cf9f]" : "text-[#f7f2e8]/60 hover:text-[#e4cf9f]"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/it"
          target="_blank"
          className="text-[11px] uppercase tracking-[0.18em] text-[#f7f2e8]/60 hover:text-[#e4cf9f]"
        >
          Vedi il sito ↗
        </Link>
        <span className="hidden text-[11px] text-[#f7f2e8]/40 md:inline">{email}</span>
        <button
          onClick={logout}
          className="text-[11px] uppercase tracking-[0.18em] text-[#f7f2e8]/60 hover:text-[#e4cf9f]"
        >
          Esci
        </button>
      </div>
    </header>
  );
}
