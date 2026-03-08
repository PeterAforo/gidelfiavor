import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { booksApi, articlesApi, galleryApi, testimonialsApi, siteContentApi, sectionsApi, settingsApi, menusApi } from "@/lib/api";

// Site content
export const useSiteContent = () =>
  useQuery({
    queryKey: ["site_content"],
    queryFn: async () => {
      try {
        return await siteContentApi.get();
      } catch {
        return {};
      }
    },
  });

export const useUpsertSiteContent = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: Record<string, string>) => {
      return await siteContentApi.update(data);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["site_content"] }),
  });
};

// Books
export const useBooks = () =>
  useQuery({
    queryKey: ["books"],
    queryFn: async () => {
      try {
        return await booksApi.getAll();
      } catch {
        return [];
      }
    },
  });

export const useUpsertBook = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (book: any) => {
      if (book.id) {
        return await booksApi.update(book.id, book);
      }
      return await booksApi.create(book);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["books"] }),
  });
};

export const useDeleteBook = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      return await booksApi.delete(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["books"] }),
  });
};

// Articles
export const useArticles = (publishedOnly = false) =>
  useQuery({
    queryKey: ["articles", publishedOnly],
    queryFn: async () => {
      try {
        const articles = await articlesApi.getAll();
        if (publishedOnly) {
          return articles.filter((a: any) => a.published);
        }
        return articles;
      } catch {
        return [];
      }
    },
  });

export const useArticle = (id: string) =>
  useQuery({
    queryKey: ["article", id],
    queryFn: async () => {
      try {
        return await articlesApi.getById(id);
      } catch {
        return null;
      }
    },
    enabled: !!id,
  });

export const useUpsertArticle = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (article: any) => {
      if (article.id) {
        return await articlesApi.update(article.id, article);
      }
      return await articlesApi.create(article);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["articles"] }),
  });
};

export const useDeleteArticle = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      return await articlesApi.delete(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["articles"] }),
  });
};

// Gallery
export const useGalleryImages = () =>
  useQuery({
    queryKey: ["gallery_images"],
    queryFn: async () => {
      try {
        return await galleryApi.getAll();
      } catch {
        return [];
      }
    },
  });

export const useUpsertGalleryImage = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (img: any) => {
      return await galleryApi.create(img);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["gallery_images"] }),
  });
};

export const useDeleteGalleryImage = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      return await galleryApi.delete(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["gallery_images"] }),
  });
};

// Testimonials
export const useTestimonials = (approvedOnly = true) =>
  useQuery({
    queryKey: ["testimonials", approvedOnly],
    queryFn: async () => {
      try {
        if (approvedOnly) {
          return await testimonialsApi.getApproved();
        }
        return await testimonialsApi.getAll();
      } catch {
        return [];
      }
    },
  });

export const useUpsertTestimonial = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (t: any) => {
      return await testimonialsApi.create(t);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["testimonials"] }),
  });
};

export const useDeleteTestimonial = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      return await testimonialsApi.delete(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["testimonials"] }),
  });
};

// File upload - for now just return the URL (implement actual upload later)
export const uploadFile = async (file: File, folder: string) => {
  // TODO: Implement file upload to a storage service
  // For now, return a placeholder or use base64
  return URL.createObjectURL(file);
};

// Page Sections (for frontend rendering)
export const usePageSections = (slug: string) =>
  useQuery({
    queryKey: ["page-sections-public", slug],
    queryFn: async () => {
      try {
        return await sectionsApi.getBySlug(slug);
      } catch {
        return [];
      }
    },
    enabled: !!slug,
  });

// Site Settings (for social links, etc.)
export const useSiteSettings = () =>
  useQuery({
    queryKey: ["site_settings"],
    queryFn: async () => {
      try {
        return await settingsApi.get();
      } catch {
        return {};
      }
    },
  });

// Menus (for navigation)
export const useMenus = () =>
  useQuery({
    queryKey: ["menus"],
    queryFn: async () => {
      try {
        return await menusApi.getAll();
      } catch {
        return [];
      }
    },
  });
