import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import NewsFeed from './components/NewsFeed';
import NewsDetail from './components/NewsDetail';
import PriceTicker from './components/PriceTicker';
import Settings from './components/Settings';
import { useStore } from './store/useStore';
import { Search, X, RefreshCw, AlertCircle, ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { fetchNews } from './services/api';
import './i18n';

import SearchResult from './components/SearchResult';

// ... imports ...

const HeaderContent: React.FC = () => {
  const { searchTerm, setSearchTerm, searchHistory, addToSearchHistory } = useStore();
  const { t } = useTranslation();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const searchRef = React.useRef<HTMLDivElement>(null);

  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowHistory(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      addToSearchHistory(searchTerm.trim());
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
      setIsSearchOpen(false);
      setShowHistory(false);
    }
  };

  const handleHistoryClick = (term: string) => {
    setSearchTerm(term);
    navigate(`/search?q=${encodeURIComponent(term)}`);
    setIsSearchOpen(false);
    setShowHistory(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-sm flex flex-col">
      <div className="order-2 md:order-1 w-full">
        <PriceTicker />
      </div>
      
      <div className="container mx-auto px-4 py-3 flex justify-between items-center order-1 md:order-2 w-full">
        <div className="flex items-center space-x-4">
          {!isHomePage && (
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <Link to="/" className="flex items-center space-x-2 group flex-shrink-0">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:shadow-blue-500/50 transition-all duration-300 transform group-hover:scale-110">
              C
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 hidden sm:inline">
              CryptNews
            </span>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 sm:hidden">
              CryptNews
            </span>
          </Link>
        </div>

        {/* Desktop Search Bar */}
        <div className="hidden md:block relative w-96 mx-4" ref={searchRef}>
          <form onSubmit={handleSearch}>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder={t('search_placeholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setShowHistory(true)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg leading-5 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-shadow shadow-sm"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </form>
          
          {/* Search History Dropdown */}
          {showHistory && searchHistory.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider bg-gray-50 dark:bg-gray-900/50">
                Recent Searches
              </div>
              <ul>
                {searchHistory.map((term, index) => (
                  <li key={index}>
                    <button
                      onClick={() => handleHistoryClick(term)}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                    >
                      <Search className="w-4 h-4 mr-2 text-gray-400" />
                      {term}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
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
        <div className="md:hidden px-4 pb-4 animate-in slide-in-from-top-2 duration-200 order-3 w-full">
          <form onSubmit={handleSearch} className="relative">
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
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </form>
        </div>
      )}
    </header>
  );
};

const App: React.FC = () => {
  const { cachedNews, setCachedNews, setIsLoading, setNewPostsAvailable, language } = useStore();
  const { t, i18n } = useTranslation();
  const [error, setError] = useState<string | null>(null);

  // Sync language from store to i18n on mount
  useEffect(() => {
    if (language && i18n.language !== language) {
      i18n.changeLanguage(language);
    }
  }, [language, i18n]);

  const loadNews = async (force: boolean = false) => {
    if (!force && cachedNews.length > 0) {
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const news = await fetchNews(i18n.language);
      if (news !== null) {
        setCachedNews(news);
      }
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

    // Poll for new news every 5 minutes
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
    }, 300000); // 5 minutes

    return () => clearInterval(interval);
  }, [i18n.language]); // Depend on i18n.language instead of setLanguage

  // Request notification permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300 font-sans">
        <HeaderContent />

        {error && (
          <div className="container mx-auto px-4 mt-4">
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-sm flex items-start" role="alert">
              <AlertCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          </div>
        )}

        <main className="pb-8">
          <Routes>
            <Route path="/" element={<NewsFeed />} />
            <Route path="/news/:id" element={<NewsDetail />} />
            <Route path="/search" element={<SearchResult />} />
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
