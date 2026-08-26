import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import BookingForm from "./booking-form";

// /clinic/[slug] — e.g. /clinic/al-shifa
// Public page, no login required. Shows the clinic's doctors and
// lets a patient book directly.
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
    <main dir="rtl" className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-1">{clinic.name}</h1>
      {clinic.address && <p className="text-gray-500 mb-6">{clinic.address}</p>}

      <BookingForm clinicSlug={params.slug} doctors={doctors ?? []} />
    </main>
  );
}
