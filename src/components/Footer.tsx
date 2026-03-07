import { Mail, MapPin, Phone, Instagram, Twitter, Facebook, Linkedin, Youtube, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useSiteSettings, useSiteContent } from "@/hooks/useCms";
import { newsletterApi } from "@/lib/api";
import { useState } from "react";
import { toast } from "sonner";

const Footer = () => {
  const { data: settings } = useSiteSettings();
  const { data: siteContent } = useSiteContent();
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    
    setIsSubscribing(true);
    try {
      const result = await newsletterApi.subscribe({ email: newsletterEmail });
      if (result.success) {
        toast.success(result.message);
        setNewsletterEmail("");
      } else {
        toast.error(result.message || "Failed to subscribe");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to subscribe. Please try again.");
    } finally {
      setIsSubscribing(false);
    }
  };

  const socialLinks = [
    { icon: Instagram, url: settings?.social_instagram, label: "Instagram" },
    { icon: Linkedin, url: settings?.social_linkedin, label: "LinkedIn" },
    { icon: Twitter, url: settings?.social_twitter, label: "Twitter" },
    { icon: Facebook, url: settings?.social_facebook, label: "Facebook" },
    { icon: Youtube, url: settings?.social_youtube, label: "YouTube" },
  ].filter(link => link.url);

  const contactEmail = settings?.contact_email || siteContent?.contact_email || "author@gidelfiavor.com";
  const contactAddress = settings?.contact_address || siteContent?.contact_address || "PO Box CS 8318, Tema, Ghana";
  const contactPhone = settings?.contact_phone || siteContent?.contact_phone || "+233 XX XXX XXXX";

  return (
    <footer className="bg-secondary">
      {/* Main Footer */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-12 lg:gap-20">
          {/* Left - Logo, Tagline, Newsletter */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground font-display font-bold text-sm">{(settings?.site_name || siteContent?.hero_title || "Gidel")[0]}</span>
              </div>
              <span className="font-display text-xl font-bold text-foreground">{settings?.site_name || siteContent?.hero_title?.split(" ")[0] || "Gidel"}</span>
            </Link>
            <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-6 leading-tight">
              {settings?.footer_tagline || siteContent?.footer_tagline || (
                <><span className="font-bold">Get Ready</span> To<br /><span className="font-bold">Create Great</span></>
              )}
            </h3>
            <form onSubmit={handleNewsletterSubmit} className="flex items-center gap-2 border-b border-border pb-2">
              <input
                type="email"
                placeholder="Email Address"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="flex-1 bg-transparent font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                required
              />
              <button 
                type="submit" 
                disabled={isSubscribing}
                className="text-foreground/60 hover:text-primary transition-colors disabled:opacity-50"
              >
                {isSubscribing ? <Loader2 size={18} className="animate-spin" /> : <Mail size={18} />}
              </button>
            </form>
          </div>

          {/* Center - Quick Links */}
          <div>
            <h4 className="font-display text-lg font-bold mb-6 text-foreground">Quick Link</h4>
            <div className="space-y-3">
              {[
                { label: "About Me", to: "/about" },
                { label: "Books", to: "/books" },
                { label: "Contact Us", to: "/contact" },
                { label: "Blog Post", to: "/articles" },
                { label: "Gallery", to: "/gallery" },
              ].map((l) => (
                <Link key={l.to} to={l.to} className="block text-muted-foreground hover:text-foreground transition-colors font-body text-sm">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Right - Contact */}
          <div>
            <h4 className="font-display text-lg font-bold mb-6 text-foreground">Contact</h4>
            <div className="space-y-4">
              <a href={`mailto:${contactEmail}`} className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors font-body text-sm">
                <Mail size={16} /> {contactEmail}
              </a>
              <p className="flex items-center gap-3 text-muted-foreground font-body text-sm">
                <MapPin size={16} /> {contactAddress}
              </p>
              <p className="flex items-center gap-3 text-muted-foreground font-body text-sm">
                <Phone size={16} /> {contactPhone}
              </p>
            </div>
            {/* Social Icons */}
            <div className="flex gap-2 mt-6">
              {socialLinks.length > 0 ? (
                socialLinks.map((social, i) => (
                  <a
                    key={i}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-foreground flex items-center justify-center text-background hover:bg-primary transition-colors"
                    aria-label={social.label}
                  >
                    <social.icon size={16} />
                  </a>
                ))
              ) : (
                [Instagram, Linkedin, Twitter, Facebook].map((Icon, i) => (
                  <span
                    key={i}
                    className="w-9 h-9 rounded-full bg-foreground/50 flex items-center justify-center text-background/50 cursor-not-allowed"
                    title="Social link not configured"
                  >
                    <Icon size={16} />
                  </span>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border">
        <div className="container mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-body text-sm text-muted-foreground">
            © {settings?.site_name || siteContent?.hero_title || "Gidel Fiavor"} {new Date().getFullYear()} | {settings?.copyright_text || "All Rights Reserved"}
          </p>
          <div className="flex gap-6">
            <Link to="/terms" className="font-body text-sm text-muted-foreground hover:text-foreground transition-colors">
              Terms & Condition
            </Link>
            <Link to="/privacy" className="font-body text-sm text-muted-foreground hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link to="/contact" className="font-body text-sm text-muted-foreground hover:text-foreground transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
