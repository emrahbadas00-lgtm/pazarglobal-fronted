# 🚀 PazarGlobal Multi-Agent Yol Haritası v3 (Aralık 2025)

---

# ⚡ YENİ: Gelişmiş Agent Mimarisi

## 🎯 Yeni Agent Planı (ImageAgent, VoiceAgent, MarketingAgent...)

### 1️⃣ **ImageAgent** - ÖNCELİK #1 ⭐
- **Görev:** Fotoğraftan ürün tanıma + otomatik ilan
- **Tools:** OpenAI Vision API, Price estimation
- **Timeline:** 2 hafta

### 2️⃣ **VoiceAgent** - ÖNCELİK #2 ⭐
- **Görev:** Sesli komutlar (Whisper STT + TTS)
- **Features:** "iPhone sat", "telefon ara"
- **Timeline:** 2 hafta

### 3️⃣ **MarketingAgent** - ÖNCELİK #3 ⭐
- **Görev:** Platform karşılaştırma (Sahibinden scraping)
- **Features:** Fiyat analizi, trend tespiti
- **Timeline:** 3 hafta

**Detaylı plan:** Dosyanın sonunda "YENİ AGENT MİMARİSİ" bölümünde

---

# Yol Haritası v2 (2025 Q4) - ESKİ PLANLAMA

Bu doküman PazarGlobal WhatsApp ajanının önümüzdeki sürümlerinde tamamlanması gereken işleri faz faz listeler. Öncelik sıralaması güvenlik, kişiselleştirme ve çekirdek ilan operasyonlarını adresler.

---

## 0. Özet Öncelikler

| Öncelik | Başlık | Neden kritik? | Karar Tarihi |
|---------|--------|----------------|--------------|
| 🔴 | WhatsApp entegrasyonu + session yönetimi | Kullanıcı sohbetinin kaybolmaması, aynı anda birden fazla cihazdan kötüye kullanımı engellemek | Anında |
| 🔴 | Kimlik ve kişiselleştirme | Küçük konuşmalarda isimle hitap, user_id eşlemesi, Delete/Update tool'larında yetki kontrolü | Anında |
| 🔴 | Güvenlik sertleştirmesi | WhatsApp numarası ele geçirildiğinde OTP / cihaz doğrulama zorunluluğu, kritik aksiyonlarda PIN | 1 hafta |
| 🟡 | İlan yönetimi revizyonu | Update/Delete tool'larının gerçek ilanlar üzerinde çalışması | 1-2 hafta |
| 🟡 | Premium İlan Özelliği (MONETIZASYON) | Mevcut pagination sistemi sayesinde kolay implementasyon, direkt revenue impact | 2-3 hafta |
| 🟢 | Ödeme akışı + OTP | Ödeme yönlendirmelerinde ikinci faktör + Premium üyelik ödemeleri | 3-4 hafta |

### 0.1 Tamamlananlar (08 Dec 2025)

- [x] Arama sonuçlarında ilan sahibi bilgisi (user_name/owner_name + phone) Supabase join ile çekiliyor ve detayda gösteriliyor (backend + workflow + bridge).

---

## 1. Phase 1 – WhatsApp Entegrasyonu (Kritik)

**Mevcut Durum**

- Twilio WhatsApp Business API ile mesaj gönder/al.
- Uvicorn tabanlı Agent Backend çalışıyor.

**Geliştirmeler**

1. **Session Yönetimi**  
     - Her telefon numarası + cihaz kombinasyonu için UUID tabanlı session oluştur.  
     - Session TTL 24 saat; pasif kalırsa redis/Supabase `user_sessions` tablosunda `expired=true`.  
     - Yeni cihazdan girişte eski oturumu sonlandır veya ikincil doğrulama iste.
2. **Conversation Context Persistence**  
     - Redis primary, Supabase yedek küme; her mesajda hem kısa hem uzun tarihçe tut.  
     - Multi-turn context, guardrail mask'li versiyonla saklanacak.
