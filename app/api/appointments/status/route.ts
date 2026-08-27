import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  const { appointmentId, status } = await req.json();

  const allowed = ["confirmed", "cancelled", "completed", "no_show"];
  if (!appointmentId || !allowed.includes(status)) {
    return NextResponse.json({ error: "بيانات غير صحيحة" }, { status: 400 });
  }

  const supabase = createClient();
  const { error } = await supabase
    .from("appointments")
    .update({ status })
    .eq("id", appointmentId);

  if (error) {
    return NextResponse.json({ error: "صار خطأ، حاول مرة تانية" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
