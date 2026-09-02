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
      ? `${window.location.origin}/c/${clinic.slug}`
      : `/c/${clinic.slug}`;

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(clinicUrl)}`;

  function copyLink() {
    navigator.clipboard.writeText(clinicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function shareLink() {
    if (navigator.share) {
      try {
        await navigator.share({ title: clinic.name, url: clinicUrl });
      } catch {
        // user cancelled — no action needed
      }
    } else {
      copyLink();
    }
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
        <div className="flex items-center gap-2 flex-wrap mb-4">
          <code dir="ltr" className="bg-gray-100 px-3 py-2 rounded text-sm flex-1 break-all">
            {clinicUrl}
          </code>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={copyLink} className="bg-[#1CBCCF] text-white hover:bg-[#17a3b4] px-4 py-2 rounded-full text-sm font-bold">
            {copied ? "تم النسخ ✓" : "نسخ الرابط"}
          </button>
          <button onClick={shareLink} className="border border-black/15 px-4 py-2 rounded-full text-sm font-bold text-[#111]">
            مشاركة
          </button>
        </div>

        <div className="mt-5 pt-5 border-t border-black/5 flex items-center gap-4">
          <img src={qrCodeUrl} alt="QR Code لرابط العيادة" className="w-24 h-24 border rounded" />
          <p className="text-sm text-gray-500">
            اطبع هذا الرمز وحطه بعيادتك — المريض يصوره بكاميرا جواله ويوصل لصفحة الحجز مباشرة.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="bg-white border rounded-lg p-5 space-y-3">
        <h2 className="font-bold">معلومات العيادة</h2>

        <div>
          <label className="block text-sm text-gray-600 mb-1">اسم العيادة</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="w-full border rounded p-2" />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">رقم الهاتف (يستخدم لاستقبال حجوزات واتساب)</label>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} dir="ltr" placeholder="9647701234567" className="w-full border rounded p-2" />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">العنوان</label>
          <input value={address} onChange={(e) => setAddress(e.target.value)} className="w-full border rounded p-2" />
        </div>

        <button type="submit" disabled={loading} className="bg-[#1CBCCF] text-white hover:bg-[#17a3b4] font-bold px-5 py-2 rounded-full disabled:opacity-50">
          {loading ? "جاري الحفظ..." : "حفظ التعديلات"}
        </button>
        {saved && <span className="text-green-600 text-sm mr-3">تم الحفظ ✓</span>}
      </form>
    </div>
  );
}
