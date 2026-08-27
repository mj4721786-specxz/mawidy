export default function CheckEmailPage() {
  return (
    <main dir="rtl" className="min-h-screen bg-[#0F2B28] flex items-center justify-center px-6 text-center">
      <div>
        <h1 className="text-2xl font-bold text-[#F1EAD8] mb-3">تحقق من بريدك الإلكتروني</h1>
        <p className="text-[#7FA39B]">
          أرسلنا رابط تأكيد لبريدك الإلكتروني. افتحه وأكّد حسابك، وبعدها رجّع سجّل دخول من هون.
        </p>
        <a href="/login" className="inline-block mt-6 text-[#E2A63C] font-bold">
          تسجيل الدخول
        </a>
      </div>
    </main>
  );
}
