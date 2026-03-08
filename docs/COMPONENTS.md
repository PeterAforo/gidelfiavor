# Component Documentation

## UI Components

### Loading States (`src/components/LoadingStates.tsx`)

Reusable loading and error state components.

```tsx
import { LoadingSpinner, PageLoader, ErrorState, EmptyState } from '@/components/LoadingStates';

// Spinner with optional text
<LoadingSpinner size="md" text="Loading..." />

// Full page loader
<PageLoader text="Loading content..." />

// Error state with retry
<ErrorState 
  title="Failed to load"
  message="Please try again"
  onRetry={() => refetch()}
  retrying={isLoading}
/>

// Empty state
<EmptyState
  title="No items found"
  description="Create your first item to get started"
  action={<Button>Create Item</Button>}
/>
```

### Optimized Image (`src/components/OptimizedImage.tsx`)

Lazy-loading image component with placeholder support.

```tsx
import OptimizedImage from '@/components/OptimizedImage';

<OptimizedImage
  src="/image.jpg"
  alt="Description"
  width={400}
  height={300}
  priority={false}
  placeholder="blur"
  objectFit="cover"
/>
```

### SEO (`src/components/SEO.tsx`)

Meta tags and structured data components.

```tsx
import SEO, { ArticleSchema, BookSchema } from '@/components/SEO';

// Page-level SEO
<SEO
  title="Page Title"
  description="Page description"
  image="/og-image.jpg"
  type="article"
/>

// Article structured data
<ArticleSchema
  title="Article Title"
  description="Article description"
  image="/article-image.jpg"
  datePublished="2024-01-01"
  url="https://example.com/article"
/>
```

### Error Boundary (`src/components/ErrorBoundary.tsx`)

Catches React errors and displays fallback UI.

```tsx
import ErrorBoundary from '@/components/ErrorBoundary';

<ErrorBoundary fallback={<CustomErrorUI />}>
  <YourComponent />
</ErrorBoundary>
```

---

## Hooks

### useRetry (`src/hooks/useRetry.ts`)

Retry logic for async operations.

```tsx
import { useRetry, useAsyncAction } from '@/hooks/useRetry';

// Auto-retry on failure
const { data, error, isLoading, retry } = useRetry(
  () => fetchData(),
  { maxRetries: 3, delay: 1000, backoff: true }
);

// Manual async action
const { execute, isLoading, error } = useAsyncAction(submitForm);
await execute(formData);
```

### useNetworkStatus (`src/hooks/useNetworkStatus.ts`)

Monitor network connectivity.

```tsx
import useNetworkStatus from '@/hooks/useNetworkStatus';

const { isOnline, wasOffline, checkConnection } = useNetworkStatus();

if (!isOnline) {
  return <OfflineIndicator onRetry={checkConnection} />;
}
```

### useAuth (`src/hooks/useAuth.tsx`)

Authentication state management.

```tsx
import { useAuth } from '@/hooks/useAuth';

const { user, isAuthenticated, signIn, signOut, getAuthHeaders } = useAuth();

// Login
await signIn(email, password);

// Get headers for API calls
const headers = getAuthHeaders();
```

### useCms (`src/hooks/useCms.ts`)

CMS data fetching hooks.

```tsx
import { useBooks, useArticles, usePageSections } from '@/hooks/useCms';

const { data: books, isLoading } = useBooks();
const { data: articles } = useArticles(publishedOnly);
const { data: sections } = usePageSections('home');
```

---

## API Utilities

### apiErrorHandler (`src/lib/apiErrorHandler.ts`)

Centralized error handling.

```tsx
import { handleApiError, withErrorHandling, ApiException } from '@/lib/apiErrorHandler';

// Wrap async operations
const data = await withErrorHandling(
  () => api.fetchData(),
  { showToast: true, fallback: [] }
);

// Manual error handling
try {
  await api.submit(data);
} catch (error) {
  const { message, code } = handleApiError(error);
}
```

---

## Page Builder

### SectionRenderer (`src/components/SectionRenderer.tsx`)

Renders dynamic page sections from the CMS.

```tsx
import SectionRenderer from '@/components/SectionRenderer';

<SectionRenderer sections={pageSections} />
```

### Section Types

| Type | Description |
|------|-------------|
| `hero` | Hero banner with title, subtitle, CTA |
| `text` | Rich text content block |
| `image` | Single image with caption |
| `gallery` | Image grid |
| `cta` | Call-to-action section |
| `testimonials` | Testimonial carousel |
| `books` | Books showcase |
| `articles` | Articles list |
| `contact` | Contact form |

---

## Admin Components

### AdminGuard (`src/components/AdminGuard.tsx`)

Protects admin routes.

```tsx
import AdminGuard from '@/components/AdminGuard';

<Route 
  path="/admin/dashboard" 
  element={
    <AdminGuard>
      <AdminDashboard />
    </AdminGuard>
  } 
/>
```

### AdminSidebar (`src/components/AdminSidebar.tsx`)

Navigation sidebar for admin panel.

---

## Styling

### Theme Colors

The site uses CSS variables for theming:

```css
--background: 0 0% 100%;
--foreground: 222.2 84% 4.9%;
--primary: 222.2 47.4% 11.2%;
--secondary: 210 40% 96.1%;
--muted: 210 40% 96.1%;
--accent: 210 40% 96.1%;
--destructive: 0 84.2% 60.2%;
```

### Tailwind Classes

Common utility patterns:

```tsx
// Container
<div className="container mx-auto px-6">

// Card
<div className="bg-card rounded-lg border p-6">

// Button variants
<Button variant="default" />
<Button variant="outline" />
<Button variant="ghost" />
```
