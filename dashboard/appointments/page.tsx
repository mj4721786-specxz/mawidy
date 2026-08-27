import { createClient } from "@/lib/supabase/server";
import AppointmentRow from "./appointment-row";

export default async function AppointmentsPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: clinic } = await supabase
    .from("clinics")
    .select("id")
    .eq("owner_id", user!.id)
    .single();

  const { data: appointments } = await supabase
    .from("appointments")
    .select("id, appointment_date, appointment_time, status, doctors(full_name), patients(full_name, phone)")
    .eq("clinic_id", clinic?.id)
    .order("appointment_date", { ascending: true })
    .order("appointment_time", { ascending: true });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">الحجوزات</h1>

      {(!appointments || appointments.length === 0) && (
        <p className="text-gray-500">ما في حجوزات لسا.</p>
      )}

      <div className="space-y-3">
        {appointments?.map((a: any) => (
          <AppointmentRow key={a.id} appointment={a} />
        ))}
      </div>
    </div>
  );
}