3. **Webhook Handler Sertleştirmesi**  
     - Twilio → WhatsApp Bridge → Agent Backend hattında queue (RabbitMQ veya Supabase queue) ile retry.  
     - Rate limit: kullanıcı başına dakikada 10 mesaj.
4. **Medya İşleme Yol Haritası**  
     - Fotoğraf/Video download & S3'e yükleme.  
     - Audio transcription (Twilio + OpenAI Whisper).  
     - PDF/Doküman relay.

---

## 2. Phase 2 – Kullanıcı Kimliği & Kişiselleştirme

**Supabase Şeması (uygulanacak)**

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone_number TEXT UNIQUE NOT NULL,
    display_name TEXT,
    profile_meta JSONB,
    kyc_verified BOOLEAN DEFAULT false,
    total_sales INT DEFAULT 0,
    total_purchases INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    started_at TIMESTAMP DEFAULT now(),
    last_message_at TIMESTAMP,
    device_fingerprint TEXT,
    context JSONB,
    is_active BOOLEAN DEFAULT true,
    terminated_reason TEXT
);
```

**Ajan Güncellemeleri**

- **Greeting/SmallTalk Agent**: `display_name` varsa "Hoş geldiniz Emrah Bey" şeklinde hitap; yoksa telefonun maskelenmiş hali.  
- **Identity Helper (yeni hafif ajan değil, middleware)**: Her istekte `user_id`, `display_name`, `kyc_verified` context'e eklenir.  
- **ProfileAgent** (backlog): "ilanlarım", "profilim" komutlarına cevap, istatistik döndür.

---

## 3. Phase 3 – İlan Yönetimi İyileştirmeleri

### 3.1 Delete Flow

- `delete_listing_tool(listing_id, user_id)` → Supabase `DELETE ... WHERE id=:listing_id AND user_id=:user_id`.  
- DeleteListingAgent talimatları: `list_user_listings_tool` sonucu dışındaki bir ID ile işlem yapma, kullanıcıdan onay al, işlem audit log'una yaz.  
- Hata mesajları: "Bu ilan size ait değil" / "İlan bulunamadı" / "İşlem pin doğrulaması gerekiyor" (güvenlik fazıyla entegre).

### 3.2 Update Flow

- `update_listing_tool` user_id zorunlu parametre.  
- Agent önce ilan seçtirip sonra patch uygular; asla insert çağırmaz.  
- Price değişikliklerinde `clean_price_tool`, metadata merge.

---

## 3.5 Phase 3.5 – Premium İlan Özelliği (Monetizasyon Stratejisi) 🆕

**Neden Kritik?**

Mevcut pagination sistemi (5 ilan gösterimi) premium ilan stratejisi için mükemmel temel oluşturuyor. Küçük batchler sayesinde premium ilanların görünürlüğü çok net olur ve kullanıcılar doğal olarak upgrade'e teşvik edilir.

### 3.5.1 Database Değişiklikleri

```sql
ALTER TABLE listings ADD COLUMN is_premium BOOLEAN DEFAULT FALSE;
ALTER TABLE listings ADD COLUMN premium_expires_at TIMESTAMP;
CREATE INDEX idx_listings_premium ON listings(is_premium, created_at);
```

### 3.5.2 search_listings_tool Enhancement

```python
@function_tool
async def search_listings_tool(
    query: Optional[str] = None,
    category: Optional[str] = None,
    prioritize_premium: bool = True,  # YENİ: Default True
    limit: int = 5
):
    # ORDER BY: is_premium DESC, created_at DESC
    # Premium ilanlar her zaman önce gelir
```

### 3.5.3 SearchAgent Display Format

```
⭐ PREMIUM #1: BMW 520i [2024] - ÖNE ÇIKAN İLAN
⭐ PREMIUM #2: Mercedes C200 [2023] - ÖNE ÇIKAN İLAN
#3: Renault Clio [2015]
#4: Ford Focus [2018]
#5: Opel Astra [2017]

