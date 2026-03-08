/**
 * SectionRenderer - Renders Page Builder sections on the frontend
 * This component takes sections from the backend and renders them with proper styling
 */

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useBooks, useArticles, useTestimonials, useGalleryImages } from "@/hooks/useCms";
import { getApiBaseUrl } from "@/lib/api";
import { ArrowRight, Quote, BookOpen, Users, Award, Heart, MapPin, Mail, Phone, Star, GraduationCap, Briefcase } from "lucide-react";

// Icon mapping for dynamic icon rendering
const iconMap: Record<string, any> = {
  BookOpen, Users, Award, Heart, MapPin, Mail, Phone, Star, GraduationCap, Briefcase, ArrowRight, Quote
};

interface Section {
  id: number;
  section_type: string;
  title: string;
  content: any;
  settings: any;
  sort_order: number;
}

interface SectionRendererProps {
  sections: Section[];
}

// Helper to get section style from settings
const getSectionStyle = (settings: any) => {
  const style: React.CSSProperties = {};
  if (settings?.backgroundColor) {
    style.backgroundColor = settings.backgroundColor;
  }
  if (settings?.textColor) {
    style.color = settings.textColor;
  }
  return style;
};

// Section wrapper that applies custom colors
const SectionWrapper = ({ section, children, className = "" }: { section: Section; children: React.ReactNode; className?: string }) => {
  const style = getSectionStyle(section.settings);
  const hasCustomStyle = section.settings?.backgroundColor || section.settings?.textColor;
  
  if (!hasCustomStyle) {
    return <>{children}</>;
  }
  
  return (
    <div style={style} className={className}>
      {children}
    </div>
  );
};

