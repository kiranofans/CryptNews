import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { useTranslation } from 'react-i18next';


const HeroSlider: React.FC = () => {
  const { cachedNews } = useStore();
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % Math.min(cachedNews.length, 5));
    }, 5000);
    return () => clearInterval(interval);
  }, [cachedNews]);

  if (!cachedNews || cachedNews.length === 0) {
    return null;
  }

  const currentNews = cachedNews[currentIndex];
  const tickerNews = [...cachedNews.slice(0, 10), ...cachedNews.slice(0, 10)];

  return (
    <div className="relative w-full h-36 sm:h-64 md:h-80 lg:h-96 overflow-hidden rounded-2xl shadow-xl mb-8 group">
      {/* Breaking News Ticker */}
      <div className="absolute top-0 left-0 right-0 z-30 bg-red-600/90 backdrop-blur-sm text-white h-6 md:h-8 flex items-center overflow-hidden border-b border-red-500/30">
        <div className="flex-shrink-0 px-3 flex items-center z-40 bg-red-700 h-full shadow-md">
           <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-white rounded-full animate-pulse mr-2"></span>
           <span className="font-bold text-[9px] md:text-xs uppercase whitespace-nowrap tracking-wider">{t('breaking_news')}</span>
        </div>
        <div className="flex-1 overflow-hidden relative h-full flex items-center mask-image-linear-gradient">
             <div className="whitespace-nowrap animate-marquee inline-flex items-center">
                {tickerNews.map((news, idx) => (
                    <a key={`${news.id}-${idx}`} href={`/news/${news.id}`} className="inline-block mx-4 text-[9px] md:text-xs font-medium hover:underline opacity-90 hover:opacity-100 transition-opacity">
                        {news.title} •
                    </a>
                ))}
             </div>
        </div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />
      <img
        src={currentNews.imageurl}
        alt={currentNews.title}
        className="w-full h-full object-cover transition-opacity duration-1000 ease-in-out"
        loading="lazy"
        data-pin-nopin="true"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          const fallback = `https://picsum.photos/seed/${currentNews.id.substring(0,6)}/1200/800`;
          if (target.src !== fallback) {
            target.src = fallback;
          } else {
            target.onerror = null;
          }
        }}

      />
      <div className="absolute bottom-0 left-0 right-0 p-3 md:p-6 z-20 text-white">
        <span className="bg-red-600 text-white text-[10px] md:text-xs font-bold px-2 py-0.5 md:py-1 rounded uppercase mb-1 md:mb-2 inline-block">
          {t('breaking_news')}
        </span>
        <a href={`/news/${currentNews.id}`} className="block hover:underline">
          <h2 className="text-base sm:text-2xl md:text-3xl font-bold mb-1 md:mb-2 line-clamp-2 drop-shadow-md leading-tight">
            {currentNews.title}
          </h2>
        </a>
        <p className="text-xs sm:text-sm md:text-base text-gray-200 line-clamp-2 mb-2 md:mb-4 drop-shadow-sm hidden sm:block overflow-hidden">
          {currentNews.body.length > 150 ? `${currentNews.body.substring(0, 150)}...` : currentNews.body}
        </p>
        <div className="flex space-x-2">
          {cachedNews.slice(0, 5).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full transition-all duration-300 ${
                index === currentIndex ? 'bg-white w-4 md:w-6' : 'bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroSlider;
