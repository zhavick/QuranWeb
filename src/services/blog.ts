import type { BlogArticle, BlogArticleStatus, UserReflection } from '../types/blog';

let cachedArticles: BlogArticle[] | null = null;

const STORAGE_KEY_CUSTOM_ARTICLES = 'quranweb_custom_articles';
const STORAGE_KEY_STATUS_OVERRIDES = 'quranweb_article_status_overrides';
const STORAGE_KEY_READ_LATER = 'quranweb_read_later';
const STORAGE_KEY_REFLECTIONS = 'quranweb_reflections';

function getStatusOverrides(): Record<string, BlogArticleStatus | 'deleted'> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_STATUS_OVERRIDES);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function setStatusOverrides(overrides: Record<string, BlogArticleStatus | 'deleted'>): void {
  try {
    localStorage.setItem(STORAGE_KEY_STATUS_OVERRIDES, JSON.stringify(overrides));
  } catch (err) {
    console.error('Error saving status overrides:', err);
  }
}

/**
 * Mengambil daftar seluruh artikel jurnal blog (gabungan bawaan + kustom admin)
 * @param includeAllStatuses Jika true (misal untuk panel admin), mengembalikan artikel dengan status draft & archived
 */
export async function fetchBlogArticles(includeAllStatuses: boolean = false): Promise<BlogArticle[]> {
  try {
    let baseArticles: BlogArticle[] = [];
    if (!cachedArticles) {
      const res = await fetch('/data/blog_articles.json');
      if (res.ok) {
        baseArticles = await res.json();
      }
    } else {
      baseArticles = cachedArticles;
    }

    // Gabungkan dengan artikel kustom yang dibuat melalui panel CMS Admin
    const customJson = localStorage.getItem(STORAGE_KEY_CUSTOM_ARTICLES);
    const customArticles: BlogArticle[] = customJson ? JSON.parse(customJson) : [];

    const merged = [...customArticles, ...baseArticles];
    cachedArticles = baseArticles;

    const overrides = getStatusOverrides();

    // Terapkan status override dan status default ('published')
    const enriched = merged
      .filter((art) => overrides[art.id] !== 'deleted')
      .map((art) => {
        const overrideStatus = overrides[art.id] as BlogArticleStatus | undefined;
        return {
          ...art,
          status: overrideStatus || art.status || 'published',
        };
      });

    if (includeAllStatuses) {
      return enriched;
    }

    // Untuk katalog publik, hanya tampilkan artikel yang berstatus 'published'
    return enriched.filter((art) => art.status === 'published');
  } catch (err) {
    console.error('Error fetching blog articles:', err);
    return cachedArticles || [];
  }
}

/**
 * Mengambil satu artikel berdasarkan slug
 */
export async function fetchArticleBySlug(slug: string): Promise<BlogArticle | null> {
  const articles = await fetchBlogArticles();
  return articles.find((a) => a.slug === slug.toLowerCase()) || null;
}

/**
 * Menyimpan draf / publikasi artikel baru dari CMS Admin
 */
export async function saveBlogArticle(article: BlogArticle): Promise<{ success: boolean; message: string }> {
  try {
    const customJson = localStorage.getItem(STORAGE_KEY_CUSTOM_ARTICLES);
    const customArticles: BlogArticle[] = customJson ? JSON.parse(customJson) : [];

    // Pastikan status tervalidasi
    const normalizedArticle: BlogArticle = {
      ...article,
      status: article.status || 'published',
    };

    const existingIdx = customArticles.findIndex((a) => a.id === normalizedArticle.id);
    if (existingIdx >= 0) {
      customArticles[existingIdx] = normalizedArticle;
    } else {
      customArticles.unshift(normalizedArticle);
    }

    localStorage.setItem(STORAGE_KEY_CUSTOM_ARTICLES, JSON.stringify(customArticles));

    // Bersihkan status override jika sebelumnya pernah dihapus/diarsip
    const overrides = getStatusOverrides();
    if (overrides[normalizedArticle.id]) {
      delete overrides[normalizedArticle.id];
      setStatusOverrides(overrides);
    }

    const actionText = normalizedArticle.status === 'published' ? 'diterbitkan' : 'disimpan sebagai draf';
    return { success: true, message: `Artikel berhasil ${actionText}.` };
  } catch (err) {
    return { success: false, message: 'Gagal menyimpan artikel ke penyimpanan lokal.' };
  }
}

