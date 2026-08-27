"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

// Clinic owner login. Uses Supabase Auth (email + password).
// On success, redirects to /dashboard — middleware.ts protects that
// route so only logged-in users reach it.
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
    <main dir="rtl" className="min-h-screen bg-[#0F2B28] flex items-center justify-center px-6">
      <form
        onSubmit={handleLogin}
        className="bg-[#14332E] border border-white/10 rounded-lg p-8 w-full max-w-sm"
      >
        <h1 className="text-2xl font-bold text-[#F1EAD8] mb-1">تسجيل دخول العيادة</h1>
        <p className="text-sm text-[#7FA39B] mb-6">إدارة مواعيدك من هنا</p>

        <label className="block text-sm text-[#E4EEEA] mb-1">البريد الإلكتروني</label>
        <input
          type="email"
          required
          dir="ltr"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-[#0F2B28] border border-white/10 rounded p-2 mb-4 text-[#E4EEEA]"
        />

        <label className="block text-sm text-[#E4EEEA] mb-1">كلمة المرور</label>
        <input
          type="password"
          required
          dir="ltr"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-[#0F2B28] border border-white/10 rounded p-2 mb-4 text-[#E4EEEA]"
        />

        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#E2A63C] text-[#0F2B28] font-bold py-3 rounded disabled:opacity-50"
        >
          {loading ? "جاري الدخول..." : "دخول"}
        </button>
      </form>
    </main>
  );
}
