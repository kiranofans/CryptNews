export interface NewsItem {
  id: string;
  title: string;
  imageurl: string;
  body: string;
  url: string;
  source: string;
  published_on: number;
  categories: string;
  author?: string;
}
