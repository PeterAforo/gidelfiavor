import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useBooks, usePageSections } from "@/hooks/useCms";
import SectionRenderer from "@/components/SectionRenderer";
import { ArrowRight } from "lucide-react";
import { resolveImageUrl } from "@/lib/api";
import PageHeader from "@/components/PageHeader";
import PageLoader from "@/components/PageLoader";

// Helper function to strip HTML tags from text
const stripHtml = (html: string) => {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
};

// Helper function to truncate text
const truncateText = (text: string, maxLength: number = 300) => {
  const stripped = stripHtml(text);
  if (stripped.length <= maxLength) return stripped;
  return stripped.substring(0, maxLength).trim() + '...';
};

const BooksPage = () => {
  // All hooks must be called unconditionally at the top
  const { data: pageSections = [], isLoading: sectionsLoading } = usePageSections("books");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { data: books = [], isLoading: booksLoading } = useBooks();

  if (sectionsLoading || booksLoading) return <PageLoader />;

  // Page Builder sections take priority over the default books layout
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
        title="Books"
        breadcrumbs={[
          { label: "Home", to: "/" },
          { label: "Books" }
        ]}
      />
      <section className="py-16 md:py-20 bg-background">
        <div className="container mx-auto px-6" ref={ref}>

          {books.length === 0 && (
            <p className="text-center text-muted-foreground font-body">No books published yet.</p>
          )}
          <div className="space-y-16">
            {books.map((book, index) => (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center"
              >
                {book.cover_url && (
                  <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                    <div className="flex justify-center">
                      <img
                        src={resolveImageUrl(book.cover_url)}
                        alt={`Book cover: ${book.title}`}
                        className="w-64 md:w-80 lg:w-96 rounded-xl shadow-2xl"
                        loading="lazy"
                      />
                    </div>
                  </div>
                )}
                <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                  {book.year && <p className="text-primary font-body text-sm mb-2 font-semibold">{book.year}</p>}
                  <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
                    {book.title}
                  </h2>
                  <p className="text-muted-foreground font-body leading-relaxed mb-5">
                    {truncateText(book.description, 350)}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {book.tags?.map((tag) => (
                      <span key={tag} className="px-3 py-1 text-xs font-body bg-secondary text-foreground/70 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                  {book.purchase_link && (
                    <a href={book.purchase_link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-body font-semibold text-sm rounded-full hover:bg-primary/90 transition-colors">
                      Get the Book <ArrowRight size={16} />
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default BooksPage;
