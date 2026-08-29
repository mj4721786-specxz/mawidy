import { createClient } from "@/lib/supabase/server";
import AddDoctorForm from "./add-doctor-form";
import DoctorRow from "./doctor-row";
import { PLANS, PlanKey } from "@/lib/plans";

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

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("plan, status, started_at")
    .eq("clinic_id", clinic?.id)
    .order("started_at", { ascending: false })
    .limit(1)
    .single();

  const trialEndsAt = subscription
    ? new Date(new Date(subscription.started_at).getTime() + 7 * 24 * 60 * 60 * 1000)
    : null;
  const inTrialWindow = trialEndsAt ? new Date() < trialEndsAt : false;

  const plan = (subscription?.plan ?? "basic") as PlanKey;
  const maxDoctors = inTrialWindow ? Infinity : PLANS[plan].maxDoctors;
  const currentCount = doctors?.length ?? 0;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">الأطباء</h1>

      {inTrialWindow ? (
        <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded p-3 mb-4">
          أنت بفترة التجربة المجانية (أسبوع) — عدد أطباء غير محدود لكل الميزات. بعد الفترة بيرجع الحد حسب خطتك ({PLANS[plan].label}: {PLANS[plan].maxDoctors === Infinity ? "بلا حدود" : `${PLANS[plan].maxDoctors} طبيب`}).
        </p>
      ) : (
        <p className="text-sm text-gray-500 mb-4">
          خطتك الحالية: <strong>{PLANS[plan].label}</strong> — {currentCount}/{maxDoctors === Infinity ? "∞" : maxDoctors} طبيب مستخدم
        </p>
      )}

      <AddDoctorForm clinicId={clinic?.id} canAddMore={currentCount < maxDoctors} />

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
