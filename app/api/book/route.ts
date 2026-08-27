import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// The ONLY endpoint patients use to book. It calls the Postgres
// function book_appointment(), which relies on a partial unique index
// to reject double-booking atomically — even under concurrent requests.
export async function POST(req: Request) {
  const body = await req.json();
  const { clinicSlug, doctorId, date, time, patientName, patientPhone } = body;

  if (!clinicSlug || !doctorId || !date || !time || !patientName || !patientPhone) {
    return NextResponse.json({ error: "بيانات ناقصة" }, { status: 400 });
  }

  const supabase = createClient();

  const { data, error } = await supabase.rpc("book_appointment", {
    p_clinic_slug: clinicSlug,
    p_doctor_id: doctorId,
    p_date: date,
    p_time: time,
    p_patient_name: patientName,
    p_patient_phone: patientPhone,
  });

  if (error) {
    // 23505 = unique_violation → someone else took this slot first
    if (error.code === "23505") {
      return NextResponse.json(
        { error: "عذراً، هذا الموعد تم حجزه للتو من شخص آخر. اختر وقت تاني." },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: "صار خطأ، حاول مرة تانية." }, { status: 500 });
  }

  return NextResponse.json({ appointmentId: data });
}
