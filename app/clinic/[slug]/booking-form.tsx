"use client";

import { useState } from "react";

type Doctor = { id: string; full_name: string; specialty: string; slot_duration_minutes: number };

export default function BookingForm({ clinicSlug, doctors }: { clinicSlug: string; doctors: Doctor[] }) {
  const [doctorId, setDoctorId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [result, setResult] = useState<any>(null);

  const selectedDoctor = doctors.find((d) => d.id === doctorId);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    const res = await fetch("/api/book", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clinicSlug,
        doctorId,
        date,
        time,
        patientName: name,
        patientPhone: phone,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setStatus("error");
      setErrorMsg(data.error || "صار خطأ");
      return;
    }

    setResult({ doctorName: selectedDoctor?.full_name, date, time, name });
    setStatus("done");
  }

  if (status === "done" && result) {
    const waMessage = encodeURIComponent(
      `تأكيد حجز\nالطبيب: ${result.doctorName}\nالتاريخ: ${result.date}\nالوقت: ${result.time}\nالمريض: ${result.name}`
    );
    return (
      <div className="border rounded-lg p-6 bg-green-50">
        <h2 className="text-xl font-bold text-green-700 mb-3">تم حجز موعدك بنجاح ✅</h2>
        <p>الطبيب: {result.doctorName}</p>
        <p>التاريخ: {result.date}</p>
        <p>الوقت: {result.time}</p>
        <p>الاسم: {result.name}</p>

        {/* Opens WhatsApp with a pre-filled message. This is NOT automatic
            sending — WhatsApp Business API isn't configured. The patient
            still has to press send themselves. */}
        <a
          href={`https://wa.me/?text=${waMessage}`}
          target="_blank"
          className="inline-block mt-4 bg-green-600 text-white px-4 py-2 rounded"
        >
          إرسال التفاصيل عبر واتساب
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block mb-1 font-medium">الطبيب</label>
        <select
          required
          value={doctorId}
          onChange={(e) => setDoctorId(e.target.value)}
          className="w-full border rounded p-2"
        >
          <option value="">اختر الطبيب</option>
          {doctors.map((d) => (
            <option key={d.id} value={d.id}>
              {d.full_name} — {d.specialty}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block mb-1 font-medium">اليوم</label>
        <input required type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full border rounded p-2" />
      </div>

      <div>
        <label className="block mb-1 font-medium">الوقت</label>
        {/* Phase 2 note: a real available-slots list (computed from
            working_hours + blocked_times + existing appointments) replaces
            this free input in Phase 3. Kept simple here on purpose. */}
        <input required type="time" value={time} onChange={(e) => setTime(e.target.value)} className="w-full border rounded p-2" />
      </div>

      <div>
        <label className="block mb-1 font-medium">اسمك</label>
        <input required value={name} onChange={(e) => setName(e.target.value)} className="w-full border rounded p-2" />
      </div>

      <div>
        <label className="block mb-1 font-medium">رقم الهاتف</label>
        <input required value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full border rounded p-2" dir="ltr" />
      </div>

      {status === "error" && <p className="text-red-600">{errorMsg}</p>}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full bg-teal-700 text-white py-3 rounded font-bold disabled:opacity-50"
      >
        {status === "loading" ? "جاري الحجز..." : "تأكيد الحجز"}
      </button>
    </form>
  );
}
