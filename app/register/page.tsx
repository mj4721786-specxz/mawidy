"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const router = useRouter();
  const supabase = createClient();

  const [clinicName, setClinicName] = useState("");
  const [slug, setSlug] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSlugFromName(name: string) {
    setClinicName(name);
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const cleanSlug = slug.trim().toLowerCase();
    if (!/^[a-z0-9-]+$/.test(cleanSlug)) {
      setError("رابط العيادة لازم يكون بأحرف إنجليزية صغيرة وأرقام وشرطات فقط، مثال: al-shifa");
      return;
    }

    setLoading(true);

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      setError(signUpError.message.includes("already registered")
        ? "هذا البريد مسجل مسبقاً"
        : "صار خطأ بإنشاء الحساب، حاول مرة تانية");
      setLoading(false);
      return;
    }

    if (!signUpData.session) {
      setError("");
      setLoading(false);
      router.push("/register/check-email");
      return;
    }

    const { data: newClinic, error: clinicError } = await supabase
      .from("clinics")
      .insert({
        owner_id: signUpData.user!.id,
        name: clinicName,
        slug: cleanSlug,
      })
      .select("id")
      .single();

    if (clinicError || !newClinic) {
      setError(
        clinicError?.code === "23505"
          ? "رابط العيادة هذا مستخدم من عيادة تانية، جرب رابط مختلف"
          : "تم إنشاء حسابك، بس صار خطأ بإنشاء العيادة. تواصل معنا."
      );
      setLoading(false);
      return;
    }

    await supabase.from("subscriptions").insert({
      clinic_id: newClinic.id,
      plan: "basic",
      price_iqd: 15000,
      status: "trial",
    });

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main dir="rtl" className="min-h-screen bg-[#E8F0F1] flex items-center justify-center px-6 py-16">
      <form onSubmit={handleRegister} className="bg-white border border-black/10 rounded-2xl p-8 w-full max-w-md shadow-sm">
        <h1 className="text-2xl font-bold text-[#111] mb-1">سجّل عيادتك</h1>
        <p className="text-sm text-[#4C5354] mb-6">دقيقة وحدة وموقع الحجز تبعك جاهز</p>

        <label className="block text-sm text-[#333] mb-1">اسم العيادة</label>
        <input required value={clinicName} onChange={(e) => handleSlugFromName(e.target.value)} placeholder="عيادة الشفاء"
          className="w-full bg-[#F7FAFA] border border-black/10 rounded-lg p-2 mb-4 text-[#111]" />

        <label className="block text-sm text-[#333] mb-1">رابط العيادة (بالإنجليزي)</label>
        <div className="flex items-center gap-1 mb-1" dir="ltr">
          <span className="text-xs text-[#4C5354]">mawidy.app/clinic/</span>
          <input required value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="al-shifa" dir="ltr"
            className="flex-1 bg-[#F7FAFA] border border-black/10 rounded-lg p-2 text-[#111] text-sm" />
        </div>
        <p className="text-xs text-[#4C5354] mb-4">أحرف إنجليزية صغيرة وأرقام وشرطات بس</p>

        <label className="block text-sm text-[#333] mb-1">البريد الإلكتروني</label>
        <input type="email" required dir="ltr" value={email} onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-[#F7FAFA] border border-black/10 rounded-lg p-2 mb-4 text-[#111]" />

        <label className="block text-sm text-[#333] mb-1">كلمة المرور</label>
        <input type="password" required minLength={6} dir="ltr" value={password} onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-[#F7FAFA] border border-black/10 rounded-lg p-2 mb-4 text-[#111]" />

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <button type="submit" disabled={loading} className="w-full bg-[#1CBCCF] text-white font-bold py-3 rounded-full disabled:opacity-50 hover:bg-[#17a3b4] transition-colors">
          {loading ? "جاري التسجيل..." : "سجّل عيادتي"}
        </button>

        <p className="text-xs text-[#4C5354] text-center mt-4">
          عندك حساب؟ <a href="/login" className="text-[#1CBCCF]">سجّل دخول</a>
        </p>
      </form>
    </main>
  );
}
