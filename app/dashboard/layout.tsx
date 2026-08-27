import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import SignOutButton from "./sign-out-button";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: clinic } = await supabase
    .from("clinics")
    .select("name")
    .eq("owner_id", user.id)
    .single();

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50">
      <header className="bg-[#0F2B28] text-white">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <span className="font-bold">{clinic?.name ?? "لوحة التحكم"}</span>
          </div>
          <nav className="flex items-center gap-6 text-sm">
            <a href="/dashboard" className="text-[#E4EEEA] hover:text-[#E2A63C]">الرئيسية</a>
            <a href="/dashboard/appointments" className="text-[#E4EEEA] hover:text-[#E2A63C]">الحجوزات</a>
            <a href="/dashboard/doctors" className="text-[#E4EEEA] hover:text-[#E2A63C]">الأطباء</a>
            <SignOutButton />
          </nav>
        </div>
      </header>
      <div className="max-w-5xl mx-auto px-6 py-8">{children}</div>
    </div>
  );
}
