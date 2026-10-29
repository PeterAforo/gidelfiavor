import HeroSection from "@/components/HeroSection";
import { motion } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { useBooks, useTestimonials, useSiteContent, useArticles } from "@/hooks/useCms";
import { resolveImageUrl } from "@/lib/api";
import { Quote, ArrowRight, BookOpen, Users, Award, Heart } from "lucide-react";

// Parse a JSON list stored in site content; invalid or missing data renders nothing
const parseList = (json?: string): any[] => {
  try {
    const parsed = json ? JSON.parse(json) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

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
  const { data: content, isLoading: contentLoading, isError: contentError } = useSiteContent();
  const { data: books, isLoading: booksLoading, isError: booksError } = useBooks();
  const { data: testimonials, isLoading: testimonialsLoading, isError: testimonialsError } = useTestimonials();
  const { data: articles, isLoading: articlesLoading, isError: articlesError } = useArticles(true);
  
  // Only show loading if content is still loading (most important), others can load in background
  // Also consider errors as "loaded" to prevent infinite loading state
  const isLoading = contentLoading && !contentError;
  
  const aboutRef = useRef(null);
  const servicesRef = useRef(null);
  const booksRef = useRef(null);
  const testimonialsRef = useRef(null);

  // Note: Homepage always uses the custom HeroSection component for consistent design.
  // Page builder sections for "home" are ignored to preserve the designed layout.
  // To customize homepage content, use the Site Content admin panel instead.

  const displayBooks = books?.slice(0, 3) ?? [];
  const displayTestimonials = testimonials?.slice(0, 3) ?? [];
  const displayArticles = articles?.slice(0, 3) ?? [];
  const services = parseList(content?.services);
  const aboutCards = parseList(content?.about_cards);
  const stats = [
    { value: content?.stat_books, label: "Published Books" },
    { value: content?.stat_certification, label: "Certified" },
    { value: content?.stat_workshops, label: "Workshops & Seminars", accent: true },
    { value: content?.stat_lives, label: "Lives Transformed", accent: true },
  ].filter((s) => s.value);
  
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
      {(services.length > 0 || content?.years_experience || stats.length > 0) && (
      <section className="py-16 md:py-20" ref={servicesRef} style={{ backgroundColor: 'hsl(var(--stats-bg, var(--secondary)))' }}>
        <div className="container mx-auto px-6">
          {services.length > 0 && (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-8 md:mb-12"
              >
                <p className="font-body text-sm uppercase tracking-[0.2em] mb-3 font-semibold" style={{ color: 'hsl(var(--stats-accent, var(--primary)))' }}>What I Do</p>
                <h2 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold" style={{ color: 'hsl(var(--stats-foreground, var(--foreground)))' }}>Services & Expertise</h2>
              </motion.div>

              {/* Service Cards Row */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {services.map((service: any, i: number) => {
                  const IconComponent = iconMap[service.icon] || BookOpen;
                  return (
                    <motion.div
                      key={service.title}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.1 }}
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
            </>
          )}

          {/* Stats Grid */}
          <div className="grid lg:grid-cols-2 gap-4">
            {/* Left - Years of Experience */}
            {content?.years_experience && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="rounded-xl p-8"
                style={{ backgroundColor: 'hsl(var(--stats-card, var(--secondary)))' }}
              >
                <div className="flex items-center gap-6 mb-4">
                  <span className="font-display text-6xl md:text-7xl font-bold" style={{ color: 'hsl(var(--stats-accent, var(--primary)))' }}>{content.years_experience}</span>
                  <div>
                    <h3 className="font-display text-xl md:text-2xl font-bold" style={{ color: 'hsl(var(--stats-foreground, var(--foreground)))' }}>Years Of</h3>
                    <h3 className="font-display text-xl md:text-2xl font-bold" style={{ color: 'hsl(var(--stats-foreground, var(--foreground)))' }}>Experience</h3>
                  </div>
                </div>
                {content?.experience_description && (
                  <p className="text-sm font-body" style={{ color: 'hsl(var(--stats-muted, var(--muted-foreground)))' }}>
                    {content.experience_description}
                  </p>
                )}
              </motion.div>
            )}

            {/* Right - Stats Grid */}
            {stats.length > 0 && (
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.1 }}
                    transition={{ duration: 0.6, delay: 0.5 + i * 0.05 }}
                    className="rounded-xl p-6 text-center"
                    style={{
                      backgroundColor: 'hsl(var(--stats-card, var(--secondary)))',
                      ...(stat.accent && {
                        borderLeftWidth: '4px',
                        borderLeftStyle: 'solid',
                        borderLeftColor: 'hsl(var(--stats-accent, var(--primary)))'
                      })
                    }}
                  >
                    <p className="font-display text-3xl md:text-4xl font-bold mb-1" style={{ color: 'hsl(var(--stats-foreground, var(--foreground)))' }}>{stat.value}</p>
                    <p className="text-xs font-body" style={{ color: 'hsl(var(--stats-muted, var(--muted-foreground)))' }}>{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
      )}

      {/* About preview - numbered cards layout */}
      {(content?.about_heading || aboutCards.length > 0 || content?.about_portrait) && (
      <section className="py-16 md:py-20 bg-background" ref={aboutRef}>
        <div className="container mx-auto px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 md:mb-12"
          >
            {content?.about_label && (
              <p className="text-primary font-body text-sm uppercase tracking-[0.2em] mb-3 font-semibold">{content.about_label}</p>
            )}
            {content?.about_heading && (
              <h2 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4">
                {content.about_heading}
              </h2>
            )}
            {content?.about_subtitle && (
              <p className="text-muted-foreground font-body max-w-2xl mx-auto text-sm md:text-base">
                {content.about_subtitle}
              </p>
            )}
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left - Numbered Cards */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.8 }}
              className="space-y-4"
            >
              {aboutCards.map((item: any, i: number) => (
                <motion.div
                  key={item.num || i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ duration: 0.6, delay: 0.2 + i * 0.1 }}
                  className="bg-secondary rounded-xl p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex gap-4">
                    {item.num && <span className="text-primary font-display font-bold text-lg">{item.num}.</span>}
                    <div>
                      <h3 className="font-display font-bold text-foreground mb-2">{item.title}</h3>
                      <p className="text-sm text-muted-foreground font-body leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
              {content?.about_button_text && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  <Link to="/about" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-body font-semibold text-sm rounded-full hover:bg-primary/90 transition-colors mt-4">
                    {content.about_button_text} <ArrowRight size={16} />
                  </Link>
                </motion.div>
              )}
            </motion.div>

            {/* Right - Photo with decorative elements */}
            {content?.about_portrait && (
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.1 }}
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
                    src={resolveImageUrl(content.about_portrait)}
                    alt={content?.hero_title || ""}
                    className="relative w-full aspect-[4/5] object-cover rounded-full shadow-lg"
                    loading="lazy"
                  />
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>
      )}

      {/* Featured Book - large showcase with theme background */}
      {displayBooks.length > 0 && (
        <section className="py-16 md:py-20 bg-primary" ref={booksRef}>
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-20 items-center">
              {displayBooks[0].cover_url && (
                <div className="flex justify-center order-1 lg:order-1">
                  <img
                    src={resolveImageUrl(displayBooks[0].cover_url)}
                    alt={displayBooks[0].title}
                    className="w-48 md:w-64 lg:w-80 rounded-xl shadow-2xl"
                    loading="lazy"
                  />
                </div>
              )}
              <div className="order-2 lg:order-2 text-center lg:text-left">
                <p className="text-primary-foreground/80 font-body text-sm uppercase tracking-[0.2em] mb-3 font-semibold">Featured Book</p>
                <h2 className="text-primary-foreground font-display text-2xl md:text-3xl lg:text-4xl font-bold mb-4">{displayBooks[0].title}</h2>
                <p className="text-primary-foreground/70 font-body leading-relaxed mb-6 text-sm md:text-base">
                  {truncateText(displayBooks[0].description, 350)}
                </p>
                <Link to="/books" className="inline-flex items-center gap-2 px-6 py-3 bg-background text-primary font-body font-semibold text-sm rounded-full hover:bg-background/90 transition-colors">
                  Get the Book <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      {displayTestimonials.length > 0 && (
        <section className="py-16 md:py-20 bg-secondary" ref={testimonialsRef}>
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-8 md:mb-12"
            >
              <p className="text-primary font-body text-sm uppercase tracking-[0.2em] mb-3 font-semibold">Testimonials</p>
              <h2 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">What Readers Say</h2>
            </motion.div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {displayTestimonials.map((t, i) => (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="bg-background rounded-xl p-5 md:p-6 shadow-sm"
                >
                  <Quote className="text-primary mb-3 md:mb-4" size={20} />
                  <p className="font-body text-foreground/80 leading-relaxed mb-4 text-sm">"{t.quote}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-primary font-bold text-sm">{t.name.charAt(0)}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-display font-bold text-foreground text-sm truncate">{t.name}</p>
                      <p className="text-xs text-muted-foreground font-body truncate">{t.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Latest Articles */}
      {displayArticles.length > 0 && (
      <section className="py-16 md:py-20 bg-background">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-8 md:mb-12"
          >
            <p className="text-primary font-body text-sm uppercase tracking-[0.2em] mb-3 font-semibold">Blog and News</p>
            <h2 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">Latest Articles & Insights</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {displayArticles.map((article, i) => (
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
                    {/* Author and date overlay */}
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
      )}

    </>
  );
};

export default Index;