// Hero Section
const HeroSection = ({ section }: { section: Section }) => {
  const { content, settings } = section;
  const isCompact = settings?.compact;
  const backgroundImage = content?.backgroundImage || settings?.backgroundImage;

  if (isCompact) {
    return (
      <section 
        className={`relative py-20 ${backgroundImage ? 'min-h-[40vh] flex items-center' : 'bg-secondary'}`}
        style={backgroundImage ? { 
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        } : undefined}
      >
        {backgroundImage && <div className="absolute inset-0 bg-black/60" />}
        <div className={`container mx-auto px-6 text-center ${backgroundImage ? 'relative z-10' : ''}`}>
          <h1 className={`font-display text-4xl md:text-5xl font-bold mb-4 ${backgroundImage ? 'text-white' : 'text-foreground'}`}>
            {content?.heading}
          </h1>
          {content?.subheading && (
            <p className={`text-lg font-body max-w-2xl mx-auto ${backgroundImage ? 'text-white/90' : 'text-muted-foreground'}`}>
              {content.subheading}
            </p>
          )}
        </div>
      </section>
    );
  }

  return (
    <section 
      className="relative min-h-[70vh] flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: content?.backgroundImage ? `url(${content.backgroundImage})` : undefined }}
    >
      {content?.backgroundImage && <div className="absolute inset-0 bg-black/50" />}
      <div className="relative container mx-auto px-6 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className={`font-display text-4xl md:text-6xl font-bold mb-4 ${content?.backgroundImage ? 'text-white' : 'text-foreground'}`}
        >
          {content?.heading}
        </motion.h1>
        {content?.subheading && (
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className={`text-lg md:text-xl font-body max-w-3xl mx-auto mb-8 ${content?.backgroundImage ? 'text-white/90' : 'text-muted-foreground'}`}
          >
            {content.subheading}
          </motion.p>
        )}
        {content?.buttonText && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link 
              to={content.buttonLink || "#"} 
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-body font-semibold text-sm rounded-full hover:bg-primary/90 transition-colors"
            >
              {content.buttonText} <ArrowRight size={16} />
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
};

// Features Grid Section
const FeaturesSection = ({ section }: { section: Section }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { content, settings } = section;
  const items = content?.items || [];
  const columns = settings?.columns || 4;

  return (
    <section className="py-20 bg-secondary" ref={ref}>
      <div className="container mx-auto px-6">
        {content?.heading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            {content?.subtitle && (
              <p className="text-primary font-body text-sm uppercase tracking-[0.2em] mb-3 font-semibold">
                {content.subtitle}
              </p>
            )}
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              {content.heading}
            </h2>
          </motion.div>
        )}
        
        <div className={`grid sm:grid-cols-2 lg:grid-cols-${columns} gap-4`}>
          {items.map((item: any, i: number) => {
            const IconComponent = iconMap[item.icon] || Star;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="bg-secondary rounded-xl p-6 text-center border border-border hover:border-primary/30 transition-colors"
              >
                <div className="w-12 h-12 mx-auto mb-4 text-primary">
                  <IconComponent size={32} strokeWidth={1.5} />
                </div>
                <h3 className="font-display font-bold text-foreground mb-1">{item.title}</h3>
                <p className="text-xs text-muted-foreground font-body">{item.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// Text + Image Section
const TextSection = ({ section }: { section: Section }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { content, settings } = section;
  const imagePosition = settings?.imagePosition || "right";
  const columnLayout = settings?.columnLayout || "50-50";
  const imageDisplay = settings?.imageDisplay || "single";
  const hasImage = content?.image && imagePosition !== "none";
  
  // Get all images (primary + additional)
  const allImages = content?.image 
    ? [content.image, ...(content?.additionalImages || [])]
    : (content?.additionalImages || []);
  
  // Calculate grid column classes based on layout
  const getGridClasses = () => {
    if (!hasImage || columnLayout === "100") return "";
    
    const layoutMap: Record<string, string> = {
      "50-50": "lg:grid-cols-2",
      "60-40": "lg:grid-cols-[3fr_2fr]",
      "40-60": "lg:grid-cols-[2fr_3fr]",
      "70-30": "lg:grid-cols-[7fr_3fr]",
      "30-70": "lg:grid-cols-[3fr_7fr]",
      "75-25": "lg:grid-cols-[3fr_1fr]",
      "25-75": "lg:grid-cols-[1fr_3fr]",
    };
    return layoutMap[columnLayout] || "lg:grid-cols-2";
  };
  
  // Render images based on display mode
  const renderImages = () => {
    if (allImages.length === 0) return null;
    
    switch (imageDisplay) {
      case "stacked":
        return (
          <div className="space-y-4">
            {allImages.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`${section.title} ${idx + 1}`}
                className="w-full object-cover shadow-lg transition-all duration-700 hover:scale-[1.02] hover:shadow-2xl"
                loading="lazy"
              />
            ))}
          </div>
        );
      case "grid":
        return (
          <div className="grid grid-cols-2 gap-4">
            {allImages.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`${section.title} ${idx + 1}`}
                className="w-full aspect-square object-cover shadow-lg transition-all duration-700 hover:scale-[1.02] hover:shadow-2xl"
                loading="lazy"
              />
            ))}
          </div>
        );
      case "carousel":
        return (
          <div className="relative overflow-hidden">
            <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4">
              {allImages.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`${section.title} ${idx + 1}`}
                  className="w-full flex-shrink-0 snap-center object-cover shadow-lg"
                  loading="lazy"
                />
              ))}
            </div>
          </div>
        );
      default: // single
        return (
          <img
            src={allImages[0]}
            alt={section.title}
            className="w-full aspect-[4/5] object-cover shadow-lg transition-all duration-700 hover:scale-[1.02] hover:shadow-2xl filter hover:brightness-105"
            loading="lazy"
          />
        );
    }
  };

  return (
    <section className="py-20 bg-background" ref={ref}>
      <div className="container mx-auto px-6">
        {(content?.subtitle || section.title) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            {content?.subtitle && (
              <p className="text-primary font-body text-sm uppercase tracking-[0.2em] mb-3 font-semibold">
                {content.subtitle}
              </p>
            )}
            {section.title && (
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                {section.title}
              </h2>
            )}
          </motion.div>
        )}

        <div className={`grid ${hasImage ? `${getGridClasses()} gap-12 lg:gap-16 items-center` : ''} ${columnLayout === "100" ? 'space-y-8' : ''}`}>
          {hasImage && imagePosition === "left" && (
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="overflow-hidden"
            >
              {renderImages()}
            </motion.div>
          )}
          
          <motion.div
            initial={{ opacity: 0, x: hasImage ? (imagePosition === "left" ? 40 : -40) : 0, y: hasImage ? 0 : 20 }}
            animate={isInView ? { opacity: 1, x: 0, y: 0 } : {}}
            transition={{ duration: 0.8, delay: hasImage ? 0.2 : 0 }}
          >
            <div 
              className="max-w-none font-body text-muted-foreground leading-relaxed space-y-4 [&>p]:mb-4 [&>h1]:text-3xl [&>h1]:font-bold [&>h1]:text-foreground [&>h1]:mb-4 [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:text-foreground [&>h2]:mb-3 [&>h3]:text-xl [&>h3]:font-bold [&>h3]:text-foreground [&>h3]:mb-2 [&>h4]:text-lg [&>h4]:font-semibold [&>h4]:text-foreground [&>h4]:mb-2 [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:space-y-2 [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:space-y-2 [&>blockquote]:border-l-4 [&>blockquote]:border-primary [&>blockquote]:pl-4 [&>blockquote]:italic [&>a]:text-primary [&>a]:underline [&>strong]:font-semibold [&>strong]:text-foreground"
              dangerouslySetInnerHTML={{ __html: content?.html || "" }}
            />
            {content?.buttonText && (
              <Link 
                to={content.buttonLink || "#"} 
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-body font-semibold text-sm rounded-full hover:bg-primary/90 transition-colors mt-6"
              >
                {content.buttonText} <ArrowRight size={16} />
              </Link>
            )}
          </motion.div>

          {hasImage && imagePosition === "right" && (
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="overflow-hidden"
            >
              {renderImages()}
            </motion.div>
          )}
          
          {/* For stacked layout (100% width), show images below content */}
          {hasImage && columnLayout === "100" && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="overflow-hidden"
            >
              {renderImages()}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

// Gallery Section (Books, Articles, Custom Items)
const GallerySection = ({ section }: { section: Section }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { content, settings } = section;
  const dataSource = settings?.dataSource || "custom";
  const layout = settings?.layout || "grid";
  const maxItems = settings?.maxItems || 6;

  // Fetch data based on source
  const { data: books } = useBooks();
  const { data: articles } = useArticles(true);
  const { data: galleryImages } = useGalleryImages();

  let items: any[] = [];
  
  if (dataSource === "books" && books) {
    items = books.slice(0, maxItems).map((b: any) => ({
      image: b.cover_url,
      title: b.title,
      description: b.year,
      link: `/books`
    }));
  } else if (dataSource === "articles" && articles) {
    items = articles.slice(0, maxItems).map((a: any) => ({
      image: a.image_url,
      title: a.title,
      description: a.excerpt,
      link: `/articles/${a.id}`
    }));
  } else if (dataSource === "gallery" && galleryImages) {
    items = galleryImages.slice(0, maxItems).map((g: any) => ({
      image: g.image_url,
      title: g.caption || "",
      description: ""
    }));
  } else {
    items = content?.items || [];
  }

  return (
    <section className={`py-20 ${dataSource === "books" ? "bg-foreground" : "bg-background"}`} ref={ref}>
      <div className="container mx-auto px-6">
        {content?.heading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            {content?.subtitle && (
              <p className="text-primary font-body text-sm uppercase tracking-[0.2em] mb-3 font-semibold">
                {content.subtitle}
              </p>
            )}
            <h2 className={`font-display text-3xl md:text-4xl font-bold ${dataSource === "books" ? "text-background" : "text-foreground"}`}>
              {content.heading}
            </h2>
          </motion.div>
        )}

        {layout === "grid" && (
          <div className="grid md:grid-cols-3 gap-8">
            {items.map((item: any, i: number) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="group"
              >
                {item.link ? (
                  <Link to={item.link} className="block">
                    <GalleryCard item={item} isDark={dataSource === "books"} />
                  </Link>
                ) : (
                  <GalleryCard item={item} isDark={dataSource === "books"} />
                )}
              </motion.div>
            ))}
          </div>
        )}

        {layout === "alternating" && (
          <div className="space-y-16">
            {items.map((item: any, i: number) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center"
              >
                <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                  <div className="flex justify-center">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-48 md:w-56 shadow-2xl transition-all duration-500 hover:scale-105 hover:shadow-3xl filter hover:brightness-110"
                        loading="lazy"
                      />
                    )}
                  </div>
                </div>
                <div className={i % 2 === 1 ? "lg:order-1" : ""}>
                  <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground font-body leading-relaxed mb-5">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

const GalleryCard = ({ item, isDark }: { item: any; isDark?: boolean }) => (
  <div className={`${isDark ? "bg-muted/10 hover:bg-muted/20" : "bg-secondary"} rounded-xl p-6 transition-colors`}>
    {item.image && (
      <img
        src={item.image}
        alt={item.title}
        className="w-32 mx-auto shadow-2xl mb-6 group-hover:scale-110 group-hover:shadow-3xl transition-all duration-500 filter group-hover:brightness-110"
        loading="lazy"
      />
    )}
    <h3 className={`font-display text-lg font-bold mb-1 text-center ${isDark ? "text-background" : "text-foreground"}`}>
      {item.title}
    </h3>
    {item.description && (
      <p className={`text-sm font-body text-center ${isDark ? "text-background/60" : "text-muted-foreground"}`}>
        {item.description}
      </p>
    )}
  </div>
);

// Testimonials Section
const TestimonialsSection = ({ section }: { section: Section }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { content, settings } = section;
  const maxItems = settings?.maxItems || 3;
  
  const { data: testimonials } = useTestimonials();
  const displayTestimonials = testimonials?.slice(0, maxItems) || [];

  if (displayTestimonials.length === 0) return null;

  return (
    <section className="py-20 bg-secondary" ref={ref}>
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          {content?.subtitle && (
            <p className="text-primary font-body text-sm uppercase tracking-[0.2em] mb-3 font-semibold">
              {content.subtitle}
            </p>
          )}
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            {content?.heading || "What Readers Say"}
          </h2>
        </motion.div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {displayTestimonials.map((t: any, i: number) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
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
  );
};

// CTA Section
const CTASection = ({ section }: { section: Section }) => {
  const { content } = section;

  return (
    <section className="py-20 bg-primary">
      <div className="container mx-auto px-6 text-center">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
          {content?.heading}
        </h2>
        {content?.description && (
          <p className="text-primary-foreground/80 font-body max-w-2xl mx-auto mb-8">
            {content.description}
          </p>
        )}
        {content?.buttonText && (
          <Link 
            to={content.buttonLink || "/contact"} 
            className="inline-flex items-center gap-2 px-6 py-3 bg-background text-foreground font-body font-semibold text-sm rounded-full hover:bg-background/90 transition-colors"
          >
            {content.buttonText} <ArrowRight size={16} />
          </Link>
        )}
      </div>
    </section>
  );
};

// Contact Section
const ContactSection = ({ section }: { section: Section }) => {
  const { content, settings } = section;

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            {content?.heading || "Get in Touch"}
          </h2>
          {content?.description && (
            <p className="text-muted-foreground font-body max-w-2xl mx-auto">
              {content.description}
            </p>
          )}
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="bg-secondary rounded-2xl p-8 md:p-12">
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Subject</label>
                <input
                  type="text"
                  name="subject"
                  className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Message</label>
                <textarea
                  name="message"
                  rows={5}
                  required
                  className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full px-6 py-3 bg-primary text-primary-foreground font-body font-semibold rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
              >
                {content?.buttonText || "Send Message"} <ArrowRight size={16} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

// Video Section
const VideoSection = ({ section }: { section: Section }) => {
  const { content } = section;
  
  // Extract YouTube video ID
  const getYouTubeId = (url: string) => {
    const match = url?.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/);
    return match ? match[1] : null;
  };
  
  const videoId = getYouTubeId(content?.videoUrl || "");

  if (!videoId) return null;

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        {content?.title && (
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground text-center mb-8">
            {content.title}
          </h2>
        )}
        <div className="max-w-4xl mx-auto">
          <div className="aspect-video rounded-xl overflow-hidden shadow-lg">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              title={content?.title || "Video"}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </section>
  );
};

// Spacer Section
const SpacerSection = ({ section }: { section: Section }) => {
  const height = section.settings?.height || 50;
  return <div style={{ height: `${height}px` }} />;
};

// HTML Section
const HTMLSection = ({ section }: { section: Section }) => {
  return (
    <section className="py-10">
      <div 
        className="container mx-auto px-6 font-body text-muted-foreground leading-relaxed [&>p]:mb-4 [&>h1]:text-3xl [&>h1]:font-bold [&>h1]:text-foreground [&>h1]:mb-4 [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:text-foreground [&>h2]:mb-3 [&>h3]:text-xl [&>h3]:font-bold [&>h3]:text-foreground [&>h3]:mb-2 [&>h4]:text-lg [&>h4]:font-semibold [&>h4]:text-foreground [&>h4]:mb-2 [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:space-y-2 [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:space-y-2 [&>blockquote]:border-l-4 [&>blockquote]:border-primary [&>blockquote]:pl-4 [&>blockquote]:italic [&>a]:text-primary [&>a]:underline [&>strong]:font-semibold [&>strong]:text-foreground"
        dangerouslySetInnerHTML={{ __html: section.content?.html || "" }}
      />
    </section>
  );
};

// Social Feed Section
const SocialFeedSection = ({ section }: { section: Section }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { settings } = section;
  const postsCount = settings?.postsCount || 6;
  const layout = settings?.layout || "grid";
  const platform = settings?.platform || "all";
  const mediaType = settings?.mediaType || "all";

  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter posts by media type
  const filterByMediaType = (posts: any[]) => {
    if (mediaType === "all") return posts;
    
    return posts.filter(post => {
      const hasImage = post.media_url && !post.video_url;
      const hasVideo = post.video_url || (post.media_url && post.media_type === 'video');
      const isTextOnly = !post.media_url && !post.video_url;
      
      switch (mediaType) {
        case "images":
          return hasImage;
        case "videos":
          return hasVideo;
        case "text":
          return isTextOnly;
        default:
          return true;
      }
    });
  };

  useEffect(() => {
    const params = new URLSearchParams({ limit: String(postsCount) });
    if (platform && platform !== "all") {
      params.append("platform", platform);
    }
    if (mediaType && mediaType !== "all") {
      // Map frontend values to database values
      const mediaTypeMap: Record<string, string> = {
        "images": "image",
        "videos": "video",
        "text": "text"
      };
      params.append("mediaType", mediaTypeMap[mediaType] || mediaType);
    }
    fetch(`${getApiBaseUrl()}/api/social-posts?${params}`)
      .then(res => res.json())
      .then(data => {
        setPosts(data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [postsCount, platform, mediaType]);

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "facebook": return "📘";
      case "twitter": return "🐦";
      case "instagram": return "📸";
      case "linkedin": return "💼";
      case "youtube": return "🎬";
      default: return "📱";
    }
  };

  return (
    <section className="py-16 bg-background" ref={ref}>
      <div className="container mx-auto px-6">
        {section.title && (
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="font-display text-3xl md:text-4xl font-bold text-foreground text-center mb-12"
          >
            {section.title}
          </motion.h2>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>No social posts to display.</p>
            <p className="text-sm mt-2">Connect social accounts in the admin panel.</p>
          </div>
        ) : (
          <div className={`grid gap-6 ${layout === "list" ? "grid-cols-1 max-w-2xl mx-auto" : "md:grid-cols-2 lg:grid-cols-3"}`}>
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                {post.media_url && (
                  <img
                    src={post.media_url}
                    alt=""
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span>{getPlatformIcon(post.platform)}</span>
                    <span className="text-sm text-muted-foreground capitalize">{post.platform}</span>
                  </div>
                  <p className="text-foreground line-clamp-3">{post.content}</p>
                  <div className="flex gap-4 mt-3 text-sm text-muted-foreground">
                    <span>❤️ {post.likes_count || 0}</span>
                    <span>💬 {post.comments_count || 0}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

// Main Section Renderer
const SectionRenderer = ({ sections }: SectionRendererProps) => {
  return (
    <>
      {sections.map((section) => {
        const sectionStyle = getSectionStyle(section.settings);
        const hasCustomStyle = section.settings?.backgroundColor || section.settings?.textColor;
        
        let content;
        switch (section.section_type) {
          case "hero":
            content = <HeroSection key={section.id} section={section} />;
            break;
          case "features":
            content = <FeaturesSection key={section.id} section={section} />;
            break;
          case "text":
            content = <TextSection key={section.id} section={section} />;
            break;
          case "gallery":
            content = <GallerySection key={section.id} section={section} />;
            break;
          case "testimonials":
            content = <TestimonialsSection key={section.id} section={section} />;
            break;
          case "cta":
            content = <CTASection key={section.id} section={section} />;
            break;
          case "contact":
            content = <ContactSection key={section.id} section={section} />;
            break;
          case "video":
            content = <VideoSection key={section.id} section={section} />;
            break;
          case "social":
            content = <SocialFeedSection key={section.id} section={section} />;
            break;
          case "spacer":
            content = <SpacerSection key={section.id} section={section} />;
            break;
          case "html":
            content = <HTMLSection key={section.id} section={section} />;
            break;
          default:
            return null;
        }
        
        // Wrap with custom styles if set
        if (hasCustomStyle) {
          return (
            <div key={section.id} style={sectionStyle}>
              {content}
            </div>
          );
        }
        
        return content;
      })}
    </>
  );
};

export default SectionRenderer;
