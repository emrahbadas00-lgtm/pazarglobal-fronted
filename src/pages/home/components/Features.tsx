import { motion } from 'framer-motion';
import { useState } from 'react';

const features = [
  {
    id: 1,
    title: 'AI Fotoğraf Tanıma',
    description: 'Fotoğrafınızı yükleyin, yapay zeka ürününüzü otomatik tanısın. Kategori, marka, model - her şey hazır.',
    icon: 'ri-camera-ai-line',
    gradient: 'from-purple-500 to-blue-500',
    image: 'https://readdy.ai/api/search-image?query=artificial%20intelligence%20analyzing%20product%20photo%20on%20smartphone%20screen%2C%20neural%20network%20visualization%2C%20modern%20tech%20interface%20with%20purple%20and%20blue%20gradient%20colors%2C%20clean%20minimal%20background%2C%20professional%20photography&width=600&height=400&seq=feature-ai-1&orientation=landscape',
  },
  {
    id: 2,
    title: 'Akıllı Fiyatlandırma',
    description: 'Piyasa analizi ve platform verilerine göre en uygun fiyat önerisi. Hızlı satış garantisi.',
    icon: 'ri-line-chart-line',
    gradient: 'from-cyan-500 to-green-500',
    image: 'https://readdy.ai/api/search-image?query=dynamic%20pricing%20chart%20with%20AI%20analytics%2C%20colorful%20graphs%20and%20data%20visualization%2C%20cyan%20and%20green%20gradient%20theme%2C%20modern%20financial%20dashboard%20interface%2C%20clean%20minimal%20design&width=600&height=400&seq=feature-price-2&orientation=landscape',
  },
  {
    id: 3,
    title: 'Sesli İlan Verme',
    description: 'Konuşun, AI yazıya döksün. Eller serbest, ilan hazır. Push-to-talk ile saniyeler içinde.',
    icon: 'ri-mic-ai-line',
    gradient: 'from-orange-500 to-pink-500',
    image: 'https://readdy.ai/api/search-image?query=voice%20recording%20interface%20with%20sound%20waves%20visualization%2C%20microphone%20icon%20with%20orange%20and%20pink%20gradient%2C%20modern%20audio%20UI%20design%2C%20clean%20minimal%20background%2C%20professional%20tech%20photography&width=600&height=400&seq=feature-voice-3&orientation=landscape',
  },
];

export default function Features() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <section id="features" className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-5xl lg:text-6xl font-display font-bold mb-6">
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Neden PazarGlobal?
            </span>
            <span className="ml-3">🚀</span>
          </h2>
          <p className="text-xl text-gray-600 font-light">
            Yapay zeka destekli özellikleri keşfedin
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              className="relative group cursor-pointer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              onMouseEnter={() => setHoveredId(feature.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div className="relative h-[500px] rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500">
                {/* Background Image */}
                <div className="absolute inset-0">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
                  />
                  <div
                    className={`absolute inset-0 bg-gradient-to-b ${feature.gradient} transition-opacity duration-500 ${
                      hoveredId === feature.id ? 'opacity-70' : 'opacity-80'
                    }`}
                  />
                </div>

                {/* Content */}
                <div className="relative h-full flex flex-col justify-end p-8">
                  <motion.div
                    initial={{ y: 0 }}
                    animate={{ y: hoveredId === feature.id ? -10 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6">
                      <i className={`${feature.icon} text-4xl text-white`} />
                    </div>

                    <h3 className="text-3xl font-display font-bold text-white mb-4">
                      {feature.title}
                    </h3>

                    <p className="text-lg text-white/90 leading-relaxed mb-6">
                      {feature.description}
                    </p>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: hoveredId === feature.id ? 1 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <button className="text-white font-semibold flex items-center space-x-2 hover:space-x-3 transition-all whitespace-nowrap cursor-pointer">
                        <span>Daha Fazla</span>
                        <i className="ri-arrow-right-line text-xl" />
                      </button>
                    </motion.div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}