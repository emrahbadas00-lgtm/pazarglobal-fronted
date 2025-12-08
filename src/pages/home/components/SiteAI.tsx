import { motion } from 'framer-motion';

const siteAIFeatures = [
  {
    icon: 'ri-magic-line',
    title: 'Gelişmiş İlan Oluşturma',
    description: 'Fotoğraf yükleyin, AI otomatik olarak başlık, açıklama, kategori ve fiyat önerisi oluşturur. Ürün özelliklerini akıllıca tespit eder.',
    color: 'from-purple-500 to-pink-500'
  },
  {
    icon: 'ri-image-edit-line',
    title: 'AI Fotoğraf İyileştirme',
    description: 'Arka plan temizleme, renk düzeltme, netlik artırma, otomatik kırpma ve profesyonel görünüm için AI filtreleri.',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    icon: 'ri-search-eye-line',
    title: 'Akıllı Ürün Arama',
    description: 'Doğal dille arama yapın. "500 TL altında az kullanılmış iPhone" gibi karmaşık sorguları anlayıp en iyi sonuçları getirir.',
    color: 'from-green-500 to-emerald-500'
  },
  {
    icon: 'ri-bar-chart-box-line',
    title: 'Detaylı Piyasa Analizi',
    description: 'Ürününüzün piyasa değeri, fiyat trendleri, talep analizi, rekabet durumu ve satış tahminleri hakkında kapsamlı raporlar.',
    color: 'from-orange-500 to-red-500'
  },
  {
    icon: 'ri-robot-2-line',
    title: 'Otomatik Fiyat Optimizasyonu',
    description: 'AI, piyasa verilerini, talep-arz dengesini ve rekabeti analiz ederek dinamik fiyat önerileri sunar ve satış şansınızı artırır.',
    color: 'from-indigo-500 to-purple-500'
  },
  {
    icon: 'ri-chat-smile-3-line',
    title: 'Akıllı Müşteri Yanıtları',
    description: 'Alıcıların sorularına AI destekli otomatik yanıtlar. Ürün detayları, teslimat, ödeme gibi konularda anında bilgi.',
    color: 'from-pink-500 to-rose-500'
  },
  {
    icon: 'ri-translate-2',
    title: 'Çoklu Dil Desteği',
    description: 'İlanlarınızı otomatik olarak farklı dillere çevirin. Uluslararası alıcılara ulaşın, daha geniş kitleye satış yapın.',
    color: 'from-teal-500 to-cyan-500'
  },
  {
    icon: 'ri-shield-check-line',
    title: 'Dolandırıcılık Tespiti',
    description: 'AI, şüpheli ilanları, sahte profilleri ve güvenli olmayan işlemleri otomatik olarak tespit eder ve sizi uyarır.',
    color: 'from-red-500 to-orange-500'
  },
  {
    icon: 'ri-lightbulb-flash-line',
    title: 'Kişiselleştirilmiş Öneriler',
    description: 'Arama geçmişiniz ve ilgi alanlarınıza göre size özel ürün önerileri. İlginizi çekebilecek ilanları kaçırmayın.',
    color: 'from-yellow-500 to-orange-500'
  },
  {
    icon: 'ri-calendar-check-line',
    title: 'Otomatik İlan Yenileme',
    description: 'İlanlarınız belirli aralıklarla otomatik olarak yenilenir ve listenin üstünde kalır. Daha fazla görünürlük.',
    color: 'from-blue-500 to-indigo-500'
  },
  {
    icon: 'ri-message-3-line',
    title: 'Sesli Komut Desteği',
    description: 'Mikrofona konuşarak ilan oluşturun, arama yapın veya işlem gerçekleştirin. Eller serbest, hızlı ve kolay.',
    color: 'from-purple-500 to-indigo-500'
  },
  {
    icon: 'ri-dashboard-line',
    title: 'Gelişmiş Analitik Dashboard',
    description: 'İlan performansı, görüntülenme sayıları, tıklama oranları, mesaj istatistikleri ve satış analizleri tek ekranda.',
    color: 'from-cyan-500 to-blue-500'
  }
];

export default function SiteAI() {
  return (
    <section className="py-24 bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 px-6 py-3 rounded-full mb-6 shadow-lg">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <i className="ri-sparkling-2-fill text-white text-xl" />
            </div>
            <span className="text-sm font-semibold text-white">Site AI Asistan</span>
          </div>

          <h2 className="text-5xl lg:text-6xl font-display font-bold text-gray-900 mb-6 leading-tight">
            Site Üzerinde Yapay Zeka ile
            <br />
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              Sınırsız Özellikler
            </span>
          </h2>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Web sitemizdeki AI asistan, WhatsApp versiyonundan çok daha güçlü! 
            Gelişmiş özellikler, detaylı analizler ve profesyonel araçlarla tam kontrol sizde.
          </p>
        </motion.div>

        {/* Comparison Banner */}
        <motion.div
          className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-2xl p-8 mb-16 text-center shadow-xl"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            <div className="text-white">
              <div className="text-sm font-semibold mb-2 opacity-90">WhatsApp AI</div>
              <div className="text-3xl font-bold">8 Özellik</div>
            </div>
            
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <i className="ri-arrow-right-line text-white text-3xl" />
            </div>

            <div className="text-white">
              <div className="text-sm font-semibold mb-2 opacity-90">Site AI</div>
              <div className="text-3xl font-bold">12+ Özellik</div>
            </div>
          </div>
          
          <p className="text-white/90 mt-6 text-lg">
            Site üzerindeki AI asistan %50 daha fazla özellik ve %300 daha hızlı işlem gücü sunuyor!
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {siteAIFeatures.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 group cursor-pointer border border-gray-100"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -8 }}
            >
              <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                <i className={`${feature.icon} text-white text-2xl`} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          className="bg-gradient-to-br from-gray-900 via-slate-800 to-zinc-900 rounded-3xl p-12 text-center shadow-2xl relative overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500 rounded-full blur-3xl" />
          </div>

          <div className="max-w-3xl mx-auto relative z-10">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="ri-sparkling-2-fill text-white text-4xl" />
            </div>
            
            <h3 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Site AI Asistanını Şimdi Deneyin
            </h3>
            
            <p className="text-lg text-gray-300 mb-8">
              Sağ alttaki chat butonuna tıklayın ve yapay zeka asistanımızın gücünü keşfedin!
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-full hover:shadow-2xl hover:scale-105 transition-all flex items-center space-x-2 whitespace-nowrap cursor-pointer">
                <i className="ri-chat-3-line text-2xl" />
                <span>AI Chat'i Aç</span>
              </button>
              
              <button className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-full hover:bg-white/20 transition-all flex items-center space-x-2 whitespace-nowrap cursor-pointer border border-white/20">
                <i className="ri-play-circle-line text-xl" />
                <span>Demo İzle</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mt-12">
          {[
            { value: '1M+', label: 'AI İşlem/Gün' },
            { value: '99.9%', label: 'Doğruluk Oranı' },
            { value: '<1sn', label: 'Yanıt Süresi' },
            { value: '24/7', label: 'Kesintisiz Hizmet' }
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="bg-white/60 backdrop-blur-sm rounded-xl p-6 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                {stat.value}
              </div>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
