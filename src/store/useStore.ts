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
  appendCachedNews: (news: any[]) => void;
  setSearchTerm: (term: string) => void;
  setIsLoading: (loading: boolean) => void;
  setNewPostsAvailable: (available: boolean) => void;
  toggleBookmark: (newsItem: any) => void;
  searchHistory: string[];
  addToSearchHistory: (term: string) => void;
  clearSearchHistory: () => void;
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
      searchHistory: [],
      setLanguage: (lang) => set({ language: lang }),
      setFiat: (fiat) => set({ fiat }),
      setCachedNews: (news) => set({ cachedNews: Array.isArray(news) ? news : [] }),
      appendCachedNews: (news) =>
        set((state) => {
          if (!Array.isArray(news)) return state;
          // Filter out duplicates based on ID
          const existingIds = new Set((state.cachedNews || []).map((n) => n.id));
          const uniqueNewNews = news.filter((n) => !existingIds.has(n.id));
          return { cachedNews: [...(state.cachedNews || []), ...uniqueNewNews] };
        }),
      setSearchTerm: (term) => set({ searchTerm: term }),
      setIsLoading: (loading) => set({ isLoading: loading }),
      setNewPostsAvailable: (available) => set({ newPostsAvailable: available }),
      addToSearchHistory: (term) =>
        set((state) => {
          const newHistory = [term, ...state.searchHistory.filter((t) => t !== term)].slice(0, 5);
          return { searchHistory: newHistory };
        }),
      clearSearchHistory: () => set({ searchHistory: [] }),
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
        searchHistory: state.searchHistory,
      }),
      onRehydrateStorage: (state) => {
        return (rehydratedState, error) => {
          if (error) {
            console.error('an error occurred during hydration', error);
          } else if (rehydratedState) {
            // Ensure cachedNews is an array after hydration
            if (!Array.isArray(rehydratedState.cachedNews)) {
              rehydratedState.cachedNews = [];
            }
          }
        };
      },
    }
  )
);
