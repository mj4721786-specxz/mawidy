import { createClient } from "@/lib/supabase/server";

export default async function AdminOverview() {
  const supabase = createClient();

  const [
    { count: clinicsCount },
    { count: activeClinicsCount },
    { count: doctorsCount },
    { count: patientsCount },
    { count: appointmentsCount },
  ] = await Promise.all([
    supabase.from("clinics").select("*", { count: "exact", head: true }),
    supabase.from("clinics").select("*", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("doctors").select("*", { count: "exact", head: true }),
    supabase.from("patients").select("*", { count: "exact", head: true }),
    supabase.from("appointments").select("*", { count: "exact", head: true }),
  ]);

  const stats = [
    { label: "إجمالي العيادات", value: clinicsCount ?? 0 },
    { label: "عيادات نشطة", value: activeClinicsCount ?? 0 },
    { label: "إجمالي الأطباء", value: doctorsCount ?? 0 },
    { label: "إجمالي المرضى", value: patientsCount ?? 0 },
    { label: "إجمالي الحجوزات", value: appointmentsCount ?? 0 },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">نظرة عامة على المنصة</h1>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white border rounded-lg p-5">
            <div className="text-3xl font-bold text-[#1CBCCF]">{s.value}</div>
            <div className="text-sm text-gray-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>
      <a href="/admin/clinics" className="inline-block mt-8 bg-[#1CBCCF] text-white hover:bg-[#17a3b4] font-bold px-5 py-2.5 rounded-full">
        إدارة العيادات
      </a>
    </div>
  );
}
