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
    <div dir="rtl" className="min-h-screen bg-gray-50">
      <header className="bg-[#1B1420] text-white">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="font-bold">لوحة تحكم موعدي — Admin</span>
          <nav className="flex items-center gap-6 text-sm">
            <a href="/admin" className="text-gray-200 hover:text-[#E2A63C]">نظرة عامة</a>
            <a href="/admin/clinics" className="text-gray-200 hover:text-[#E2A63C]">العيادات</a>
            <a href="/admin/subscriptions" className="text-gray-200 hover:text-[#E2A63C]">الاشتراكات</a>
            <SignOutButton />
          </nav>
        </div>
      </header>
      <div className="max-w-5xl mx-auto px-6 py-8">{children}</div>
    </div>
  );
}
