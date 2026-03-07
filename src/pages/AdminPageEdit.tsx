import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { pagesApi, sectionsApi, filesApi, generateSlug as apiGenerateSlug } from "@/lib/api";
import AdminLayout from "@/components/AdminLayout";
import RichTextEditor from "@/components/RichTextEditor";
import PageBuilder from "@/components/PageBuilder";
import ImageUpload from "@/components/ImageUpload";
import { ArrowLeft, Save, Eye, Layers, FileText, Upload, X, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

const AdminPageEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isNew = id === "new";
  const [editorMode, setEditorMode] = useState<"content" | "builder">("content");

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    meta_title: "",
    meta_description: "",
    is_published: true,
    featured_image: "",
    header_image: "",
    gallery_images: [] as string[],
  });
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const [sections, setSections] = useState<any[]>([]);

  const { data: page, isLoading } = useQuery({
    queryKey: ["page", id],
    queryFn: () => pagesApi.getById(id!),
    enabled: !isNew && !!id,
  });

  const { data: pageSections = [] } = useQuery({
    queryKey: ["page-sections", id],
    queryFn: () => sectionsApi.getForPage(id!),
    enabled: !isNew && !!id,
  });

  useEffect(() => {
    if (page) {
      setFormData({
        title: page.title || "",
        slug: page.slug || "",
        content: page.content || "",
        meta_title: page.meta_title || "",
        meta_description: page.meta_description || "",
        is_published: page.is_published ?? true,
        featured_image: page.featured_image || "",
        header_image: page.header_image || "",
        gallery_images: page.gallery_images || [],
      });
    }
  }, [page]);

  useEffect(() => {
    if (pageSections.length > 0) {
      setSections(pageSections);
    }
  }, [pageSections]);

  const createMutation = useMutation({
    mutationFn: pagesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pages"] });
      toast.success("Page created successfully");
      navigate("/admin/pages");
    },
    onError: (err: any) => toast.error(err.message),
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => pagesApi.update(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pages"] });
      queryClient.invalidateQueries({ queryKey: ["page", id] });
      toast.success("Page updated successfully");
    },
    onError: (err: any) => toast.error(err.message),
  });

  // Section mutations
  const addSectionMutation = useMutation({
    mutationFn: (data: any) => sectionsApi.create(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["page-sections", id] });
      toast.success("Section added");
    },
  });

  const updateSectionMutation = useMutation({
    mutationFn: ({ sectionId, data }: { sectionId: number; data: any }) => 
      sectionsApi.update(String(sectionId), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["page-sections", id] });
      toast.success("Section updated");
    },
  });

  const deleteSectionMutation = useMutation({
    mutationFn: (sectionId: number) => sectionsApi.delete(String(sectionId)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["page-sections", id] });
      toast.success("Section deleted");
    },
  });

  const reorderSectionsMutation = useMutation({
    mutationFn: (newSections: any[]) => 
      sectionsApi.reorder(id!, newSections.map((s, i) => ({ id: s.id, sort_order: i }))),
  });

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  // Helper to strip HTML tags and get plain text
  const stripHtml = (html: string) => {
    if (!html) return '';
    return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
  };

  // Auto-generate meta description from content (first 150-160 chars)
  const generateMetaDescription = (content: string) => {
    const plainText = stripHtml(content);
    if (plainText.length <= 160) return plainText;
    // Cut at word boundary
    const truncated = plainText.substring(0, 157);
    const lastSpace = truncated.lastIndexOf(' ');
    return (lastSpace > 100 ? truncated.substring(0, lastSpace) : truncated) + '...';
  };

  // Auto-generate meta title from page title
  const generateMetaTitle = (title: string) => {
    if (!title) return '';
    return `${title} | Gidel Fiavor`;
  };

  // Default sections based on page slug with actual website content
  const getDefaultSectionsForPage = (slug: string) => {
    const templates: Record<string, any[]> = {
      home: [
        { 
          section_type: "hero", 
          title: "Hero Banner", 
          content: { 
            heading: "Gidel Kwasi Fiavor", 
            subheading: "Inspiring excellence in healthcare, faith and family guided by wisdom, integrity and divine purpose", 
            buttonText: "Learn More", 
            buttonLink: "/about" 
          }, 
          settings: {}, 
          sort_order: 0 
        },
        { 
          section_type: "features", 
          title: "Services & Expertise", 
          content: { 
            heading: "What I Do",
            subtitle: "Services & Expertise",
            items: [
              { icon: "BookOpen", title: "Published Author", description: "Author of 3 books on healthcare, faith, and marriage" },
              { icon: "Users", title: "Marriage Counsellor", description: "Guiding couples toward stronger relationships" },
              { icon: "Award", title: "Healthcare Marketing", description: "27+ years advancing healthcare excellence" },
              { icon: "Heart", title: "Theologian", description: "Faith-based transformation and ministry leadership" },
            ]
          }, 
          settings: { columns: 4 }, 
          sort_order: 1 
        },
        { 
          section_type: "text", 
          title: "About Preview", 
          content: { 
            subtitle: "About Me",
            html: "<p>Elder Gidel Kwasi Fiavor is a passionate healthcare marketing specialist, theologian, marriage counsellor, and author with nearly three decades of professional experience, helping people and institutions grow with purpose.</p><p>As an Associate Member of the Chartered Institute of Marketing, Ghana (ACIMG), Elder Fiavor has dedicated his career to advancing healthcare excellence, leadership, and faith-based transformation.</p>",
            buttonText: "Learn More About Me",
            buttonLink: "/about"
          }, 
          settings: { imagePosition: "right" }, 
          sort_order: 2 
        },
        { 
          section_type: "gallery", 
          title: "Books Preview", 
          content: { heading: "My Books", subtitle: "Transformative Reads" }, 
          settings: { dataSource: "books", layout: "grid", maxItems: 3 }, 
          sort_order: 3 
        },
        { 
          section_type: "testimonials", 
          title: "Testimonials", 
          content: { heading: "What Readers Say", subtitle: "Testimonials" }, 
          settings: { dataSource: "database", maxItems: 3 }, 
          sort_order: 4 
        },
        { 
          section_type: "gallery", 
          title: "Latest Articles", 
          content: { heading: "Latest Articles & Insights", subtitle: "Blog and News" }, 
          settings: { dataSource: "articles", layout: "grid", maxItems: 3 }, 
          sort_order: 5 
        },
      ],
      about: [
        { 
          section_type: "hero", 
          title: "Page Header", 
          content: { heading: "About Me", subheading: "Inspiring transformation in homes, hospitals, and hearts" }, 
          settings: { compact: true }, 
          sort_order: 0 
        },
        { 
          section_type: "features", 
          title: "Expertise Icons", 
          content: { 
            heading: "What I Do",
            items: [
              { icon: "BookOpen", title: "Published Author", description: "3 Books" },
              { icon: "Users", title: "Marriage Counsellor", description: "100+ Couples" },
              { icon: "Award", title: "Healthcare Marketing", description: "27+ Years" },
              { icon: "Heart", title: "Theologian", description: "Ministry Leader" },
            ]
          }, 
          settings: { columns: 4 }, 
          sort_order: 1 
        },
        { 
          section_type: "text", 
          title: "Biography", 
          content: { 
            subtitle: "My Story",
            html: "<p>Elder Gidel Kwasi Fiavor is a passionate healthcare marketing specialist, theologian, marriage counsellor, and author with nearly three decades of professional experience, helping people and institutions grow with purpose.</p><p>As an Associate Member of the Chartered Institute of Marketing, Ghana (ACIMG), Elder Fiavor has dedicated his career to advancing healthcare excellence, leadership, and faith-based transformation. His academic and professional journey has taken him through some of the world's most respected institutions, including the University of Ghana Business School, Ghana Institute of Management and Public Administration (GIMPA), Dominion University College, Harvard Business School, La Plade Academy, and Simplilearn.</p><p>Elder Fiavor is married to Mrs Belinda Sedinam Fiavor, a Chartered Accountant and Relationship Coach. Together, they share a beautiful family with three children: Kadita Adel Kwaku, Seli Bettina Afua, and Nunya Lucas Kwaku Fiavor.</p><p>Beyond business and ministry, Elder Fiavor believes in the power of faith, family, and meaningful human connections. His life's work is centred on inspiring transformation in homes, hospitals, and hearts through wisdom, compassion, and purpose-driven leadership.</p>"
          }, 
          settings: { imagePosition: "right" }, 
          sort_order: 2 
        },
        { 
          section_type: "text", 
          title: "Experience", 
          content: { 
            subtitle: "Over 27 Years Experience",
            html: "<p><strong>Head of Marketing & Business Development</strong> - New Crystal Health Services Ltd (Since 2009)</p><ul><li>Developing and implementing business strategies</li><li>Corporate client acquisition</li><li>Cash revenue growth</li><li>Customer satisfaction improvement</li><li>Branding, advertising, and promotional campaigns</li><li>Market research and analysis</li></ul><p><strong>Head of Pharmacy Department</strong> - Raphal Medical Centre</p><p><strong>Purchasing Officer</strong> - Provita Specialist Hospital Ltd</p><p><strong>Church Leadership:</strong></p><ul><li>Personal Assistant to Head Pastor - Action Chapel International, Tema</li><li>President of the Temple Ministry</li></ul>"
          }, 
          settings: { imagePosition: "none" }, 
          sort_order: 3 
        },
        { 
          section_type: "text", 
          title: "Education", 
          content: { 
            subtitle: "Education & Certifications",
            html: "<p><strong>Executive Master of Business Administration (EMBA) in Marketing</strong><br/>University of Ghana, Legon</p><p><strong>Bachelor of Business Administration (Management)</strong><br/>Ghana Institute of Management and Public Administration (GIMPA)</p><p><strong>Bachelor of Arts in Theology</strong><br/>Dominion University College</p><h4>Professional Certifications</h4><ul><li>Associate Member, Chartered Institute of Marketing, Ghana (ACIMG)</li><li>Health Care Strategy - Harvard Business School</li><li>Healthcare Economics - Harvard Business School</li><li>International Healthcare Administration - La Plade Academy</li><li>Digital Marketing - Simplilearn</li></ul>"
          }, 
          settings: { imagePosition: "none" }, 
          sort_order: 4 
        },
        { 
          section_type: "contact", 
          title: "Contact Form", 
          content: { heading: "Get in Touch", description: "Have questions? Send me a message." }, 
          settings: { showContactInfo: true }, 
          sort_order: 5 
        },
      ],
      books: [
        { 
          section_type: "hero", 
          title: "Page Header", 
          content: { heading: "Books", subheading: "Transformative Reads" }, 
          settings: { compact: true }, 
          sort_order: 0 
        },
        { 
          section_type: "gallery", 
          title: "Books List", 
          content: { heading: "My Published Works" }, 
          settings: { dataSource: "books", layout: "alternating" }, 
          sort_order: 1 
        },
      ],
      articles: [
        { 
          section_type: "hero", 
          title: "Page Header", 
          content: { heading: "Articles", subheading: "Insights & Wisdom" }, 
          settings: { compact: true }, 
          sort_order: 0 
        },
        { 
          section_type: "gallery", 
          title: "Articles Grid", 
          content: { heading: "Latest Articles" }, 
          settings: { dataSource: "articles", layout: "grid" }, 
          sort_order: 1 
        },
      ],
      gallery: [
        { 
          section_type: "hero", 
          title: "Page Header", 
          content: { heading: "Gallery", subheading: "Moments Captured" }, 
          settings: { compact: true }, 
          sort_order: 0 
        },
        { 
          section_type: "gallery", 
          title: "Photo Gallery", 
          content: { heading: "Photos & Media" }, 
          settings: { dataSource: "gallery", layout: "masonry" }, 
          sort_order: 1 
        },
      ],
      contact: [
        { 
          section_type: "hero", 
          title: "Page Header", 
          content: { heading: "Contact", subheading: "Get in Touch" }, 
          settings: { compact: true }, 
          sort_order: 0 
        },
        { 
          section_type: "features", 
          title: "Contact Info Cards", 
          content: { 
            heading: "Contact Information",
            items: [
              { icon: "MapPin", title: "Address", description: "PO Box CS 8318, Tema, Ghana" },
              { icon: "Mail", title: "Email", description: "author@gidelfiavor.com" },
              { icon: "Phone", title: "Phone", description: "+233 XX XXX XXXX" },
            ]
          }, 
          settings: { columns: 3 }, 
          sort_order: 1 
        },
        { 
          section_type: "contact", 
          title: "Contact Form", 
          content: { heading: "Send a Message", description: "Fill out the form below and I'll get back to you.", buttonText: "Send Message" }, 
          settings: { showContactInfo: false }, 
          sort_order: 2 
        },
      ],
    };
    
    return templates[slug] || [
      { section_type: "hero", title: "Page Header", content: { heading: formData.title || "Page Title" }, settings: { compact: true }, sort_order: 0 },
      { section_type: "text", title: "Main Content", content: { html: "<p>Page content here...</p>" }, settings: { imagePosition: "none" }, sort_order: 1 },
    ];
  };

  const initializeDefaultSections = async () => {
    if (sections.length === 0 && !isNew) {
      const defaultSections = getDefaultSectionsForPage(formData.slug);
      for (const section of defaultSections) {
        await addSectionMutation.mutateAsync(section);
      }
      toast.success(`Initialized ${defaultSections.length} default sections for this page`);
    }
  };

  const resetToDefaultContent = async () => {
    if (!window.confirm("This will delete all existing sections and replace them with the default website content. Are you sure?")) {
      return;
    }
    
    // Delete all existing sections
    for (const section of sections) {
      await deleteSectionMutation.mutateAsync(section.id);
    }
    
    // Add default sections with actual content
    const defaultSections = getDefaultSectionsForPage(formData.slug);
    for (const section of defaultSections) {
      await addSectionMutation.mutateAsync(section);
    }
    
    toast.success(`Reset to ${defaultSections.length} default sections with website content`);
  };

  const handleSectionsChange = (newSections: any[]) => {
    setSections(newSections);
    reorderSectionsMutation.mutate(newSections);
  };

  const handleSectionAdd = (section: any) => {
    addSectionMutation.mutate(section);
  };

  const handleSectionUpdate = (sectionId: number, data: any) => {
    updateSectionMutation.mutate({ sectionId, data });
  };

  const handleSectionDelete = (sectionId: number) => {
    deleteSectionMutation.mutate(sectionId);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) {
      toast.error("Title is required");
      return;
    }
    if (!formData.slug) {
      toast.error("Slug is required");
      return;
    }

    if (isNew) {
      createMutation.mutate(formData);
    } else {
      updateMutation.mutate(formData);
    }
  };

  if (!isNew && isLoading) {
    return (
      <AdminLayout>
        <div className="p-6">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate("/admin/pages")}
            className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground">
              {isNew ? "Create New Page" : "Edit Page"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {isNew ? "Add a new page to your website" : `Editing: ${formData.title}`}
            </p>
          </div>
          {!isNew && formData.slug && (
            <a
              href={`/${formData.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 text-sm border border-border rounded-lg hover:bg-muted"
            >
              <Eye size={16} /> Preview
            </a>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title & Slug */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Page Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => {
                  const newTitle = e.target.value;
                  setFormData({ 
                    ...formData, 
                    title: newTitle,
                    slug: isNew ? generateSlug(newTitle) : formData.slug,
                    meta_title: isNew || !formData.meta_title ? generateMetaTitle(newTitle) : formData.meta_title,
                  });
                }}
                placeholder="About Us"
                className="w-full px-4 py-2.5 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">URL Slug *</label>
              <div className="flex items-center">
                <span className="px-3 py-2.5 bg-muted border border-r-0 border-border rounded-l-lg text-muted-foreground text-sm">
                  /
                </span>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="about-us"
                  className="flex-1 px-4 py-2.5 border border-border rounded-r-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
            </div>
          </div>

          {/* Editor Mode Toggle */}
          <div className="flex gap-2 mb-4 p-1 bg-muted rounded-lg w-fit">
            <button
              type="button"
              onClick={() => setEditorMode("content")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium transition-all ${
                editorMode === "content"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-background/50"
              }`}
            >
              <FileText size={16} />
              Simple Content
            </button>
            <button
              type="button"
              onClick={() => {
                if (!isNew) {
                  setEditorMode("builder");
                  // Auto-initialize default sections if none exist
                  if (sections.length === 0 && pageSections.length === 0) {
                    initializeDefaultSections();
                  }
                }
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium transition-all ${
                editorMode === "builder"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-background/50"
              } ${isNew ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
              title={isNew ? "Save the page first to use Page Builder" : "Click to add drag-and-drop sections"}
            >
              <Layers size={16} />
              Page Builder (Sections)
            </button>
          </div>
          
          {editorMode === "content" && (
            <p className="text-sm text-muted-foreground mb-2">
              Use Simple Content for basic text, or switch to <strong>Page Builder</strong> to add multiple sections like Hero, Gallery, CTA, etc.
            </p>
          )}

          {/* Content Editor */}
          {editorMode === "content" ? (
            <div>
              <label className="block text-sm font-medium mb-2">Page Content</label>
              <RichTextEditor
                content={formData.content}
                onChange={(content) => setFormData({ 
                  ...formData, 
                  content,
                  meta_description: isNew || !formData.meta_description ? generateMetaDescription(content) : formData.meta_description,
                })}
                placeholder="Start writing your page content..."
              />
            </div>
          ) : (
            <div>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <label className="block text-sm font-medium">Page Sections</label>
                  <p className="text-sm text-muted-foreground">
                    Drag and drop sections to build your page. Click on a section to edit it.
                  </p>
                </div>
                <div className="flex gap-2">
                  {sections.length === 0 ? (
                    <button
                      type="button"
                      onClick={initializeDefaultSections}
                      className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
                    >
                      Load Default Sections
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={resetToDefaultContent}
                      className="px-4 py-2 text-sm border border-orange-500 text-orange-600 rounded-lg hover:bg-orange-50"
                    >
                      Reset to Website Content
                    </button>
                  )}
                </div>
              </div>
              <PageBuilder
                sections={sections}
                onSectionsChange={handleSectionsChange}
                onSectionAdd={handleSectionAdd}
                onSectionUpdate={handleSectionUpdate}
                onSectionDelete={handleSectionDelete}
              />
            </div>
          )}

          {/* Page Images */}
          <div className="bg-muted/30 rounded-lg p-4 space-y-4">
            <h3 className="font-medium text-foreground">Page Images</h3>
            
            {/* Header/Banner Background Image */}
            <div>
              <label className="block text-sm font-medium mb-2">Header Background Image</label>
              <p className="text-xs text-muted-foreground mb-2">Background image for the page title/header section</p>
              <ImageUpload
                value={formData.header_image}
                onChange={(url) => setFormData({ ...formData, header_image: url })}
                folder="pages"
                placeholder="Upload header background"
              />
            </div>

            {/* Featured Image */}
            <div>
              <label className="block text-sm font-medium mb-2">Featured Image</label>
              <p className="text-xs text-muted-foreground mb-2">Main image for the page (used in previews/cards)</p>
              <ImageUpload
                value={formData.featured_image}
                onChange={(url) => setFormData({ ...formData, featured_image: url })}
                folder="pages"
                placeholder="Upload featured image"
              />
            </div>

            {/* Gallery Images */}
            <div>
              <label className="block text-sm font-medium mb-2">Gallery Images</label>
              <p className="text-xs text-muted-foreground mb-2">Additional images for the page</p>
              
              <div className="flex flex-wrap gap-3 mb-3">
                {formData.gallery_images.map((img, index) => (
                  <div key={index} className="relative group">
                    <img src={img} alt="" className="w-24 h-24 object-cover rounded-lg border border-border" />
                    <button
                      type="button"
                      onClick={() => {
                        const newImages = formData.gallery_images.filter((_, i) => i !== index);
                        setFormData({ ...formData, gallery_images: newImages });
                      }}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>

              <input
                ref={galleryInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={async (e) => {
                  const files = e.target.files;
                  if (!files || files.length === 0) return;
                  setUploadingGallery(true);
                  const newImages: string[] = [];
                  for (let i = 0; i < files.length; i++) {
                    try {
                      const result = await filesApi.upload(files[i], 'pages');
                      if (result.url) newImages.push(result.url);
                    } catch (err) {
                      toast.error(`Failed to upload ${files[i].name}`);
                    }
                  }
                  setFormData({ ...formData, gallery_images: [...formData.gallery_images, ...newImages] });
                  setUploadingGallery(false);
                  if (newImages.length > 0) toast.success(`${newImages.length} image(s) uploaded`);
                  if (galleryInputRef.current) galleryInputRef.current.value = '';
                }}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => galleryInputRef.current?.click()}
                disabled={uploadingGallery}
                className="flex items-center gap-2 px-4 py-2 border border-dashed border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-colors text-sm"
              >
                <Upload size={16} />
                {uploadingGallery ? 'Uploading...' : 'Upload Images'}
              </button>
            </div>
          </div>

          {/* SEO Settings */}
          <div className="bg-muted/30 rounded-lg p-4 space-y-4">
            <h3 className="font-medium text-foreground">SEO Settings</h3>
            <div>
              <label className="block text-sm font-medium mb-2">Meta Title</label>
              <input
                type="text"
                value={formData.meta_title}
                onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                placeholder="Page title for search engines"
                className="w-full px-4 py-2.5 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Meta Description</label>
              <textarea
                value={formData.meta_description}
                onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                placeholder="Brief description for search engines (150-160 characters)"
                rows={2}
                className="w-full px-4 py-2.5 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
              />
            </div>
          </div>

          {/* Publish Status */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="is_published"
              checked={formData.is_published}
              onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
              className="w-4 h-4 rounded"
            />
            <label htmlFor="is_published" className="text-sm">
              Published (visible on website)
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={() => navigate("/admin/pages")}
              className="px-6 py-2.5 border border-border rounded-lg hover:bg-muted"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
              className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50"
            >
              <Save size={16} />
              {isNew ? "Create Page" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default AdminPageEdit;
