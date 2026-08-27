export default function HomePage() {
  return (
    <main dir="rtl" className="min-h-screen bg-[#0F2B28] text-[#E4EEEA] flex flex-col">
      <header className="border-b border-white/10">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <span className="text-2xl font-bold text-[#F1EAD8]">موعدي</span>
          <a href="mailto:hello@mawidy.app" className="text-sm text-[#7FA39B] hover:text-white">
            تواصل معنا
          </a>
        </div>
      </header>

      <section className="flex-1 flex items-center">
        <div className="max-w-3xl mx-auto px-6 text-center py-24">
          <span className="inline-block text-xs tracking-widest text-[#E2A63C] border border-[#E2A63C]/30 rounded-full px-4 py-1 mb-6">
            CLINIC BOOKING PLATFORM
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-[#F1EAD8] leading-tight mb-6">
            نظام حجز مواعيد للعيادات
          </h1>
          <p className="text-lg text-[#7FA39B] max-w-xl mx-auto mb-10 leading-relaxed">
            كل عيادة تحصل على صفحة حجز خاصة فيها، والمريض يحجز موعده مباشرة
            بدون اتصال أو انتظار.
          </p>
          <div className="flex items-center justify-center gap-4">
            <a href="/clinic/al-shifa" className="bg-[#E2A63C] text-[#0F2B28] font-bold px-6 py-3 rounded">
              جرّب صفحة حجز تجريبية
            </a>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 py-6 text-center text-xs text-[#7FA39B]">
        موعدي © 2026
      </footer>
    </main>
  );
}
