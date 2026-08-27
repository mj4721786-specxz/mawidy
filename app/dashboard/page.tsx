import { createClient } from "@/lib/supabase/server";

export default async function DashboardHome() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: clinic } = await supabase
    .from("clinics")
    .select("id")
    .eq("owner_id", user!.id)
    .single();

  const today = new Date().toISOString().split("T")[0];

  const [{ count: todayCount }, { count: upcomingCount }, { count: patientsCount }, { count: confirmedCount }, { count: cancelledCount }] =
    await Promise.all([
      supabase.from("appointments").select("*", { count: "exact", head: true }).eq("clinic_id", clinic?.id).eq("appointment_date", today),
      supabase.from("appointments").select("*", { count: "exact", head: true }).eq("clinic_id", clinic?.id).gt("appointment_date", today),
      supabase.from("patients").select("*", { count: "exact", head: true }).eq("clinic_id", clinic?.id),
      supabase.from("appointments").select("*", { count: "exact", head: true }).eq("clinic_id", clinic?.id).eq("status", "confirmed"),
      supabase.from("appointments").select("*", { count: "exact", head: true }).eq("clinic_id", clinic?.id).eq("status", "cancelled"),
    ]);

  const stats = [
    { label: "حجوزات اليوم", value: todayCount ?? 0 },
    { label: "حجوزات قادمة", value: upcomingCount ?? 0 },
    { label: "عدد المرضى", value: patientsCount ?? 0 },
    { label: "مواعيد مؤكدة", value: confirmedCount ?? 0 },
    { label: "مواعيد ملغاة", value: cancelledCount ?? 0 },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">نظرة عامة</h1>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white border rounded-lg p-5">
            <div className="text-3xl font-bold text-[#0F2B28]">{s.value}</div>
            <div className="text-sm text-gray-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <a href="/dashboard/appointments" className="inline-block mt-8 bg-[#E2A63C] text-[#0F2B28] font-bold px-5 py-2.5 rounded">
        عرض كل الحجوزات
      </a>
    </div>
  );
}
