import { Loader2, RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
}

export const LoadingSpinner = ({ size = 'md', className, text }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div className={cn('flex flex-col items-center justify-center gap-2', className)}>
      <Loader2 className={cn('animate-spin text-primary', sizeClasses[size])} />
      {text && <p className="text-sm text-muted-foreground">{text}</p>}
    </div>
  );
};

interface PageLoaderProps {
  text?: string;
}

export const PageLoader = ({ text = 'Loading...' }: PageLoaderProps) => (
  <div className="flex items-center justify-center min-h-[400px]">
    <LoadingSpinner size="lg" text={text} />
  </div>
);

interface SkeletonProps {
  className?: string;
}

export const Skeleton = ({ className }: SkeletonProps) => (
  <div className={cn('animate-pulse bg-muted rounded', className)} />
);

export const CardSkeleton = () => (
  <div className="border rounded-lg p-4 space-y-3">
    <Skeleton className="h-40 w-full" />
    <Skeleton className="h-4 w-3/4" />
    <Skeleton className="h-4 w-1/2" />
  </div>
);

export const TableSkeleton = ({ rows = 5 }: { rows?: number }) => (
  <div className="space-y-2">
    <Skeleton className="h-10 w-full" />
    {Array.from({ length: rows }).map((_, i) => (
      <Skeleton key={i} className="h-12 w-full" />
    ))}
  </div>
);

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retrying?: boolean;
}

export const ErrorState = ({
  title = 'Something went wrong',
  message = 'An error occurred while loading this content.',
  onRetry,
  retrying = false,
}: ErrorStateProps) => (
  <div className="flex flex-col items-center justify-center min-h-[300px] text-center p-6">
    <AlertCircle className="h-12 w-12 text-destructive mb-4" />
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-muted-foreground mb-4 max-w-md">{message}</p>
    {onRetry && (
      <Button onClick={onRetry} disabled={retrying} variant="outline">
        {retrying ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Retrying...
          </>
        ) : (
          <>
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </>
        )}
      </Button>
    )}
  </div>
);

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
}

export const EmptyState = ({ title, description, action, icon }: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center min-h-[300px] text-center p-6">
    {icon && <div className="mb-4 text-muted-foreground">{icon}</div>}
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    {description && <p className="text-muted-foreground mb-4 max-w-md">{description}</p>}
    {action}
  </div>
);

interface OfflineIndicatorProps {
  onRetry?: () => void;
}

export const OfflineIndicator = ({ onRetry }: OfflineIndicatorProps) => (
  <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-destructive text-destructive-foreground p-4 rounded-lg shadow-lg z-50">
    <div className="flex items-center gap-3">
      <AlertCircle className="h-5 w-5 flex-shrink-0" />
      <div className="flex-1">
        <p className="font-medium">You're offline</p>
        <p className="text-sm opacity-90">Check your internet connection</p>
      </div>
      {onRetry && (
        <Button size="sm" variant="secondary" onClick={onRetry}>
          Retry
        </Button>
      )}
    </div>
  </div>
);

export default {
  LoadingSpinner,
  PageLoader,
  Skeleton,
  CardSkeleton,
  TableSkeleton,
  ErrorState,
  EmptyState,
  OfflineIndicator,
};
