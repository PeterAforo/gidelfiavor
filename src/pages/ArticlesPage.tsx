import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Users, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { useArticles, usePageSections } from "@/hooks/useCms";
import SectionRenderer from "@/components/SectionRenderer";
import PageHeader from "@/components/PageHeader";

const fallbackArticles = [
  { id: "1", title: "The Power of Faith in Healthcare Leadership", category: "Healthcare", image_url: "" },
  { id: "2", title: "Building Stronger Marriages Through Forgiveness", category: "Marriage", image_url: "" },
  { id: "3", title: "Celibacy and Purpose: A Modern Perspective", category: "Theology", image_url: "" },
  { id: "4", title: "Healthcare Marketing in the Digital Age", category: "Healthcare", image_url: "" },
  { id: "5", title: "The Role of Faith in Family Relationships", category: "Faith", image_url: "" },
  { id: "6", title: "Leadership Principles from Scripture", category: "Theology", image_url: "" },
];

const ArticlesPage = () => {
  // Try to load sections from backend Page Builder
  const { data: pageSections = [] } = usePageSections("articles");
  
  // If sections exist in backend, render them instead of hardcoded content
  if (pageSections.length > 0) {
    return (
      <main className="pt-20">
        <SectionRenderer sections={pageSections} />
      </main>
    );
  }

  // Fallback to original hardcoded content
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { data: articles } = useArticles(true);
  const displayArticles = articles && articles.length > 0 ? articles : fallbackArticles;

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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayArticles.map((article, index) => (
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
                          src={article.image_url}
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
                      <span className="px-2 py-1 bg-foreground/80 text-background text-xs font-body rounded flex items-center gap-1">
                        <Users size={10} /> Gidel Fiavor
                      </span>
                      <span className="px-2 py-1 bg-foreground/80 text-background text-xs font-body rounded">
                        {article.category}
                      </span>
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
