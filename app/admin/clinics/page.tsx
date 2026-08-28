import { createClient } from "@/lib/supabase/server";
import ClinicRow from "./clinic-row";

export default async function AdminClinicsPage() {
  const supabase = createClient();

  const { data: clinics } = await supabase
    .from("clinics")
    .select("id, name, slug, phone, status, created_at")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">العيادات ({clinics?.length ?? 0})</h1>

      {(!clinics || clinics.length === 0) && (
        <p className="text-gray-500">ما في عيادات مسجلة لسا.</p>
      )}

      <div className="space-y-3">
        {clinics?.map((c) => (
          <ClinicRow key={c.id} clinic={c} />
        ))}
      </div>
    </div>
  );
}
