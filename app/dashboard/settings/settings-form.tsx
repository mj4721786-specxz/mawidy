"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Clinic = {
  id: string;
  name: string;
  slug: string;
  phone: string | null;
  address: string | null;
};

export default function SettingsForm({ clinic }: { clinic: Clinic }) {
  const router = useRouter();
  const supabase = createClient();

  const [name, setName] = useState(clinic.name);
  const [phone, setPhone] = useState(clinic.phone ?? "");
  const [address, setAddress] = useState(clinic.address ?? "");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  const clinicUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/clinic/${clinic.slug}`
      : `/clinic/${clinic.slug}`;

  function copyLink() {
    navigator.clipboard.writeText(clinicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setSaved(false);

    await supabase
      .from("clinics")
      .update({ name, phone, address })
      .eq("id", clinic.id);

    setLoading(false);
    setSaved(true);
    router.refresh();
  }

  return (
    <div className="space-y-6 max-w-lg">
      <div className="bg-white border rounded-lg p-5">
        <h2 className="font-bold mb-2">رابط عيادتك (شاركه مع مرضاك)</h2>
        <div className="flex items-center gap-2 flex-wrap">
          <code dir="ltr" className="bg-gray-100 px-3 py-2 rounded text-sm flex-1 break-all">
            {clinicUrl}
          </code>
          <button onClick={copyLink} className="bg-[#0F2B28] text-white px-4 py-2 rounded text-sm font-bold">
            {copied ? "تم النسخ ✓" : "نسخ الرابط"}
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="bg-white border rounded-lg p-5 space-y-3">
        <h2 className="font-bold">معلومات العيادة</h2>

        <div>
          <label className="block text-sm text-gray-600 mb-1">اسم العيادة</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="w-full border rounded p-2" />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">رقم الهاتف</label>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} dir="ltr" className="w-full border rounded p-2" />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">العنوان</label>
          <input value={address} onChange={(e) => setAddress(e.target.value)} className="w-full border rounded p-2" />
        </div>

        <button type="submit" disabled={loading} className="bg-[#E2A63C] text-[#0F2B28] font-bold px-5 py-2 rounded disabled:opacity-50">
          {loading ? "جاري الحفظ..." : "حفظ التعديلات"}
        </button>
        {saved && <span className="text-green-600 text-sm mr-3">تم الحفظ ✓</span>}
      </form>
    </div>
  );
}
