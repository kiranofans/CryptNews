import React from 'react';
import { useStore } from '../store/useStore';
import NewsCard from './NewsCard';
import HeroSlider from './HeroSlider';
import { useTranslation } from 'react-i18next';
import { AlertCircle } from 'lucide-react';

const NewsFeed: React.FC = () => {
  const { cachedNews, searchTerm, isLoading } = useStore();
  const { t } = useTranslation();

  const filteredNews = cachedNews.filter((news) =>
    news.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    news.body.toLowerCase().includes(searchTerm.toLowerCase()) ||
    news.categories.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <HeroSlider />

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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredNews.map((news) => (
                <NewsCard key={news.id} news={news} />
              ))}
            </div>
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
