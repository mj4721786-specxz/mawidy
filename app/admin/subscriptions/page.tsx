import { createClient } from "@/lib/supabase/server";
import SubscriptionRow from "./subscription-row";

export default async function AdminSubscriptionsPage() {
  const supabase = createClient();

  const { data: subscriptions } = await supabase
    .from("subscriptions")
    .select("id, plan, price_iqd, status, clinic_id, clinics(name, slug)")
    .order("started_at", { ascending: false });

  const totalRevenue = (subscriptions ?? [])
    .filter((s) => s.status === "active")
    .reduce((sum, s) => sum + s.price_iqd, 0);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">الاشتراكات</h1>
      <p className="text-gray-500 mb-6">
        الإيرادات الشهرية المتوقعة (الاشتراكات المفعّلة فقط): {totalRevenue.toLocaleString()} د.ع
      </p>

      {(!subscriptions || subscriptions.length === 0) && (
        <p className="text-gray-500">ما في اشتراكات لسا.</p>
      )}

      <div className="space-y-3">
        {subscriptions?.map((s: any) => (
          <SubscriptionRow key={s.id} subscription={s} />
        ))}
      </div>
    </div>
  );
}
