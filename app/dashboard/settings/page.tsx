import { createClient } from "@/lib/supabase/server";
import SettingsForm from "./settings-form";

export default async function SettingsPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: clinic } = await supabase
    .from("clinics")
    .select("id, name, slug, phone, address")
    .eq("owner_id", user!.id)
    .single();

  if (!clinic) return <p className="text-gray-500">ما قدرنا نجيب بيانات عيادتك.</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">إعدادات العيادة</h1>
      <SettingsForm clinic={clinic} />
    </div>
  );
}
