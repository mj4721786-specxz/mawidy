import "./globals.css";

export const metadata = {
  title: "موعدي — نظام حجز مواعيد العيادات",
  description: "منصة SaaS لإدارة مواعيد العيادات والأطباء",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className="bg-gray-50 text-gray-900">{children}</body>
    </html>
  );
}
