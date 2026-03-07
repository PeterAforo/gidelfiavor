import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Import after mocking
import { 
  booksApi, 
  articlesApi, 
  galleryApi, 
  testimonialsApi,
  siteContentApi,
  authApi,
} from '@/lib/api';

describe('API Client', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('booksApi', () => {
    it('getAll should fetch books from /api/books', async () => {
      const mockBooks = [{ id: 1, title: 'Book 1' }];
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockBooks),
      });

      const result = await booksApi.getAll();

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/books'),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
        })
      );
      expect(result).toEqual(mockBooks);
    });

    it('create should POST to /api/books', async () => {
      const newBook = { title: 'New Book', description: 'Description' };
      const createdBook = { id: 1, ...newBook };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(createdBook),
      });

      const result = await booksApi.create(newBook);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/books'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(newBook),
        })
      );
      expect(result).toEqual(createdBook);
    });

    it('update should PUT to /api/books/:id', async () => {
      const updatedBook = { id: '1', title: 'Updated Book' };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(updatedBook),
      });

      const result = await booksApi.update('1', updatedBook);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/books/1'),
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify(updatedBook),
        })
      );
      expect(result).toEqual(updatedBook);
    });

    it('delete should DELETE /api/books/:id', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      });

      const result = await booksApi.delete('1');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/books/1'),
        expect.objectContaining({
          method: 'DELETE',
        })
      );
      expect(result).toEqual({ success: true });
    });

    it('should throw error on failed request', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ error: 'Not found' }),
      });

      await expect(booksApi.getAll()).rejects.toThrow('Not found');
    });
  });

  describe('articlesApi', () => {
    it('getAll should fetch articles', async () => {
      const mockArticles = [{ id: 1, title: 'Article 1' }];
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockArticles),
      });

      const result = await articlesApi.getAll();

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/articles'),
        expect.any(Object)
      );
      expect(result).toEqual(mockArticles);
    });

    it('getById should fetch single article', async () => {
      const mockArticle = { id: 1, title: 'Article 1', content: 'Content' };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockArticle),
      });

      const result = await articlesApi.getById('1');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/articles/1'),
        expect.any(Object)
      );
      expect(result).toEqual(mockArticle);
    });
  });

  describe('galleryApi', () => {
    it('getAll should fetch gallery images', async () => {
      const mockImages = [{ id: 1, image_url: '/img.jpg' }];
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockImages),
      });

      const result = await galleryApi.getAll();

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/gallery'),
        expect.any(Object)
      );
      expect(result).toEqual(mockImages);
    });
  });

  describe('testimonialsApi', () => {
    it('getAll should fetch testimonials', async () => {
      const mockTestimonials = [{ id: 1, name: 'John', quote: 'Great!' }];
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockTestimonials),
      });

      const result = await testimonialsApi.getAll();

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/testimonials'),
        expect.any(Object)
      );
      expect(result).toEqual(mockTestimonials);
    });
  });

  describe('siteContentApi', () => {
    it('get should fetch site content', async () => {
      const mockContent = { hero_title: 'Welcome' };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockContent),
      });

      const result = await siteContentApi.get();

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/site-content'),
        expect.any(Object)
      );
      expect(result).toEqual(mockContent);
    });

    it('update should PUT site content', async () => {
      const updateData = { hero_title: 'New Title' };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(updateData),
      });

      const result = await siteContentApi.update(updateData);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/site-content'),
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify(updateData),
        })
      );
      expect(result).toEqual(updateData);
    });
  });

  describe('authApi', () => {
    it('login should POST credentials', async () => {
      const mockResponse = { user: { id: 1, email: 'admin@test.com' }, isAdmin: true };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await authApi.login('admin@test.com', 'password123');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/auth/login'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ email: 'admin@test.com', password: 'password123' }),
        })
      );
      expect(result).toEqual(mockResponse);
    });

    it('login should throw on invalid credentials', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ error: 'Invalid credentials' }),
      });

      await expect(authApi.login('wrong@test.com', 'wrong')).rejects.toThrow('Invalid credentials');
    });
  });
});
