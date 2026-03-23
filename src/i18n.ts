import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  EN: {
    translation: {
      "latest_news": "Latest News",
      "search_placeholder": "Search coins (e.g. BTC, ETH)...",
      "no_news": "We are sorry, but the server is temporarily down. Please take a rest and try again later",
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
      "read_full_article": "Read Original Article",
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
      "read_full_article": "Ler Artigo Original",
      "loading_news": "Carregando notícias..."
    }
  },
  ES: {
    translation: {
      "latest_news": "Últimas Noticias",
      "search_placeholder": "Buscar monedas (ej: BTC, ETH)...",
      "no_news": "No se encontraron noticias.",
      "read_more": "Leer Más",
      "share": "Compartir",
      "offline_mode": "Modo Offline",
      "new_posts_available": "Nuevas publicaciones disponibles",
      "breaking_news": "Noticias de Última Hora",
      "price_alert": "Alerta de Precio",
      "copied": "¡Enlace copiado al portapapeles!",
      "author": "Autor",
      "source": "Fuente",
      "back": "Volver al feed",
      "language": "Idioma",
      "fiat": "Moneda Fiduciaria",
      "read_full_article": "Leer Artículo Original",
      "loading_news": "Cargando noticias..."
    }
  },
  FR: {
    translation: {
      "latest_news": "Dernières Nouvelles",
      "search_placeholder": "Rechercher des pièces (ex: BTC, ETH)...",
      "no_news": "Aucune nouvelle trouvée.",
      "read_more": "Lire la suite",
      "share": "Partager",
      "offline_mode": "Mode Hors Ligne",
      "new_posts_available": "Nouveaux messages disponibles",
      "breaking_news": "Dernières Nouvelles",
      "price_alert": "Alerte de Prix",
      "copied": "Lien copié dans le presse-papiers !",
      "author": "Auteur",
      "source": "Source",
      "back": "Retour au flux",
      "language": "Langue",
      "fiat": "Monnaie Fiduciaire",
      "read_full_article": "Lire l'article original",
      "loading_news": "Chargement des nouvelles..."
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
