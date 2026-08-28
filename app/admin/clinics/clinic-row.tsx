"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Clinic = {
  id: string;
  name: string;
  slug: string;
  phone: string | null;
  status: string;
  created_at: string;
};

export default function ClinicRow({ clinic }: { clinic: Clinic }) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);

  async function toggleStatus() {
    setLoading(true);
    const newStatus = clinic.status === "active" ? "suspended" : "active";
    await supabase.from("clinics").update({ status: newStatus }).eq("id", clinic.id);
    setLoading(false);
    router.refresh();
  }

  return (
    <div className="bg-white border rounded-lg p-4 flex items-center justify-between flex-wrap gap-2">
      <div>
        <div className="font-bold">{clinic.name}</div>
        <div className="text-sm text-gray-500" dir="ltr">/clinic/{clinic.slug}</div>
        {clinic.phone && <div className="text-sm text-gray-500" dir="ltr">{clinic.phone}</div>}
      </div>
      <div className="flex items-center gap-2">
        <span className={`text-xs px-3 py-1 rounded-full ${clinic.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
          {clinic.status === "active" ? "نشطة" : "موقوفة"}
        </span>
        <button
          onClick={toggleStatus}
          disabled={loading}
          className={`text-xs px-3 py-1.5 rounded text-white ${clinic.status === "active" ? "bg-red-600" : "bg-green-600"}`}
        >
          {clinic.status === "active" ? "إيقاف" : "تفعيل"}
        </button>
      </div>
    </div>
  );
}
