export type BlogPillar =
  | 'tafsir'
  | 'elder-care'
  | 'ulumul-quran'
  | 'tazkiyah'
  | 'warta';

export type BlogArticleStatus = 'published' | 'draft' | 'archived';

export interface EmbeddedAyah {
  surahId: number;
  surahName: string;
  ayahNumber: number;
  arabic: string;
  latin?: string;
  translation: string;
}

export interface BlogArticleAuthor {
  name: string;
  role: string;
  avatarText?: string;
}

export interface BlogArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  pillar: BlogPillar;
  pillarLabel: string;
  author: BlogArticleAuthor;
  publishedAt: string;
  readingTimeMinutes: number;
  content: string; // Markdown / paragraphs
  embeddedAyahs: EmbeddedAyah[];
  tags: string[];
  relatedProphetSlug?: string;
  relatedProphetName?: string;
  viewsCount: number;
  isFeatured?: boolean;
  status?: BlogArticleStatus;
}

export interface UserReflection {
  articleId: string;
  articleTitle: string;
  note: string;
  updatedAt: string;
}

