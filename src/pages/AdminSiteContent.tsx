import { useState, useRef } from "react";
import AdminLayout from "@/components/AdminLayout";
import { useSiteContent, useUpsertSiteContent } from "@/hooks/useCms";
import { Save, ChevronDown, ChevronUp, Plus, Trash2, Upload, X, Palette } from "lucide-react";
import { toast } from "sonner";
import { filesApi } from "@/lib/api";

interface FieldConfig {
  key: string;
  label: string;
  type: "text" | "textarea" | "number" | "image";
  placeholder?: string;
}

interface SectionConfig {
  title: string;
  description: string;
  fields: FieldConfig[];
}

const sections: SectionConfig[] = [
  {
    title: "Hero Section",
    description: "The main banner at the top of the homepage",
    fields: [
      { key: "hero_title", label: "Your Name", type: "text", placeholder: "Gidel Kwasi Fiavor" },
      { key: "hero_greeting", label: "Greeting Text", type: "text", placeholder: "HELLO I'M" },
      { key: "hero_subtitle", label: "Hero Description", type: "textarea", placeholder: "A passionate healthcare marketing specialist, theologian..." },
      { key: "hero_cta", label: "Button Text", type: "text", placeholder: "View Portfolio" },
      { key: "hero_image", label: "Hero Image", type: "image", placeholder: "Upload hero image" },
      { key: "hero_tagline_1", label: "Background Text Line 1", type: "text", placeholder: "HEALTHCARE MARKETING STRATEGIST" },
      { key: "hero_tagline_2", label: "Background Text Line 2", type: "text", placeholder: "THEOLOGIAN" },
    ],
  },
  {
    title: "Stats Section",
    description: "The statistics displayed on the homepage",
    fields: [
      { key: "years_experience", label: "Years of Experience", type: "number", placeholder: "27" },
      { key: "experience_description", label: "Experience Description", type: "text", placeholder: "Years of professional experience" },
      { key: "stat_books", label: "Number of Books", type: "number", placeholder: "3" },
      { key: "stat_certification", label: "Certification Text", type: "text", placeholder: "ACIMG" },
      { key: "stat_workshops", label: "Workshops/Seminars", type: "number", placeholder: "50" },
      { key: "stat_lives", label: "Lives Impacted", type: "text", placeholder: "1000+" },
    ],
  },
  {
    title: "About Preview Section",
    description: "The about section preview on the homepage",
    fields: [
      { key: "about_label", label: "Section Label", type: "text", placeholder: "About Me" },
      { key: "about_heading", label: "About Heading", type: "text", placeholder: "Inspiring Excellence in Healthcare, Faith & Family" },
      { key: "about_subtitle", label: "About Subtitle", type: "textarea", placeholder: "Helping people and institutions grow with purpose..." },
      { key: "about_portrait", label: "About Portrait Image", type: "image", placeholder: "Upload portrait image" },
      { key: "about_button_text", label: "Button Text", type: "text", placeholder: "Learn More About Me" },
    ],
  },
  {
    title: "Contact Information",
    description: "Contact details displayed on the website",
    fields: [
      { key: "contact_email", label: "Email Address", type: "text", placeholder: "contact@example.com" },
      { key: "contact_phone", label: "Phone Number", type: "text", placeholder: "+233 XX XXX XXXX" },
      { key: "contact_address", label: "Address", type: "text", placeholder: "Accra, Ghana" },
    ],
  },
];

const defaultServices = [
  { icon: "BookOpen", title: "Published Author", desc: "Author of books on healthcare, faith, and marriage" },
  { icon: "Users", title: "Marriage Counsellor", desc: "Guiding couples toward stronger relationships" },
  { icon: "Award", title: "Healthcare Marketing", desc: "27+ years advancing healthcare excellence" },
  { icon: "Heart", title: "Theologian", desc: "Faith-based transformation and ministry leadership" },
];

