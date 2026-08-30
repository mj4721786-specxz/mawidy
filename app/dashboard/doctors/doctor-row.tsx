"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Doctor = {
  id: string;
  full_name: string;
  specialty: string;
  slot_duration_minutes: number;
  is_active: boolean;
};

export default function DoctorRow({ doctor }: { doctor: Doctor }) {
  const router = useRouter();
  const supabase = createClient();

  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState(doctor.full_name);
  const [specialty, setSpecialty] = useState(doctor.specialty);
  const [duration, setDuration] = useState(doctor.slot_duration_minutes);
  const [loading, setLoading] = useState(false);

  async function saveEdit() {
    setLoading(true);
    await supabase
      .from("doctors")
      .update({ full_name: fullName, specialty, slot_duration_minutes: duration })
      .eq("id", doctor.id);
    setLoading(false);
    setEditing(false);
    router.refresh();
  }

  async function toggleActive() {
    setLoading(true);
    await supabase
      .from("doctors")
      .update({ is_active: !doctor.is_active })
      .eq("id", doctor.id);
    setLoading(false);
    router.refresh();
  }

  if (editing) {
    return (
      <div className="bg-white border rounded-lg p-4 space-y-2">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <input value={fullName} onChange={(e) => setFullName(e.target.value)} className="border rounded p-2" />
          <input value={specialty} onChange={(e) => setSpecialty(e.target.value)} className="border rounded p-2" />
          <select value={duration} onChange={(e) => setDuration(Number(e.target.value))} className="border rounded p-2">
            <option value={15}>15 دقيقة</option>
            <option value={30}>30 دقيقة</option>
            <option value={45}>45 دقيقة</option>
            <option value={60}>60 دقيقة</option>
          </select>
        </div>
        <div className="flex gap-2">
          <button onClick={saveEdit} disabled={loading} className="text-xs bg-[#1CBCCF] text-white hover:bg-[#17a3b4] px-4 py-2 rounded-full">
            حفظ
          </button>
          <button onClick={() => setEditing(false)} className="text-xs border px-4 py-2 rounded">
            إلغاء
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border rounded-lg p-4 flex items-center justify-between flex-wrap gap-2">
      <div>
        <div className="font-bold">{doctor.full_name}</div>
        <div className="text-sm text-gray-500">{doctor.specialty} — مدة الموعد {doctor.slot_duration_minutes} دقيقة</div>
      </div>
      <div className="flex items-center gap-2">
        <span className={`text-xs px-3 py-1 rounded-full ${doctor.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
          {doctor.is_active ? "نشط" : "معطّل"}
        </span>
        <button onClick={() => setEditing(true)} className="text-xs border px-3 py-1.5 rounded">
          تعديل
        </button>
        <button
          onClick={toggleActive}
          disabled={loading}
          className={`text-xs px-3 py-1.5 rounded text-white ${doctor.is_active ? "bg-orange-600" : "bg-green-600"}`}
        >
          {doctor.is_active ? "تعطيل" : "تفعيل"}
        </button>
      </div>
    </div>
  );
}
