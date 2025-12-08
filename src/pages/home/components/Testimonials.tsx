import { motion } from 'framer-motion';

const testimonials = [
  {
    id: 1,
    name: 'Ahmet Yılmaz',
    role: 'Doğrulanmış Kullanıcı',
    content: 'PazarGlobal sayesinde eski telefonumu 5 dakikada sattım. AI asistan her şeyi hazırladı, ben sadece fotoğraf çektim!',
    avatar: 'https://readdy.ai/api/search-image?query=professional%20turkish%20man%20smiling%20portrait%20headshot%2C%20business%20casual%20attire%2C%20warm%20friendly%20expression%2C%20studio%20lighting%2C%20high%20quality%20photography&width=200&height=200&seq=testimonial-1&orientation=squarish',
    rating: 5,
  },
  {
    id: 2,
    name: 'Zeynep Kaya',
    role: 'Premium Üye',
    content: 'Sesli ilan verme özelliği muhteşem! Arabamı satarken tüm detayları konuşarak anlattım, AI mükemmel bir metin oluşturdu.',
    avatar: 'https://readdy.ai/api/search-image?query=professional%20turkish%20woman%20smiling%20portrait%20headshot%2C%20business%20attire%2C%20confident%20friendly%20expression%2C%20studio%20lighting%2C%20high%20quality%20photography&width=200&height=200&seq=testimonial-2&orientation=squarish',
    rating: 5,
  },
  {
    id: 3,
    name: 'Mehmet Demir',
    role: 'Doğrulanmış Kullanıcı',
    content: 'Fiyat önerisi özelliği çok işime yaradı. Piyasa fiyatını bilmiyordum, AI en uygun fiyatı önerdi ve hemen alıcı buldum.',
    avatar: 'https://readdy.ai/api/search-image?query=professional%20turkish%20businessman%20smiling%20portrait%20headshot%2C%20modern%20business%20casual%2C%20approachable%20expression%2C%20studio%20lighting%2C%20high%20quality%20photography&width=200&height=200&seq=testimonial-3&orientation=squarish',
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center space-x-2 text-sm text-gray-600 mb-4">
            <div className="w-2 h-2 bg-gradient-primary rounded-full" />
            <span className="uppercase tracking-wider font-semibold">Kullanıcılarımız Ne Diyor</span>
          </div>
          <h2 className="text-5xl lg:text-6xl font-display font-bold">
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Gerçek Deneyimler
            </span>
          </h2>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
            >
              {/* Quote Icon */}
              <div className="mb-6">
                <i className="ri-double-quotes-l text-6xl text-gray-200" />
              </div>

              {/* Rating */}
              <div className="flex space-x-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <i key={i} className="ri-star-fill text-xl text-yellow-400" />
                ))}
              </div>

              {/* Content */}
              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                {testimonial.content}
              </p>

              {/* Author */}
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 flex items-center justify-center">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="flex items-center space-x-2 mt-1">
                    <i className="ri-checkbox-circle-fill text-green-500 text-sm" />
                    <span className="text-sm text-gray-600">{testimonial.role}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}