import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

type Message = {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  listings?: any[]; // İlan bilgileri için
};

type Tab = 'general' | 'listing' | 'support';

// Generate or retrieve unique user ID
const getUserId = (): string => {
  let userId = localStorage.getItem('web_user_id');
  if (!userId) {
    userId = `web_user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('web_user_id', userId);
  }
  return userId;
};

// Parse listing data from message
const parseListings = (content: string): { cleanContent: string; listings: any[] } => {
  const searchCacheMatch = content.match(/\[SEARCH_CACHE\]({.*})/s);
  if (searchCacheMatch) {
    try {
      const cacheData = JSON.parse(searchCacheMatch[1]);
      const cleanContent = content.replace(/\[SEARCH_CACHE\].*$/s, '').trim();
      return { cleanContent, listings: cacheData.results || [] };
    } catch (e) {
      console.error('Failed to parse listings:', e);
    }
  }
  return { cleanContent: content, listings: [] };
};

export default function ChatBox() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('listing');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Merhaba! Ben PazarAI. Size nasıl yardımcı olabilirim? İlan vermek için fotoğraf gönderebilir veya ürününüzü anlatabilirsiniz.',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const currentMessageRef = useRef<string>('');
  const conversationHistory = useRef<Array<{ role: string; content: string }>>([]);

  const AGENT_BACKEND_URL = 'https://pazarglobal-agent-backend-production-4ec8.up.railway.app';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessageToAgent = async (message: string) => {
    setIsTyping(true);
    setIsConnecting(true);
    setError(null);
    currentMessageRef.current = '';

    const userId = getUserId();

    // Add user message to conversation history
    conversationHistory.current.push({
      role: 'user',
      content: message
    });

    try {
      const response = await fetch(`${AGENT_BACKEND_URL}/web-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          user_id: userId,
          conversation_history: conversationHistory.current
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Backend error response:', errorText);
        throw new Error(`Backend hatası (${response.status}): ${errorText || 'Bilinmeyen hata'}`);
      }

      setIsConnecting(false);

      // Check if response is SSE
      const contentType = response.headers.get('content-type');
      if (!contentType?.includes('text/event-stream')) {
        console.error('Invalid content type:', contentType);
        throw new Error('Backend yanlış format döndü. SSE bekleniyor.');
      }

      // Read SSE stream
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('Response body okunamıyor');
      }

      let aiMessageId = Date.now().toString();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          // Parse listings from final message
          const { cleanContent, listings } = parseListings(currentMessageRef.current);
          
          // Add AI response to conversation history
          if (cleanContent) {
            conversationHistory.current.push({
              role: 'assistant',
              content: cleanContent
            });
          }

          // Update message with parsed data
          setMessages((prev) => {
            const updated = [...prev];
            const index = updated.findIndex(m => m.id === aiMessageId);
            if (index >= 0) {
              updated[index] = {
                ...updated[index],
                content: cleanContent,
                listings: listings.length > 0 ? listings : undefined,
              };
            }
            return updated;
          });

          setIsTyping(false);
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              
              if (data.type === 'text' && data.content) {
                currentMessageRef.current += data.content;
                
                // Update or create AI message
                setMessages((prev) => {
                  const existingIndex = prev.findIndex(m => m.id === aiMessageId);
                  if (existingIndex >= 0) {
                    const updated = [...prev];
                    updated[existingIndex] = {
                      ...updated[existingIndex],
                      content: currentMessageRef.current,
                    };
                    return updated;
                  } else {
                    return [
                      ...prev,
                      {
                        id: aiMessageId,
                        type: 'ai',
                        content: currentMessageRef.current,
                        timestamp: new Date(),
                      },
                    ];
                  }
                });
              } else if (data.type === 'done') {
                // Streaming complete
                setIsTyping(false);
              } else if (data.type === 'error') {
                throw new Error(data.content || 'Backend hatası oluştu');
              }
            } catch (parseError) {
              console.error('SSE parse hatası:', parseError, 'Line:', line);
            }
          }
        }
      }
    } catch (err: any) {
      console.error('Agent bağlantı hatası:', err);
      
      // Determine error type and message
      let errorMessage = 'Bağlantı hatası. Lütfen tekrar deneyin.';
      
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        errorMessage = 'Backend\'e ulaşılamıyor. CORS veya network hatası olabilir.';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      setIsTyping(false);
      setIsConnecting(false);
      
      // Add error message
      const errorAiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: '⚠️ Üzgünüm, şu anda bağlantı kuramıyorum. Backend servisi çalışıyor mu kontrol edin. Lütfen daha sonra tekrar deneyin.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorAiMessage]);
    }
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    const messageToSend = inputValue;
    setInputValue('');
    
    // Send to agent backend
    sendMessageToAgent(messageToSend);
  };

  const handleQuickAction = (action: string) => {
    const quickMessages: Record<string, string> = {
      'create': 'Yeni bir ilan oluşturmak istiyorum',
      'price': 'Ürünüm için fiyat önerisi alabilir miyim?',
      'improve': 'İlan metnini iyileştirmek istiyorum',
      'search': 'Tüm ilanları göster',
      'seller': 'Satıcı bulmak istiyorum',
      'help': 'Yardım almak istiyorum',
    };

    const message = quickMessages[action];
    if (message) {
      const newMessage: Message = {
        id: Date.now().toString(),
        type: 'user',
        content: message,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, newMessage]);
      sendMessageToAgent(message);
    }
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const newMessage: Message = {
        id: Date.now().toString(),
        type: 'user',
        content: `📷 ${file.name} yüklendi`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, newMessage]);

      // TODO: Implement file upload to agent backend
      setIsTyping(true);
      setTimeout(() => {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: 'Dosya yükleme özelliği yakında aktif olacak!',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiResponse]);
        setIsTyping(false);
      }, 1500);
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      setTimeout(() => {
        setIsRecording(false);
        const newMessage: Message = {
          id: Date.now().toString(),
          type: 'user',
          content: '🎤 Sesli mesaj kaydedildi',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, newMessage]);
        
        // TODO: Implement voice message to agent backend
        setIsTyping(true);
        setTimeout(() => {
          const aiResponse: Message = {
            id: (Date.now() + 1).toString(),
            type: 'ai',
            content: 'Sesli mesaj özelliği yakında aktif olacak!',
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, aiResponse]);
          setIsTyping(false);
        }, 1500);
      }, 3000);
    }
  };

  const quickActions = [
    { id: 'create', icon: 'ri-add-circle-line', label: 'İlan Oluştur', color: 'from-purple-500 to-blue-500' },
    { id: 'search', icon: 'ri-search-line', label: 'İlan Ara', color: 'from-cyan-500 to-green-500' },
    { id: 'improve', icon: 'ri-edit-line', label: 'Metni İyileştir', color: 'from-orange-500 to-pink-500' },
  ];

  const renderListingCard = (listing: any) => {
    const images = listing.signed_images || [];
    const mainImage = images[0] || 'https://readdy.ai/api/search-image?query=product%20placeholder%20simple%20white%20background&width=400&height=300&seq=placeholder&orientation=landscape';

    return (
      <div 
        key={listing.id}
        onClick={() => navigate(`/listing/${listing.id}`)}
        className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
      >
        {/* Main Image */}
        <div className="relative h-40 bg-gray-100">
          <img
            src={mainImage}
            alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {listing.category && (
            <span className="absolute top-2 left-2 px-2 py-1 bg-purple-600 text-white text-xs rounded-full">
              {listing.category}
            </span>
          )}
        </div>

        {/* Image Gallery Thumbnails */}
        {images.length > 1 && (
          <div className="flex gap-1 p-2 bg-gray-50">
            {images.slice(0, 3).map((img: string, idx: number) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(img, '_blank');
                }}
                className="flex-1 h-16 rounded-lg overflow-hidden border-2 border-gray-200 hover:border-purple-600 transition-all"
              >
                <img
                  src={img}
                  alt={`${listing.title} ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}

        {/* Content */}
        <div className="p-3">
          <h4 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
            {listing.title}
          </h4>
          <div className="flex items-center justify-between mb-2">
            <span className="text-lg font-bold text-purple-600">
              {typeof listing.price === 'number' 
                ? listing.price.toLocaleString('tr-TR') 
                : listing.price} ₺
            </span>
            {listing.condition && (
              <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                {listing.condition}
              </span>
            )}
          </div>
          {listing.location && (
            <div className="flex items-center text-xs text-gray-500">
              <i className="ri-map-pin-line mr-1"></i>
              {listing.location}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderMessage = (msg: Message) => {
    const isUser = msg.role === 'user';
    
    // Parse listings from message
    let listings: any[] = [];
    let cleanContent = msg.content;
    
    const cacheMatch = msg.content.match(/\[SEARCH_CACHE\]({.*})/s);
    if (cacheMatch) {
      try {
        const cacheData = JSON.parse(cacheMatch[1]);
        listings = cacheData.results || [];
        cleanContent = msg.content.replace(/\[SEARCH_CACHE\]({.*})/s, '').trim();
      } catch (e) {
        console.error('Failed to parse listings:', e);
      }
    }

    return (
      <div
        key={msg.id}
        className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
      >
        <div className={`flex items-start space-x-2 max-w-[85%] ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
            isUser ? 'bg-purple-600' : 'bg-gray-200'
          }`}>
            <i className={`${isUser ? 'ri-user-line text-white' : 'ri-robot-line text-gray-600'}`}></i>
          </div>
          <div className="flex flex-col space-y-2 flex-1 min-w-0">
            <div
              className={`px-4 py-3 rounded-2xl break-words whitespace-pre-wrap ${
                isUser
                  ? 'bg-purple-600 text-white rounded-tr-none'
                  : 'bg-gray-100 text-gray-900 rounded-tl-none'
              }`}
            >
              {cleanContent}
            </div>
            
            {/* Render Listings */}
            {listings.length > 0 && (
              <div className="space-y-2">
                {listings.slice(0, 3).map((listing) => renderListingCard(listing))}
                {listings.length > 3 && (
                  <button
                    onClick={() => navigate('/listings')}
                    className="w-full py-2 text-sm text-purple-600 hover:text-purple-700 font-medium transition-colors"
                  >
                    Tüm İlanları Gör ({listings.length} ilan)
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* FAB Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-primary rounded-full shadow-2xl flex items-center justify-center z-50 hover:scale-110 transition-transform animate-pulse-slow cursor-pointer"
          >
            <i className="ri-chat-ai-line text-3xl text-white" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 w-[440px] h-[700px] bg-white rounded-3xl shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-primary p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <i className="ri-robot-2-fill text-2xl text-white" />
                </div>
                <div>
                  <div className="text-white font-semibold">PazarAI Asistan</div>
                  <div className="flex items-center space-x-1 text-white/80 text-xs">
                    <div className={`w-2 h-2 rounded-full ${isConnecting ? 'bg-yellow-400' : 'bg-green-400'} animate-pulse`} />
                    <span>{isConnecting ? 'Bağlanıyor...' : 'Çevrimiçi'}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors cursor-pointer"
                >
                  <i className="ri-subtract-line text-white text-xl" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors cursor-pointer"
                >
                  <i className="ri-close-line text-white text-xl" />
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 bg-gray-50">
              {[
                { id: 'general', label: 'Genel Sohbet' },
                { id: 'listing', label: 'İlan Asistanı' },
                { id: 'support', label: 'Destek' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as Tab)}
                  className={`flex-1 py-3 text-sm font-medium transition-colors relative whitespace-nowrap cursor-pointer ${
                    activeTab === tab.id ? 'text-purple-600' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-primary"
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Error Banner */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border-b border-red-200 px-4 py-2 flex items-center justify-between"
              >
                <div className="flex items-center space-x-2">
                  <i className="ri-error-warning-line text-red-500" />
                  <span className="text-sm text-red-700">{error}</span>
                </div>
                <button
                  onClick={() => setError(null)}
                  className="text-red-500 hover:text-red-700 cursor-pointer"
                >
                  <i className="ri-close-line" />
                </button>
              </motion.div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className="max-w-[85%] space-y-2">
                    <div
                      className={`rounded-2xl px-4 py-3 ${
                        message.type === 'user'
                          ? 'bg-gradient-primary text-white'
                          : 'bg-white text-gray-800 shadow-md'
                      }`}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{message.content}</p>
                    </div>

                    {/* Listing Cards */}
                    {message.listings && message.listings.length > 0 && (
                      <div className="space-y-2">
                        {message.listings.slice(0, 3).map((listing, idx) => (
                          <motion.div
                            key={listing.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                          >
                            <div className="flex">
                              {/* Image */}
                              {listing.signed_images && listing.signed_images[0] && (
                                <div className="w-24 h-24 flex-shrink-0">
                                  <img
                                    src={listing.signed_images[0]}
                                    alt={listing.title}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              )}
                              
                              {/* Content */}
                              <div className="flex-1 p-3 min-w-0">
                                <h4 className="text-sm font-semibold text-gray-900 mb-1 truncate">
                                  {listing.title}
                                </h4>
                                <div className="flex items-center justify-between">
                                  <span className="text-lg font-bold text-purple-600">
                                    {listing.price?.toLocaleString('tr-TR')} ₺
                                  </span>
                                  <span className="text-xs text-gray-500 flex items-center">
                                    <i className="ri-map-pin-line mr-1" />
                                    {listing.location}
                                  </span>
                                </div>
                                {listing.category && (
                                  <span className="inline-block mt-2 px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                                    {listing.category}
                                  </span>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                        
                        {message.listings.length > 3 && (
                          <div className="text-center">
                            <button
                              onClick={() => handleQuickAction('search')}
                              className="text-sm text-purple-600 hover:text-purple-700 font-medium cursor-pointer"
                            >
                              +{message.listings.length - 3} ilan daha göster
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-white rounded-2xl px-4 py-3 shadow-md">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Quick Actions */}
              {activeTab === 'listing' && messages.length <= 2 && !isTyping && (
                <div className="space-y-2 pt-4">
                  <p className="text-xs text-gray-500 text-center mb-3">Hızlı İşlemler</p>
                  {quickActions.map((action, index) => (
                    <motion.button
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => handleQuickAction(action.id)}
                      className={`w-full py-3 px-4 bg-gradient-to-r ${action.color} text-white rounded-xl hover:shadow-lg transition-all flex items-center space-x-3 whitespace-nowrap cursor-pointer`}
                    >
                      <i className={`${action.icon} text-xl`} />
                      <span className="text-sm font-medium">{action.label}</span>
                    </motion.button>
                  ))}
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-gray-200">
              {isRecording && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-3 flex items-center justify-center space-x-3 py-2"
                >
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-1 bg-red-500 rounded-full"
                        animate={{ height: [8, 24, 8] }}
                        transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.1 }}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-red-500 font-medium">Kaydediliyor...</span>
                </motion.div>
              )}

              <div className="flex items-center space-x-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  onClick={handleFileUpload}
                  disabled={isTyping}
                  className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-full transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <i className="ri-attachment-line text-xl" />
                </button>

                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Mesajınızı yazın..."
                  disabled={isTyping}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-full resize-none focus:outline-none focus:border-purple-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  rows={1}
                />

                <button
                  onClick={toggleRecording}
                  disabled={isTyping}
                  className={`w-10 h-10 flex items-center justify-center rounded-full transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                    isRecording
                      ? 'bg-red-500 text-white animate-pulse'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <i className={`${isRecording ? 'ri-stop-circle-line' : 'ri-mic-line'} text-xl`} />
                </button>

                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isTyping}
                  className="w-10 h-10 bg-gradient-primary text-white rounded-full flex items-center justify-center hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <i className="ri-send-plane-fill text-lg" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
