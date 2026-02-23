import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  EN: {
    translation: {
      "latest_news": "Latest News",
      "search_placeholder": "Search coins (e.g. BTC, ETH)...",
      "no_news": "No news found.",
      "read_more": "Read More",
      "share": "Share",
      "offline_mode": "Offline Mode",
      "new_posts_available": "New posts available",
      "breaking_news": "Breaking News",
      "price_alert": "Price Alert",
      "copied": "Link copied to clipboard!",
      "author": "Author",
      "source": "Source",
      "back": "Back to feed",
      "language": "Language",
      "fiat": "Fiat Currency",
      "read_full_article": "Read Full Article",
      "loading_news": "Loading news..."
    }
  },
  PT: {
    translation: {
      "latest_news": "Últimas Notícias",
      "search_placeholder": "Pesquisar moedas (ex: BTC, ETH)...",
      "no_news": "Nenhuma notícia encontrada.",
      "read_more": "Leia Mais",
      "share": "Compartilhar",
      "offline_mode": "Modo Offline",
      "new_posts_available": "Novas postagens disponíveis",
      "breaking_news": "Notícias de Última Hora",
      "price_alert": "Alerta de Preço",
      "copied": "Link copiado para a área de transferência!",
      "author": "Autor",
      "source": "Fonte",
      "back": "Voltar ao feed",
      "language": "Idioma",
      "fiat": "Moeda Fiduciária",
      "read_full_article": "Ler Artigo Completo",
      "loading_news": "Carregando notícias..."
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "EN",
    fallbackLng: "EN",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