const defaultAboutCards = [
  { num: "01", title: "Healthcare Marketing Specialist", desc: "As an Associate Member of the Chartered Institute of Marketing, Ghana (ACIMG), dedicated to advancing healthcare excellence and leadership." },
  { num: "02", title: "Theologian & Marriage Counsellor", desc: "Guiding individuals and couples toward healing, faith-based transformation, and stronger relationships through compassionate counseling." },
  { num: "03", title: "Published Author", desc: "Author of books on healthcare policies, faith, and marriage including 'The Hearts of Men and the Will of God'." },
];

const iconOptions = ["BookOpen", "Users", "Award", "Heart", "GraduationCap", "Briefcase", "Star", "Target"];

const AdminSiteContent = () => {
  const { data: content, isLoading } = useSiteContent();
  const upsert = useUpsertSiteContent();
  const [values, setValues] = useState<Record<string, string>>({});
  const [initialized, setInitialized] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    "Hero Section": true,
    "Stats Section": true,
    "About Preview Section": true,
    "Contact Information": true,
    "Services Section": true,
    "About Cards": true,
  });

  // Services state
  const [services, setServices] = useState<Array<{ icon: string; title: string; desc: string }>>(defaultServices);
  const [aboutCards, setAboutCards] = useState<Array<{ num: string; title: string; desc: string }>>(defaultAboutCards);

  if (content && !initialized) {
    setValues(content);
    // Parse services and about cards from content
    if (content.services) {
      try {
        setServices(JSON.parse(content.services));
      } catch (e) {}
    }
    if (content.about_cards) {
      try {
        setAboutCards(JSON.parse(content.about_cards));
      } catch (e) {}
    }
    setInitialized(true);
  }

  const toggleSection = (title: string) => {
    setExpandedSections((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const handleSave = async () => {
    // Include services and about cards as JSON
    const allValues = {
      ...values,
      services: JSON.stringify(services),
      about_cards: JSON.stringify(aboutCards),
    };
    try {
      await upsert.mutateAsync(allValues);
      toast.success("Content saved!");
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const updateService = (index: number, field: string, value: string) => {
    setServices((prev) => prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)));
  };

  const addService = () => {
    setServices((prev) => [...prev, { icon: "Star", title: "New Service", desc: "Description" }]);
  };

  const removeService = (index: number) => {
    setServices((prev) => prev.filter((_, i) => i !== index));
  };

  const updateAboutCard = (index: number, field: string, value: string) => {
    setAboutCards((prev) => prev.map((c, i) => (i === index ? { ...c, [field]: value } : c)));
  };

  const addAboutCard = () => {
    const num = String(aboutCards.length + 1).padStart(2, "0");
    setAboutCards((prev) => [...prev, { num, title: "New Card", desc: "Description" }]);
  };

  const removeAboutCard = (index: number) => {
    setAboutCards((prev) => prev.filter((_, i) => i !== index));
  };

  const [uploading, setUploading] = useState<string | null>(null);

  // Extract dominant color from image using Canvas
  const extractDominantColor = (imageUrl: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Could not get canvas context'));
            return;
          }
          
          // Scale down for faster processing
          const scale = Math.min(1, 100 / Math.max(img.width, img.height));
          canvas.width = img.width * scale;
          canvas.height = img.height * scale;
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;
          
          // Count color occurrences (simplified - group similar colors)
          const colorCounts: Record<string, number> = {};
          
          for (let i = 0; i < data.length; i += 4) {
            const r = Math.round(data[i] / 16) * 16;
            const g = Math.round(data[i + 1] / 16) * 16;
            const b = Math.round(data[i + 2] / 16) * 16;
            const a = data[i + 3];
            
            // Skip transparent and very light/dark pixels
            if (a < 128) continue;
            const brightness = (r + g + b) / 3;
            if (brightness < 30 || brightness > 225) continue;
            
            const key = `${r},${g},${b}`;
            colorCounts[key] = (colorCounts[key] || 0) + 1;
          }
          
          // Find most common color
          let maxCount = 0;
          let dominantColor = '234,100,85'; // Default fallback
          
          for (const [color, count] of Object.entries(colorCounts)) {
            if (count > maxCount) {
              maxCount = count;
              dominantColor = color;
            }
          }
          
          const [r, g, b] = dominantColor.split(',').map(Number);
          const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
          resolve(hex);
        } catch (e) {
          reject(e);
        }
      };
      img.onerror = reject;
      img.src = imageUrl;
    });
  };

  const handleImageUpload = async (fieldKey: string, file: File) => {
    setUploading(fieldKey);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch(`http://localhost:3001/api/files/upload?folder=hero`, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error('Upload failed');
      const data = await response.json();
      const imageUrl = data.url.startsWith('http') ? data.url : `http://localhost:3001${data.url}`;
      setValues((v) => ({ ...v, [fieldKey]: data.url }));
      
      // If this is the hero image, extract dominant color and update theme
      if (fieldKey === 'hero_image') {
        try {
          const dominantColor = await extractDominantColor(imageUrl);
          setValues((v) => ({ ...v, theme_color: dominantColor }));
          toast.success(`Image uploaded! Theme color extracted: ${dominantColor}`);
        } catch (colorError) {
          toast.success("Image uploaded! (Could not extract color)");
        }
      } else {
        toast.success("Image uploaded!");
      }
    } catch (e: any) {
      toast.error(e.message || "Upload failed");
    } finally {
      setUploading(null);
    }
  };

  if (isLoading) return <AdminLayout><p className="text-muted-foreground font-body">Loading...</p></AdminLayout>;

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Homepage Content</h1>
          <p className="text-muted-foreground font-body mt-1">Edit all sections of your homepage</p>
        </div>
        <button
          onClick={handleSave}
          disabled={upsert.isPending}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground font-body font-semibold text-sm rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          <Save size={16} />
          {upsert.isPending ? "Saving..." : "Save All Changes"}
        </button>
      </div>

      <div className="space-y-6">
        {/* Standard Sections */}
        {sections.map((section) => (
          <div key={section.title} className="bg-card border border-border rounded-lg overflow-hidden">
            <button
              onClick={() => toggleSection(section.title)}
              className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
            >
              <div className="text-left">
                <h2 className="font-display text-lg font-semibold text-foreground">{section.title}</h2>
                <p className="text-sm text-muted-foreground font-body">{section.description}</p>
              </div>
              {expandedSections[section.title] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
            {expandedSections[section.title] && (
              <div className="p-4 pt-0 space-y-4 border-t border-border">
                {section.fields.map((field) => (
                  <div key={field.key}>
                    <label className="block text-sm font-body font-medium text-foreground mb-1">{field.label}</label>
                    {field.type === "textarea" ? (
                      <textarea
                        value={values[field.key] || ""}
                        onChange={(e) => setValues((v) => ({ ...v, [field.key]: e.target.value }))}
                        placeholder={field.placeholder}
                        rows={3}
                        className="w-full px-4 py-3 bg-background border border-border rounded-lg font-body text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-y"
                      />
                    ) : field.type === "image" ? (
                      <div className="space-y-3">
                        {values[field.key] && (
                          <div className="relative inline-block">
                            <img
                              src={values[field.key].startsWith('http') ? values[field.key] : `http://localhost:3001${values[field.key]}`}
                              alt="Preview"
                              className="w-40 h-40 object-cover rounded-lg border border-border"
                            />
                            <button
                              type="button"
                              onClick={() => setValues((v) => ({ ...v, [field.key]: "" }))}
                              className="absolute -top-2 -right-2 p-1 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/80"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        )}
                        <div className="flex items-center gap-3">
                          <label className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg cursor-pointer hover:bg-primary/90 transition-colors">
                            <Upload size={16} />
                            <span className="text-sm font-medium">
                              {uploading === field.key ? "Uploading..." : "Upload Image"}
                            </span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              disabled={uploading === field.key}
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleImageUpload(field.key, file);
                              }}
                            />
                          </label>
                          <span className="text-xs text-muted-foreground">or enter URL:</span>
                          <input
                            type="text"
                            value={values[field.key] || ""}
                            onChange={(e) => setValues((v) => ({ ...v, [field.key]: e.target.value }))}
                            placeholder="/uploads/image.png"
                            className="flex-1 px-3 py-2 bg-background border border-border rounded-lg font-body text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                          />
                        </div>
                      </div>
                    ) : (
                      <input
                        type={field.type}
                        value={values[field.key] || ""}
                        onChange={(e) => setValues((v) => ({ ...v, [field.key]: e.target.value }))}
                        placeholder={field.placeholder}
                        className="w-full px-4 py-3 bg-background border border-border rounded-lg font-body text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Services Section */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <button
            onClick={() => toggleSection("Services Section")}
            className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
          >
            <div className="text-left">
              <h2 className="font-display text-lg font-semibold text-foreground">Services Section</h2>
              <p className="text-sm text-muted-foreground font-body">The 4 service cards on the homepage</p>
            </div>
            {expandedSections["Services Section"] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
          {expandedSections["Services Section"] && (
            <div className="p-4 pt-0 space-y-4 border-t border-border">
              {services.map((service, index) => (
                <div key={index} className="p-4 bg-muted/30 rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-foreground">Service {index + 1}</span>
                    <button
                      onClick={() => removeService(index)}
                      className="text-destructive hover:text-destructive/80 p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-body text-muted-foreground mb-1">Icon</label>
                      <select
                        value={service.icon}
                        onChange={(e) => updateService(index, "icon", e.target.value)}
                        className="w-full px-3 py-2 bg-background border border-border rounded-lg font-body text-sm"
                      >
                        {iconOptions.map((icon) => (
                          <option key={icon} value={icon}>{icon}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-body text-muted-foreground mb-1">Title</label>
                      <input
                        type="text"
                        value={service.title}
                        onChange={(e) => updateService(index, "title", e.target.value)}
                        className="w-full px-3 py-2 bg-background border border-border rounded-lg font-body text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-body text-muted-foreground mb-1">Description</label>
                    <input
                      type="text"
                      value={service.desc}
                      onChange={(e) => updateService(index, "desc", e.target.value)}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg font-body text-sm"
                    />
                  </div>
                </div>
              ))}
              <button
                onClick={addService}
                className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 font-medium"
              >
                <Plus size={16} /> Add Service
              </button>
            </div>
          )}
        </div>

        {/* About Cards Section */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <button
            onClick={() => toggleSection("About Cards")}
            className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
          >
            <div className="text-left">
              <h2 className="font-display text-lg font-semibold text-foreground">About Cards</h2>
              <p className="text-sm text-muted-foreground font-body">The numbered cards in the About preview section</p>
            </div>
            {expandedSections["About Cards"] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
          {expandedSections["About Cards"] && (
            <div className="p-4 pt-0 space-y-4 border-t border-border">
              {aboutCards.map((card, index) => (
                <div key={index} className="p-4 bg-muted/30 rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-foreground">Card {card.num}</span>
                    <button
                      onClick={() => removeAboutCard(index)}
                      className="text-destructive hover:text-destructive/80 p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div>
                    <label className="block text-xs font-body text-muted-foreground mb-1">Title</label>
                    <input
                      type="text"
                      value={card.title}
                      onChange={(e) => updateAboutCard(index, "title", e.target.value)}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg font-body text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-body text-muted-foreground mb-1">Description</label>
                    <textarea
                      value={card.desc}
                      onChange={(e) => updateAboutCard(index, "desc", e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg font-body text-sm resize-y"
                    />
                  </div>
                </div>
              ))}
              <button
                onClick={addAboutCard}
                className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 font-medium"
              >
                <Plus size={16} /> Add Card
              </button>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSiteContent;
