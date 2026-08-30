"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError("البريد الإلكتروني أو كلمة المرور غير صحيحة");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main dir="rtl" className="min-h-screen bg-[#E8F0F1] flex items-center justify-center px-6">
      <form onSubmit={handleLogin} className="bg-white border border-black/10 rounded-2xl p-8 w-full max-w-sm shadow-sm">
        <h1 className="text-2xl font-bold text-[#111] mb-1">تسجيل دخول العيادة</h1>
        <p className="text-sm text-[#4C5354] mb-6">إدارة مواعيدك من هنا</p>

        <label className="block text-sm text-[#333] mb-1">البريد الإلكتروني</label>
        <input type="email" required dir="ltr" value={email} onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-[#F7FAFA] border border-black/10 rounded-lg p-2 mb-4 text-[#111]" />

        <label className="block text-sm text-[#333] mb-1">كلمة المرور</label>
        <input type="password" required dir="ltr" value={password} onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-[#F7FAFA] border border-black/10 rounded-lg p-2 mb-4 text-[#111]" />

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <button type="submit" disabled={loading} className="w-full bg-[#1CBCCF] text-white font-bold py-3 rounded-full disabled:opacity-50 hover:bg-[#17a3b4] transition-colors">
          {loading ? "جاري الدخول..." : "دخول"}
        </button>

        <p className="text-xs text-[#4C5354] text-center mt-4">
          ما عندك حساب؟ <a href="/register" className="text-[#1CBCCF]">سجّل عيادتك</a>
        </p>
      </form>
    </main>
  );
}
