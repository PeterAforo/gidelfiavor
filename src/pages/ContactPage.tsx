import { Mail, MapPin, Phone, ArrowRight, Loader2 } from "lucide-react";
import { useSiteContent, usePageSections, useSiteSettings } from "@/hooks/useCms";
import SectionRenderer from "@/components/SectionRenderer";
import PageHeader from "@/components/PageHeader";
import { useState } from "react";
import { contactApi } from "@/lib/api";
import { toast } from "sonner";

const ContactPage = () => {
  // Try to load sections from backend Page Builder
  const { data: pageSections = [] } = usePageSections("contact");
  const { data: content } = useSiteContent();
  const { data: settings } = useSiteSettings();
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const result = await contactApi.submit({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
      });
      
      if (result.success) {
        toast.success(result.message);
        setFormData({ name: "", phone: "", email: "", subject: "", message: "" });
      } else {
        toast.error(result.message || "Failed to send message");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const contactEmail = settings?.contact_email || content?.contact_email || "author@gidelfiavor.com";
  const contactAddress = settings?.contact_address || content?.contact_address || "PO Box CS 8318, Tema, Ghana";
  const contactPhone = settings?.contact_phone || content?.contact_phone || "+233 XX XXX XXXX";
  
  // If sections exist in backend, render them instead of hardcoded content
  if (pageSections.length > 0) {
    return (
      <main className="pt-20 min-h-screen bg-background">
        <SectionRenderer sections={pageSections} />
      </main>
    );
  }

  return (
    <main className="pt-20 min-h-screen bg-background">
      <PageHeader
        title="Contact"
        breadcrumbs={[
          { label: "Home", to: "/" },
          { label: "Contact" }
        ]}
      />
      
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-6">
          {/* Contact Info Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {/* Address Card */}
            <div className="bg-background rounded-2xl p-8 text-center border border-border hover:border-primary/30 transition-colors">
              <div className="w-14 h-14 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                <MapPin size={24} className="text-primary" />
              </div>
              <h3 className="font-display font-bold text-foreground mb-3">Address</h3>
              <p className="text-sm text-muted-foreground font-body leading-relaxed">
                {contactAddress}
              </p>
            </div>

            {/* Email Card */}
            <div className="bg-background rounded-2xl p-8 text-center border border-border hover:border-primary/30 transition-colors">
              <div className="w-14 h-14 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                <Mail size={24} className="text-primary" />
              </div>
              <h3 className="font-display font-bold text-foreground mb-3">E-Mail</h3>
              <a 
                href={`mailto:${contactEmail}`}
                className="text-sm text-muted-foreground font-body hover:text-primary transition-colors"
              >
                {contactEmail}
              </a>
            </div>

            {/* Phone Card */}
            <div className="bg-background rounded-2xl p-8 text-center border border-border hover:border-primary/30 transition-colors">
              <div className="w-14 h-14 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                <Phone size={24} className="text-primary" />
              </div>
              <h3 className="font-display font-bold text-foreground mb-3">Call Me</h3>
              <p className="text-sm text-muted-foreground font-body">
                {contactPhone}
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="max-w-3xl mx-auto">
            <div className="bg-secondary rounded-2xl p-8 md:p-12">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg font-body text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
                    required
                  />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg font-body text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <input
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg font-body text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
                    required
                  />
                  <input
                    type="text"
                    name="subject"
                    placeholder="Subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg font-body text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
                    required
                  />
                </div>
                <textarea
                  name="message"
                  placeholder="Your Message"
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg font-body text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors resize-none"
                  required
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-primary text-primary-foreground font-body font-semibold text-sm rounded-full hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <><Loader2 size={16} className="animate-spin" /> Sending...</>
                  ) : (
                    <>Send Message <ArrowRight size={16} /></>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ContactPage;
