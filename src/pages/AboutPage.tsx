import { useSiteContent, usePageSections } from "@/hooks/useCms";
import { resolveImageUrl } from "@/lib/api";
import SectionRenderer from "@/components/SectionRenderer";
import PageHeader from "@/components/PageHeader";
import PageLoader from "@/components/PageLoader";

const AboutPage = () => {
  const { data: pageSections = [], isLoading: sectionsLoading } = usePageSections("about");
  const { data: content, isLoading: contentLoading } = useSiteContent();

  if (sectionsLoading || contentLoading) return <PageLoader />;

  // Page Builder sections are the primary source for this page
  if (pageSections.length > 0) {
    return (
      <main className="pt-20">
        <SectionRenderer sections={pageSections} />
      </main>
    );
  }

  return (
    <main className="pt-20">
      <PageHeader
        title="About Me"
        breadcrumbs={[
          { label: "Home", to: "/" },
          { label: "About Me" }
        ]}
      />
      {(content?.about_portrait || content?.about_bio) && (
        <section className="py-16 bg-background">
          <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
            {content?.about_portrait && (
              <img
                src={resolveImageUrl(content.about_portrait)}
                alt={content?.hero_title || ""}
                className="w-full max-w-md mx-auto aspect-[4/5] object-cover shadow-lg"
              />
            )}
            <div>
              {content?.about_heading && (
                <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-6">{content.about_heading}</h2>
              )}
              {content?.about_bio && (
                <p className="text-muted-foreground font-body leading-relaxed whitespace-pre-line">{content.about_bio}</p>
              )}
            </div>
          </div>
        </section>
      )}
    </main>
  );
};

export default AboutPage;
