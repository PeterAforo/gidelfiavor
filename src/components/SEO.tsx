import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  type?: 'website' | 'article' | 'book' | 'profile';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  keywords?: string[];
  noIndex?: boolean;
}

const SEO = ({
  title = 'Gidel Kwasi Fiavor - Author, Theologian & Healthcare Marketing Specialist',
  description = 'Elder Gidel Kwasi Fiavor is a passionate healthcare marketing specialist, theologian, marriage counsellor, and author with nearly three decades of professional experience.',
  image = 'https://www.gidelfiavor.com/og-image.jpg',
  type = 'website',
  author = 'Gidel Kwasi Fiavor',
  publishedTime,
  modifiedTime,
  keywords = ['Gidel Fiavor', 'author', 'theologian', 'healthcare marketing', 'marriage counsellor', 'Ghana', 'books'],
  noIndex = false,
}: SEOProps) => {
  const location = useLocation();
  const canonicalUrl = `https://www.gidelfiavor.com${location.pathname}`;

  useEffect(() => {
    // Update document title
    document.title = title;

    // Update or create meta tags
    const updateMeta = (name: string, content: string, isProperty = false) => {
      const attr = isProperty ? 'property' : 'name';
      let meta = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attr, name);
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    // Basic meta tags
    updateMeta('description', description);
    updateMeta('keywords', keywords.join(', '));
    updateMeta('author', author);
    
    if (noIndex) {
      updateMeta('robots', 'noindex, nofollow');
    } else {
      updateMeta('robots', 'index, follow');
    }

    // Open Graph tags
    updateMeta('og:title', title, true);
    updateMeta('og:description', description, true);
    updateMeta('og:type', type, true);
    updateMeta('og:url', canonicalUrl, true);
    updateMeta('og:image', image, true);
    updateMeta('og:site_name', 'Gidel Kwasi Fiavor', true);

    // Twitter Card tags
    updateMeta('twitter:card', 'summary_large_image');
    updateMeta('twitter:title', title);
    updateMeta('twitter:description', description);
    updateMeta('twitter:image', image);

    // Article-specific tags
    if (type === 'article' && publishedTime) {
      updateMeta('article:published_time', publishedTime, true);
      updateMeta('article:author', author, true);
      if (modifiedTime) {
        updateMeta('article:modified_time', modifiedTime, true);
      }
    }

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;

  }, [title, description, image, type, author, publishedTime, modifiedTime, keywords, noIndex, canonicalUrl]);

  return null;
};

// Structured Data Components
export const PersonSchema = () => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Gidel Kwasi Fiavor',
    jobTitle: ['Author', 'Theologian', 'Healthcare Marketing Specialist', 'Marriage Counsellor'],
    description: 'A passionate healthcare marketing specialist, theologian, marriage counsellor, and author with nearly three decades of professional experience.',
    url: 'https://www.gidelfiavor.com',
    sameAs: [
      'https://www.linkedin.com/in/gidelfiavor',
      'https://twitter.com/gidelfiavor',
      'https://www.facebook.com/gidelfiavor',
    ],
    knowsAbout: ['Healthcare Marketing', 'Theology', 'Marriage Counselling', 'Writing'],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

export const WebsiteSchema = () => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Gidel Kwasi Fiavor',
    url: 'https://www.gidelfiavor.com',
    description: 'Official website of Gidel Kwasi Fiavor - Author, Theologian & Healthcare Marketing Specialist',
    author: {
      '@type': 'Person',
      name: 'Gidel Kwasi Fiavor',
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://www.gidelfiavor.com/articles?search={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

interface BookSchemaProps {
  title: string;
  description: string;
  image: string;
  isbn?: string;
  datePublished?: string;
}

export const BookSchema = ({ title, description, image, isbn, datePublished }: BookSchemaProps) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Book',
    name: title,
    description,
    image,
    author: {
      '@type': 'Person',
      name: 'Gidel Kwasi Fiavor',
    },
    ...(isbn && { isbn }),
    ...(datePublished && { datePublished }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

interface ArticleSchemaProps {
  title: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified?: string;
  url: string;
}

export const ArticleSchema = ({ title, description, image, datePublished, dateModified, url }: ArticleSchemaProps) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    image,
    datePublished,
    dateModified: dateModified || datePublished,
    author: {
      '@type': 'Person',
      name: 'Gidel Kwasi Fiavor',
    },
    publisher: {
      '@type': 'Person',
      name: 'Gidel Kwasi Fiavor',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

interface BreadcrumbSchemaProps {
  items: { name: string; url: string }[];
}

export const BreadcrumbSchema = ({ items }: BreadcrumbSchemaProps) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

export default SEO;
