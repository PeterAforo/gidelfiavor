export type ImageWithAlt = {
  asset?: { _ref: string };
  alt?: string;
};

export type LinkItem = {
  label?: string;
  href?: string;
  isExternal?: boolean;
};

export type SiteSettings = {
  siteTitle?: string;
  siteDescription?: string;
  footerText?: string;
  socialLinks?: Array<{ platform?: string; url?: string }>;
  announcement?: {
    enabled?: boolean;
    message?: string;
    link?: string;
    linkText?: string;
  };
};

export type Navigation = {
  mainNav?: Array<LinkItem>;
  footerNav?: Array<{ groupTitle?: string; links?: Array<LinkItem> }>;
};

export type Book = {
  _id: string;
  title?: string;
  slug?: { current?: string };
  subtitle?: string;
  shortDescription?: string;
  coverImage?: ImageWithAlt;
  genre?: string[];
  publishDate?: string;
  status?: string;
  purchaseLinks?: Array<{ store?: string; url?: string; format?: string }>;
};

export type BlogPost = {
  _id: string;
  title?: string;
  slug?: { current?: string };
  excerpt?: string;
  publishedAt?: string;
  readingTime?: number;
  categories?: Array<{ title?: string }>;
};

export type EventItem = {
  _id: string;
  title?: string;
  slug?: { current?: string };
  date?: string;
  eventType?: string;
  status?: string;
  location?: {
    venue?: string;
    city?: string;
    isVirtual?: boolean;
  };
};
