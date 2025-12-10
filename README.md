# 🌐 PazarGlobal Frontend

**AI-Powered Listing Platform - Web Interface**

PazarGlobal'in modern, responsive web arayüzü. Next.js ile geliştirilmiş, AI chatbot entegrasyonlu ilan platformu.

---

## 📋 İçindekiler

- [Durum](#-durum)
- [Özellikler](#-özellikler)
- [Teknoloji Stack](#-teknoloji-stack)
- [Kurulum](#-kurulum)
- [Proje Yapısı](#-proje-yapısı)
- [Önemli Componentler](#-önemli-componentler)
- [Agent Backend Entegrasyonu](#-agent-backend-entegrasyonu)
- [Gelecek Özellikler](#-gelecek-özellikler)

---

## 🚦 Durum

**⚠️ DEVELOPMENT STAGE**

- ✅ Core UI components tamamlandı
- ✅ ChatBox agent entegrasyonu çalışıyor
- ✅ Authentication (Supabase Auth) hazır
- ✅ Responsive design
- ❌ Production deployment yapılmadı
- ❌ Backend ile tam entegrasyon test edilmedi

**Next Steps:**
1. Vercel deployment
2. Backend API entegrasyonu test
3. User testing
4. Performance optimization

---

## ✨ Özellikler

### Mevcut Özellikler (Geliştirme)

#### 1. **AI Chat Interface** 🤖
- ✅ ChatBox component (Agent Backend'e direkt bağlı)
- ✅ Real-time messaging
- ✅ Conversation history
- ✅ User context (Supabase Auth ile)

#### 2. **Listing Pages** 📋
- ✅ Create listing (form-based)
- ✅ Listing detail page
- ✅ Listings list/browse
- ✅ Kategori bazlı görüntüleme

#### 3. **Authentication** 🔐
- ✅ Supabase Auth integration
- ✅ Login/Register pages
- ✅ Protected routes
- ✅ User session management

#### 4. **UI/UX** 🎨
- ✅ Modern, clean design
- ✅ Responsive (mobile/tablet/desktop)
- ✅ Dark mode ready (infrastructure)
- ✅ Tailwind CSS

---

## 🛠️ Teknoloji Stack

```
Framework:      Next.js 14 (App Router)
Language:       TypeScript
Styling:        Tailwind CSS
UI Components:  Custom components (+ headlessui potansiyeli)
Auth:           Supabase Auth
Database:       Supabase (PostgreSQL)
AI Integration: Agent Backend (FastAPI)
State:          React Context / Local State
Forms:          React Hook Form (potansiyel)
Deployment:     Vercel (planned)
```

---

## 🚀 Kurulum

### 1. Gereksinimler
- Node.js 18+
- npm veya yarn
- Supabase account
- Agent Backend URL

### 2. Clone & Install
```bash
cd PazarGlobal_Fronted/pazarglobal-frontend
npm install
```

### 3. Environment Variables
`.env.local` dosyası oluşturun:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...

# Agent Backend (direkt ChatBox'ta kullanılıyor)
NEXT_PUBLIC_AGENT_BACKEND_URL=https://pazarglobal-agent-backend-production.up.railway.app

# App Config
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Development Server
```bash
npm run dev
```

Server: `http://localhost:3000`

### 5. Build
```bash
npm run build
npm start  # Production mode
```

---

## 📁 Proje Yapısı

```
pazarglobal-frontend/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Homepage
│   │   └── ...                # Other pages
│   │
│   ├── components/
│   │   ├── feature/           # Feature components
│   │   │   └── ChatBox.tsx    # ⭐ AI Chat Component
│   │   ├── layout/            # Layout components
│   │   └── ui/                # UI primitives
│   │
│   ├── pages/
│   │   ├── listings/          # Listing pages
│   │   │   └── page.tsx
│   │   ├── listing-detail/    # Detail page
│   │   │   └── page.tsx
│   │   ├── create-listing/    # Create listing form
│   │   │   └── page.tsx
│   │   └── auth/              # Auth pages
│   │
│   ├── lib/                   # Utilities
│   │   └── supabaseClient.ts  # Supabase client
│   │
│   └── styles/
│       └── globals.css        # Global styles
│
├── public/                    # Static assets
├── .env.local                 # Environment variables
├── next.config.js             # Next.js config
├── tailwind.config.js         # Tailwind config
└── package.json
```

---

## 🎯 Önemli Componentler

### 1. **ChatBox** (`src/components/feature/ChatBox.tsx`)

**En Kritik Component - Agent Backend Entegrasyonu**

```typescript
const AGENT_BACKEND_URL = 'https://pazarglobal-agent-backend-production.up.railway.app';

export default function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  
  // User context from Supabase Auth
  const { user } = useAuth();
  
  // Send message to Agent Backend
  const handleSend = async () => {
    const response = await fetch(`${AGENT_BACKEND_URL}/web-chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: user?.id || 'guest',
        message: input,
        conversation_history: messages,
        user_context: {
          name: user?.user_metadata?.full_name
        }
      })
    });
    
    const data = await response.json();
    setMessages([...messages, 
      { role: 'user', content: input },
      { role: 'assistant', content: data.response }
    ]);
  };
}
```

**Özellikler:**
- ✅ Direkt Agent Backend'e bağlanır (WhatsApp Bridge kullanmaz!)
- ✅ User authentication ile entegre
- ✅ Conversation history management
- ✅ Real-time messaging UI
- ⚠️ Media upload henüz yok (TODO)

**Kullanıldığı Sayfalar:**
- `/listings` - Ilan listesi sayfasında
- `/listing-detail` - İlan detay sayfasında
- `/create-listing` - İlan oluşturma sayfasında

---

### 2. **Listings Page** (`src/pages/listings/page.tsx`)

**İlan listesi & arama sayfası**

**Features:**
- İlan listesi görüntüleme
- Kategori filtreleme
- ChatBox ile AI arama
- Responsive grid layout

---

### 3. **Create Listing Page** (`src/pages/create-listing/page.tsx`)

**Form-based ilan oluşturma**

**Not:** Kullanıcı hem form doldurabilir hem de ChatBox ile AI'ya ilan yaptırabilir.

**Dual Approach:**
1. **Traditional Form:** Manuel form doldurma
2. **AI Chat:** ChatBox ile konuşarak ilan oluşturma

---

### 4. **Listing Detail Page** (`src/pages/listing-detail/page.tsx`)

**İlan detay sayfası**

**Features:**
- Full listing details
- Image gallery
- Contact information
- ChatBox (sorular için)

---

## 🔗 Agent Backend Entegrasyonu

### ChatBox → Agent Backend Flow

```
User types message in ChatBox
         ↓
ChatBox component (React)
         ↓
POST /web-chat (NOT /agent/run)
         ↓
Agent Backend (Railway)
         ↓
Workflow Runner → RouterAgent → Specialized Agent
         ↓
Response → ChatBox
         ↓
UI Update
```

### Endpoint Kullanımı

**⚠️ ÖNEMLİ:** ChatBox `/web-chat` endpoint kullanıyor (frontend için özel)

```typescript
// ChatBox.tsx
const response = await fetch(`${AGENT_BACKEND_URL}/web-chat`, {
  method: 'POST',
  body: JSON.stringify({
    user_id: user?.id,
    message: input,
    conversation_history: messages
  })
});
```

**vs WhatsApp Bridge:**
- WhatsApp Bridge → `/agent/run` kullanır
- Web Frontend → `/web-chat` kullanır
- Aynı workflow, farklı endpoint (CORS, session yönetimi farklı)

---

## 🎯 Gelecek Özellikler

### Phase 1: Production Launch 🚀
**Timeline:** 2 hafta

**Checklist:**
- [ ] Vercel deployment
- [ ] Environment variables setup
- [ ] Domain configuration
- [ ] SSL certificate
- [ ] Analytics integration (Google Analytics / Vercel Analytics)

---

### Phase 2: ChatBox Enhancements 💬
**Timeline:** 1 hafta

**Features:**
- [ ] Media upload (image upload via ChatBox)
- [ ] Voice input (Web Speech API)
- [ ] File attachments
- [ ] Rich message formatting
- [ ] Typing indicator
- [ ] Read receipts

---

### Phase 3: Advanced Features 🌟
**Timeline:** 2-3 hafta

**Features:**
- [ ] Favorites/Wishlist
- [ ] Comparison tool
- [ ] Advanced search filters
- [ ] Price alerts
- [ ] User dashboard (my listings, messages, stats)
- [ ] Dark mode toggle

---

### Phase 4: Performance & SEO 📈
**Timeline:** 1 hafta

**Optimizations:**
- [ ] Image optimization (Next.js Image)
- [ ] Code splitting
- [ ] SEO meta tags
- [ ] Sitemap generation
- [ ] Schema.org markup
- [ ] Lighthouse score 90+

---

### Phase 5: Mobile App 📱
**Timeline:** 4-6 hafta

**Approach:**
- React Native (code sharing ile)
- Veya PWA (Progressive Web App)

---

## 🐛 Known Issues

### 1. ChatBox Media Upload
**Status:** Not implemented

**Workaround:** Kullanıcılar fotoğraf için create-listing form'u kullanabilir

---

### 2. Real-time Updates
**Status:** Polling-based (not WebSocket)

**TODO:** WebSocket veya Supabase Realtime entegrasyonu

---

### 3. Offline Support
**Status:** No offline functionality

**TODO:** Service Worker + IndexedDB

---

## 📚 Kaynaklar

- **Next.js Docs:** https://nextjs.org/docs
- **Supabase Docs:** https://supabase.com/docs
- **Tailwind CSS:** https://tailwindcss.com/docs
- **Vercel Deployment:** https://vercel.com/docs

---

## 📝 Development Notes

### Running Locally
```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Linting
npm run lint
```

### Environment Setup
1. Copy `.env.example` to `.env.local`
2. Fill in Supabase credentials
3. Set Agent Backend URL
4. Start development

### Common Commands
```bash
# Add new dependency
npm install package-name

# TypeScript check
npx tsc --noEmit

# Format code
npx prettier --write .
```

---

## 🤝 Katkıda Bulunma

Proje aktif geliştirme aşamasında.

---

## 📄 Lisans

Private project - PazarGlobal

---

**Son Güncelleme:** 10 Aralık 2025  
**Durum:** Development (Not Production)  
**Next Milestone:** Vercel Deployment
