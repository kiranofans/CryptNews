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
      setCachedNews: (news) => {
        if (!Array.isArray(news)) return set({ cachedNews: [] });
        // Deduplicate incoming array by ID first, then by Title (normalized)
        const uniqueById = new Map(news.map((n) => [n.id, n]));
        const uniqueByTitle = new Map(Array.from(uniqueById.values()).map((n) => [String(n.title ?? '').toLowerCase().trim(), n]));
        set({ cachedNews: Array.from(uniqueByTitle.values()) });
      },
      appendCachedNews: (news) =>
        set((state) => {
          if (!Array.isArray(news)) return state;
          // Merge and deduplicate by ID, then by Title
          const allNews = [...(state.cachedNews || []), ...news];
          const uniqueById = new Map(allNews.map((n) => [n.id, n]));
          const uniqueByTitle = new Map(Array.from(uniqueById.values()).map((n) => [String(n.title ?? '').toLowerCase().trim(), n]));
          return { cachedNews: Array.from(uniqueByTitle.values()) };
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
            // Ensure cachedNews is an array after hydration and clean out unwanted sources
            if (!Array.isArray(rehydratedState.cachedNews)) {
              rehydratedState.cachedNews = [];
            } else {
              rehydratedState.cachedNews = rehydratedState.cachedNews.filter((n: any) => {
                 const textToCheck = `${n.source || ''} ${n.title || ''} ${n.categories || ''}`.toLowerCase();
                 return !textToCheck.includes('feds') && 
                        !textToCheck.includes('federal') &&
                        !textToCheck.includes('fca') && 
                        !textToCheck.includes('uk finance');
              });
            }
          }
        };
      },
    }
  )
);
