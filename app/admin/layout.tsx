import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import SignOutButton from "../dashboard/sign-out-button";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: adminRow } = await supabase
    .from("admins")
    .select("user_id")
    .eq("user_id", user.id)
    .single();

  if (!adminRow) redirect("/dashboard");

  return (
    <div dir="rtl" className="min-h-screen bg-[#F5F8F8]">
      <header className="bg-white border-b border-black/5">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="font-bold text-[#111]">لوحة تحكم موعدي — Admin</span>
          <nav className="flex items-center gap-6 text-sm">
            <a href="/admin" className="text-[#4C5354] hover:text-[#1CBCCF]">نظرة عامة</a>
            <a href="/admin/clinics" className="text-[#4C5354] hover:text-[#1CBCCF]">العيادات</a>
            <a href="/admin/subscriptions" className="text-[#4C5354] hover:text-[#1CBCCF]">الاشتراكات</a>
            <SignOutButton />
          </nav>
        </div>
      </header>
      <div className="max-w-5xl mx-auto px-6 py-8">{children}</div>
    </div>
  );
}
