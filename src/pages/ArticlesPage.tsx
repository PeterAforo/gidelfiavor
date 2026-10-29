import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Users, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { useArticles, usePageSections } from "@/hooks/useCms";
import { resolveImageUrl } from "@/lib/api";
import SectionRenderer from "@/components/SectionRenderer";
import PageHeader from "@/components/PageHeader";
import PageLoader from "@/components/PageLoader";

const ArticlesPage = () => {
  // All hooks must be called unconditionally at the top
  const { data: pageSections = [], isLoading: sectionsLoading } = usePageSections("articles");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { data: articles = [], isLoading: articlesLoading } = useArticles(true);

  if (sectionsLoading || articlesLoading) return <PageLoader />;

  // Page Builder sections take priority over the default articles layout
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
        title="Articles"
        breadcrumbs={[
          { label: "Home", to: "/" },
          { label: "Articles" }
        ]}
      />
      <section className="py-16 md:py-20 bg-background">
        <div className="container mx-auto px-6" ref={ref}>
          {articles.length === 0 && (
            <p className="text-center text-muted-foreground font-body">No articles published yet.</p>
          )}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.05 }}
              >
                <Link to={`/articles/${article.id}`} className="group block">
                  {/* Image Container */}
                  <div className="relative overflow-hidden rounded-xl mb-4">
                    <div className="aspect-[4/3] bg-secondary">
                      {article.image_url ? (
                        <img
                          src={resolveImageUrl(article.image_url)}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-foreground/5 to-foreground/10 flex items-center justify-center">
                          <BookOpen size={48} className="text-foreground/20" />
                        </div>
                      )}
                    </div>
                    {/* Author and Category overlay */}
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      {article.author_name && (
                        <span className="px-2 py-1 bg-foreground/80 text-background text-xs font-body rounded flex items-center gap-1">
                          <Users size={10} /> {article.author_name}
                        </span>
                      )}
                      {article.category && (
                        <span className="px-2 py-1 bg-foreground/80 text-background text-xs font-body rounded">
                          {article.category}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Title */}
                  <h2 className="font-display font-bold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
                    {article.title}
                  </h2>
                  
                  {/* Read More */}
                  <span className="inline-flex items-center gap-1 text-sm font-body text-muted-foreground group-hover:text-primary transition-colors">
                    READ MORE <ArrowRight size={14} />
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default ArticlesPage;
