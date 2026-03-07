import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useSiteContent, useSiteSettings } from "@/hooks/useCms";
import heroImage from "@/assets/777.png";

const HeroSection = () => {
  const { data: content } = useSiteContent();
  const { data: settings } = useSiteSettings();

  // Get author name from content or settings
  const authorName = content?.hero_title || settings?.site_name || "Gidel Kwasi Fiavor";
  const nameParts = authorName.split(" ");
  const firstName = nameParts.slice(0, -1).join(" ") || nameParts[0];
  const lastName = nameParts[nameParts.length - 1] || "";

  return (
    <section className="relative flex items-start overflow-hidden bg-background pt-20 pb-0">
      <div className="container mx-auto px-6 pb-0">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start pt-8 relative">
          {/* Left content - Name + About Me section moved here */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:pr-4"
          >
            <p className="text-foreground/60 font-body text-sm uppercase tracking-wider mb-4">
              {content?.hero_greeting || "HELLO I'M"}
            </p>
            <h1 className="font-display text-[3.5rem] md:text-[4.2rem] lg:text-[5.8rem] font-black text-foreground mb-6" style={{ lineHeight: '0.85' }}>
              {nameParts.map((part, index) => (
                <span key={index} className="block">{part}</span>
              ))}
            </h1>
            
            {/* About Me content */}
            <div className="mb-6">
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                {content?.hero_subtitle || "A passionate healthcare marketing specialist, theologian, marriage counsellor, and author with nearly three decades of professional experience."}
              </p>
            </div>
            
            <Link
              to="/books"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-body font-semibold text-sm rounded-full hover:bg-primary/90 transition-colors"
            >
              {content?.hero_cta || "View Portfolio"} <ArrowRight size={16} />
            </Link>
          </motion.div>

          {/* Right - Image */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative flex justify-center row-span-2"
          >
            <div className="relative">
              <img
                src={content?.hero_image || heroImage}
                alt={authorName}
                className="w-auto h-[800px] object-contain"
                loading="eager"
              />
            </div>
          </motion.div>
          
          </div>
      </div>
      
      {/* Background text - absolute positioned at bottom, full width, overlapping hero image */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 1 }}
        className="absolute bottom-[-20px] left-0 right-0 pointer-events-none z-10"
      >
        <div className="container mx-auto px-6">
          <h2 className="font-display text-[4vw] lg:text-[5vw] font-bold leading-none text-transparent tracking-tight"
              style={{ WebkitTextStroke: '1px rgba(0,0,0,0.1)' }}>
            {content?.hero_tagline_1 || "HEALTHCARE MARKETING STRATEGIST"}
          </h2>
          <h2 className="font-display text-[8vw] lg:text-[10vw] font-bold leading-none tracking-tight -mt-[1vw] text-primary"
              style={{ 
                WebkitTextStroke: '2px hsl(var(--primary))',
                opacity: 0.85
              }}>
            {content?.hero_tagline_2 || "THEOLOGIAN"}
          </h2>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
