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

// Helper to resolve image URLs - handles both absolute URLs and relative paths
export const resolveImageUrl = (url: string | undefined | null): string => {
  if (!url) return '';
  // If already an absolute URL (http/https), return as-is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  // If relative path, prefix with API base URL
  return `${getApiBaseUrl()}${url.startsWith('/') ? '' : '/'}${url}`;
};

const AUTH_KEYS = ['auth_user', 'auth_token', 'auth_is_admin'];

export const authHeader = (): Record<string, string> => {
  const token = localStorage.getItem('auth_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Expired/invalid admin session: clear it and send the user back to the login screen
const handleUnauthorized = (response: Response, sentToken: boolean) => {
  if (response.status !== 401 || !sentToken) return;
  AUTH_KEYS.forEach((key) => localStorage.removeItem(key));
  if (window.location.pathname.startsWith('/admin/')) {
    window.location.assign('/admin');
  }
};

export async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const auth = authHeader();
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...auth,
      ...options?.headers,
    },
  });

  if (!response.ok) {
    handleUnauthorized(response, 'Authorization' in auth);
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

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

// Fallback when Cloudinary isn't configured (local development): multipart upload to the API
const uploadViaApi = async (file: File, folder: string) => {
  const formData = new FormData();
  formData.append('file', file);
  const auth = authHeader();
  const response = await fetch(`${API_BASE}/files/upload?folder=${folder}`, {
    method: 'POST',
    headers: auth,
    body: formData,
  });
  if (!response.ok) {
    handleUnauthorized(response, 'Authorization' in auth);
    throw new Error('Upload failed');
  }
  return response.json();
};

const upload = async (file: File, folder: string = 'general') => {
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error('File too large (max 10 MB)');
  }

  let signed: Record<string, any>;
  try {
    signed = await fetchAPI<Record<string, any>>('/files/upload-signature', {
      method: 'POST',
      body: JSON.stringify({ folder, isImage: file.type.startsWith('image/') }),
    });
  } catch (err: any) {
    if (err.message === 'Cloudinary not configured') return uploadViaApi(file, folder);
    throw err;
  }

  // Upload the file straight to Cloudinary so large files never pass through the API
  const { cloudName, apiKey, signature, ...params } = signed;
  const formData = new FormData();
  formData.append('file', file);
  formData.append('api_key', apiKey);
  formData.append('signature', signature);
  Object.entries(params).forEach(([key, value]) => formData.append(key, String(value)));
  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
    method: 'POST',
    body: formData,
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.error?.message || 'Upload failed');

  return fetchAPI<any>('/files', {
    method: 'POST',
    body: JSON.stringify({
      public_id: result.public_id,
      secure_url: result.secure_url,
      original_name: file.name,
      file_type: file.type,
      bytes: result.bytes,
      folder,
    }),
  });
};

export const filesApi = {
  getAll: (folder?: string) => fetchAPI<any[]>(folder ? `/files?folder=${folder}` : '/files'),
  getFolders: () => fetchAPI<any[]>('/files/folders'),
  upload,
  uploadMultiple: (files: File[], folder: string = 'general') =>
    Promise.all(files.map((file) => upload(file, folder))),
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
