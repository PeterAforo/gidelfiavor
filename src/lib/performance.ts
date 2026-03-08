// Performance optimization utilities

// Preload critical resources
export const preloadCriticalResources = () => {
  // Preload fonts
  const fonts = [
    '/fonts/inter-var.woff2',
    '/fonts/playfair-display-var.woff2',
  ];

  fonts.forEach(font => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'font';
    link.type = 'font/woff2';
    link.href = font;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });
};

// Preload images for above-the-fold content
export const preloadImage = (src: string) => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = src;
  document.head.appendChild(link);
};

// Prefetch pages for faster navigation
export const prefetchPage = (href: string) => {
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = href;
  document.head.appendChild(link);
};

// DNS prefetch for external resources
export const dnsPrefetch = (domain: string) => {
  const link = document.createElement('link');
  link.rel = 'dns-prefetch';
  link.href = domain;
  document.head.appendChild(link);
};

// Initialize performance optimizations
export const initPerformanceOptimizations = () => {
  // DNS prefetch for external services
  const externalDomains = [
    'https://res.cloudinary.com',
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
    'https://www.google-analytics.com',
  ];

  externalDomains.forEach(dnsPrefetch);

  // Preconnect to API
  const apiLink = document.createElement('link');
  apiLink.rel = 'preconnect';
  apiLink.href = import.meta.env.VITE_API_URL?.replace('/api', '') || '';
  document.head.appendChild(apiLink);
};

// Report Core Web Vitals
export const reportWebVitals = (onPerfEntry?: (metric: PerformanceEntry) => void) => {
  if (onPerfEntry && typeof onPerfEntry === 'function') {
    // Use Performance Observer for Core Web Vitals
    if ('PerformanceObserver' in window) {
      // Largest Contentful Paint
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(onPerfEntry);
      });
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

      // First Input Delay
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(onPerfEntry);
      });
      fidObserver.observe({ type: 'first-input', buffered: true });

      // Cumulative Layout Shift
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(onPerfEntry);
      });
      clsObserver.observe({ type: 'layout-shift', buffered: true });
    }
  }
};

// Debounce function for performance
export const debounce = <T extends (...args: Parameters<T>) => ReturnType<T>>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Throttle function for performance
export const throttle = <T extends (...args: Parameters<T>) => ReturnType<T>>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Measure component render time
export const measureRender = (componentName: string) => {
  const start = performance.now();
  return () => {
    const end = performance.now();
    console.debug(`[Performance] ${componentName} rendered in ${(end - start).toFixed(2)}ms`);
  };
};

export default {
  preloadCriticalResources,
  preloadImage,
  prefetchPage,
  dnsPrefetch,
  initPerformanceOptimizations,
  reportWebVitals,
  debounce,
  throttle,
  measureRender,
};
