import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../stores/authStore';

interface TopNavigationProps {
  isScrolled: boolean;
}

export default function TopNavigation({ isScrolled }: TopNavigationProps) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState('');
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const { user, profile, isAuthenticated, signIn, signUp, signOut, loadUser } = useAuthStore();

  // Kullanıcıyı yükle
  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const handleNavigation = (path: string) => {
    if (window.REACT_APP_NAVIGATE) {
      window.REACT_APP_NAVIGATE(path);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoggingIn(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const result = await signIn(email, password);
    
    setIsLoggingIn(false);

    if (result.success) {
      setShowLoginModal(false);
    } else {
      setError(result.error || 'Giriş yapılırken bir hata oluştu');
    }
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoggingIn(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const fullName = formData.get('fullName') as string;

    const result = await signUp(email, password, fullName);
    
    setIsLoggingIn(false);

    if (result.success) {
      setShowSignUpModal(false);
      setShowLoginModal(false);
    } else {
      setError(result.error || 'Kayıt olurken bir hata oluştu');
    }
  };

  const handleLogout = async () => {
    await signOut();
    setShowProfileMenu(false);
  };

  const getInitials = () => {
    if (profile?.display_name) {
      return profile.display_name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    if (profile?.full_name) {
      return profile.full_name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return 'U';
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-white/80 backdrop-blur-md'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div
              className="flex items-center space-x-3 cursor-pointer"
              onClick={() => handleNavigation('/')}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-cyan-500 rounded-xl flex items-center justify-center">
                <i className="ri-sparkling-2-fill text-white text-xl" />
              </div>
              <span className="text-xl font-display font-bold text-gray-900">PazarGlobal</span>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => handleNavigation('/')}
                className="text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors whitespace-nowrap cursor-pointer"
              >
                Ana Sayfa
              </button>
              <button
                onClick={() => handleNavigation('/listings')}
                className="text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors whitespace-nowrap cursor-pointer"
              >
                İlanlar
              </button>
              <button
                onClick={() => handleNavigation('/about')}
                className="text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors whitespace-nowrap cursor-pointer"
              >
                Hakkımızda
              </button>
            </div>

            {/* User Actions */}
            <div className="flex items-center space-x-4">
              {!isAuthenticated ? (
                <>
                  <button
                    onClick={() => setShowLoginModal(true)}
                    className="px-5 py-2 text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors whitespace-nowrap cursor-pointer"
                  >
                    Giriş Yap
                  </button>
                  <button
                    onClick={() => {
                      const chatButton = document.querySelector('.chat-fab-button') as HTMLElement;
                      if (chatButton) {
                        chatButton.click();
                      }
                    }}
                    className="px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-cyan-500 rounded-full hover:shadow-lg hover:scale-105 transition-all whitespace-nowrap cursor-pointer"
                  >
                    İlan Ver
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      const chatButton = document.querySelector('.chat-fab-button') as HTMLElement;
                      if (chatButton) {
                        chatButton.click();
                      }
                    }}
                    className="px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-cyan-500 rounded-full hover:shadow-lg hover:scale-105 transition-all whitespace-nowrap cursor-pointer"
                  >
                    İlan Ver
                  </button>

                  {/* Profile Menu */}
                  <div className="relative" ref={profileMenuRef}>
                    <button
                      onClick={() => setShowProfileMenu(!showProfileMenu)}
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center text-white font-semibold hover:shadow-lg transition-all cursor-pointer"
                    >
                      {getInitials()}
                    </button>

                    <AnimatePresence>
                      {showProfileMenu && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
                        >
                          {/* Profile Header */}
                          <div className="p-4 bg-gradient-to-br from-purple-50 to-cyan-50 border-b border-gray-100">
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center text-white font-semibold text-lg">
                                {getInitials()}
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900">
                                  {profile?.display_name || profile?.full_name || 'Kullanıcı'}
                                </p>
                                <p className="text-xs text-gray-600">{profile?.email || user?.email}</p>
                              </div>
                            </div>
                          </div>

                          {/* Menu Items */}
                          <div className="py-2">
                            <button className="w-full px-4 py-3 flex items-center space-x-3 hover:bg-gray-50 transition-colors cursor-pointer text-left">
                              <div className="w-8 h-8 flex items-center justify-center">
                                <i className="ri-user-line text-lg text-gray-600" />
                              </div>
                              <span className="text-sm font-medium text-gray-700">Profilim</span>
                            </button>

                            <button className="w-full px-4 py-3 flex items-center space-x-3 hover:bg-gray-50 transition-colors cursor-pointer text-left">
                              <div className="w-8 h-8 flex items-center justify-center">
                                <i className="ri-file-list-3-line text-lg text-gray-600" />
                              </div>
                              <span className="text-sm font-medium text-gray-700">İlanlarım</span>
                            </button>

                            <button className="w-full px-4 py-3 flex items-center space-x-3 hover:bg-gray-50 transition-colors cursor-pointer text-left">
                              <div className="w-8 h-8 flex items-center justify-center">
                                <i className="ri-heart-line text-lg text-gray-600" />
                              </div>
                              <span className="text-sm font-medium text-gray-700">Favorilerim</span>
                            </button>

                            <button className="w-full px-4 py-3 flex items-center space-x-3 hover:bg-gray-50 transition-colors cursor-pointer text-left">
                              <div className="w-8 h-8 flex items-center justify-center">
                                <i className="ri-message-3-line text-lg text-gray-600" />
                              </div>
                              <span className="text-sm font-medium text-gray-700">Mesajlarım</span>
                            </button>

                            <button className="w-full px-4 py-3 flex items-center space-x-3 hover:bg-gray-50 transition-colors cursor-pointer text-left">
                              <div className="w-8 h-8 flex items-center justify-center">
                                <i className="ri-settings-3-line text-lg text-gray-600" />
                              </div>
                              <span className="text-sm font-medium text-gray-700">Ayarlar</span>
                            </button>

                            <div className="border-t border-gray-100 my-2" />

                            <button
                              onClick={handleLogout}
                              className="w-full px-4 py-3 flex items-center space-x-3 hover:bg-red-50 transition-colors cursor-pointer text-left"
                            >
                              <div className="w-8 h-8 flex items-center justify-center">
                                <i className="ri-logout-box-line text-lg text-red-600" />
                              </div>
                              <span className="text-sm font-medium text-red-600">Çıkış Yap</span>
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Login Modal */}
      <AnimatePresence>
        {showLoginModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowLoginModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-gradient-to-br from-purple-600 to-cyan-500 p-8 text-center">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <i className="ri-user-line text-3xl text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Hoş Geldiniz</h2>
                <p className="text-purple-100 text-sm">Hesabınıza giriş yapın</p>
              </div>

              {/* Form */}
              <form onSubmit={handleLogin} className="p-8">
                <div className="space-y-5">
                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                      {error}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      E-posta
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      disabled={isLoggingIn}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none text-sm disabled:bg-gray-50"
                      placeholder="ornek@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Şifre
                    </label>
                    <input
                      type="password"
                      name="password"
                      required
                      disabled={isLoggingIn}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none text-sm disabled:bg-gray-50"
                      placeholder="••••••••"
                    />
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer" />
                      <span className="ml-2 text-gray-600">Beni hatırla</span>
                    </label>
                    <button type="button" className="text-purple-600 hover:text-purple-700 font-medium cursor-pointer">
                      Şifremi unuttum
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoggingIn}
                    className="w-full py-3 bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all whitespace-nowrap cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {isLoggingIn ? 'Giriş yapılıyor...' : 'Giriş Yap'}
                  </button>

                  <div className="text-center text-sm text-gray-600">
                    Hesabınız yok mu?{' '}
                    <button 
                      type="button" 
                      onClick={() => {
                        setShowLoginModal(false);
                        setShowSignUpModal(true);
                        setError('');
                      }}
                      className="text-purple-600 hover:text-purple-700 font-semibold cursor-pointer"
                    >
                      Kayıt Ol
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sign Up Modal */}
      <AnimatePresence>
        {showSignUpModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowSignUpModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-gradient-to-br from-purple-600 to-cyan-500 p-8 text-center">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <i className="ri-user-add-line text-3xl text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Hesap Oluştur</h2>
                <p className="text-purple-100 text-sm">Hemen ücretsiz kayıt olun</p>
              </div>

              {/* Form */}
              <form onSubmit={handleSignUp} className="p-8">
                <div className="space-y-5">
                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                      {error}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ad Soyad
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      disabled={isLoggingIn}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none text-sm disabled:bg-gray-50"
                      placeholder="Ahmet Yılmaz"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      E-posta
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      disabled={isLoggingIn}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none text-sm disabled:bg-gray-50"
                      placeholder="ornek@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Şifre
                    </label>
                    <input
                      type="password"
                      name="password"
                      required
                      minLength={6}
                      disabled={isLoggingIn}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none text-sm disabled:bg-gray-50"
                      placeholder="••••••••"
                    />
                    <p className="text-xs text-gray-500 mt-1">En az 6 karakter olmalıdır</p>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoggingIn}
                    className="w-full py-3 bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all whitespace-nowrap cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {isLoggingIn ? 'Kayıt yapılıyor...' : 'Kayıt Ol'}
                  </button>

                  <div className="text-center text-sm text-gray-600">
                    Zaten hesabınız var mı?{' '}
                    <button 
                      type="button" 
                      onClick={() => {
                        setShowSignUpModal(false);
                        setShowLoginModal(true);
                        setError('');
                      }}
                      className="text-purple-600 hover:text-purple-700 font-semibold cursor-pointer"
                    >
                      Giriş Yap
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
