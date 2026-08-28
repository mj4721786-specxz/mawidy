import { createClient } from "@/lib/supabase/server";
import HoursEditor from "./hours-editor";

export default async function HoursPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: clinic } = await supabase
    .from("clinics")
    .select("id")
    .eq("owner_id", user!.id)
    .single();

  const { data: doctors } = await supabase
    .from("doctors")
    .select("id, full_name")
    .eq("clinic_id", clinic?.id);

  const { data: allHours } = await supabase
    .from("working_hours")
    .select("id, doctor_id, weekday, start_time, end_time");

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">أوقات الدوام</h1>

      {(!doctors || doctors.length === 0) && (
        <p className="text-gray-500">أضف طبيب أولاً من صفحة الأطباء حتى تقدر تحدد دوامه.</p>
      )}

      <div className="space-y-6">
        {doctors?.map((doc) => (
          <HoursEditor
            key={doc.id}
            doctorId={doc.id}
            doctorName={doc.full_name}
            initialHours={(allHours ?? []).filter((h) => h.doctor_id === doc.id)}
          />
        ))}
      </div>
    </div>
  );
}
