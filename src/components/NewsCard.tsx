import React from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { Share2, Bookmark, BookmarkCheck, Twitter, Facebook } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useTranslation } from 'react-i18next';

interface NewsItem {
  id: string;
  title: string;
  imageurl: string;
  body: string;
  url: string;
  source: string;
  published_on: number;
  categories: string;
}

interface NewsCardProps {
  news: NewsItem;
}

const NewsCard: React.FC<NewsCardProps> = ({ news }) => {
  const { t } = useTranslation();
  const { toggleBookmark, bookmarkedNews } = useStore();
  const isBookmarked = bookmarkedNews.some((item) => item.id === news.id);

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

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleBookmark(news);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full border border-gray-100 dark:border-gray-700">
      <Link to={`/news/${news.id}`} className="block relative h-48 overflow-hidden">
        <img
          src={news.imageurl}
          alt={news.title}
          className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://picsum.photos/seed/crypto/600/400';
          }}
        />
        <div className="absolute top-2 right-2 flex space-x-2">
           <button
            onClick={handleBookmark}
            className="p-2 bg-white/80 dark:bg-black/50 backdrop-blur-sm rounded-full hover:bg-white dark:hover:bg-black transition-colors"
          >
            {isBookmarked ? <BookmarkCheck className="w-4 h-4 text-green-600" /> : <Bookmark className="w-4 h-4 text-gray-700 dark:text-gray-200" />}
          </button>
        </div>
      </Link>
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex items-center justify-between mb-2 text-xs text-gray-500 dark:text-gray-400">
          <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-0.5 rounded-full font-medium">
            {news.source}
          </span>
          <span>{formatDistanceToNow(new Date(news.published_on * 1000), { addSuffix: true })}</span>
        </div>
        <Link to={`/news/${news.id}`} className="block mb-2">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            {news.title}
          </h3>
        </Link>
        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 mb-4 flex-grow">
          {news.body}
        </p>
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