💡 ⭐ Premium ilanlar listenin başında görünür!
   İlanınızı öne çıkarmak için Premium üyelik edinin.
```

### 3.5.4 UX Flow Örneği

**Senaryo A - Çok Premium İlan (Rekabet Gösterimi):**
```
Kullanıcı: "Araba arıyorum"
Agent: "100 ilan bulundu (12 premium). 5 göstereyim mi?"
Kullanıcı: "Göster"
Agent: [5 premium ilanı gösterir]
      "💡 Premium ilanlar öncelikli gösteriliyor!
          Daha fazla için 'daha fazla' yazın (kalan 88 normal + 7 premium)"
```

**Senaryo B - Az Premium İlan (Conversion Trigger):**
```
Kullanıcı: "Otomotiv ilanları"
Agent: "50 ilan bulundu (2 premium). 5 göstereyim mi?"
Kullanıcı: "Göster"
Agent: [2 premium + 3 normal ilan gösterir]
      "💡 ⭐ Premium ilanlar listenin başında görünür!
          İlanınızı öne çıkarmak için Premium üyelik edinin."
```

### 3.5.5 Monetizasyon Psikolojisi

- **Normal kullanıcı görür**: "Hep aynı ilanlar ilk 5'te" → değer anlar
- **Premium kullanıcı görür**: "İlanım hep ilk 5'te!" → anında ROI
- **Conversion trigger**: "2 premium var ama 100 ilan → ilanımı neden kimse görmüyor?"
- **Şeffaf rekabet**: "12 premium ilan" → pazar dinamiklerini gösterir

### 3.5.6 Mevcut Sistemle Uyum

✅ **5'er ilan gösterimi**: Premium görünürlüğü net  
✅ **"Ask first" yaklaşımı**: Premium istatistikleri önce gösterir  
✅ **Limit parametresi**: Premium/normal karışımı akıllıca yönetir  
✅ **Conversation context**: Pagination'da premium önceliği sürdürür

### 3.5.7 Bağımlılıklar

- Phase 2 (User Identity) tamamlanmalı → kullanıcı yönetimi için
- Phase 3 (Listing Management) tamamlanmalı → ilan operasyonları için
- Current pagination system (zaten uygulanmış) ✅

### 3.5.8 TODO

- [ ] Database schema güncellemesi (is_premium, premium_expires_at)
- [ ] search_listings.py ORDER BY güncelleme
- [ ] SearchAgent instructions güncelleme (premium display format)
- [ ] Premium membership payment flow (Phase 4 ile entegre)
- [ ] Admin panel: premium ilan yönetimi (Phase 9 ile entegre)

---

## 4. Phase 4 – Güvenlik Sertleştirmesi (Yeni)

### 4.1 Cihaz & Oturum Koruması

- **Device Fingerprint**: Twilio webhookundan gelen `WaId` + User-Agent + IP hash'lenip `user_sessions.device_fingerprint` alanına yazılır.  
- **Yeni cihaz algılama**: Aynı kullanıcı farklı fingerprint ile bağlanırsa "yeni cihaz doğrulaması" mesajı gönderilir. Eski cihaz devre dışı bırakılmadan kritik işlem yapılamaz.

### 4.2 Oturum Süresi

- `max_session_age`: 24 saat.  
- `max_inactive_period`: 30 dakika.  
- Süre dolduğunda kullanıcıya: "Güvenlik nedeniyle oturumunu yenilemek için PIN/OTP gir."  
- Silme/ödeme gibi hassas komutlar sadece aktif oturumda olur.

### 4.3 OTP / PIN Katmanı

- **PIN Set Flow**: Kullanıcı ilk kez WhatsApp'tan işlem yaparken 4-6 haneli PIN oluşturur (Supabase `user_security` tablosu).  
- **OTP Flow** (kritik işlemler): 6 haneli tek kullanımlık kod SMS veya WhatsApp üzerinden gönderilir, 2 dakikalık TTL.

**Hangi işlemlerde gerekecek?**

1. Ödeme yönlendirmesi (Phase 5 ile entegre).  
2. İlan silme (isteğe bağlı; default: PIN ile doğrula).  
3. Kişisel verileri gösteren profil sorguları.  
4. Yeni cihaz oturum açma.

### 4.4 Audit & Alerting

- Tüm hassas işlemler `security_events` tablosuna kaydedilir: user_id, action, device_fingerprint, otp_id, result.  
- Şüpheli aktivite (aynı dakikada 3 farklı cihaz) → Slack/Webhook uyarısı.

### 4.5 Agent Değişiklikleri

- **SecurityAgent (yeni)**: PIN/OTP doğrulama akışını yönetir; diğer ajanlar doğrulanmış `session_token` olmadan kritik tool çağrısı yapamaz.  
- Tüm ajanlar `context.security.session_verified == true` kontrolü yapar; değilse SecurityAgent'e yönlendirir.

---

## 5. Phase 5 – Ödeme Entegrasyonu

1. **Gateway Seçimi**: Stripe (global) + İyzico (yerel).  
2. **Flow**: Kullanıcı ürün satın almak istediğinde PaymentAgent bir checkout linki oluşturur, fakat önce OTP doğrulaması ister.  
3. **Escrow (Opsiyonel)**: Ödeme Platform cüzdanına düşer; alıcı onayından sonra satıcıya transfer.  
4. **Webhook**: Başarılı/başarısız ödeme Supabase `payments` tablosuna işlenir, WhatsApp üzerinden bildirilir.

---

## 6. Phase 6 – Piyasa Araştırması & Fiyat İstihbaratı

- **search_market_prices_tool**: Sahibinden, Letgo, Hepsiburada scraping veya API.  
- MarketResearchAgent kullanıcıya medyan/ortalama fiyatlar + güven aralığı döndürür.  
- Tavily entegrasyonu ile genel trend çekilir (API anahtarı `.env`de mevcut).

---

## 7. Phase 7 – Vision AI

1. **analyze_product_image_tool**: OpenAI Vision API ile marka/model çıkarımı.  
2. **visual_search_tool**: Vektör veritabanı (Supabase pgvector) ile benzer ilan arama.  
3. Kullanıcı fotoğraf gönderdiğinde ListingAgent taslak oluşturmak için bu sonuçları kullanır.

---

## 8. Phase 8 – Ses Özellikleri

- Gelen sesli mesaj → Twilio transcript → Router'a gönder.  
- Yanıtları ElevenLabs/Azure TTS ile sese çevir, WhatsApp'a audio gönder.  
- VoiceAgent, "sesli konuşmak istiyorum" komutlarında devreye girer.

---

## 9. Phase 9 – Frontend Dashboard

- Next.js + Supabase Auth.  
- Kullanıcı paneli: ilanlarım, mesajlarım, favorilerim, satış/alış geçmişi.  
- Admin panel: moderasyon, analitik, kullanıcı yönetimi.  
- Tailwind + shadcn UI, mobil öncelikli, dark mode.

---

## 10. Ek Öneriler

1. **Bildirim Sistemi**: Email / WhatsApp özet mesajları, push bildirimleri.  
2. **Favoriler & Kaydedilmiş Aramalar**: Fiyat düşüşü uyarısı.  
3. **Puanlama & Güven Skoru**: Alıcı-satıcı değerlendirmeleri.  
4. **Konuşma Geçmişi İhracı**: PDF veya e-posta ile gönderim.  
5. **Çok Dilli**: i18n altyapısı (TR/EN).  
6. **Analytics Agent**: "ilanım kaç kişi gördü?" sorusuna cevap.

---

## 10.1 LLM Maliyet/Hız Optimizasyonu (Yeni)

- [ ] Küçük model (ör. 4o-mini / gpt-3.5) ile hafif işler: selamlama, iptal, basit yönlendirme, kısa liste formatlama.  
- [ ] Orta model (4o) ile arama sonucu özetleme, kısa formatlama; ağır mantık gerekmiyorsa 5.1 kullanma.  
- [ ] Büyük model (5.1) yalnızca zorlayıcı muhakeme ve kalite-kritik yanıtlar için; düşük güven skorunda fallback.  
- [ ] Prompt ve geçmişi kısalt, `max_tokens` sınırla; streaming yalnızca ilk token gecikmesini düşürür.  
- [ ] Niyet/route katmanı: düşük güven → büyük modele yeniden dene; aksi halde küçük/orta modelde kal.  
- [ ] Maliyet izleme: model başına aylık token/ücret dashboard’u.

---

## 11. Güvenlik Checklist (Hızlı Referans)

- [ ] WhatsApp → Agent Backend her istekte `user_id`, `display_name`, `device_fingerprint` gönderiyor.  
- [ ] Session TTL & inactivity timeout uygulanıyor.  
- [ ] Delete/Update/Payment tool'ları `user_id` filtresi olmadan çalışmıyor.  
- [ ] SecurityAgent üzerinden PIN/OTP doğrulaması zorunlu kılındı.  
- [ ] Audit log + anomaly detection devrede.  
- [ ] Backup/restore prosedürü belgelendi.

---

## 12. MVP Kapanış Kriteri

1. Phase 1 + 2 + 3 tamamlandı.  
2. Güvenlik Fazı (OTP + session) devrede.  
3. Delete/Update tool'ları gerçek veride test edildi.  
4. Payment fazı için temel altyapı hazır (gateway + OTP).  
5. WhatsApp deneyimi kişiselleştirilmiş (isimle hitap, profil özetleri).

Bu plan tamamlandığında WhatsApp üzerinden güvenli, kişiselleştirilmiş ve aksiyon odaklı bir pazar deneyimi sunabiliriz. 🚀

---

## 13. Güvenlik Açıkları & TODO (6 Aralık 2025)

### 🔴 KRİTİK: Yayınlanmış İlan Güncelleme Güvenlik Açığı

**Problem:**  
Yapay zeka, yayınlanmış (onaylanmış) ilanları hiçbir kimlik kontrolü yapmadan sadece konuşma geçmişine bakarak güncelleyebiliyor. Kullanıcı "fiyat değiştir" dediğinde sistem:
- İlanın gerçekten o kullanıcıya ait olduğunu doğrulamıyor
- PIN/OTP/şifre gibi ikinci faktör doğrulama istemiyor
- Sadece sohbet context'inden "bu ilan senindi" çıkarımı yapıyor

**Güvenlik Riski:**  
- WhatsApp numarası ele geçirilirse tüm ilanlar değiştirilebilir
- Başkasının ilanını değiştirme riski (context pollution ile)
- Audit trail eksik (kim ne zaman değiştirdi takibi yok)

**Çözüm (Production'a geçmeden ÖNCE):**

1. **UpdateListingAgent Değişiklikleri:**
   ```python
   # Yayınlanmış ilan güncellemesi için zorunlu kontroller:
   - İlan ID'si user_id ile eşleşmeli (DB query: listings.user_id = current_user_id)
   - Eğer critical field (price, title) değişiyorsa → PIN/OTP iste
   - Update audit_log tablosuna kaydet (user_id, listing_id, field, old_value, new_value, timestamp)
   ```

2. **Taslak vs Yayınlanmış İlan Ayrımı:**
   - **Taslak (draft):** Onaylanmadan önce → Serbest düzenleme OK
   - **Yayınlanmış (active):** Onaylandıktan sonra → Güvenlik kontrolü ZORUNLU
   - listings.status field'ı: 'draft' | 'active' | 'sold' | 'inactive'

3. **Implementation Adımları:**
   - [ ] `update_listing_tool` içine user_id parametresi ekle ve WHERE clause'a ekle
   - [ ] UpdateListingAgent instructions'a "yayınlanmış ilan güncelleme = PIN iste" kuralı ekle
   - [ ] SecurityAgent ile entegrasyon (Phase 4.3 ile birlikte)
   - [ ] audit_events tablosu oluştur ve log kaydetmeye başla
   - [ ] Test: Farklı user_id ile başkasının ilanını güncellemeyi dene → başarısız olmalı

4. **Kısa Vadeli Workaround (Sistem production ready değilken):**
   - UpdateListingAgent sadece son N dakika içinde oluşturulan ilanları güncellesin
   - Veya sadece draft status'taki ilanları güncellesin
   - Active ilanlar için "Bu ilan yayında, değişiklik için lütfen siteye giriş yapın" mesajı ver

**Öncelik:** 🔴 YÜKSEK (Phase 4 ile birlikte çözülmeli)  
**Sorumlu:** Backend + Agent geliştirici  
**Hedef Tarih:** Güvenlik fazı tamamlanana kadar geçici workaround devrede olmalı

Fotoğraf Özelliği Yol Planı

1. Supabase altyapısı

product-images → private bucket; storage RLS: yalnızca service_role yazsın/okusun, public erişim yok.
storage.objects politikaları: role = service_role için ALL; signed URL kullanımı için Supabase’in kendi anon token’ı yeterli.
listings tablosuna images jsonb default '[]'::jsonb kolonu ekle; image_url legacy olarak ilk görsel için tutulabilir ama asıl path’ler images içinde saklanır (ör. [{ "path": "user/uuid/listing/shot1.jpg", "label": "primary" }]).
2. WhatsApp Bridge medya hattı

Twilio’dan gelen MediaUrlN adreslerini 5 dakikalık TTL bitmeden httpx ile indir.
Dosya tipini/mime’ı doğrula, max 10 MB, sadece jpeg/png/webp kabul et; istersen antivirüs ya da Vision moderation ekle.
Dosyayı Supabase Storage’a service_key ile yükle (dosya adı: {user_id}/{draft_id}/{uuid}.jpg).
Upload sonrası yalnızca path’i (ve thumbnail bilgisi) Agent Backend’e gönder; WhatsApp’a asla raw Supabase URL’si dönme.
3. Agent Backend & Tools

WorkflowInputa media_refs listesi ekle; ListingAgent taslakta images metadatası tutar.
insert_listing ve update_listing fonksiyonlarına [images: Optional[List[str]]](http://vscodecontentref/7) parametresi ekle; Supabase'e kaydederken images kolonuna path dizisini yazar, image_url opsiyonel.

---

# 🚀 YENİ AGENT MİMARİSİ (Aralık 2025)

## Mimari Diyagram

```
RouterAgent (Orchestrator)
        ↓