/**
 * Memperbarui status artikel (published, draft, archived)
 */
export async function updateArticleStatus(
  id: string,
  status: BlogArticleStatus
): Promise<{ success: boolean; message: string }> {
  try {
    // 1. Cek jika artikel berada di custom articles
    const customJson = localStorage.getItem(STORAGE_KEY_CUSTOM_ARTICLES);
    if (customJson) {
      const customArticles: BlogArticle[] = JSON.parse(customJson);
      const idx = customArticles.findIndex((a) => a.id === id);
      if (idx >= 0) {
        customArticles[idx].status = status;
        localStorage.setItem(STORAGE_KEY_CUSTOM_ARTICLES, JSON.stringify(customArticles));
      }
    }

    // 2. Simpan juga ke status overrides agar persisten untuk artikel bawaan maupun kustom
    const overrides = getStatusOverrides();
    overrides[id] = status;
    setStatusOverrides(overrides);

    const labelMap: Record<BlogArticleStatus, string> = {
      published: 'diterbitkan',
      draft: 'disimpan sebagai draf',
      archived: 'diarsipkan',
    };

    return {
      success: true,
      message: `Status artikel berhasil diubah menjadi: ${labelMap[status]}.`,
    };
  } catch {
    return { success: false, message: 'Gagal memperbarui status artikel.' };
  }
}

/**
 * Menghapus artikel kustom atau menyembunyikan artikel bawaan
 */
export async function deleteBlogArticle(id: string): Promise<{ success: boolean; message: string }> {
  try {
    const customJson = localStorage.getItem(STORAGE_KEY_CUSTOM_ARTICLES);
    if (customJson) {
      let customArticles: BlogArticle[] = JSON.parse(customJson);
      const filtered = customArticles.filter((a) => a.id !== id);
      if (filtered.length !== customArticles.length) {
        localStorage.setItem(STORAGE_KEY_CUSTOM_ARTICLES, JSON.stringify(filtered));
      }
    }

    // Tandai juga sebagai 'deleted' di overrides
    const overrides = getStatusOverrides();
    overrides[id] = 'deleted';
    setStatusOverrides(overrides);

    return { success: true, message: 'Artikel berhasil dihapus dari sistem.' };
  } catch {
    return { success: false, message: 'Gagal menghapus artikel.' };
  }
}

/**
 * Mengambil daftar ID artikel yang disimpan di Read Later
 */
export function getReadLaterList(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_READ_LATER);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Toggle simpan ke Read Later
 */
export function toggleReadLater(articleId: string): boolean {
  try {
    const list = getReadLaterList();
    const exists = list.includes(articleId);
    let updated: string[];

    if (exists) {
      updated = list.filter((id) => id !== articleId);
    } else {
      updated = [articleId, ...list];
    }

    localStorage.setItem(STORAGE_KEY_READ_LATER, JSON.stringify(updated));
    return !exists;
  } catch {
    return false;
  }
}

export function isArticleReadLater(articleId: string): boolean {
  const list = getReadLaterList();
  return list.includes(articleId);
}

/**
 * Mengambil catatan refleksi tadabbur pribadi pengguna
 */
export function getUserReflections(): UserReflection[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_REFLECTIONS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function getUserReflectionForArticle(articleId: string): string {
  const list = getUserReflections();
  const found = list.find((r) => r.articleId === articleId);
  return found ? found.note : '';
}

export function saveUserReflection(articleId: string, articleTitle: string, note: string): void {
  try {
    const list = getUserReflections();
    const filtered = list.filter((r) => r.articleId !== articleId);

    if (note.trim()) {
      filtered.unshift({
        articleId,
        articleTitle,
        note: note.trim(),
        updatedAt: new Date().toISOString(),
      });
    }

    localStorage.setItem(STORAGE_KEY_REFLECTIONS, JSON.stringify(filtered));
  } catch (err) {
    console.error('Error saving user reflection:', err);
  }
}

