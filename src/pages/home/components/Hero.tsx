import { motion } from 'framer-motion';
import { useState } from 'react';

export default function Hero() {
  const [showPhone, setShowPhone] = useState(true);

  const handleStartClick = () => {
    if (window.REACT_APP_NAVIGATE) {
      window.REACT_APP_NAVIGATE('/listings');
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-300/30 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-300/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />
      </div>

      {/* Dark Overlay for Better Text Contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/5 to-black/10" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-left"
          >
            <motion.h1
              className="text-6xl lg:text-7xl font-display font-black leading-tight mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
                AI ile Saniyeler
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
                İçinde İlan Ver
              </span>
            </motion.h1>

            <motion.p
              className="text-xl lg:text-2xl text-gray-700 mb-10 font-light leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Fotoğraf çek, konuş, yayınla. Yapay zeka her şeyi halleder.
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <button 
                onClick={handleStartClick}
                className="group px-8 py-4 bg-gradient-primary text-white font-semibold rounded-full hover:shadow-2xl hover:scale-105 transition-all flex items-center space-x-2 whitespace-nowrap cursor-pointer"
              >
                <span>Hemen Başla</span>
                <i className="ri-sparkle-fill text-xl group-hover:rotate-12 transition-transform" />
              </button>
              <button 
                onClick={() => scrollToSection('how-it-works')}
                className="px-8 py-4 bg-white/80 backdrop-blur-sm text-gray-800 font-semibold rounded-full hover:bg-white hover:shadow-lg transition-all flex items-center space-x-2 whitespace-nowrap cursor-pointer"
              >
                <i className="ri-play-circle-line text-xl" />
                <span>Nasıl Çalışır?</span>
              </button>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="mt-16 grid grid-cols-3 gap-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <div>
                <div className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">500K+</div>
                <div className="text-sm text-gray-600 mt-1">Aktif Kullanıcı</div>
              </div>
              <div>
                <div className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">1M+</div>
                <div className="text-sm text-gray-600 mt-1">İşlenen İlan</div>
              </div>
              <div>
                <div className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">98%</div>
                <div className="text-sm text-gray-600 mt-1">Memnuniyet</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Visual */}
          {showPhone && (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative hidden lg:block"
            >
              <div className="relative">
                {/* Control Buttons */}
                <div className="absolute -top-4 right-0 z-20 flex items-center space-x-2">
                  <button
                    onClick={() => setShowPhone(false)}
                    className="w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer group"
                    title="Küçült"
                  >
                    <i className="ri-subtract-line text-gray-700 text-lg group-hover:text-gray-900" />
                  </button>
                  <button
                    onClick={() => setShowPhone(false)}
                    className="w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-red-50 transition-colors cursor-pointer group"
                    title="Kapat"
                  >
                    <i className="ri-close-line text-gray-700 text-lg group-hover:text-red-600" />
                  </button>
                </div>

                {/* Main Phone Mockup */}
                <div className="relative z-10 bg-white rounded-3xl shadow-2xl p-4 transform hover:scale-105 transition-transform duration-500">
                  <img
                    src="https://readdy.ai/api/search-image?query=modern%20smartphone%20displaying%20AI%20chat%20interface%20with%20colorful%20gradient%20messages%20and%20voice%20recording%20interface%2C%20clean%20minimal%20design%2C%20floating%20UI%20elements%20around%20phone%20showing%20photo%20icon%20microphone%20waves%20price%20tags%20and%20checkmarks%2C%20professional%20product%20photography%20with%20soft%20shadows&width=400&height=600&seq=hero-phone-1&orientation=portrait"
                    alt="PazarGlobal App"
                    className="w-full h-auto rounded-2xl object-cover"
                  />
                </div>

                {/* Floating Elements */}
                <motion.div
                  className="absolute -top-8 -right-8 w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-lg"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <i className="ri-camera-fill text-3xl text-white" />
                </motion.div>

                <motion.div
                  className="absolute top-1/4 -left-12 w-16 h-16 bg-gradient-secondary rounded-full flex items-center justify-center shadow-lg"
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                >
                  <i className="ri-mic-fill text-2xl text-white" />
                </motion.div>

                <motion.div
                  className="absolute bottom-1/4 -right-12 w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-lg"
                  animate={{ y: [0, -15, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, delay: 0.5 }}
                >
                  <i className="ri-price-tag-3-fill text-3xl text-purple-600" />
                </motion.div>

                <motion.div
                  className="absolute -bottom-8 left-1/4 w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-lg"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <i className="ri-check-line text-3xl text-white" />
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* Show Phone Button - appears when phone is hidden */}
          {!showPhone && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative hidden lg:flex items-center justify-center"
            >
              <button
                onClick={() => setShowPhone(true)}
                className="px-8 py-4 bg-gradient-primary text-white font-semibold rounded-full hover:shadow-2xl hover:scale-105 transition-all flex items-center space-x-2 whitespace-nowrap cursor-pointer"
              >
                <i className="ri-smartphone-line text-xl" />
                <span>Uygulamayı Göster</span>
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <i className="ri-arrow-down-line text-3xl text-gray-400" />
      </motion.div>
    </section>
  );
}
