import { createClient } from "@/lib/supabase/server";

export default async function PatientsPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: clinic } = await supabase
    .from("clinics")
    .select("id")
    .eq("owner_id", user!.id)
    .single();

  const { data: patients } = await supabase
    .from("patients")
    .select("id, full_name, phone, created_at")
    .eq("clinic_id", clinic?.id)
    .order("created_at", { ascending: false });

  const patientsWithStats = await Promise.all(
    (patients ?? []).map(async (p) => {
      const { data: appts } = await supabase
        .from("appointments")
        .select("appointment_date")
        .eq("patient_id", p.id)
        .order("appointment_date", { ascending: false });

      const today = new Date().toISOString().split("T")[0];
      const past = appts?.filter((a) => a.appointment_date <= today) ?? [];
      const future = appts?.filter((a) => a.appointment_date > today) ?? [];

      return {
        ...p,
        totalVisits: appts?.length ?? 0,
        lastVisit: past[0]?.appointment_date ?? null,
        nextVisit: future[future.length - 1]?.appointment_date ?? null,
      };
    })
  );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">المرضى</h1>

      {patientsWithStats.length === 0 && (
        <p className="text-gray-500">ما في مرضى مسجلين لسا.</p>
      )}

      <div className="bg-white border rounded-lg overflow-hidden">
        {patientsWithStats.length > 0 && (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="text-right p-3">الاسم</th>
                <th className="text-right p-3">الهاتف</th>
                <th className="text-right p-3">عدد الحجوزات</th>
                <th className="text-right p-3">آخر موعد</th>
                <th className="text-right p-3">الموعد القادم</th>
              </tr>
            </thead>
            <tbody>
              {patientsWithStats.map((p) => (
                <tr key={p.id} className="border-t">
                  <td className="p-3 font-medium">{p.full_name}</td>
                  <td className="p-3" dir="ltr">{p.phone}</td>
                  <td className="p-3">{p.totalVisits}</td>
                  <td className="p-3" dir="ltr">{p.lastVisit ?? "—"}</td>
                  <td className="p-3" dir="ltr">{p.nextVisit ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
