"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { PLANS, PlanKey } from "@/lib/plans";

type Subscription = {
  id: string;
  plan: string;
  price_iqd: number;
  status: string;
  clinics: { name: string; slug: string } | null;
};

export default function SubscriptionRow({ subscription }: { subscription: Subscription }) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);

  async function changePlan(newPlan: PlanKey) {
    setLoading(true);
    await supabase
      .from("subscriptions")
      .update({ plan: newPlan, price_iqd: PLANS[newPlan].priceIqd, status: "active" })
      .eq("id", subscription.id);
    setLoading(false);
    router.refresh();
  }

  return (
    <div className="bg-white border rounded-lg p-4 flex items-center justify-between flex-wrap gap-3">
      <div>
        <div className="font-bold">{subscription.clinics?.name ?? "—"}</div>
        <div className="text-sm text-gray-500" dir="ltr">/clinic/{subscription.clinics?.slug}</div>
      </div>

      <div className="flex items-center gap-2">
        <span
          className={`text-xs px-3 py-1 rounded-full ${
            subscription.status === "trial"
              ? "bg-blue-100 text-blue-700"
              : subscription.status === "active"
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {subscription.status === "trial" ? "تجريبي" : subscription.status === "active" ? "مفعّل" : subscription.status}
        </span>

        {(Object.keys(PLANS) as PlanKey[]).map((key) => (
          <button
            key={key}
            onClick={() => changePlan(key)}
            disabled={loading}
            className={`text-xs px-3 py-1.5 rounded font-bold ${
              subscription.plan === key ? "bg-[#1B1420] text-white" : "border text-gray-600"
            }`}
          >
            {PLANS[key].label}
          </button>
        ))}
      </div>
    </div>
  );
}
