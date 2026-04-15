import React, { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { useTranslation } from 'react-i18next';
import { fetchNews } from '../services/api';

const NewsPoller: React.FC = () => {
  const { cachedNews, setCachedNews, setIsLoading, setNewPostsAvailable, language } = useStore();
  const { t, i18n } = useTranslation();

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
    try {
      const news = await fetchNews(i18n.language);
      if (news !== null) {
        setCachedNews(news);
      }
      setNewPostsAvailable(false);
    } catch (err: any) {
      console.error('Failed to fetch news', err);
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
  }, [i18n.language]);

  // Request notification permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }, []);

  return null;
};

export default NewsPoller;
