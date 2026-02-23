import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import NewsFeed from './components/NewsFeed';
import NewsDetail from './components/NewsDetail';
import PriceTicker from './components/PriceTicker';
import Settings from './components/Settings';
import { useStore } from './store/useStore';
import { Search, X, RefreshCw, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { fetchNews } from './services/api';
import './i18n';

const App: React.FC = () => {
  const { setLanguage, searchTerm, setSearchTerm, cachedNews, setCachedNews, setIsLoading } = useStore();
  const { t, i18n } = useTranslation();
  const [countryFlag, setCountryFlag] = useState<string>('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [newPostsAvailable, setNewPostsAvailable] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadNews = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const news = await fetchNews(i18n.language);
      setCachedNews(news);
      setNewPostsAvailable(false);
    } catch (err) {
      console.error('Failed to fetch news', err);
      setError('Failed to load news. Showing cached content if available.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadNews();

    // Poll for new news every minute
    const interval = setInterval(async () => {
      try {
        const latestNews = await fetchNews(i18n.language);
        if (latestNews && latestNews.length > 0 && cachedNews.length > 0) {
          if (latestNews[0].id !== cachedNews[0].id) {
            setNewPostsAvailable(true);
            // Optional: Show browser notification
            if (Notification.permission === 'granted') {
              new Notification('CryptNews', {
                body: t('new_posts_available'),
                icon: '/vite.svg'
              });
            }
          }
        }
      } catch (e) {
        // Silent fail on poll
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [i18n.language]); // Depend on i18n.language instead of setLanguage

  // Request notification permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            // Use a free reverse geocoding API (BigDataCloud)
            const response = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
            );
            const data = await response.json();
            
            if (data && data.countryCode) {
              // Set flag emoji based on country code
              const codePoints = data.countryCode
                .toUpperCase()
                .split('')
                .map((char: string) => 127397 + char.charCodeAt(0));
              setCountryFlag(String.fromCodePoint(...codePoints));

              // Map country to language if possible
              const countryToLang: Record<string, string> = {
                'BR': 'PT',
                'PT': 'PT',
                'ES': 'ES',
                'MX': 'ES',
                'AR': 'ES',
                'CO': 'ES',
                'FR': 'FR',
                'US': 'EN',
                'GB': 'EN',
                'CA': 'EN',
                'AU': 'EN',
              };

              if (countryToLang[data.countryCode]) {
                setLanguage(countryToLang[data.countryCode]);
              }
            }
          } catch (error) {
            console.error('Error fetching country data:', error);
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
        }
      );
    }
  }, [setLanguage]);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300 font-sans">
        <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="container mx-auto px-4 py-3 flex justify-between items-center">
            <Link to="/" className="flex items-center space-x-2 group flex-shrink-0">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:shadow-blue-500/50 transition-all duration-300 transform group-hover:scale-110">
                C
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 hidden sm:inline">
                CryptNews {countryFlag && <span className="ml-2 text-2xl" role="img" aria-label="Country Flag">{countryFlag}</span>}
              </span>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 sm:hidden">
                CN {countryFlag && <span className="ml-1 text-xl" role="img" aria-label="Country Flag">{countryFlag}</span>}
              </span>
            </Link>

            {/* Desktop Search Bar */}
            <div className="hidden md:block relative w-96 mx-4">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder={t('search_placeholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg leading-5 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-shadow shadow-sm"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="flex items-center space-x-2">
              {/* Mobile Search Toggle */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="md:hidden p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
                aria-label="Toggle search"
              >
                {isSearchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
              </button>
              <Settings />
            </div>
          </div>

          {/* Mobile Search Bar (Expandable) */}
          {isSearchOpen && (
            <div className="md:hidden px-4 pb-4 animate-in slide-in-from-top-2 duration-200">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder={t('search_placeholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  autoFocus
                  className="block w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg leading-5 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base transition-shadow shadow-sm"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
          )}
          
          <PriceTicker />
        </header>

        {newPostsAvailable && (
          <div className="flex justify-center my-4 sticky top-20 z-30">
            <button
              onClick={loadNews}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full shadow-lg flex items-center space-x-2 transition-transform transform hover:scale-105 animate-bounce"
            >
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>{t('new_posts_available')}</span>
            </button>
          </div>
        )}

        {error && (
          <div className="container mx-auto px-4 mt-4">
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-sm flex items-start" role="alert">
              <AlertCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          </div>
        )}

        <main className="pb-20">
          <Routes>
            <Route path="/" element={<NewsFeed />} />
            <Route path="/news/:id" element={<NewsDetail />} />
          </Routes>
        </main>

        <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-8 mt-auto">
          <div className="container mx-auto px-4 text-center text-gray-500 dark:text-gray-400 font-mono text-sm">
            <p>&copy; {new Date().getFullYear()} CryptNews. All rights reserved.</p>
            <p className="mt-2">Data provided by CryptoCompare</p>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;
