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
      <div className="border border-[#1CBCCF]/30 rounded-2xl p-6 bg-[#E8F0F1]">
        <h2 className="text-xl font-bold text-[#0e8a99] mb-3">تم حجز موعدك بنجاح ✅</h2>
        <p>الطبيب: {result.doctorName}</p>
        <p>التاريخ: {result.date}</p>
        <p>الوقت: {result.time}</p>
        <p>الاسم: {result.name}</p>

        <a href={`https://wa.me/?text=${waMessage}`} target="_blank" className="inline-block mt-4 bg-green-600 text-white px-4 py-2 rounded-full">
          إرسال التفاصيل عبر واتساب
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block mb-1 font-medium text-[#111]">الطبيب</label>
        <select required value={doctorId} onChange={(e) => setDoctorId(e.target.value)} className="w-full border border-black/10 rounded-lg p-2 bg-white">
          <option value="">اختر الطبيب</option>
          {doctors.map((d) => (
            <option key={d.id} value={d.id}>{d.full_name} — {d.specialty}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block mb-1 font-medium text-[#111]">اليوم</label>
        <input required type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full border border-black/10 rounded-lg p-2 bg-white" />
      </div>

      <div>
        <label className="block mb-1 font-medium text-[#111]">الوقت</label>
        <input required type="time" value={time} onChange={(e) => setTime(e.target.value)} className="w-full border border-black/10 rounded-lg p-2 bg-white" />
      </div>

      <div>
        <label className="block mb-1 font-medium text-[#111]">اسمك</label>
        <input required value={name} onChange={(e) => setName(e.target.value)} className="w-full border border-black/10 rounded-lg p-2 bg-white" />
      </div>

      <div>
        <label className="block mb-1 font-medium text-[#111]">رقم الهاتف</label>
        <input required value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full border border-black/10 rounded-lg p-2 bg-white" dir="ltr" />
      </div>

      {status === "error" && <p className="text-red-500">{errorMsg}</p>}

      <button type="submit" disabled={status === "loading"} className="w-full bg-[#1CBCCF] text-white py-3 rounded-full font-bold disabled:opacity-50 hover:bg-[#17a3b4] transition-colors">
        {status === "loading" ? "جاري الحجز..." : "تأكيد الحجز"}
      </button>
    </form>
  );
}
