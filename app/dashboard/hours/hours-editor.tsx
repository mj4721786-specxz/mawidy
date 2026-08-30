"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const dayLabels = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];

type WorkingHour = { id: string; weekday: number; start_time: string; end_time: string };

export default function HoursEditor({
  doctorId,
  doctorName,
  initialHours,
}: {
  doctorId: string;
  doctorName: string;
  initialHours: WorkingHour[];
}) {
  const router = useRouter();
  const supabase = createClient();

  const [days, setDays] = useState(() => {
    const map: Record<number, { open: boolean; start: string; end: string }> = {};
    for (let i = 0; i < 7; i++) {
      const existing = initialHours.find((h) => h.weekday === i);
      map[i] = existing
        ? { open: true, start: existing.start_time.slice(0, 5), end: existing.end_time.slice(0, 5) }
        : { open: false, start: "09:00", end: "17:00" };
    }
    return map;
  });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  function toggleDay(i: number) {
    setDays((d) => ({ ...d, [i]: { ...d[i], open: !d[i].open } }));
  }

  function updateTime(i: number, field: "start" | "end", value: string) {
    setDays((d) => ({ ...d, [i]: { ...d[i], [field]: value } }));
  }

  async function save() {
    setLoading(true);
    setSaved(false);

    await supabase.from("working_hours").delete().eq("doctor_id", doctorId);

    const rows = Object.entries(days)
      .filter(([, v]) => v.open)
      .map(([weekday, v]) => ({
        doctor_id: doctorId,
        weekday: Number(weekday),
        start_time: v.start,
        end_time: v.end,
      }));

    if (rows.length > 0) {
      await supabase.from("working_hours").insert(rows);
    }

    setLoading(false);
    setSaved(true);
    router.refresh();
  }

  return (
    <div className="bg-white border rounded-lg p-5">
      <h2 className="font-bold mb-4">{doctorName}</h2>
      <div className="space-y-2">
        {dayLabels.map((label, i) => (
          <div key={i} className="flex items-center gap-3 flex-wrap">
            <label className="flex items-center gap-2 w-28">
              <input type="checkbox" checked={days[i].open} onChange={() => toggleDay(i)} />
              <span className="text-sm">{label}</span>
            </label>
            {days[i].open && (
              <div className="flex items-center gap-2" dir="ltr">
                <input type="time" value={days[i].start} onChange={(e) => updateTime(i, "start", e.target.value)} className="border rounded p-1 text-sm" />
                <span className="text-sm text-gray-400">—</span>
                <input type="time" value={days[i].end} onChange={(e) => updateTime(i, "end", e.target.value)} className="border rounded p-1 text-sm" />
              </div>
            )}
          </div>
        ))}
      </div>

      <button onClick={save} disabled={loading} className="mt-4 bg-[#1CBCCF] text-white hover:bg-[#17a3b4] px-5 py-2 rounded-full text-sm font-bold disabled:opacity-50">
        {loading ? "جاري الحفظ..." : "حفظ الدوام"}
      </button>
      {saved && <span className="text-green-600 text-sm mr-3">تم الحفظ ✓</span>}
    </div>
  );
}
