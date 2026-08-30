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
    <div dir="rtl" className="min-h-screen bg-[#F5F8F8]">
      <header className="bg-white border-b border-black/5">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <span className="font-bold text-[#111]">{clinic?.name ?? "لوحة التحكم"}</span>
          </div>
          <nav className="flex items-center gap-4 text-sm flex-wrap">
            <a href="/dashboard" className="text-[#4C5354] hover:text-[#1CBCCF]">الرئيسية</a>
            <a href="/dashboard/appointments" className="text-[#4C5354] hover:text-[#1CBCCF]">الحجوزات</a>
            <a href="/dashboard/doctors" className="text-[#4C5354] hover:text-[#1CBCCF]">الأطباء</a>
            <a href="/dashboard/patients" className="text-[#4C5354] hover:text-[#1CBCCF]">المرضى</a>
            <a href="/dashboard/hours" className="text-[#4C5354] hover:text-[#1CBCCF]">أوقات الدوام</a>
            <a href="/dashboard/settings" className="text-[#4C5354] hover:text-[#1CBCCF]">الإعدادات</a>
            <SignOutButton />
          </nav>
        </div>
      </header>
      <div className="max-w-5xl mx-auto px-6 py-8">{children}</div>
    </div>
  );
}
