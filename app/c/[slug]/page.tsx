import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import BookingForm from "./booking-form";

export default async function ClinicPage({ params }: { params: { slug: string } }) {
  const supabase = createClient();

  const { data: clinic } = await supabase
    .from("clinics")
    .select("id, name, phone, address, status")
    .eq("slug", params.slug)
    .eq("status", "active")
    .single();

  if (!clinic) notFound();

  const { data: doctors } = await supabase
    .from("doctors")
    .select("id, full_name, specialty, slot_duration_minutes")
    .eq("clinic_id", clinic.id)
    .eq("is_active", true);

  return (
    <main dir="rtl" className="max-w-2xl mx-auto p-6 bg-[#E8F0F1] min-h-screen">
      <h1 className="text-2xl font-bold mb-1 text-[#111]">{clinic.name}</h1>
      {clinic.address && <p className="text-[#4C5354] mb-6">{clinic.address}</p>}

      <BookingForm clinicSlug={params.slug} doctors={doctors ?? []} />
    </main>
  );
}
