import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { apiConfig } from '../config/api';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations';
import { Bot as BotIcon, MessageCircle, Gift, Zap, Shield, CheckCircle2, XCircle, Send } from 'lucide-react';

interface BotStatus {
  isAuthenticated: boolean;
  displayName: string | null;
  lastError: string | null;
}

const Bot: React.FC = () => {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [botStatus, setBotStatus] = useState<BotStatus>({
    isAuthenticated: false,
    displayName: null,
    lastError: null
  });
  const { language } = useLanguage();
  const t = translations[language];

  const checkBotStatus = async () => {
    try {
      const response = await fetch(`${apiConfig.botURL}/bot2/api/bot-status?botId=1`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        }
      });

      const data = await response.json();
      
      setBotStatus({
        isAuthenticated: Boolean(data.isAuthenticated),
        displayName: data.displayName || null,
        lastError: null
      });
    } catch (error) {
      console.error('Error verificando estado:', error);
      setBotStatus(prev => ({
        ...prev,
        lastError: t.botStatusError
      }));
    }
  };

  useEffect(() => {
    checkBotStatus();
    const interval = setInterval(checkBotStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      toast.error(t.enterUsername);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${apiConfig.botURL}/bot2/api/friend-request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({
          username,
          botId: 'bot1',
          sendFromAllBots: true
        })
      });

      const data = await response.json();

      if (data.success) {
        toast.success(t.friendRequestSent);
        setUsername('');
      } else {
        toast.error(data.error || t.friendRequestError);
      }
    } catch (error) {
      console.error('Error enviando solicitud:', error);
      toast.error(t.friendRequestError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#003554]">
      {/* Hero Section */}
      <div className="relative pt-32 pb-20 px-4">
        <div className="absolute inset-0 bg-[url('/circuit-pattern.png')] opacity-5"></div>
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center">
            <div className="inline-block p-3 bg-primary-500/20 rounded-2xl mb-6">
              <BotIcon className="w-12 h-12 text-primary-400" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              {t.botTitle}
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              {t.botDescription}
            </p>
          </div>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="container mx-auto px-4 pb-20">
        <div className="max-w-4xl mx-auto">
          {/* Estado del Bot */}
          <div className="bg-[#051923] rounded-2xl p-8 mb-12 border border-primary-500/20 shadow-lg">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-primary-500/20 rounded-xl">
                <Shield className="w-6 h-6 text-primary-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">{t.botStatus}</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${botStatus.isAuthenticated ? 'bg-green-400' : 'bg-red-400'} animate-pulse`}></div>
                <span className="text-lg text-gray-300">
                  {t.connectionStatus}:{' '}
                  <span className={`font-medium ${botStatus.isAuthenticated ? 'text-green-400' : 'text-red-400'}`}>
                    {botStatus.isAuthenticated ? t.connected : t.disconnected}
                  </span>
                </span>
              </div>
              {botStatus.displayName && (
                <div className="flex items-center gap-3 text-gray-300">
                  <MessageCircle className="w-5 h-5 text-primary-400" />
                  <span>{t.botName}: <span className="font-medium">{botStatus.displayName}</span></span>
                </div>
              )}
              {botStatus.lastError && (
                <div className="flex items-center gap-3 text-red-400">
                  <XCircle className="w-5 h-5" />
                  <span>{t.error}: {botStatus.lastError}</span>
                </div>
              )}
            </div>
          </div>

          {/* Pasos */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              {
                icon: <MessageCircle className="w-6 h-6 text-primary-400" />,
                title: t.step1Title,
                description: t.step1Description
              },
              {
                icon: <CheckCircle2 className="w-6 h-6 text-primary-400" />,
                title: t.step2Title,
                description: t.step2Description
              },
              {
                icon: <Gift className="w-6 h-6 text-primary-400" />,
                title: t.step3Title,
                description: t.step3Description
              }
            ].map((step, index) => (
              <div key={index} className="group">
                <div className="relative bg-[#051923] rounded-2xl p-6 border border-primary-500/20 shadow-lg transition-all duration-300 hover:border-primary-500/40 h-full">
                  <div className="w-12 h-12 bg-primary-500/20 rounded-xl flex items-center justify-center mb-4">
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                  <p className="text-gray-300">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Formulario */}
          <div className="relative">
            <div className="bg-[#051923] rounded-2xl p-8 border border-primary-500/20 shadow-lg">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="username" className="block text-lg font-bold text-white mb-3">
                    {t.fortniteUsername}
                  </label>
                  <div className="relative">
                    <input
                      id="username"
                      name="username"
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full px-5 py-4 bg-[#051923] border border-primary-500/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                      placeholder={t.usernamePlaceholder}
                      disabled={loading}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 px-6 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-bold text-lg transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 shadow-lg shadow-primary-500/20"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>{t.sendingRequest}</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>{t.sendFriendRequest}</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer 
        position="bottom-right"
        theme="dark"
      />
    </div>
  );
};

export default Bot;