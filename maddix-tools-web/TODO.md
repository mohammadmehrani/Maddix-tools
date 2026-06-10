# Maddix Tools (Next.js) - TODO

## فاز 1: اسکلت اپ + تنظیمات جهانی
- [ ] ساخت Zustand store برای theme و lang + persist در localStorage
- [ ] راه‌اندازی react-i18next با fa/en و سوییچ RTL/LTR
- [ ] جایگزینی Layout موجود با AppShell مشابه index.html (sidebar/topbar/footer/modal)
- [ ] افزودن Theme/Lang toggle بدون رفرش صفحه
- [ ] افزودن ابزار Toast ساده

## فاز 2: مسیریابی و Lazy Loading
- [ ] پیاده‌سازی صفحات: Home, HackTools (صفحه اصلی ابزارها), NetworkChecker, IP/DNS Scanner
- [ ] استفاده از next/dynamic برای Lazy Loading صفحات
- [ ] ساخت لینک‌های Sidebar برای جابجایی بدون رفرش کامل

## فاز 3: اولین ابزارها (نسخه واقعی UI + منطق)
- [ ] ساخت feature: Reverse Shell Generator (پویا + copy)
- [ ] ساخت feature: Hash Generator (WebCrypto + copy)
- [ ] ساخت feature: Encoder/Decoder (Base64/URL/Hex)
- [ ] ساخت feature: IP Lookup و DNS Lookup (fetch از سرویس‌های عمومی)
- [ ] ساخت feature: IP/DNS Scanner از فایل sourse/Sccaner Ip & Domin (تفکیک به کامپوننت‌ها)

## فاز 4: HackTools کامل (14 ابزار)
- [ ] شناسایی دقیق 14 ابزار در ریپوهای HackTools و پیاده‌سازی کامل هرکدام
- [ ] تفکیک payloadها/دستورها به constants
- [ ] copy/copy-all و state جداگانه برای هر ابزار
- [ ] به‌روزرسانی payloadها/تکنیک‌ها با نکته‌های 2025-2026

## فاز 5: V2Ray Modifier و Network-Checker کامل
- [ ] ادغام ابزارهای network-checker (مرجع از sourse/network-checker-main)
- [ ] ادغام v2ray-config-modifier (تبدیل UI به Next + Zip download با libs)

## فاز 6: Crypto/UUID در همه مدل‌ها/ورژن‌ها
- [ ] افزودن uuid generator مرکزی (crypto.randomUUID با fallback)
- [ ] افزودن helpers رمزنگاری (AES-GCM WebCrypto)
- [ ] هر مدل داده/نتیجه toolها با id یکتا + نسخه (version) سازگار شود

## فاز 7: کیفیت و دیپلوی
- [ ] تست اجرای npm run dev
- [ ] npm run build
- [ ] افزودن vercel.json و تنظیمات لازم
- [ ] نوشتن README.md نهایی

