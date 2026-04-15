import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { useTranslation } from 'react-i18next';
import { Share2, ArrowLeft, Twitter, Facebook, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { PinterestWidget } from './PinterestWidget';
import ReactMarkdown from 'react-markdown';

interface NewsDetailProps {
  id?: string;
  initialNews?: any;
}

const NewsDetail: React.FC<NewsDetailProps> = ({ id, initialNews }) => {
  const { cachedNews } = useStore();
  const { t } = useTranslation();
  const [news, setNews] = useState<any | null>(initialNews || null);

  useEffect(() => {
    if (id && cachedNews) {
      const foundNews = cachedNews.find((n) => n.id === id);
      if (foundNews) {
        setNews(foundNews);
      }
    }
  }, [id, cachedNews]);

  if (!news) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center px-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-500 mb-4">{t('loading_news')}...</p>
        <p className="text-sm text-gray-400">If this takes too long, the news might not be available anymore.</p>
        <a href="/" className="mt-4 text-blue-600 hover:underline">
          {t('back')}
        </a>
      </div>
    );
  }

  const handleShare = async () => {
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
      navigator.clipboard.writeText(news.url);
      alert(t('copied'));
    }
  };

  const handleTwitterShare = () => {
    const text = encodeURIComponent(news.title);
    const url = encodeURIComponent(news.url);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
  };

  const handleFacebookShare = () => {
    const url = encodeURIComponent(news.url);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
  };

  const handlePinterestShare = () => {
    const url = encodeURIComponent(news.url);
    const media = encodeURIComponent(news.imageurl);
    const description = encodeURIComponent(news.title);
    window.open(`https://pinterest.com/pin/create/button/?url=${url}&media=${media}&description=${description}`, '_blank');
  };

  const formatContent = (content: string) => {
    if (!content) return null;

    // If content is short, just return it
    if (content.length < 300 && !content.includes('\n')) {
      return <p className="text-lg leading-relaxed text-gray-800 dark:text-gray-200">{content}</p>;
    }

    // Check for explicit newlines first
    if (content.includes('\n')) {
      return content.split('\n').map((line, i) => {
        const trimmed = line.trim();
        if (!trimmed) return null;
        if (/^[-*•]/.test(trimmed) || /^\d+\./.test(trimmed)) {
           return <li key={i} className="ml-6 list-disc mb-2 text-lg text-gray-800 dark:text-gray-200 pl-2">{trimmed.replace(/^[-*•]|\d+\.\s*/, '').trim()}</li>;
        }
        return <p key={i} className="mb-4 text-lg leading-relaxed text-gray-800 dark:text-gray-200">{line}</p>;
      });
    }

    // Heuristic splitting for long blocks
    const sentences = content.match(/[^.!?]+[.!?]+(\s|$)/g) || [content];
    const elements: React.ReactNode[] = [];
    let currentPara: string[] = [];

    sentences.forEach((sentence, i) => {
      const trimmed = sentence.trim();
      // Check for bullet points embedded in text
      if (/^[-*•]/.test(trimmed) || /^\d+\./.test(trimmed)) {
         if (currentPara.length > 0) {
           elements.push(<p key={`p-${i}`} className="mb-4 text-lg leading-relaxed text-gray-800 dark:text-gray-200">{currentPara.join('')}</p>);
           currentPara = [];
         }
         elements.push(<li key={`li-${i}`} className="ml-6 list-disc mb-2 text-lg text-gray-800 dark:text-gray-200 pl-2">{trimmed.replace(/^[-*•]|\d+\.\s*/, '').trim()}</li>);
      } else {
        currentPara.push(sentence);
        if (currentPara.join('').length > 400) { // Split after ~400 chars
           elements.push(<p key={`p-${i}`} className="mb-4 text-lg leading-relaxed text-gray-800 dark:text-gray-200">{currentPara.join('')}</p>);
           currentPara = [];
        }
      }
    });

    if (currentPara.length > 0) {
      elements.push(<p key="last" className="mb-4 text-lg leading-relaxed text-gray-800 dark:text-gray-200">{currentPara.join('')}</p>);
    }

    return elements;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <article className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
        <div className="relative h-64 md:h-96 w-full group">
          <img
            src={news.imageurl}
            alt={news.title}
            className="w-full h-full object-cover"
            data-pin-nopin="true"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              const fallback = `https://picsum.photos/seed/${news.id.substring(0,6)}/1200/800`;
              if (target.src !== fallback) {
                target.src = fallback;
              } else {
                target.onerror = null;
              }
            }}

          />
          
          {/* Pinterest Widget - Desktop Only */}
          <div className="absolute top-4 left-4 z-20 hidden md:block opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <PinterestWidget 
              url={news.url} 
              media={news.imageurl} 
              description={news.title} 
            />
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 p-6 md:p-8 text-white w-full">
            <div className="flex items-center space-x-2 mb-3">
              <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded uppercase">
                {news.source}
              </span>
              <span className="text-sm opacity-90">
                {formatDistanceToNow(new Date(news.published_on * 1000), { addSuffix: true })}
              </span>
            </div>
          </div>
        </div>

        <div className="p-6 md:p-8">
          <div className="flex items-center justify-between mb-4 border-b border-gray-100 dark:border-gray-700 pb-4">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 font-bold">
                {news.source.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{news.source}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{t('author')}: {news.author || 'Unknown'}</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleTwitterShare}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-300"
                title="Share on Twitter"
              >
                <Twitter className="w-5 h-5" />
              </button>
              <button
                onClick={handleFacebookShare}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-300"
                title="Share on Facebook"
              >
                <Facebook className="w-5 h-5" />
              </button>
              <button
                onClick={handleShare}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-300"
                title="Share"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          <h1 className="text-2xl md:text-4xl font-bold leading-tight text-gray-900 dark:text-white mb-6">
            {news.title}
          </h1>
          <div className="prose dark:prose-invert max-w-none mb-8">
            <div className="markdown-content">
              <ReactMarkdown>{news.body}</ReactMarkdown>
            </div>
            
            <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
              <a
                href={news.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full md:w-auto inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform transition-all duration-300 hover:-translate-y-1 active:scale-95 group"
              >
                <span className="mr-2">{t('read_full_article')}</span>
                <Share2 className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              </a>
              <p className="mt-4 text-center md:text-left text-sm text-gray-400 dark:text-gray-500 italic">
                {t('source')}: {news.source}
              </p>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};

export default NewsDetail;
