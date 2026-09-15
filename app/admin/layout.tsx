import { createClient } from "@/lib/supabase/server";
import AdminNav from "@/components/admin/AdminNav";

export const metadata = { title: "Area riservata", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return <>{children}</>;

  return (
    <div className="min-h-screen bg-[#f7f2e8]">
      <AdminNav email={user.email ?? ""} />
      <div className="mx-auto max-w-[1180px] px-5 py-10 md:px-8">{children}</div>
    </div>
  );
}
