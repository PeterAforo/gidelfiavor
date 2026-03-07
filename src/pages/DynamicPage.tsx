import { useParams } from "react-router-dom";
import { usePageSections } from "@/hooks/useCms";
import { useQuery } from "@tanstack/react-query";
import { pagesApi } from "@/lib/api";
import SectionRenderer from "@/components/SectionRenderer";
import PageHeader from "@/components/PageHeader";
import NotFound from "./NotFound";
import { Loader2 } from "lucide-react";

const DynamicPage = () => {
  const { slug } = useParams<{ slug: string }>();
  
  // Fetch the page by slug
  const { data: page, isLoading: pageLoading, error: pageError } = useQuery({
    queryKey: ["page", slug],
    queryFn: () => pagesApi.getBySlug(slug || ""),
    enabled: !!slug,
  });

  // Fetch page sections
  const { data: sections = [], isLoading: sectionsLoading } = usePageSections(slug || "");

  const isLoading = pageLoading || sectionsLoading;

  if (isLoading) {
    return (
      <main className="pt-20 min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </main>
    );
  }

  // If page doesn't exist, show 404
  if (pageError || !page) {
    return <NotFound />;
  }

  return (
    <main className="pt-20 min-h-screen bg-background">
      <PageHeader
        title={page.title}
        breadcrumbs={[
          { label: "Home", to: "/" },
          { label: page.title }
        ]}
      />
      
      {sections.length > 0 ? (
        <SectionRenderer sections={sections} />
      ) : (
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-6">
            {page.content ? (
              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: page.content }}
              />
            ) : (
              <div className="text-center text-muted-foreground">
                <p>This page has no content yet.</p>
                <p className="text-sm mt-2">Add sections in the admin panel to build this page.</p>
              </div>
            )}
          </div>
        </section>
      )}
    </main>
  );
};

export default DynamicPage;