┌───────┼───────┼───────┐
↓       ↓       ↓       ↓
Voice   Image   Market  Fraud
Agent   Agent   Agent   Agent
```

## Agent Detayları

### ImageAgent (Vision + Auto-Listing)
**Tech Stack:**
- OpenAI GPT-4 Vision
- PIL/OpenCV preprocessing
- Category ML model
- Price estimation algorithm

**Features:**
- Fotoğraftan kategori/marka/model tanıma
- Otomatik başlık + açıklama oluşturma
- Ürün durumu tespiti (yeni/kullanılmış)
- Tahmini fiyat önerisi
- Kalite skoru (1-10)

**Implementation:**
```python
class ImageAgent(BaseAgent):
    async def analyze(self, image_path):
        # Vision API call
        # Extract: category, brand, condition, price
        # Return structured JSON
```

### VoiceAgent (Speech-to-Text + TTS)
**Tech Stack:**
- OpenAI Whisper (STT)
- OpenAI TTS (Text-to-Speech)
- Real-time streaming

**Features:**
- Sesli komut: "iPhone sat", "telefon ara"
- Türkçe optimizasyon
- Eller serbest ilan oluşturma
- TTS ile geri bildirim

### MarketingAgent (Web Scraping + Analysis)
**Tech Stack:**
- Playwright (browser automation)
- BeautifulSoup (parsing)
- Price comparison engine

**Features:**
- Sahibinden/Letgo scraping
- Piyasa fiyat analizi (min/max/avg)
- Trend tespiti (talep artıyor mu?)
- Rekabet skoru
- Satış stratejisi önerileri

### PriceAgent (Dynamic Pricing)
- Optimal fiyat önerisi
- Dinamik indirim stratejisi
- Satış tahmini (X gün içinde satılır)

### TranslationAgent (i18n)
- 10+ dil desteği
- Otomatik çeviri
- Kültürel uyarlama

### FraudDetectionAgent (Security)
- Şüpheli ilan tespiti
- Sahte fotoğraf kontrolü (reverse search)
- Risk skoru (1-10)
- Otomatik uyarı

## Timeline

| Agent | Süre | Öncelik |
|-------|------|---------|
| ImageAgent | 2 hafta | ⭐⭐⭐ |
| VoiceAgent | 2 hafta | ⭐⭐⭐ |
| MarketingAgent | 3 hafta | ⭐⭐ |
| PriceAgent | 1 hafta | ⭐ |
| TranslationAgent | 1 hafta | ⭐ |
| FraudDetectionAgent | 2 hafta | ⭐⭐ |

## Frontend Integration

```typescript
// ChatBox.tsx yeni özellikler
<MicrophoneButton onClick={startVoiceRecording} />
<ImageUpload onChange={handleImageUpload} />
<ComparisonTable platforms={['PazarGlobal', 'Sahibinden']} />
```

**Son Güncelleme:** 8 Aralık 2025  
**Sıradaki:** Listings Supabase entegrasyonu → ImageAgent başlangıç
Delete/Update işlemlerinde Supabase Storage’daki eski dosyaları silmek için seçenek ekle (örn. delete_images: bool).
Search/List tool’ları sonuç döndürürken image path’lerini generate_signed_urls(paths) ile 5 dakikalık linklere çevirir ve cevaba “📷 Fotoğrafı aç” satırı ekler.
4. Agent talimatları

ListingAgent: “Kullanıcı medya gönderirse images alanına ekle, önizlemede fotoğraf sayısını bildir.”
PublishAgent: taslaktaki images listesini insert tool’a geçir; hata varsa kullanıcıya “fotoğraf yüklenemedi” bilgisi.
UpdateAgent: “fotoğraf ekle”, “fotoğraf sil” gibi komutları destekle (yeni tool parametreleri).
SearchAgent: sonuçta görsel varsa link ver; yoksa “(Fotoğraf yok)” notu.
5. API & güvenlik

Backend’te /media/upload gibi bir yardımcı endpoint (opsiyonel) ile WhatsApp dışındaki istemciler de dosya atabilir.
Tüm upload/signed URL talepleri media_audit tablosuna loglansın (user_id, file, action).
Signed URL’ler süresi dolunca kullanıcı linke yeniden tıkladığında backend yeni link üretmeli.
Kullanıcı kayıtlı değilse veya session doğrulanmadıysa fotoğraf görüntüleme linki üretilmesin.
6. Teslimatlar

Supabase migration: images kolonu + storage RLS.
WhatsApp bridge: medya indirme, validation, upload.
Backend/tools/workflow güncellemeleri.
Agent talimatları & preview metinleri.
Test scriptleri:
Fotoğraflı ilan oluşturma (yeni fotonun Supabase’de olduğunu doğrula).
Fotoğrafsız ilan (boş liste) → signed URL üretilmemeli.
Update agent ile fotoğraf ekleme/çıkarma.
Search cevaplarında linklerin çalıştığını kontrol et.
Bu adımlarla kullanıcı WhatsApp’tan fotoğraf yollayarak ilan açabilecek, UpdateAgent üzerinden sonradan görsel ekleyebilecek ve diğer kullanıcılar da güvenli signed URL’ler sayesinde fotoğrafları görebilecek. Hazırsan Supabase migration + storage politikalarıyla başlayabiliriz.
