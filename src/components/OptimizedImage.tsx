import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  placeholder?: 'blur' | 'empty';
  objectFit?: 'cover' | 'contain' | 'fill' | 'none';
  onClick?: () => void;
}

const OptimizedImage = ({
  src,
  alt,
  className,
  width,
  height,
  priority = false,
  placeholder = 'empty',
  objectFit = 'cover',
  onClick,
}: OptimizedImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [error, setError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (priority) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '200px', // Start loading 200px before entering viewport
        threshold: 0.01,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setError(true);
    setIsLoaded(true);
  };

  // Generate placeholder blur data URL
  const blurDataUrl = 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width || 400} ${height || 300}">
      <filter id="b" color-interpolation-filters="sRGB">
        <feGaussianBlur stdDeviation="20"/>
      </filter>
      <rect width="100%" height="100%" fill="#e5e7eb" filter="url(#b)"/>
    </svg>
  `);

  const objectFitClass = {
    cover: 'object-cover',
    contain: 'object-contain',
    fill: 'object-fill',
    none: 'object-none',
  }[objectFit];

  return (
    <div
      ref={imgRef}
      className={cn(
        'relative overflow-hidden bg-muted',
        className
      )}
      style={{ width, height }}
      onClick={onClick}
    >
      {/* Placeholder */}
      {!isLoaded && placeholder === 'blur' && (
        <img
          src={blurDataUrl}
          alt=""
          className={cn('absolute inset-0 w-full h-full', objectFitClass)}
          aria-hidden="true"
        />
      )}
      
      {/* Skeleton loader */}
      {!isLoaded && placeholder === 'empty' && (
        <div className="absolute inset-0 bg-muted animate-pulse" />
      )}

      {/* Actual image */}
      {isInView && !error && (
        <img
          src={src}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={handleLoad}
          onError={handleError}
          className={cn(
            'w-full h-full transition-opacity duration-300',
            objectFitClass,
            isLoaded ? 'opacity-100' : 'opacity-0'
          )}
          width={width}
          height={height}
        />
      )}

      {/* Error state */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted text-muted-foreground">
          <span className="text-sm">Failed to load image</span>
        </div>
      )}
    </div>
  );
};

// Responsive image with srcset support
interface ResponsiveImageProps extends OptimizedImageProps {
  srcSet?: string;
  sizes?: string;
}

export const ResponsiveImage = ({
  src,
  srcSet,
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  ...props
}: ResponsiveImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(props.priority);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (props.priority) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px', threshold: 0.01 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [props.priority]);

  return (
    <div
      ref={imgRef}
      className={cn('relative overflow-hidden bg-muted', props.className)}
    >
      {!isLoaded && (
        <div className="absolute inset-0 bg-muted animate-pulse" />
      )}
      
      {isInView && (
        <img
          src={src}
          srcSet={srcSet}
          sizes={sizes}
          alt={props.alt}
          loading={props.priority ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          className={cn(
            'w-full h-full object-cover transition-opacity duration-300',
            isLoaded ? 'opacity-100' : 'opacity-0'
          )}
        />
      )}
    </div>
  );
};

export default OptimizedImage;
