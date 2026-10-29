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
  filesApi,
} from '@/lib/api';

const jsonResponse = (body: unknown, ok = true, status = ok ? 200 : 400) => ({
  ok,
  status,
  json: () => Promise.resolve(body),
});

describe('Auth header and 401 handling', () => {
  beforeEach(() => {
    mockFetch.mockReset();
    localStorage.clear();
  });

  it('attaches Bearer token when logged in', async () => {
    localStorage.setItem('auth_token', 'tok123');
    mockFetch.mockResolvedValueOnce(jsonResponse([]));
    await booksApi.getAll();
    expect(mockFetch.mock.calls[0][1].headers).toMatchObject({
      Authorization: 'Bearer tok123',
      'Content-Type': 'application/json',
    });
  });

  it('omits Authorization when not logged in', async () => {
    mockFetch.mockResolvedValueOnce(jsonResponse([]));
    await booksApi.getAll();
    expect(mockFetch.mock.calls[0][1].headers).not.toHaveProperty('Authorization');
  });

  it('clears the stored session on 401 when a token was sent', async () => {
    localStorage.setItem('auth_token', 'expired');
    localStorage.setItem('auth_user', '{}');
    localStorage.setItem('auth_is_admin', 'true');
    mockFetch.mockResolvedValueOnce(jsonResponse({ error: 'Invalid or expired token' }, false, 401));
    await expect(booksApi.create({ title: 'x' })).rejects.toThrow('Invalid or expired token');
    expect(localStorage.getItem('auth_token')).toBeNull();
    expect(localStorage.getItem('auth_user')).toBeNull();
    expect(localStorage.getItem('auth_is_admin')).toBeNull();
  });
});

describe('filesApi.upload', () => {
  beforeEach(() => {
    mockFetch.mockReset();
    localStorage.clear();
    localStorage.setItem('auth_token', 'tok');
  });

  const image = () => new File(['abc'], 'photo.jpg', { type: 'image/jpeg' });

  it('signs, uploads directly to Cloudinary, then registers the file', async () => {
    mockFetch
      .mockResolvedValueOnce(jsonResponse({ cloudName: 'demo', apiKey: 'k', signature: 's', timestamp: 1, folder: 'gidelfiavor/albums' }))
      .mockResolvedValueOnce(jsonResponse({ public_id: 'gidelfiavor/albums/x', secure_url: 'https://res.cloudinary.com/demo/x.jpg', bytes: 3 }))
      .mockResolvedValueOnce(jsonResponse({ id: 1, url: 'https://res.cloudinary.com/demo/x.jpg' }));

    const result = await filesApi.upload(image(), 'albums');

    expect(mockFetch.mock.calls[0][0]).toContain('/files/upload-signature');
    expect(JSON.parse(mockFetch.mock.calls[0][1].body)).toEqual({ folder: 'albums', isImage: true });
    expect(mockFetch.mock.calls[1][0]).toBe('https://api.cloudinary.com/v1_1/demo/auto/upload');
    const form = mockFetch.mock.calls[1][1].body as FormData;
    expect(form.get('signature')).toBe('s');
    expect(form.get('api_key')).toBe('k');
    expect(form.get('folder')).toBe('gidelfiavor/albums');
    expect(form.get('cloudName')).toBeNull();
    expect(mockFetch.mock.calls[2][0]).toMatch(/\/files$/);
    expect(JSON.parse(mockFetch.mock.calls[2][1].body)).toMatchObject({
      public_id: 'gidelfiavor/albums/x',
      original_name: 'photo.jpg',
      folder: 'albums',
    });
    expect(result.url).toBe('https://res.cloudinary.com/demo/x.jpg');
  });

  it('falls back to multipart API upload when Cloudinary is not configured', async () => {
    mockFetch
      .mockResolvedValueOnce(jsonResponse({ error: 'Cloudinary not configured' }, false, 501))
      .mockResolvedValueOnce(jsonResponse({ id: 2, url: '/uploads/general/a.jpg' }));

    const result = await filesApi.upload(image());

    expect(mockFetch.mock.calls[1][0]).toContain('/files/upload?folder=general');
    expect(mockFetch.mock.calls[1][1].headers).toEqual({ Authorization: 'Bearer tok' });
    expect(result.url).toBe('/uploads/general/a.jpg');
  });

  it('rejects files over 10 MB without calling the network', async () => {
    const big = new File([new Uint8Array(10 * 1024 * 1024 + 1)], 'big.jpg', { type: 'image/jpeg' });
    await expect(filesApi.upload(big)).rejects.toThrow('File too large');
    expect(mockFetch).not.toHaveBeenCalled();
  });
});

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
