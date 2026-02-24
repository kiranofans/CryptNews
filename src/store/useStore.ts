import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  language: string;
  fiat: string;
  cachedNews: any[];
  bookmarkedNews: any[];
  searchTerm: string;
  isLoading: boolean;
  newPostsAvailable: boolean;
  setLanguage: (lang: string) => void;
  setFiat: (fiat: string) => void;
  setCachedNews: (news: any[]) => void;
  setSearchTerm: (term: string) => void;
  setIsLoading: (loading: boolean) => void;
  setNewPostsAvailable: (available: boolean) => void;
  toggleBookmark: (newsItem: any) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      language: 'EN',
      fiat: 'USD',
      cachedNews: [],
      bookmarkedNews: [],
      searchTerm: '',
      isLoading: false,
      newPostsAvailable: false,
      setLanguage: (lang) => set({ language: lang }),
      setFiat: (fiat) => set({ fiat }),
      setCachedNews: (news) => set({ cachedNews: news }),
      setSearchTerm: (term) => set({ searchTerm: term }),
      setIsLoading: (loading) => set({ isLoading: loading }),
      setNewPostsAvailable: (available) => set({ newPostsAvailable: available }),
      toggleBookmark: (newsItem) =>
        set((state) => {
          const isBookmarked = state.bookmarkedNews.some((item) => item.id === newsItem.id);
          if (isBookmarked) {
            return { bookmarkedNews: state.bookmarkedNews.filter((item) => item.id !== newsItem.id) };
          } else {
            return { bookmarkedNews: [...state.bookmarkedNews, newsItem] };
          }
        }),
    }),
    {
      name: 'cryptnews-storage', // unique name
      partialize: (state) => ({
        language: state.language,
        fiat: state.fiat,
        cachedNews: state.cachedNews,
        bookmarkedNews: state.bookmarkedNews,
      }),
    }
  )
);
