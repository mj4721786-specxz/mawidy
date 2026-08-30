export default function HomePage() {
  return (
    <main dir="rtl" className="min-h-screen bg-[#E8F0F1] text-[#1a2e30] flex flex-col">
      <header className="border-b border-black/5 bg-white">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <span className="text-2xl font-bold text-[#111]">موعدي</span>
          <a href="/login" className="text-sm text-[#4C5354] hover:text-[#1CBCCF]">
            تسجيل الدخول
          </a>
        </div>
      </header>

      <section className="flex-1 flex items-center">
        <div className="max-w-3xl mx-auto px-6 text-center py-24">
          <span className="inline-block text-xs tracking-widest text-[#1CBCCF] border border-[#1CBCCF]/30 bg-white rounded-full px-4 py-1 mb-6">
            CLINIC BOOKING PLATFORM
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-[#111] leading-tight mb-6">
            نظام حجز مواعيد للعيادات
          </h1>
          <p className="text-lg text-[#4C5354] max-w-xl mx-auto mb-10 leading-relaxed">
            كل عيادة تحصل على صفحة حجز خاصة فيها، والمريض يحجز موعده مباشرة
            بدون اتصال أو انتظار.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <a href="/register" className="bg-[#1CBCCF] text-white font-bold px-6 py-3 rounded-full hover:bg-[#17a3b4] transition-colors">
              سجّل عيادتك
            </a>
            <a href="/login" className="text-[#111] border border-black/15 bg-white px-6 py-3 rounded-full hover:border-[#1CBCCF]">
              عندي حساب، تسجيل الدخول
            </a>
          </div>
        </div>
      </section>

      <footer className="border-t border-black/5 bg-white py-6 text-center text-xs text-[#4C5354]">
        موعدي © 2026
      </footer>
    </main>
  );
}
