import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import PublicLayout from "@/components/PublicLayout";
import AdminGuard from "@/components/AdminGuard";
import ErrorBoundary from "@/components/ErrorBoundary";
import ThemeColorProvider from "@/components/ThemeColorProvider";
import DynamicFavicon from "@/components/DynamicFavicon";
import { PersonSchema, WebsiteSchema } from "@/components/SEO";

import Index from "./pages/Index";
import AboutPage from "./pages/AboutPage";
import BooksPage from "./pages/BooksPage";
import ArticlesPage from "./pages/ArticlesPage";
import ArticleDetailPage from "./pages/ArticleDetailPage";
import GalleryPage from "./pages/GalleryPage";
import ContactPage from "./pages/ContactPage";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminSiteContent from "./pages/AdminSiteContent";
import AdminBooks from "./pages/AdminBooks";
import AdminBookEdit from "./pages/AdminBookEdit";
import AdminArticles from "./pages/AdminArticles";
import AdminArticleEdit from "./pages/AdminArticleEdit";
import AdminGallery from "./pages/AdminGallery";
import AdminTestimonials from "./pages/AdminTestimonials";
import AdminMenus from "./pages/AdminMenus";
import AdminMenuEdit from "./pages/AdminMenuEdit";
import AdminPages from "./pages/AdminPages";
import AdminPageEdit from "./pages/AdminPageEdit";
import AdminAlbums from "./pages/AdminAlbums";
import AdminSetup from "./pages/AdminSetup";
import AdminFiles from "./pages/AdminFiles";
import AdminSettings from "./pages/AdminSettings";
import AdminComments from "./pages/AdminComments";
import AdminSocialFeeds from "./pages/AdminSocialFeeds";
import AdminNewsletter from "./pages/AdminNewsletter";
import AdminUsers from "./pages/AdminUsers";
import NotFound from "./pages/NotFound";
import DynamicPage from "./pages/DynamicPage";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <ThemeColorProvider>
        <DynamicFavicon />
        <PersonSchema />
        <WebsiteSchema />
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <AuthProvider>
            <Routes>
            {/* Public pages */}
            <Route path="/" element={<PublicLayout><Index /></PublicLayout>} />
            <Route path="/about" element={<PublicLayout><AboutPage /></PublicLayout>} />
            <Route path="/books" element={<PublicLayout><BooksPage /></PublicLayout>} />
            <Route path="/articles" element={<PublicLayout><ArticlesPage /></PublicLayout>} />
            <Route path="/articles/:id" element={<PublicLayout><ArticleDetailPage /></PublicLayout>} />
            <Route path="/gallery" element={<PublicLayout><GalleryPage /></PublicLayout>} />
            <Route path="/contact" element={<PublicLayout><ContactPage /></PublicLayout>} />
            
            {/* Dynamic pages from admin panel */}
            <Route path="/page/:slug" element={<PublicLayout><DynamicPage /></PublicLayout>} />

            {/* Admin */}
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/setup" element={<AdminSetup />} />
            <Route path="/admin/dashboard" element={<AdminGuard><AdminDashboard /></AdminGuard>} />
            <Route path="/admin/site-content" element={<AdminGuard><AdminSiteContent /></AdminGuard>} />
            <Route path="/admin/books" element={<AdminGuard><AdminBooks /></AdminGuard>} />
            <Route path="/admin/books/:id" element={<AdminGuard><AdminBookEdit /></AdminGuard>} />
            <Route path="/admin/articles" element={<AdminGuard><AdminArticles /></AdminGuard>} />
            <Route path="/admin/articles/:id" element={<AdminGuard><AdminArticleEdit /></AdminGuard>} />
            <Route path="/admin/gallery" element={<AdminGuard><AdminGallery /></AdminGuard>} />
            <Route path="/admin/testimonials" element={<AdminGuard><AdminTestimonials /></AdminGuard>} />
            <Route path="/admin/menus" element={<AdminGuard><AdminMenus /></AdminGuard>} />
            <Route path="/admin/menus/:id" element={<AdminGuard><AdminMenuEdit /></AdminGuard>} />
            <Route path="/admin/pages" element={<AdminGuard><AdminPages /></AdminGuard>} />
            <Route path="/admin/pages/:id" element={<AdminGuard><AdminPageEdit /></AdminGuard>} />
            <Route path="/admin/albums" element={<AdminGuard><AdminAlbums /></AdminGuard>} />
            <Route path="/admin/files" element={<AdminGuard><AdminFiles /></AdminGuard>} />
            <Route path="/admin/settings" element={<AdminGuard><AdminSettings /></AdminGuard>} />
            <Route path="/admin/comments" element={<AdminGuard><AdminComments /></AdminGuard>} />
            <Route path="/admin/social-feeds" element={<AdminGuard><AdminSocialFeeds /></AdminGuard>} />
            <Route path="/admin/newsletter" element={<AdminGuard><AdminNewsletter /></AdminGuard>} />
            <Route path="/admin/users" element={<AdminGuard><AdminUsers /></AdminGuard>} />

            <Route path="*" element={<NotFound />} />
            </Routes>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeColorProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
