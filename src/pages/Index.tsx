import HeroSection from "@/components/HeroSection";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { useBooks, useTestimonials, useSiteContent, useArticles } from "@/hooks/useCms";
import { Quote, ArrowRight, BookOpen, Users, Award, Heart } from "lucide-react";
import authorPortrait from "@/assets/author-portrait.jpg";
import book1 from "@/assets/book-1.jpg";
import book2 from "@/assets/book-2.jpg";
import book3 from "@/assets/book-3.jpg";

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

const Index = () => {
  // All hooks must be called unconditionally at the top
  const { data: content, isLoading: contentLoading } = useSiteContent();
  const { data: books, isLoading: booksLoading } = useBooks();
  const { data: testimonials, isLoading: testimonialsLoading } = useTestimonials();
  const { data: articles, isLoading: articlesLoading } = useArticles(true);
  
  const isLoading = contentLoading || booksLoading || testimonialsLoading || articlesLoading;
  
  const aboutRef = useRef(null);
  const aboutInView = useInView(aboutRef, { once: true, margin: "-100px" });
  const servicesRef = useRef(null);
  const servicesInView = useInView(servicesRef, { once: true, margin: "-100px" });
  const booksRef = useRef(null);
  const booksInView = useInView(booksRef, { once: true, margin: "-100px" });
  const testimonialsRef = useRef(null);
  const testimonialsInView = useInView(testimonialsRef, { once: true, margin: "-100px" });

  // Note: Homepage always uses the custom HeroSection component for consistent design.
  // Page builder sections for "home" are ignored to preserve the designed layout.
  // To customize homepage content, use the Site Content admin panel instead.

  // Fallback to original hardcoded content
  const displayBooks = books && books.length > 0 ? books.slice(0, 3) : [];
  const displayTestimonials = testimonials && testimonials.length > 0 ? testimonials.slice(0, 3) : [];

  // Services from content or defaults
  const services = content?.services ? JSON.parse(content.services) : [
    { icon: "BookOpen", title: "Published Author", desc: "Author of books on healthcare, faith, and marriage" },
    { icon: "Users", title: "Marriage Counsellor", desc: "Guiding couples toward stronger relationships" },
    { icon: "Award", title: "Healthcare Marketing", desc: "27+ years advancing healthcare excellence" },
    { icon: "Heart", title: "Theologian", desc: "Faith-based transformation and ministry leadership" },
  ];
  
  const iconMap: Record<string, any> = { BookOpen, Users, Award, Heart };

  // Show loading skeleton while data is being fetched
  if (isLoading) {
    return (
      <>
        <HeroSection />
        <section className="py-20 bg-secondary">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <div className="h-4 w-24 bg-muted rounded mx-auto mb-3 animate-pulse"></div>
              <div className="h-8 w-64 bg-muted rounded mx-auto animate-pulse"></div>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-background rounded-xl p-6 animate-pulse">
                  <div className="w-12 h-12 bg-muted rounded-full mx-auto mb-4"></div>
                  <div className="h-5 w-32 bg-muted rounded mx-auto mb-2"></div>
                  <div className="h-3 w-48 bg-muted rounded mx-auto"></div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <HeroSection />

      {/* Services/What I Do */}
      <section className="py-20" ref={servicesRef} style={{ backgroundColor: 'hsl(var(--stats-bg, var(--secondary)))' }}>
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={servicesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <p className="font-body text-sm uppercase tracking-[0.2em] mb-3 font-semibold" style={{ color: 'hsl(var(--stats-accent, var(--primary)))' }}>What I Do</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold" style={{ color: 'hsl(var(--stats-foreground, var(--foreground)))' }}>Services & Expertise</h2>
          </motion.div>
          
          {/* Service Cards Row */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {services.map((service: any, i: number) => {
              const IconComponent = iconMap[service.icon] || BookOpen;
              return (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={servicesInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="rounded-xl p-6 text-center transition-colors"
                  style={{ 
                    backgroundColor: 'hsl(var(--stats-card, var(--secondary)))',
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    borderColor: 'hsl(var(--stats-border, var(--border)))'
                  }}
                >
                  <div className="w-12 h-12 mx-auto mb-4" style={{ color: 'hsl(var(--stats-accent, var(--primary)))' }}>
                    <IconComponent size={32} strokeWidth={1.5} />
                  </div>
                  <h3 className="font-display font-bold mb-1" style={{ color: 'hsl(var(--stats-foreground, var(--foreground)))' }}>{service.title}</h3>
                  <p className="text-xs font-body" style={{ color: 'hsl(var(--stats-muted, var(--muted-foreground)))' }}>{service.desc}</p>
                </motion.div>
              );
            })}
          </div>

          {/* Stats Grid */}
          <div className="grid lg:grid-cols-2 gap-4">
            {/* Left - Years of Experience */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={servicesInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="rounded-xl p-8"
              style={{ backgroundColor: 'hsl(var(--stats-card, var(--secondary)))' }}
            >
              <div className="flex items-center gap-6 mb-4">
                <span className="font-display text-6xl md:text-7xl font-bold" style={{ color: 'hsl(var(--stats-accent, var(--primary)))' }}>{content?.years_experience || "27"}</span>
                <div>
                  <h3 className="font-display text-xl md:text-2xl font-bold" style={{ color: 'hsl(var(--stats-foreground, var(--foreground)))' }}>Years Of</h3>
                  <h3 className="font-display text-xl md:text-2xl font-bold" style={{ color: 'hsl(var(--stats-foreground, var(--foreground)))' }}>Experience</h3>
                </div>
              </div>
              <p className="text-sm font-body" style={{ color: 'hsl(var(--stats-muted, var(--muted-foreground)))' }}>
                {content?.experience_description || "Healthcare marketing specialist, theologian, and author providing expert guidance to help people and institutions grow with purpose."}
              </p>
            </motion.div>

            {/* Right - Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={servicesInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="rounded-xl p-6 text-center"
                style={{ backgroundColor: 'hsl(var(--stats-card, var(--secondary)))' }}
              >
                <p className="font-display text-3xl md:text-4xl font-bold mb-1" style={{ color: 'hsl(var(--stats-foreground, var(--foreground)))' }}>{content?.stat_books || books?.length || "3"}</p>
                <p className="text-xs font-body" style={{ color: 'hsl(var(--stats-muted, var(--muted-foreground)))' }}>{content?.stat_books_label || "Published Books"}</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={servicesInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.55 }}
                className="rounded-xl p-6 text-center"
                style={{ backgroundColor: 'hsl(var(--stats-card, var(--secondary)))' }}
              >
                <p className="font-display text-3xl md:text-4xl font-bold mb-1" style={{ color: 'hsl(var(--stats-foreground, var(--foreground)))' }}>{content?.stat_certification || "Harvard"}</p>
                <p className="text-xs font-body" style={{ color: 'hsl(var(--stats-muted, var(--muted-foreground)))' }}>{content?.stat_certification_label || "Certified"}</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={servicesInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="rounded-xl p-6 text-center"
                style={{ 
                  backgroundColor: 'hsl(var(--stats-card, var(--secondary)))',
                  borderLeftWidth: '4px',
                  borderLeftStyle: 'solid',
                  borderLeftColor: 'hsl(var(--stats-accent, var(--primary)))'
                }}
              >
                <p className="font-display text-3xl md:text-4xl font-bold mb-1" style={{ color: 'hsl(var(--stats-foreground, var(--foreground)))' }}>{content?.stat_workshops || "200+"}</p>
                <p className="text-xs font-body" style={{ color: 'hsl(var(--stats-muted, var(--muted-foreground)))' }}>{content?.stat_workshops_label || "Workshops & Seminars"}</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={servicesInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.65 }}
                className="rounded-xl p-6 text-center"
                style={{ 
                  backgroundColor: 'hsl(var(--stats-card, var(--secondary)))',
                  borderLeftWidth: '4px',
                  borderLeftStyle: 'solid',
                  borderLeftColor: 'hsl(var(--stats-accent, var(--primary)))'
                }}
              >
                <p className="font-display text-3xl md:text-4xl font-bold mb-1" style={{ color: 'hsl(var(--stats-foreground, var(--foreground)))' }}>{content?.stat_lives || "1,000+"}</p>
                <p className="text-xs font-body" style={{ color: 'hsl(var(--stats-muted, var(--muted-foreground)))' }}>{content?.stat_lives_label || "Lives Transformed"}</p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* About preview - numbered cards layout */}
      <section className="py-20 bg-background" ref={aboutRef}>
        <div className="container mx-auto px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={aboutInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <p className="text-primary font-body text-sm uppercase tracking-[0.2em] mb-3 font-semibold">{content?.about_label || "About Me"}</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              {content?.about_heading || "Inspiring Excellence in Healthcare, Faith & Family"}
            </h2>
            <p className="text-muted-foreground font-body max-w-2xl mx-auto">
              {content?.about_subtitle || "Helping people and institutions grow with purpose through wisdom, integrity, and divine purpose."}
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left - Numbered Cards */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={aboutInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="space-y-4"
            >
              {(content?.about_cards ? JSON.parse(content.about_cards) : [
                {
                  num: "01",
                  title: "Healthcare Marketing Specialist",
                  desc: "As an Associate Member of the Chartered Institute of Marketing, Ghana (ACIMG), dedicated to advancing healthcare excellence and leadership."
                },
                {
                  num: "02",
                  title: "Theologian & Marriage Counsellor",
                  desc: "Guiding individuals and couples toward healing, faith-based transformation, and stronger relationships through compassionate counseling."
                },
                {
                  num: "03",
                  title: "Published Author",
                  desc: "Author of books on healthcare policies, faith, and marriage including 'The Hearts of Men and the Will of God' and 'The Unreasonable Vision of Forgiveness in Marriage'."
                }
              ]).map((item: any, i: number) => (
                <motion.div
                  key={item.num}
                  initial={{ opacity: 0, y: 20 }}
                  animate={aboutInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.2 + i * 0.1 }}
                  className="bg-secondary rounded-xl p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex gap-4">
                    <span className="text-primary font-display font-bold text-lg">{item.num}.</span>
                    <div>
                      <h3 className="font-display font-bold text-foreground mb-2">{item.title}</h3>
                      <p className="text-sm text-muted-foreground font-body leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={aboutInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <Link to="/about" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-body font-semibold text-sm rounded-full hover:bg-primary/90 transition-colors mt-4">
                  {content?.about_button_text || "Learn More About Me"} <ArrowRight size={16} />
                </Link>
              </motion.div>
            </motion.div>

            {/* Right - Photo with decorative elements */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={aboutInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative max-w-md mx-auto">
                {/* Decorative circle outline */}
                <div className="absolute -top-6 -right-6 w-24 h-24 border-2 border-primary/20 rounded-full" />
                <div className="absolute top-1/2 -right-4 w-8 h-8 border-2 border-primary/30 rounded-full" />
                {/* Decorative coral accent */}
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-primary/20 rounded-full" />
                
                <img
                  src={content?.about_portrait || authorPortrait}
                  alt="Gidel Kwasi Fiavor"
                  className="relative w-full aspect-[4/5] object-cover rounded-full shadow-lg"
                  loading="lazy"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Book - large showcase with theme background */}
      {displayBooks.length > 0 && (
        <section className="py-20" ref={booksRef} style={{ backgroundColor: 'hsl(var(--stats-bg, var(--secondary)))' }}>
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div className="flex justify-center">
                <img
                  src={displayBooks[0].cover_url || fallbackCovers[0]}
                  alt={displayBooks[0].title}
                  className="w-64 md:w-80 lg:w-96 rounded-xl shadow-2xl"
                  loading="lazy"
                />
              </div>
              <div>
                <p className="text-white/80 font-body text-sm uppercase tracking-[0.2em] mb-3 font-semibold">Featured Book</p>
                <h2 className="text-white font-display text-3xl md:text-4xl font-bold mb-4">{displayBooks[0].title}</h2>
                <p className="text-white/70 font-body leading-relaxed mb-6">
                  {truncateText(displayBooks[0].description, 350) || "A comprehensive guide providing departmental policies and frameworks for healthcare institutions striving for world-class standards and excellence."}
                </p>
                <Link to="/books" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary font-body font-semibold text-sm rounded-full hover:bg-white/90 transition-colors">
                  Get the Book <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      {displayTestimonials.length > 0 && (
        <section className="py-20 bg-secondary" ref={testimonialsRef}>
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={testimonialsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <p className="text-primary font-body text-sm uppercase tracking-[0.2em] mb-3 font-semibold">Testimonials</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">What Readers Say</h2>
            </motion.div>
            <div className="grid md:grid-cols-3 gap-6">
              {displayTestimonials.map((t, i) => (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={testimonialsInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="bg-background rounded-xl p-6 shadow-sm"
                >
                  <Quote className="text-primary mb-4" size={24} />
                  <p className="font-body text-foreground/80 leading-relaxed mb-4 text-sm">"{t.quote}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-primary font-bold text-sm">{t.name.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="font-display font-bold text-foreground text-sm">{t.name}</p>
                      <p className="text-xs text-muted-foreground font-body">{t.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Latest Articles */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-primary font-body text-sm uppercase tracking-[0.2em] mb-3 font-semibold">Blog and News</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">Latest Articles & Insights</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {(articles && articles.length > 0 ? articles.slice(0, 3) : [
              { id: "1", title: "The Power of Faith in Healthcare Leadership", excerpt: "Exploring how faith-based principles can transform healthcare management and patient care.", category: "Healthcare", created_at: new Date().toISOString(), image_url: "" },
              { id: "2", title: "Building Stronger Marriages Through Forgiveness", excerpt: "Understanding the unreasonable vision of forgiveness and its role in lasting relationships.", category: "Marriage", created_at: new Date().toISOString(), image_url: "" },
              { id: "3", title: "Celibacy and Purpose: A Modern Perspective", excerpt: "Examining celibacy as a worthy calling in today's world from theological and cultural viewpoints.", category: "Theology", created_at: new Date().toISOString(), image_url: "" },
            ]).map((article, i) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <Link to={`/articles/${article.id}`} className="group block">
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
                    {/* Author and date overlay */}
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span className="px-2 py-1 bg-foreground/80 text-background text-xs font-body rounded flex items-center gap-1">
                        <Users size={10} /> Gidel Fiavor
                      </span>
                      <span className="px-2 py-1 bg-foreground/80 text-background text-xs font-body rounded">
                        {article.category}
                      </span>
                    </div>
                  </div>
                  <h3 className="font-display font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-sm text-muted-foreground font-body mb-3 line-clamp-2">
                    {article.excerpt}
                  </p>
                  <span className="inline-flex items-center gap-1 text-sm font-body text-foreground/60 group-hover:text-primary transition-colors">
                    READ MORE <ArrowRight size={14} />
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/articles" className="inline-flex items-center gap-2 px-6 py-3 border border-border text-foreground font-body font-semibold text-sm rounded-full hover:bg-secondary transition-colors">
              View All Articles <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

    </>
  );
};

export default Index;
