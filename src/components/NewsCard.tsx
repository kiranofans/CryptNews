import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { Share2, Twitter, Facebook } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { NewsItem } from '../types/news';

interface NewsCardProps {
  news: NewsItem;
}

interface ImageWithRetryProps {
  src: string;
  alt: string;
  newsId: string;
}

// Retry once, then Picsum fallback, then clean empty box
const ImageWithRetry: React.FC<ImageWithRetryProps> = ({ src, alt, newsId }) => {
  const [attempt, setAttempt] = useState(0);
  const fallback = `https://picsum.photos/seed/${newsId.substring(0, 6)}/600/400`;

  if (attempt >= 2) {
    // Final failure: show a clean empty placeholder (no broken icon, no text)
    return <div className="w-full h-full bg-gray-200 dark:bg-gray-600" />;
  }

  return (
    <img
      key={attempt}
      src={attempt === 1 ? fallback : src}
      alt=""
      className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
      loading="lazy"
      data-pin-nopin="true"
      onError={() => setAttempt((a) => a + 1)}
    />
  );
};

const NewsCard: React.FC<NewsCardProps> = ({ news }) => {
  const { t } = useTranslation();

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (navigator.share) {
      try {
        await navigator.share({
          title: news.title,
          text: news.body.substring(0, 100) + '...',
          url: news.url,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(news.url);
      alert(t('copied'));
    }
  };

  const handleTwitterShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const text = encodeURIComponent(news.title);
    const url = encodeURIComponent(news.url);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
  };

  const handleFacebookShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = encodeURIComponent(news.url);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
  };

  const handlePinterestShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = encodeURIComponent(news.url);
    const media = encodeURIComponent(news.imageurl);
    const description = encodeURIComponent(news.title);
    window.open(`https://pinterest.com/pin/create/button/?url=${url}&media=${media}&description=${description}`, '_blank');
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full border border-gray-100 dark:border-gray-700 group">
      <Link to={`/news/${news.id}`} className="block relative h-48 overflow-hidden bg-gray-100 dark:bg-gray-700">
        <ImageWithRetry src={news.imageurl} alt={news.title} newsId={news.id} />
        {/* Pinterest Button - Desktop Only */}
        <button
          onClick={handlePinterestShare}
          className="absolute top-2 left-2 z-20 hidden md:flex items-center justify-center bg-red-600 hover:bg-red-700 text-white py-1.5 px-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform hover:scale-105 font-bold text-xs"
          title="Pin on Pinterest"
          aria-label="Pin on Pinterest"
        >
          <svg className="w-3 h-3 mr-1.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.399.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.951-7.252 4.173 0 7.41 2.967 7.41 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.367 18.62 0 12.017 0z" />
          </svg>
          Save
        </button>
      </Link>
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex items-center justify-between mb-2 text-xs text-gray-500 dark:text-gray-400">
          <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-0.5 rounded-full font-medium">
            {news.source}
          </span>
          <span>{formatDistanceToNow(new Date(news.published_on * 1000), { addSuffix: true })}</span>
        </div>
        <Link to={`/news/${news.id}`} className="block mb-4 flex-grow">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-3 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            {news.title}
          </h3>
        </Link>
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
          <Link
            to={`/news/${news.id}`}
            className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline"
          >
            {t('read_more')}
          </Link>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleTwitterShare}
              className="text-gray-400 hover:text-blue-400 transition-colors"
              title="Share on Twitter"
            >
              <Twitter className="w-4 h-4" />
            </button>
            <button
              onClick={handleFacebookShare}
              className="text-gray-400 hover:text-blue-600 transition-colors"
              title="Share on Facebook"
            >
              <Facebook className="w-4 h-4" />
            </button>
            <button
              onClick={handleShare}
              className="flex items-center space-x-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;
