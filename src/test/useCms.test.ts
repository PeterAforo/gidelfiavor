import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { ReactNode } from 'react';

// Mock the API module
vi.mock('@/lib/api', () => ({
  booksApi: {
    getAll: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  articlesApi: {
    getAll: vi.fn(),
    getById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  galleryApi: {
    getAll: vi.fn(),
    create: vi.fn(),
    delete: vi.fn(),
  },
  testimonialsApi: {
    getAll: vi.fn(),
    create: vi.fn(),
    delete: vi.fn(),
  },
  siteContentApi: {
    get: vi.fn(),
    update: vi.fn(),
  },
  sectionsApi: {
    getBySlug: vi.fn(),
  },
}));

import { 
  useBooks, 
  useArticles, 
  useArticle,
  useGalleryImages, 
  useTestimonials,
  useSiteContent,
  usePageSections,
} from '@/hooks/useCms';
import { booksApi, articlesApi, galleryApi, testimonialsApi, siteContentApi, sectionsApi } from '@/lib/api';

// Create a wrapper with QueryClientProvider
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  const Wrapper = ({ children }: { children: ReactNode }) => {
    return React.createElement(QueryClientProvider, { client: queryClient }, children);
  };
  return Wrapper;
};

describe('useCms Hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('useBooks', () => {
    it('should fetch books successfully', async () => {
      const mockBooks = [
        { id: 1, title: 'Book 1', description: 'Description 1' },
        { id: 2, title: 'Book 2', description: 'Description 2' },
      ];
      vi.mocked(booksApi.getAll).mockResolvedValue(mockBooks);

      const { result } = renderHook(() => useBooks(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(mockBooks);
      expect(booksApi.getAll).toHaveBeenCalledTimes(1);
    });

    it('should return empty array on error', async () => {
      vi.mocked(booksApi.getAll).mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() => useBooks(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual([]);
    });
  });

  describe('useArticles', () => {
    it('should fetch all articles', async () => {
      const mockArticles = [
        { id: 1, title: 'Article 1', published: true },
        { id: 2, title: 'Article 2', published: false },
      ];
      vi.mocked(articlesApi.getAll).mockResolvedValue(mockArticles);

      const { result } = renderHook(() => useArticles(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(mockArticles);
    });

    it('should filter to published only when flag is true', async () => {
      const mockArticles = [
        { id: 1, title: 'Article 1', published: true },
        { id: 2, title: 'Article 2', published: false },
      ];
      vi.mocked(articlesApi.getAll).mockResolvedValue(mockArticles);

      const { result } = renderHook(() => useArticles(true), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual([{ id: 1, title: 'Article 1', published: true }]);
    });
  });

  describe('useArticle', () => {
    it('should fetch a single article by id', async () => {
      const mockArticle = { id: 1, title: 'Article 1', content: 'Content' };
      vi.mocked(articlesApi.getById).mockResolvedValue(mockArticle);

      const { result } = renderHook(() => useArticle('1'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(mockArticle);
      expect(articlesApi.getById).toHaveBeenCalledWith('1');
    });

    it('should not fetch when id is empty', async () => {
      const { result } = renderHook(() => useArticle(''), {
        wrapper: createWrapper(),
      });

      expect(result.current.isFetching).toBe(false);
      expect(articlesApi.getById).not.toHaveBeenCalled();
    });
  });

  describe('useGalleryImages', () => {
    it('should fetch gallery images', async () => {
      const mockImages = [
        { id: 1, image_url: '/img1.jpg', caption: 'Image 1' },
        { id: 2, image_url: '/img2.jpg', caption: 'Image 2' },
      ];
      vi.mocked(galleryApi.getAll).mockResolvedValue(mockImages);

      const { result } = renderHook(() => useGalleryImages(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(mockImages);
    });
  });

  describe('useTestimonials', () => {
    it('should fetch testimonials', async () => {
      const mockTestimonials = [
        { id: 1, name: 'John', quote: 'Great book!' },
        { id: 2, name: 'Jane', quote: 'Inspiring!' },
      ];
      vi.mocked(testimonialsApi.getAll).mockResolvedValue(mockTestimonials);

      const { result } = renderHook(() => useTestimonials(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(mockTestimonials);
    });
  });

  describe('useSiteContent', () => {
    it('should fetch site content', async () => {
      const mockContent = {
        hero_title: 'Welcome',
        hero_subtitle: 'Subtitle',
        about_bio: 'Bio text',
      };
      vi.mocked(siteContentApi.get).mockResolvedValue(mockContent);

      const { result } = renderHook(() => useSiteContent(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(mockContent);
    });

    it('should return empty object on error', async () => {
      vi.mocked(siteContentApi.get).mockRejectedValue(new Error('Error'));

      const { result } = renderHook(() => useSiteContent(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual({});
    });
  });

  describe('usePageSections', () => {
    it('should fetch page sections by slug', async () => {
      const mockSections = [
        { id: 1, section_type: 'hero', title: 'Hero' },
        { id: 2, section_type: 'text', title: 'Content' },
      ];
      vi.mocked(sectionsApi.getBySlug).mockResolvedValue(mockSections);

      const { result } = renderHook(() => usePageSections('home'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(mockSections);
      expect(sectionsApi.getBySlug).toHaveBeenCalledWith('home');
    });

    it('should not fetch when slug is empty', async () => {
      const { result } = renderHook(() => usePageSections(''), {
        wrapper: createWrapper(),
      });

      expect(result.current.isFetching).toBe(false);
      expect(sectionsApi.getBySlug).not.toHaveBeenCalled();
    });
  });
});
