import { useState, useEffect, useMemo } from "react";
import { Menu, X, Instagram, Linkedin, Twitter, Facebook, Youtube } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { useSiteSettings, useMenus } from "@/hooks/useCms";

const defaultNavLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Books", href: "/books" },
  { label: "Articles", href: "/articles" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { data: settings } = useSiteSettings();
  const { data: menus = [] } = useMenus();

  // Built-in routes that have dedicated pages (not dynamic /page/ routes)
  const builtInRoutes: Record<string, string> = {
    'home': '/',
    'about': '/about',
    'books': '/books',
    'articles': '/articles',
    'gallery': '/gallery',
    'contact': '/contact',
  };

  // Use dynamic menus if available, otherwise fall back to defaults
  const navLinks = useMemo(() => {
    if (menus && menus.length > 0) {
      // Sort by sort_order and filter only visible items
      return menus
        .filter((menu: any) => menu.is_visible !== false)
        .sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0))
        .map((menu: any) => {
          // If menu has a custom URL, use it
          if (menu.url) {
            return { label: menu.title, href: menu.url };
          }
          
          const slug = menu.page_slug || menu.slug || menu.title.toLowerCase().replace(/\s+/g, '-');
          
          // Check if this is a built-in route
          if (builtInRoutes[slug]) {
            return { label: menu.title, href: builtInRoutes[slug] };
          }
          
          // Otherwise use /page/{slug} for dynamic pages
          return { label: menu.title, href: `/page/${slug}` };
        });
    }
    return defaultNavLinks;
  }, [menus]);

  const socialLinks = [
    { icon: Instagram, url: settings?.social_instagram, label: "Instagram" },
    { icon: Linkedin, url: settings?.social_linkedin, label: "LinkedIn" },
    { icon: Twitter, url: settings?.social_twitter, label: "Twitter" },
    { icon: Facebook, url: settings?.social_facebook, label: "Facebook" },
    { icon: Youtube, url: settings?.social_youtube, label: "YouTube" },
  ].filter(link => link.url);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 pt-[env(safe-area-inset-top)] ${
        scrolled
          ? "bg-background/95 backdrop-blur-md shadow-sm py-3"
          : "bg-background py-4"
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <span className="text-primary-foreground font-display font-bold text-sm">G</span>
          </div>
          <span className="font-display text-xl font-bold text-foreground">Gidel Fiavor</span>
        </Link>

        {/* Center nav links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`text-sm font-body font-medium transition-colors ${
                location.pathname === link.href
                  ? "text-foreground font-semibold"
                  : "text-foreground/60 hover:text-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right side - social icons + menu button */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2">
            {socialLinks.length > 0 ? (
              socialLinks.map((social, i) => (
                <a
                  key={i}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 rounded-full bg-foreground/5 flex items-center justify-center text-foreground/60 hover:bg-foreground/10 hover:text-foreground transition-colors"
                  aria-label={social.label}
                >
                  <social.icon size={14} />
                </a>
              ))
            ) : (
              [Instagram, Linkedin, Twitter, Facebook].map((Icon, i) => (
                <span
                  key={i}
                  className="w-8 h-8 rounded-full bg-foreground/5 flex items-center justify-center text-foreground/30"
                  title="Social link not configured"
                >
                  <Icon size={14} />
                </span>
              ))
            )}
          </div>
          <Link
            to="/contact"
            className="hidden md:flex w-9 h-9 rounded-full bg-primary items-center justify-center text-primary-foreground"
            aria-label="Contact"
          >
            <Menu size={16} />
          </Link>
          <button
            className="md:hidden text-foreground"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background border-t border-border"
          >
            <div className="container mx-auto px-6 py-4 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`text-sm font-body font-medium transition-colors py-2 ${
                    location.pathname === link.href ? "text-primary" : "text-foreground/70 hover:text-foreground"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex items-center gap-3 pt-4 border-t border-border">
                {socialLinks.length > 0 ? (
                  socialLinks.map((social, i) => (
                    <a
                      key={i}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-11 h-11 rounded-full bg-foreground/5 flex items-center justify-center text-foreground/60"
                      aria-label={social.label}
                    >
                      <social.icon size={16} />
                    </a>
                  ))
                ) : (
                  [Instagram, Linkedin, Twitter, Facebook].map((Icon, i) => (
                    <span
                      key={i}
                      className="w-9 h-9 rounded-full bg-foreground/5 flex items-center justify-center text-foreground/30"
                    >
                      <Icon size={16} />
                    </span>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
