"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { generateSlug } from "@/lib/slug";

export default function RegisterPage() {
  const router = useRouter();
  const supabase = createClient();

  const [clinicName, setClinicName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function insertClinicWithUniqueSlug(ownerId: string, name: string) {
    const base = generateSlug(name);
    let attempt = 0;
    let lastError: any = null;

    while (attempt < 20) {
      const candidate = attempt === 0 ? base : `${base}-${attempt + 1}`;
      const { data, error } = await supabase
        .from("clinics")
        .insert({ owner_id: ownerId, name, slug: candidate })
        .select("id, slug")
        .single();

      if (!error) return { data, error: null };

      if (error.code === "23505") {
        attempt++;
        lastError = error;
        continue;
      }
      return { data: null, error };
    }
    return { data: null, error: lastError };
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError("");
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
      setLoading(false);
      router.push("/register/check-email");
      return;
    }

    const { data: newClinic, error: clinicError } = await insertClinicWithUniqueSlug(
      signUpData.user!.id,
      clinicName
    );

    if (clinicError || !newClinic) {
      setError("تم إنشاء حسابك، بس صار خطأ بإنشاء العيادة. تواصل معنا.");
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
        <p className="text-sm text-[#4C5354] mb-6">دقيقة وحدة وموقع الحجز تبعك جاهز — رابطك يتولد تلقائياً</p>

        <label className="block text-sm text-[#333] mb-1">اسم العيادة</label>
        <input required value={clinicName} onChange={(e) => setClinicName(e.target.value)} placeholder="عيادة الشفاء"
          className="w-full bg-[#F7FAFA] border border-black/10 rounded-lg p-2 mb-4 text-[#111]" />

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
