import { motion } from 'framer-motion';

export default function About() {
  return (
    <section id="about" className="py-24 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-6">
              <span className="text-sm uppercase tracking-wider text-gray-600 font-semibold">
                Hikayemiz
              </span>
            </div>

            <h2 className="text-4xl lg:text-5xl font-display font-bold text-gray-900 mb-8 leading-tight">
              Türkiye'nin İlk AI-Native İlan Platformu
            </h2>

            <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
              <p>
                PazarGlobal, yapay zeka teknolojisini ilan verme deneyimine entegre eden Türkiye'nin ilk platformudur. 
                Misyonumuz, alım-satım sürecini herkes için daha hızlı, kolay ve güvenilir hale getirmek.
              </p>
              <p>
                Geleneksel ilan platformlarının karmaşık formları ve zaman alıcı süreçlerini ortadan kaldırarak, 
                kullanıcılarımıza saniyeler içinde profesyonel ilanlar oluşturma imkanı sunuyoruz.
              </p>
              <p>
                Fotoğraf tanıma, sesli komut, akıllı fiyatlandırma ve metin iyileştirme gibi AI destekli özelliklerimizle, 
                ilan verme deneyimini yeniden tanımlıyoruz.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-8 mt-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <div className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
                  500K+
                </div>
                <div className="text-gray-600">Aktif Kullanıcı</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                <div className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
                  1M+
                  <sup className="text-2xl ml-1">AI</sup>
                </div>
                <div className="text-gray-600">İşlenen İlan</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                <div className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
                  98%
                </div>
                <div className="text-gray-600">Memnuniyet Oranı</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
              >
                <div className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
                  24/7
                </div>
                <div className="text-gray-600">AI Destek</div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="https://readdy.ai/api/search-image?query=modern%20tech%20team%20working%20with%20AI%20technology%20in%20bright%20office%20space%2C%20diverse%20professionals%20collaborating%20on%20innovative%20marketplace%20platform%2C%20futuristic%20workspace%20with%20holographic%20displays%20and%20data%20visualization%2C%20warm%20ambient%20lighting%2C%20professional%20corporate%20photography&width=600&height=700&seq=about-team-1&orientation=portrait"
                alt="PazarGlobal Team"
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 to-transparent" />
            </div>

            {/* Floating Badge */}
            <motion.div
              className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-2xl p-6"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center">
                  <i className="ri-trophy-fill text-3xl text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">#1</div>
                  <div className="text-sm text-gray-600">AI Platform</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}