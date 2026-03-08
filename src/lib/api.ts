/**
 * API Client for Neon PostgreSQL Backend
 */

// Use environment variable for API URL, fallback to localhost for development
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Export base URL for components that need direct access
export const getApiBaseUrl = () => {
  const url = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
  // Remove /api suffix to get base URL
  return url.replace(/\/api$/, '');
};

export async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || 'Request failed');
  }

  return response.json();
}

// Books
export const booksApi = {
  getAll: () => fetchAPI<any[]>('/books'),
  create: (data: any) => fetchAPI<any>('/books', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => fetchAPI<any>(`/books/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => fetchAPI<any>(`/books/${id}`, { method: 'DELETE' }),
};

// Articles
export const articlesApi = {
  getAll: () => fetchAPI<any[]>('/articles'),
  getById: (id: string) => fetchAPI<any>(`/articles/${id}`),
  create: (data: any) => fetchAPI<any>('/articles', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => fetchAPI<any>(`/articles/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => fetchAPI<any>(`/articles/${id}`, { method: 'DELETE' }),
  like: (id: string) => fetchAPI<{ like_count: number }>(`/articles/${id}/like`, { method: 'POST' }),
  unlike: (id: string) => fetchAPI<{ like_count: number }>(`/articles/${id}/unlike`, { method: 'POST' }),
};

// Gallery
export const galleryApi = {
  getAll: () => fetchAPI<any[]>('/gallery'),
  create: (data: any) => fetchAPI<any>('/gallery', { method: 'POST', body: JSON.stringify(data) }),
  delete: (id: string) => fetchAPI<any>(`/gallery/${id}`, { method: 'DELETE' }),
};

// Testimonials
export const testimonialsApi = {
  getAll: () => fetchAPI<any[]>('/testimonials'),
  getApproved: () => fetchAPI<any[]>('/testimonials/approved'),
  create: (data: any) => fetchAPI<any>('/testimonials', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => fetchAPI<any>(`/testimonials/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => fetchAPI<any>(`/testimonials/${id}`, { method: 'DELETE' }),
  submit: (data: { name: string; role?: string; quote: string; email?: string }) =>
    fetchAPI<{ success: boolean; message: string }>('/testimonials/submit', { method: 'POST', body: JSON.stringify(data) }),
};

// Site Content
export const siteContentApi = {
  get: () => fetchAPI<any>('/site-content'),
  update: (data: any) => fetchAPI<any>('/site-content', { method: 'PUT', body: JSON.stringify(data) }),
};

// Menus
export const menusApi = {
  getAll: () => fetchAPI<any[]>('/menus'),
  create: (data: any) => fetchAPI<any>('/menus', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => fetchAPI<any>(`/menus/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => fetchAPI<any>(`/menus/${id}`, { method: 'DELETE' }),
};

// Pages
export const pagesApi = {
  getAll: () => fetchAPI<any[]>('/pages'),
  getById: (id: string) => fetchAPI<any>(`/pages/${id}`),
  getBySlug: (slug: string) => fetchAPI<any>(`/pages/slug/${slug}`),
  create: (data: any) => fetchAPI<any>('/pages', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => fetchAPI<any>(`/pages/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => fetchAPI<any>(`/pages/${id}`, { method: 'DELETE' }),
};

// Albums
export const albumsApi = {
  getAll: () => fetchAPI<any[]>('/albums'),
  getById: (id: string) => fetchAPI<any>(`/albums/${id}`),
  create: (data: any) => fetchAPI<any>('/albums', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => fetchAPI<any>(`/albums/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => fetchAPI<any>(`/albums/${id}`, { method: 'DELETE' }),
  getMedia: (albumId: string) => fetchAPI<any[]>(`/albums/${albumId}/media`),
  addMedia: (albumId: string, data: any) => fetchAPI<any>(`/albums/${albumId}/media`, { method: 'POST', body: JSON.stringify(data) }),
  deleteMedia: (mediaId: string) => fetchAPI<any>(`/media/${mediaId}`, { method: 'DELETE' }),
};

// Auth
export const authApi = {
  login: (email: string, password: string) => 
    fetchAPI<{ user: any; token: string; isAdmin: boolean }>('/auth/login', { 
      method: 'POST', 
      body: JSON.stringify({ email, password }) 
    }),
};

// Files
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const filesApi = {
  getAll: (folder?: string) => fetchAPI<any[]>(folder ? `/files?folder=${folder}` : '/files'),
  getFolders: () => fetchAPI<any[]>('/files/folders'),
  upload: async (file: File, folder: string = 'general') => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch(`${API_BASE}/files/upload?folder=${folder}`, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) throw new Error('Upload failed');
    return response.json();
  },
  uploadMultiple: async (files: File[], folder: string = 'general') => {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    const response = await fetch(`${API_BASE}/files/upload-multiple?folder=${folder}`, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) throw new Error('Upload failed');
    return response.json();
  },
  delete: (id: string) => fetchAPI<any>(`/files/${id}`, { method: 'DELETE' }),
};

// Site Settings
export const settingsApi = {
  get: () => fetchAPI<any>('/settings'),
  update: (data: any) => fetchAPI<any>('/settings', { method: 'PUT', body: JSON.stringify(data) }),
};

// Comments
export const commentsApi = {
  getForArticle: (articleId: string) => fetchAPI<any[]>(`/articles/${articleId}/comments`),
  create: (articleId: string, data: any) => fetchAPI<any>(`/articles/${articleId}/comments`, { method: 'POST', body: JSON.stringify(data) }),
  getAll: () => fetchAPI<any[]>('/admin/comments'),
  approve: (id: string, is_approved: boolean) => fetchAPI<any>(`/admin/comments/${id}`, { method: 'PUT', body: JSON.stringify({ is_approved }) }),
  delete: (id: string) => fetchAPI<any>(`/admin/comments/${id}`, { method: 'DELETE' }),
};

// Page Sections
export const sectionsApi = {
  getForPage: (pageId: string) => fetchAPI<any[]>(`/pages/${pageId}/sections`),
  getBySlug: (slug: string) => fetchAPI<any[]>(`/pages/slug/${slug}/sections`),
  create: (pageId: string, data: any) => fetchAPI<any>(`/pages/${pageId}/sections`, { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => fetchAPI<any>(`/sections/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  reorder: (pageId: string, sections: { id: number; sort_order: number }[]) => 
    fetchAPI<any>(`/pages/${pageId}/sections/reorder`, { method: 'PUT', body: JSON.stringify({ sections }) }),
  delete: (id: string) => fetchAPI<any>(`/sections/${id}`, { method: 'DELETE' }),
};

// Analytics
export const analyticsApi = {
  trackPageView: (data: { page_path: string; page_title: string; referrer?: string; session_id?: string }) =>
    fetchAPI<any>('/analytics/pageview', { method: 'POST', body: JSON.stringify(data) }),
  trackArticleView: (id: string) => fetchAPI<any>(`/articles/${id}/view`, { method: 'POST' }),
  getDashboard: (days: number = 30) => fetchAPI<any>(`/analytics/dashboard?days=${days}`),
};

// Social Feeds
export const socialFeedsApi = {
  getAll: () => fetchAPI<any[]>('/social-feeds'),
  create: (data: any) => fetchAPI<any>('/social-feeds', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => fetchAPI<any>(`/social-feeds/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => fetchAPI<any>(`/social-feeds/${id}`, { method: 'DELETE' }),
  sync: (id: number) => fetchAPI<any>(`/social-feeds/${id}/sync`, { method: 'POST' }),
  getPosts: (limit: number = 20) => fetchAPI<any[]>(`/social-posts?limit=${limit}`),
};

// Slug Generation
export const generateSlug = (title: string) => 
  fetchAPI<{ slug: string }>('/generate-slug', { method: 'POST', body: JSON.stringify({ title }) });

// Contact Form
export const contactApi = {
  submit: (data: { name: string; email: string; subject?: string; message: string }) =>
    fetchAPI<{ success: boolean; message: string }>('/contact', { method: 'POST', body: JSON.stringify(data) }),
};

// Newsletter
export const newsletterApi = {
  subscribe: (data: { email: string; name?: string }) =>
    fetchAPI<{ success: boolean; message: string }>('/newsletter/subscribe', { method: 'POST', body: JSON.stringify(data) }),
  unsubscribe: (email: string) =>
    fetchAPI<{ success: boolean; message: string }>('/newsletter/unsubscribe', { method: 'POST', body: JSON.stringify({ email }) }),
  getSubscribers: () => fetchAPI<any[]>('/admin/newsletter'),
};

export default {
  books: booksApi,
  articles: articlesApi,
  gallery: galleryApi,
  testimonials: testimonialsApi,
  siteContent: siteContentApi,
  menus: menusApi,
  pages: pagesApi,
  albums: albumsApi,
  auth: authApi,
  files: filesApi,
  settings: settingsApi,
  comments: commentsApi,
  sections: sectionsApi,
  analytics: analyticsApi,
  socialFeeds: socialFeedsApi,
};
