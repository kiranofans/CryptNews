import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../store/useStore';
import NewsCard from './NewsCard';
import HeroSlider from './HeroSlider';
import { useTranslation } from 'react-i18next';
import { Loader2, RefreshCw } from 'lucide-react';
import { fetchNews } from '../services/api';

const NewsFeed: React.FC = () => {
  const { cachedNews, searchTerm, isLoading, newPostsAvailable, setCachedNews, appendCachedNews, setNewPostsAvailable, setIsLoading } = useStore();
  const { t, i18n } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const [apiPage, setApiPage] = useState(2);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [hasMoreApi, setHasMoreApi] = useState(true);
  const itemsPerPage = 20;
  const loaderRef = useRef<HTMLDivElement>(null);

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      const result = await fetchNews(i18n.language);
      if (result) {
        setCachedNews(result.articles);
        setHasMoreApi(result.hasMore);
      }
      setApiPage(2);
      setCurrentPage(1);
      setNewPostsAvailable(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Failed to fetch news', err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredNews = (cachedNews && Array.isArray(cachedNews) ? cachedNews : []).filter((news) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase().trim();
    if (!term) return true;
    
    const title = String(news.title || '').toLowerCase();
    const body = String(news.body || '').toLowerCase();
    const categories = String(news.categories || '').toLowerCase();
    
    return title.includes(term) || body.includes(term) || categories.includes(term);
  });

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const currentItems = filteredNews.slice(0, indexOfLastItem);
  // Check if we have more local items OR if we can fetch more from API (only when not searching)
  const hasMoreLocal = indexOfLastItem < filteredNews.length;
  const canFetchMore = !searchTerm && cachedNews.length > 0 && !hasMoreLocal && hasMoreApi;
  const hasMore = hasMoreLocal || canFetchMore;

  useEffect(() => {
    let unmounted = false;
    const observer = new IntersectionObserver(
      async (entries) => {
        if (entries[0].isIntersecting && !isFetchingMore) {
          if (hasMoreLocal) {
            // Unhide local items instantly
            setCurrentPage((prev) => prev + 1);
          } else if (canFetchMore) {
            setIsFetchingMore(true);
            try {
              const result = await fetchNews(i18n.language, apiPage);
              if (unmounted) return;

              if (result === null) {
                setHasMoreApi(false);
              } else {
                setApiPage((prev) => prev + 1);
                setHasMoreApi(result.hasMore);
                if (result.articles.length > 0) {
                  appendCachedNews(result.articles);
                  setCurrentPage((prev) => prev + 1);
                }
              }
            } catch (err) {
              console.error('Failed to fetch older news', err);
              setHasMoreApi(false);
            } finally {
              if (!unmounted) {
                setIsLoading(false);
                setIsFetchingMore(false);
              }
            }
          }
        }
      },
      { threshold: 0, rootMargin: '0px 0px 300px 0px' }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [hasMoreLocal, canFetchMore, isFetchingMore, cachedNews, i18n.language, appendCachedNews, searchTerm, apiPage]);

  return (
    <div className="container mx-auto px-4 pt-2 pb-8 relative">
      <div className="relative">
        <HeroSlider />
        {newPostsAvailable && (
          <div className="absolute top-10 left-1/2 transform -translate-x-1/2 z-30 w-full max-w-md px-4">
            <button
              onClick={handleRefresh}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-8 rounded-full shadow-lg flex items-center justify-center space-x-3 transition-transform transform hover:scale-105 animate-bounce"
            >
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span className="tracking-wide">{t('new_posts_available')}</span>
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
            {t('latest_news')}
          </span>
        </h2>
      </div>

      {isLoading && cachedNews.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse bg-white dark:bg-gray-800 rounded-xl shadow-md h-96 overflow-hidden border border-gray-100 dark:border-gray-700">
              <div className="h-48 bg-gray-200 dark:bg-gray-700 w-full"></div>
              <div className="p-4 space-y-4">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {filteredNews.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-4">
                {currentItems.map((news) => (
                  <NewsCard key={news.id} news={news} />
                ))}
              </div>

              {/* Infinite Scroll Loader & End Message */}
              <div ref={loaderRef} className="py-4 flex justify-center items-center flex-col">
                {hasMore ? (
                  isFetchingMore && (
                    <div className="flex items-center text-blue-600 dark:text-blue-400">
                      <Loader2 className="w-6 h-6 animate-spin mr-2" />
                      <span className="font-medium">Loading more news...</span>
                    </div>
                  )
                ) : (
                  <div className="text-gray-500 dark:text-gray-400 font-medium text-center">
                    <p>It's the end</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-20 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
              <p className="text-gray-500 dark:text-gray-400 text-lg">{t('no_news')}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default NewsFeed;
