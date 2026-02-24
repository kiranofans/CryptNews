import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../store/useStore';
import NewsCard from './NewsCard';
import { useTranslation } from 'react-i18next';
import { Loader2, Search } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

const SearchResult: React.FC = () => {
  const { cachedNews } = useStore();
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [currentPage, setCurrentPage] = useState(1);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const itemsPerPage = 20;
  const loaderRef = useRef<HTMLDivElement>(null);

  const filteredNews = cachedNews.filter((news) => {
    if (!query) return false;
    const term = query.toLowerCase().trim();
    
    const title = String(news.title || '').toLowerCase();
    const body = String(news.body || '').toLowerCase();
    const categories = String(news.categories || '').toLowerCase();
    
    return title.includes(term) || body.includes(term) || categories.includes(term);
  });

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [query]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const currentItems = filteredNews.slice(0, indexOfLastItem);
  const hasMore = indexOfLastItem < filteredNews.length;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isFetchingMore) {
          setIsFetchingMore(true);
          // Simulate network delay for loading next page
          setTimeout(() => {
            setCurrentPage((prev) => prev + 1);
            setIsFetchingMore(false);
          }, 800);
        }
      },
      { threshold: 0.1 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, isFetchingMore]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center mb-2">
          <Search className="w-8 h-8 mr-3 text-blue-600" />
          <span>Search Results</span>
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Found {filteredNews.length} results for "<span className="font-semibold text-gray-900 dark:text-white">{query}</span>"
        </p>
      </div>

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
                  <span className="font-medium">Loading more results...</span>
                </div>
              )
            ) : (
              <div className="text-gray-500 dark:text-gray-400 font-medium text-center mt-8">
                <p>End of results</p>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="text-center py-20 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
          <Search className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <p className="text-gray-500 dark:text-gray-400 text-lg">No results found for "{query}"</p>
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">Try different keywords or check spelling</p>
        </div>
      )}
    </div>
  );
};

export default SearchResult;
