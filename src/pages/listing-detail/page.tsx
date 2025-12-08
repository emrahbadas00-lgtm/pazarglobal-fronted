import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import TopNavigation from '../../components/feature/TopNavigation';
import Footer from '../home/components/Footer';
import { supabase } from '../../lib/supabase';

interface ListingDetail {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  condition: string;
  location: string;
  images: string[];
  created_at: string;
  user_name: string;
  user_phone: string;
  views?: number;
}

export default function ListingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [listing, setListing] = useState<ListingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showContactModal, setShowContactModal] = useState(false);

  useEffect(() => {
    if (id) {
      fetchListingDetail(id);
    }
  }, [id]);

  const fetchListingDetail = async (listingId: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('id', listingId)
        .single();

      if (error) throw error;

      if (data) {
        // Fetch images
        const { data: imagesData } = await supabase
          .from('product_images')
          .select('image_url')
          .eq('listing_id', listingId)
          .order('created_at', { ascending: true });

        const images = imagesData?.map(img => img.image_url) || [];

        setListing({
          id: data.id,
          title: data.title,
          description: data.description || '',
          price: data.price,
          category: data.category,
          condition: data.condition,
          location: data.location,
          images: images.length > 0 ? images : ['https://readdy.ai/api/search-image?query=product%20placeholder%20simple%20white%20background&width=800&height=600&seq=placeholder&orientation=landscape'],
          created_at: data.created_at,
          user_name: data.user_name || 'Satıcı',
          user_phone: data.user_phone || '',
          views: data.views || 0
        });

        // Increment views
        await supabase.rpc('increment_listing_views', { listing_id: listingId });
      }
    } catch (error) {
      console.error('Error fetching listing:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: string) => {
    const itemDate = new Date(date);
    return itemDate.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <TopNavigation />
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-purple-600"></div>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-gray-50">
        <TopNavigation />
        <div className="flex flex-col items-center justify-center h-screen">
          <i className="ri-error-warning-line text-6xl text-gray-400 mb-4"></i>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">İlan Bulunamadı</h2>
          <p className="text-gray-600 mb-6">Aradığınız ilan mevcut değil veya kaldırılmış.</p>
          <button
            onClick={() => navigate('/listings')}
            className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
          >
            İlanlara Dön
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavigation />

      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
            <button onClick={() => navigate('/')} className="hover:text-purple-600 transition-colors">
              Ana Sayfa
            </button>
            <i className="ri-arrow-right-s-line"></i>
            <button onClick={() => navigate('/listings')} className="hover:text-purple-600 transition-colors">
              İlanlar
            </button>
            <i className="ri-arrow-right-s-line"></i>
            <span className="text-gray-900 font-medium">{listing.category}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Images */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden"
              >
                {/* Main Image */}
                <div className="relative h-96 bg-gray-100">
                  <img
                    src={listing.images[selectedImage]}
                    alt={listing.title}
                    className="w-full h-full object-contain"
                  />
                  {listing.images.length > 1 && (
                    <>
                      <button
                        onClick={() => setSelectedImage(prev => prev === 0 ? listing.images.length - 1 : prev - 1)}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg"
                      >
                        <i className="ri-arrow-left-s-line text-2xl"></i>
                      </button>
                      <button
                        onClick={() => setSelectedImage(prev => prev === listing.images.length - 1 ? 0 : prev + 1)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg"
                      >
                        <i className="ri-arrow-right-s-line text-2xl"></i>
                      </button>
                    </>
                  )}
                </div>

                {/* Thumbnail Gallery */}
                {listing.images.length > 1 && (
                  <div className="p-4 flex gap-3 overflow-x-auto">
                    {listing.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 transition-all ${
                          selectedImage === index ? 'border-purple-600 ring-2 ring-purple-200' : 'border-gray-200 hover:border-purple-300'
                        }`}
                      >
                        <img src={image} alt={`${listing.title} ${index + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>

              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl shadow-lg p-6 mt-6"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Açıklama</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {listing.description || 'Açıklama bulunmuyor.'}
                </p>
              </motion.div>
            </div>

            {/* Right Column - Details */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl shadow-lg p-6 sticky top-24"
              >
                <h1 className="text-2xl font-bold text-gray-900 mb-4">{listing.title}</h1>

                <div className="mb-6">
                  <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {listing.price.toLocaleString('tr-TR')} ₺
                  </div>
                </div>

                <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Kategori</span>
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm font-medium rounded-full">
                      {listing.category}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Durum</span>
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                      {listing.condition}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Konum</span>
                    <span className="flex items-center text-gray-900 font-medium">
                      <i className="ri-map-pin-line mr-1"></i>
                      {listing.location}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">İlan Tarihi</span>
                    <span className="text-gray-900 font-medium">{formatDate(listing.created_at)}</span>
                  </div>
                  {listing.views !== undefined && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Görüntülenme</span>
                      <span className="flex items-center text-gray-900 font-medium">
                        <i className="ri-eye-line mr-1"></i>
                        {listing.views}
                      </span>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setShowContactModal(true)}
                  className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:shadow-lg transition-all whitespace-nowrap"
                >
                  <i className="ri-phone-line mr-2"></i>
                  Satıcıyla İletişime Geç
                </button>

                <div className="mt-4 flex gap-3">
                  <button className="flex-1 py-3 border-2 border-gray-200 text-gray-700 font-medium rounded-xl hover:border-purple-600 hover:text-purple-600 transition-all whitespace-nowrap">
                    <i className="ri-heart-line mr-2"></i>
                    Favorilere Ekle
                  </button>
                  <button className="flex-1 py-3 border-2 border-gray-200 text-gray-700 font-medium rounded-xl hover:border-purple-600 hover:text-purple-600 transition-all whitespace-nowrap">
                    <i className="ri-share-line mr-2"></i>
                    Paylaş
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Satıcı Bilgileri</h3>
              <button
                onClick={() => setShowContactModal(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              >
                <i className="ri-close-line text-2xl"></i>
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <i className="ri-user-line text-2xl text-purple-600"></i>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Satıcı</div>
                  <div className="font-bold text-gray-900">{listing.user_name}</div>
                </div>
              </div>

              {listing.user_phone && (
                <a
                  href={`tel:${listing.user_phone}`}
                  className="flex items-center justify-center space-x-2 w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:shadow-lg transition-all whitespace-nowrap"
                >
                  <i className="ri-phone-line text-xl"></i>
                  <span>{listing.user_phone}</span>
                </a>
              )}

              {listing.user_phone && (
                <a
                  href={`https://wa.me/${listing.user_phone.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center space-x-2 w-full py-4 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition-all whitespace-nowrap"
                >
                  <i className="ri-whatsapp-line text-xl"></i>
                  <span>WhatsApp ile İletişime Geç</span>
                </a>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
