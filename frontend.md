# PazarGlobal Web Frontend Plan

Minimal, hızlı ve AI destekli bir chat/ilan paneli için yol haritası.

## 1) Teknoloji Tercihleri
- Next.js (App Router) + TypeScript
- UI: Tailwind CSS + shadcn/ui (minimal, erişilebilir bileşenler)
- State/Data: React Query, Zustand (UI state), React Hook Form + Zod (form + doğrulama)
- Realtime: SSE veya WebSocket (chat streaming)
- Upload: Supabase Storage veya S3 pre-signed URL akışı
- TTS/ASR: Web Speech API veya üçüncü parti (Azure TTS, Whisper)

## 2) Ana Modüller
- **Auth & Kayıt**: E-posta/telefon + şifre; ileride PIN/OTP için alan; cihaz/fingerprint kaydı.
- **Chat Paneli**: Çoklu sekme (genel sohbet, ilan asistanı, destek); streaming yanıt; push-to-talk; dosya/resim ekleme; kart/tabanlı yanıtlar.
- **İlan Oluştur/Düzenle**: Adım adım form; taslak kaydet; çoklu görsel/video upload; kapak seçimi; kategori/etiket önerisi; AI ile başlık/açıklama iyileştirme.
- **İlan Listele/Filtrele**: Grid/list toggle; kategori, konum, fiyat, durum, premium, tarih filtreleri; sıralama; detay sayfası; benzer ilanlar.
- **Ödeme Yönlendirme (hazırlık)**: Checkout stub; OTP/PIN slotu; mock success/fail.
- **Profil & Güvenlik**: Bilgiler, PIN/OTP setup placeholder; ilanlarım; premium’a yükselt kancası.
- **Admin/Moderatör (ileri)**: İlan onay/red, rapor yönetimi, audit log.

## 3) UX Prensipleri
- Sade, hızlı; 2-3 aksan rengi; net tipografi (Manrope/Sohne benzeri).
- Sol sidebar: chat sekmeleri + "Yeni ilan" kısayolu. Ana panel: chat veya ilan grid. Sağ çekmece: filtre/detay/profil.
- Global action bar: sesli giriş, dosya ekle, hızlı komutlar.

## 4) Güvenlik & Performans
- Rate limit (IP + kullanıcı), Turnstile/reCAPTCHA hafif koruma.
- Maks upload boyutu, MIME doğrulama.
- Error boundary + retry; offline uyarıları.
- Token/prompt kısaltma; küçük model öncelikli, düşük güven → büyük model fallback (agent tarafında).

## 5) MVP Kapsamı (Sprint 1-2)
- Next.js iskelet, auth shell, temel layout (sidebar + main + drawer).
- Chat paneli: metin + streaming; dosya ekleme placeholder; ses butonu placeholder.
- İlan oluştur formu (taslak kaydet) + tekli/çoklu upload + AI metin iyileştirme butonu.
- İlan liste/filtre sayfası (kategori, konum, fiyat, sıralama) + detay sayfası.
- Basit profil sayfası; PIN/OTP alanları için yer tutucu.

## 6) Sprint 3-4 (Gelişmiş)
- Sesli giriş/çıkış tamamlama (TTS/ASR entegrasyonu).
- Çok sekmeli chat; kart/quick reply yanıtları; butonlu eylemler ("ilan oluştur", "ilan düzenle").
- Ödeme yönlendirme stub → gerçek gateway entegrasyonu için hook.
- Admin/moderasyon temel ekranları.

## 7) Entegrasyon Notları
- Backend agent endpoint’leri: streaming chat, ilan CRUD, arama, AI metin iyileştirme.
- Upload için pre-signed URL akışı; progres bar ve hata yakalama.
- Kayıt sırasında PIN/OTP oluşturma alanı (ileride ödeme doğrulaması için).

## 8) Tasarım Teslimleri
- Figma wireframe: layout, renk/tipografi, kart bileşenleri.
- Component kit: Button, Input, Textarea, Select, Tabs, Drawer, Modal, Card, DataTable, Badge, Tooltip, Skeleton, Upload dropzone, Audio record.

## 9) Test & Kalite
- E2E: Playwright (auth, ilan oluştur, listele, chat mesajı akışı).
- Unit: form doğrulama, helper’lar, upload handler.
- Accessibility: odak halkaları, klavye navigasyonu, ARIA label’lar.

## 10) Açık Sorular / Kararlar
- Realtime için WS mi SSE mi? (hosting ve edge uyumu)
- TTS/ASR sağlayıcısı: native mi, Azure/Whisper mı?
- Upload boyut sınırı ve kabul edilen MIME listesi?
- Premium ilan ve ödeme entegrasyonunun takvimi?
