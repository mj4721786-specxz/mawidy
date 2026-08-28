import { createClient } from "@/lib/supabase/server";
import AddDoctorForm from "./add-doctor-form";
import DoctorRow from "./doctor-row";

export default async function DoctorsPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: clinic } = await supabase
    .from("clinics")
    .select("id")
    .eq("owner_id", user!.id)
    .single();

  const { data: doctors } = await supabase
    .from("doctors")
    .select("id, full_name, specialty, slot_duration_minutes, is_active")
    .eq("clinic_id", clinic?.id)
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">الأطباء</h1>

      <AddDoctorForm clinicId={clinic?.id} />

      <div className="mt-8 space-y-3">
        {(!doctors || doctors.length === 0) && (
          <p className="text-gray-500">ما في أطباء مضافين لسا.</p>
        )}
        {doctors?.map((d) => (
          <DoctorRow key={d.id} doctor={d} />
        ))}
      </div>
    </div>
  );
}
