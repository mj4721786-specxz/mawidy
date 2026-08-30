export default function CheckEmailPage() {
  return (
    <main dir="rtl" className="min-h-screen bg-[#E8F0F1] flex items-center justify-center px-6 text-center">
      <div>
        <h1 className="text-2xl font-bold text-[#111] mb-3">تحقق من بريدك الإلكتروني</h1>
        <p className="text-[#4C5354]">
          أرسلنا رابط تأكيد لبريدك الإلكتروني. افتحه وأكّد حسابك، وبعدها رجّع سجّل دخول من هون.
        </p>
        <a href="/login" className="inline-block mt-6 text-[#1CBCCF] font-bold">
          تسجيل الدخول
        </a>
      </div>
    </main>
  );
}
