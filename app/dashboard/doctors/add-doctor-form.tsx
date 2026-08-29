"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AddDoctorForm({
  clinicId,
  canAddMore,
}: {
  clinicId: string | undefined;
  canAddMore: boolean;
}) {
  const router = useRouter();
  const supabase = createClient();

  const [fullName, setFullName] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [duration, setDuration] = useState(30);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!clinicId) return;
    setLoading(true);
    setError("");

    const { data: doctor, error: doctorError } = await supabase
      .from("doctors")
      .insert({
        clinic_id: clinicId,
        full_name: fullName,
        specialty,
        slot_duration_minutes: duration,
      })
      .select("id")
      .single();

    if (doctorError || !doctor) {
      setError("صار خطأ بإضافة الطبيب، حاول مرة تانية");
      setLoading(false);
      return;
    }

    const weekdays = [0, 1, 2, 3, 4];
    await supabase.from("working_hours").insert(
      weekdays.map((weekday) => ({
        doctor_id: doctor.id,
        weekday,
        start_time: "09:00",
        end_time: "17:00",
      }))
    );

    setFullName("");
    setSpecialty("");
    setDuration(30);
    setLoading(false);
    router.refresh();
  }

  if (!canAddMore) {
    return (
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-5 text-center">
        <p className="text-orange-800 font-bold mb-1">وصلت للحد الأقصى من الأطباء بخطتك الحالية</p>
        <p className="text-sm text-orange-700">روح لصفحة الاشتراكات وترقّى لخطة أعلى حتى تضيف أطباء أكتر.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border rounded-lg p-5 space-y-3">
      <h2 className="font-bold">إضافة طبيب جديد</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <input required placeholder="اسم الطبيب" value={fullName} onChange={(e) => setFullName(e.target.value)} className="border rounded p-2" />
        <input required placeholder="التخصص" value={specialty} onChange={(e) => setSpecialty(e.target.value)} className="border rounded p-2" />
        <select value={duration} onChange={(e) => setDuration(Number(e.target.value))} className="border rounded p-2">
          <option value={15}>15 دقيقة</option>
          <option value={30}>30 دقيقة</option>
          <option value={45}>45 دقيقة</option>
          <option value={60}>60 دقيقة</option>
        </select>
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <button type="submit" disabled={loading} className="bg-[#0F2B28] text-white px-5 py-2 rounded font-bold disabled:opacity-50">
        {loading ? "جاري الإضافة..." : "أضف الطبيب"}
      </button>
      <p className="text-xs text-gray-500">
        بيتحدد أوقات دوام افتراضية (الأحد–الخميس، 9ص–5م) — تقدر تعدلها لاحقاً.
      </p>
    </form>
  );
}
