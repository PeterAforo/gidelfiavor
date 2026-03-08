import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useBooks, usePageSections } from "@/hooks/useCms";
import SectionRenderer from "@/components/SectionRenderer";
import { ArrowRight } from "lucide-react";
import book1 from "@/assets/book-1.jpg";
import book2 from "@/assets/book-2.jpg";
import book3 from "@/assets/book-3.jpg";
import PageHeader from "@/components/PageHeader";

const fallbackBooks = [
  { id: "1", title: "Comprehensive Departmental Policies for World-Class Healthcare Institutions", year: "2024", description: "A comprehensive guide providing departmental policies and frameworks for healthcare institutions striving for world-class standards and excellence in patient care and administration.", cover_url: "", tags: ["Healthcare", "Leadership"], sort_order: 0 },
  { id: "2", title: "The Hearts of Men and the Will of God", year: "2023", description: "An exploration of celibacy, singleness, marriage, and faith from both Christian and African cultural perspectives. Topics include living a single life with purpose and celibacy as a worthy calling.", cover_url: "", tags: ["Theology", "Faith"], sort_order: 1 },
  { id: "3", title: "The Unreasonable Vision of Forgiveness in Marriage", year: "2022", description: "A profound exploration of forgiveness as a cornerstone of successful marriages, offering practical wisdom for couples seeking to strengthen their relationships through faith.", cover_url: "", tags: ["Marriage", "Relationships"], sort_order: 2 },
];
const fallbackCovers = [book1, book2, book3];

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
  const { data: pageSections = [] } = usePageSections("books");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { data: books } = useBooks();
  
  // If sections exist in backend, render them instead of hardcoded content
  if (pageSections.length > 0) {
    return (
      <main className="pt-20">
        <SectionRenderer sections={pageSections} />
      </main>
    );
  }

  // Fallback to original hardcoded content
  const displayBooks = books && books.length > 0 ? books : fallbackBooks;

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

          <div className="space-y-16">
            {displayBooks.map((book, index) => (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center"
              >
                <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                  <div className="flex justify-center">
                    <img
                      src={book.cover_url || fallbackCovers[index] || fallbackCovers[0]}
                      alt={`Book cover: ${book.title}`}
                      className="w-64 md:w-80 lg:w-96 rounded-xl shadow-2xl"
                      loading="lazy"
                    />
                  </div>
                </div>
                <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                  <p className="text-primary font-body text-sm mb-2 font-semibold">{book.year}</p>
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
                  <a href="#" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-body font-semibold text-sm rounded-full hover:bg-primary/90 transition-colors">
                    Get the Book <ArrowRight size={16} />
                  </a>
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
