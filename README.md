# موعدي (Mawidy) — Phase 1 + 2

## شو جاهز هلق
- `schema.sql` — قاعدة بيانات كاملة: عيادات، أطباء، مرضى، حجوزات، أوقات عمل، RLS، ومنع تكرار الحجز على مستوى الـ Database.
- مشروع Next.js يشتغل مع Supabase Auth.
- صفحة حجز عامة شغالة فعلياً: `/clinic/[slug]` — تحجز عبر دالة آمنة بقاعدة البيانات، مش Mock data.
- زر واتساب (يفتح رسالة جاهزة، مش إرسال تلقائي).

## شو لسا ناقص (المراحل الجاية)
- لوحة تحكم الطبيب/العيادة (تسجيل دخول، إدارة حجوزات، أوقات عمل)
- لوحة تحكم Admin
- حساب المواعيد المتاحة فعلياً (بدل إدخال وقت حر)
- نظام الاشتراكات

## طريقة التشغيل

### 1. Supabase
1. أنشئ مشروع جديد على supabase.com
2. من SQL Editor، شغّل محتوى `schema.sql`
3. من Authentication → أنشئ مستخدم تجريبي (صاحب عيادة)
4. من Project Settings → API، انسخ `URL` و `anon key`

### 2. المشروع محلياً
```bash
npm install
cp .env.example .env.local   # وحط فيه المفاتيح من Supabase
npm run dev
```

### 3. رفعه على GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <رابط الريبو>
git push -u origin main
```

### 4. النشر على Vercel
1. Import المشروع من GitHub داخل Vercel
2. أضف نفس المتغيرات يلي بـ `.env.local` تحت Environment Variables
3. Deploy

⚠️ لا ترفع ملف `.env.local` لـ GitHub أبداً — هو مستثنى تلقائياً عبر `.gitignore`.
