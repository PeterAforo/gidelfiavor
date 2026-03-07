import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Plus, Trash2, Edit2, Eye, EyeOff, ChevronDown, ChevronUp } from "lucide-react";
import RichTextEditor from "./RichTextEditor";
import ImageUpload from "./ImageUpload";

// Section types available
const SECTION_TYPES = [
  { type: "hero", label: "Hero Banner", icon: "🎯" },
  { type: "text", label: "Text Content", icon: "📝" },
  { type: "image", label: "Image", icon: "🖼️" },
  { type: "gallery", label: "Image Gallery", icon: "📸" },
  { type: "cta", label: "Call to Action", icon: "📢" },
  { type: "features", label: "Features Grid", icon: "✨" },
  { type: "testimonials", label: "Testimonials", icon: "💬" },
  { type: "contact", label: "Contact Form", icon: "📧" },
  { type: "video", label: "Video Embed", icon: "🎬" },
  { type: "social", label: "Social Feed", icon: "📱" },
  { type: "spacer", label: "Spacer", icon: "↕️" },
  { type: "divider", label: "Divider", icon: "➖" },
  { type: "html", label: "Custom HTML", icon: "🔧" },
];

interface Section {
  id: number;
  section_type: string;
  title: string;
  content: any;
  settings: any;
  sort_order: number;
  is_visible: boolean;
}

interface PageBuilderProps {
  sections: Section[];
  onSectionsChange: (sections: Section[]) => void;
  onSectionAdd: (section: Partial<Section>) => void;
  onSectionUpdate: (id: number, data: Partial<Section>) => void;
  onSectionDelete: (id: number) => void;
}

// Sortable Section Item
const SortableSection = ({
  section,
  onEdit,
  onDelete,
  onToggleVisibility,
  isEditing,
  onSave,
  onCancel,
  editData,
  setEditData,
}: any) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const sectionType = SECTION_TYPES.find((t) => t.type === section.section_type);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-card border rounded-lg mb-3 ${
        isDragging ? "shadow-lg" : "border-border"
      } ${!section.is_visible ? "opacity-60" : ""}`}
    >
      {/* Section Header */}
      <div className="flex items-center gap-3 p-3 border-b border-border">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
        >
          <GripVertical size={18} />
        </button>
        <span className="text-lg">{sectionType?.icon}</span>
        <div className="flex-1">
          <p className="font-medium text-sm">{section.title || sectionType?.label}</p>
          <p className="text-xs text-muted-foreground">{sectionType?.label}</p>
        </div>
        <button
          onClick={() => onToggleVisibility(section.id, !section.is_visible)}
          className="p-1.5 text-muted-foreground hover:text-foreground rounded"
          title={section.is_visible ? "Hide section" : "Show section"}
        >
          {section.is_visible ? <Eye size={16} /> : <EyeOff size={16} />}
        </button>
        <button
          onClick={() => onEdit(section)}
          className="p-1.5 text-muted-foreground hover:text-primary rounded"
        >
          <Edit2 size={16} />
        </button>
        <button
          onClick={() => onDelete(section.id)}
          className="p-1.5 text-muted-foreground hover:text-destructive rounded"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* Section Editor (when editing) */}
      {isEditing && (
        <div className="p-4 bg-muted/30">
          <SectionEditor
            section={section}
            editData={editData}
            setEditData={setEditData}
            onSave={onSave}
            onCancel={onCancel}
          />
        </div>
      )}
    </div>
  );
};

// Section Editor Component with proper layouts matching website
const SectionEditor = ({ section, editData, setEditData, onSave, onCancel }: any) => {
  
  // Helper to update items array
  const updateItem = (index: number, field: string, value: any) => {
    const items = [...(editData.content?.items || [])];
    items[index] = { ...items[index], [field]: value };
    setEditData({ ...editData, content: { ...editData.content, items } });
  };

  const addItem = (defaultItem: any) => {
    const items = [...(editData.content?.items || []), defaultItem];
    setEditData({ ...editData, content: { ...editData.content, items } });
  };

  const removeItem = (index: number) => {
    const items = (editData.content?.items || []).filter((_: any, i: number) => i !== index);
    setEditData({ ...editData, content: { ...editData.content, items } });
  };

  const renderFields = () => {
    switch (section.section_type) {
      case "hero":
        return (
          <div className="space-y-4">
            <p className="text-xs text-muted-foreground bg-blue-50 p-2 rounded">
              🎯 <strong>Hero Banner</strong> - Full-width banner with heading, subheading, background image, and call-to-action button.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Heading</label>
                <input
                  type="text"
                  value={editData.content?.heading || ""}
                  onChange={(e) => setEditData({ ...editData, content: { ...editData.content, heading: e.target.value } })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                  placeholder="Welcome to My Website"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Subheading</label>
                <input
                  type="text"
                  value={editData.content?.subheading || ""}
                  onChange={(e) => setEditData({ ...editData, content: { ...editData.content, subheading: e.target.value } })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                  placeholder="Your tagline here"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Background Image</label>
              <ImageUpload
                value={editData.content?.backgroundImage}
                onChange={(url) => setEditData({ ...editData, content: { ...editData.content, backgroundImage: url } })}
                folder="heroes"
                placeholder="Upload hero background image"
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Button Text</label>
                <input
                  type="text"
                  value={editData.content?.buttonText || ""}
                  onChange={(e) => setEditData({ ...editData, content: { ...editData.content, buttonText: e.target.value } })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                  placeholder="Learn More"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Button Link</label>
                <input
                  type="text"
                  value={editData.content?.buttonLink || ""}
                  onChange={(e) => setEditData({ ...editData, content: { ...editData.content, buttonLink: e.target.value } })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                  placeholder="/about"
                />
              </div>
            </div>
          </div>
        );

      case "text":
        return (
          <div className="space-y-4">
            <p className="text-xs text-muted-foreground bg-blue-50 p-2 rounded">
              📝 <strong>Text + Image Section</strong> - Content with optional image on left or right side.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Section Title</label>
                <input
                  type="text"
                  value={editData.title || ""}
                  onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Subtitle</label>
                <input
                  type="text"
                  value={editData.content?.subtitle || ""}
                  onChange={(e) => setEditData({ ...editData, content: { ...editData.content, subtitle: e.target.value } })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                  placeholder="About Me"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Content</label>
              <RichTextEditor
                content={editData.content?.html || ""}
                onChange={(html) => setEditData({ ...editData, content: { ...editData.content, html } })}
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Section Images</label>
                  <ImageUpload
                    value={editData.content?.image}
                    onChange={(url) => setEditData({ ...editData, content: { ...editData.content, image: url } })}
                    folder="sections"
                    placeholder="Upload primary image"
                  />
                </div>
                {/* Additional images */}
                <div>
                  <label className="block text-sm font-medium mb-1">Additional Images (optional)</label>
                  <div className="space-y-2">
                    {(editData.content?.additionalImages || []).map((img: string, idx: number) => (
                      <div key={idx} className="flex gap-2 items-center">
                        <img src={img} alt="" className="w-12 h-12 object-cover rounded" />
                        <input
                          type="text"
                          value={img}
                          onChange={(e) => {
                            const newImages = [...(editData.content?.additionalImages || [])];
                            newImages[idx] = e.target.value;
                            setEditData({ ...editData, content: { ...editData.content, additionalImages: newImages } });
                          }}
                          className="flex-1 px-2 py-1 text-sm border border-border rounded bg-background"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newImages = (editData.content?.additionalImages || []).filter((_: any, i: number) => i !== idx);
                            setEditData({ ...editData, content: { ...editData.content, additionalImages: newImages } });
                          }}
                          className="text-destructive text-xs px-2 py-1"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    <ImageUpload
                      value=""
                      onChange={(url) => {
                        if (url) {
                          const newImages = [...(editData.content?.additionalImages || []), url];
                          setEditData({ ...editData, content: { ...editData.content, additionalImages: newImages } });
                        }
                      }}
                      folder="sections"
                      placeholder="+ Add another image"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Image Display</label>
                  <select
                    value={editData.settings?.imageDisplay || "single"}
                    onChange={(e) => setEditData({ ...editData, settings: { ...editData.settings, imageDisplay: e.target.value } })}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                  >
                    <option value="single">Single Image</option>
                    <option value="stacked">Stacked (Vertical)</option>
                    <option value="grid">Grid (2 columns)</option>
                    <option value="carousel">Carousel/Slider</option>
                  </select>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Image Position</label>
                  <select
                    value={editData.settings?.imagePosition || "right"}
                    onChange={(e) => setEditData({ ...editData, settings: { ...editData.settings, imagePosition: e.target.value } })}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                  >
                    <option value="left">Left</option>
                    <option value="right">Right</option>
                    <option value="none">No Image</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Column Layout</label>
                  <select
                    value={editData.settings?.columnLayout || "50-50"}
                    onChange={(e) => setEditData({ ...editData, settings: { ...editData.settings, columnLayout: e.target.value } })}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                  >
                    <option value="50-50">50% / 50% (Equal)</option>
                    <option value="60-40">60% / 40%</option>
                    <option value="40-60">40% / 60%</option>
                    <option value="70-30">70% / 30%</option>
                    <option value="30-70">30% / 70%</option>
                    <option value="75-25">75% / 25%</option>
                    <option value="25-75">25% / 75%</option>
                    <option value="100">Full Width (Stacked)</option>
                  </select>
                  <p className="text-xs text-muted-foreground mt-1">Content / Image ratio</p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Button Text (optional)</label>
                  <input
                    type="text"
                    value={editData.content?.buttonText || ""}
                    onChange={(e) => setEditData({ ...editData, content: { ...editData.content, buttonText: e.target.value } })}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                    placeholder="Learn More"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Button Link</label>
                  <input
                    type="text"
                    value={editData.content?.buttonLink || ""}
                    onChange={(e) => setEditData({ ...editData, content: { ...editData.content, buttonLink: e.target.value } })}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                    placeholder="/about"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case "features":
        const featureItems = editData.content?.items || [];
        return (
          <div className="space-y-4">
            <p className="text-xs text-muted-foreground bg-blue-50 p-2 rounded">
              ✨ <strong>Features Grid</strong> - Display services, expertise, or features in a grid layout with icons.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Section Title</label>
                <input
                  type="text"
                  value={editData.content?.heading || ""}
                  onChange={(e) => setEditData({ ...editData, content: { ...editData.content, heading: e.target.value } })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                  placeholder="What I Do"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Columns</label>
                <select
                  value={editData.settings?.columns || 4}
                  onChange={(e) => setEditData({ ...editData, settings: { ...editData.settings, columns: Number(e.target.value) } })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                >
                  <option value={2}>2 Columns</option>
                  <option value={3}>3 Columns</option>
                  <option value={4}>4 Columns</option>
                </select>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium">Feature Items</label>
                <button
                  type="button"
                  onClick={() => addItem({ icon: "Star", title: "New Feature", description: "Description here" })}
                  className="text-xs px-2 py-1 bg-primary text-primary-foreground rounded"
                >
                  + Add Item
                </button>
              </div>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {featureItems.map((item: any, i: number) => (
                  <div key={i} className="border border-border rounded-lg p-3 bg-background">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs text-muted-foreground">Item {i + 1}</span>
                      <button type="button" onClick={() => removeItem(i)} className="text-destructive text-xs">Remove</button>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <input
                        type="text"
                        value={item.icon || ""}
                        onChange={(e) => updateItem(i, "icon", e.target.value)}
                        placeholder="Icon (e.g., BookOpen)"
                        className="px-2 py-1 text-sm border border-border rounded bg-background"
                      />
                      <input
                        type="text"
                        value={item.title || ""}
                        onChange={(e) => updateItem(i, "title", e.target.value)}
                        placeholder="Title"
                        className="px-2 py-1 text-sm border border-border rounded bg-background"
                      />
                      <input
                        type="text"
                        value={item.description || ""}
                        onChange={(e) => updateItem(i, "description", e.target.value)}
                        placeholder="Description"
                        className="px-2 py-1 text-sm border border-border rounded bg-background"
                      />
                    </div>
                  </div>
                ))}
                {featureItems.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">No items yet. Click "Add Item" to add features.</p>
                )}
              </div>
            </div>
          </div>
        );

      case "gallery":
        const galleryItems = editData.content?.items || [];
        return (
          <div className="space-y-4">
            <p className="text-xs text-muted-foreground bg-blue-50 p-2 rounded">
              📸 <strong>Gallery/Cards Grid</strong> - Display images, books, articles, or any cards in a grid.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Section Title</label>
                <input
                  type="text"
                  value={editData.content?.heading || ""}
                  onChange={(e) => setEditData({ ...editData, content: { ...editData.content, heading: e.target.value } })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                  placeholder="My Books"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Layout</label>
                <select
                  value={editData.settings?.layout || "grid"}
                  onChange={(e) => setEditData({ ...editData, settings: { ...editData.settings, layout: e.target.value } })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                >
                  <option value="grid">Grid (3 columns)</option>
                  <option value="alternating">Alternating (image left/right)</option>
                  <option value="masonry">Masonry</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Data Source</label>
              <select
                value={editData.settings?.dataSource || "custom"}
                onChange={(e) => setEditData({ ...editData, settings: { ...editData.settings, dataSource: e.target.value } })}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background"
              >
                <option value="custom">Custom Items (add below)</option>
                <option value="books">Books (from database)</option>
                <option value="articles">Articles (from database)</option>
                <option value="testimonials">Testimonials (from database)</option>
                <option value="gallery">Gallery Images (from database)</option>
              </select>
            </div>
            
            {editData.settings?.dataSource === "custom" && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium">Gallery Items</label>
                  <button
                    type="button"
                    onClick={() => addItem({ image: "", title: "New Item", description: "" })}
                    className="text-xs px-2 py-1 bg-primary text-primary-foreground rounded"
                  >
                    + Add Item
                  </button>
                </div>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {galleryItems.map((item: any, i: number) => (
                    <div key={i} className="border border-border rounded-lg p-3 bg-background">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs text-muted-foreground">Item {i + 1}</span>
                        <button type="button" onClick={() => removeItem(i)} className="text-destructive text-xs">Remove</button>
                      </div>
                      <div className="grid md:grid-cols-2 gap-2">
                        <div>
                          <ImageUpload
                            value={item.image}
                            onChange={(url) => updateItem(i, "image", url)}
                            folder="gallery"
                            placeholder="Upload image"
                          />
                        </div>
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={item.title || ""}
                            onChange={(e) => updateItem(i, "title", e.target.value)}
                            placeholder="Title"
                            className="w-full px-2 py-1 text-sm border border-border rounded bg-background"
                          />
                          <textarea
                            value={item.description || ""}
                            onChange={(e) => updateItem(i, "description", e.target.value)}
                            placeholder="Description"
                            rows={2}
                            className="w-full px-2 py-1 text-sm border border-border rounded bg-background resize-none"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case "image":
        return (
          <div className="space-y-4">
            <p className="text-xs text-muted-foreground bg-blue-50 p-2 rounded">
              🖼️ <strong>Single Image</strong> - Display a single image with optional caption.
            </p>
            <div>
              <label className="block text-sm font-medium mb-1">Image</label>
              <ImageUpload
                value={editData.content?.imageUrl}
                onChange={(url) => setEditData({ ...editData, content: { ...editData.content, imageUrl: url } })}
                folder="sections"
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Caption</label>
                <input
                  type="text"
                  value={editData.content?.caption || ""}
                  onChange={(e) => setEditData({ ...editData, content: { ...editData.content, caption: e.target.value } })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Alt Text</label>
                <input
                  type="text"
                  value={editData.content?.altText || ""}
                  onChange={(e) => setEditData({ ...editData, content: { ...editData.content, altText: e.target.value } })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                />
              </div>
            </div>
          </div>
        );

      case "cta":
        return (
          <div className="space-y-4">
            <p className="text-xs text-muted-foreground bg-blue-50 p-2 rounded">
              📢 <strong>Call to Action</strong> - Highlight section with heading, description, and button.
            </p>
            <div>
              <label className="block text-sm font-medium mb-1">Heading</label>
              <input
                type="text"
                value={editData.content?.heading || ""}
                onChange={(e) => setEditData({ ...editData, content: { ...editData.content, heading: e.target.value } })}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                placeholder="Ready to Get Started?"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                value={editData.content?.description || ""}
                onChange={(e) => setEditData({ ...editData, content: { ...editData.content, description: e.target.value } })}
                rows={3}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background resize-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Button Text</label>
                <input
                  type="text"
                  value={editData.content?.buttonText || ""}
                  onChange={(e) => setEditData({ ...editData, content: { ...editData.content, buttonText: e.target.value } })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Button Link</label>
                <input
                  type="text"
                  value={editData.content?.buttonLink || ""}
                  onChange={(e) => setEditData({ ...editData, content: { ...editData.content, buttonLink: e.target.value } })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                />
              </div>
            </div>
          </div>
        );

      case "testimonials":
        return (
          <div className="space-y-4">
            <p className="text-xs text-muted-foreground bg-blue-50 p-2 rounded">
              💬 <strong>Testimonials</strong> - Display customer/reader testimonials in a grid or carousel.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Section Title</label>
                <input
                  type="text"
                  value={editData.content?.heading || ""}
                  onChange={(e) => setEditData({ ...editData, content: { ...editData.content, heading: e.target.value } })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                  placeholder="What Readers Say"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Data Source</label>
                <select
                  value={editData.settings?.dataSource || "database"}
                  onChange={(e) => setEditData({ ...editData, settings: { ...editData.settings, dataSource: e.target.value } })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                >
                  <option value="database">From Database (Testimonials)</option>
                  <option value="custom">Custom Items</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Max Items to Show</label>
              <input
                type="number"
                value={editData.settings?.maxItems || 3}
                onChange={(e) => setEditData({ ...editData, settings: { ...editData.settings, maxItems: Number(e.target.value) } })}
                className="w-32 px-3 py-2 border border-border rounded-lg bg-background"
              />
            </div>
          </div>
        );

      case "contact":
        return (
          <div className="space-y-4">
            <p className="text-xs text-muted-foreground bg-blue-50 p-2 rounded">
              📧 <strong>Contact Form</strong> - Display a contact form with configurable fields.
            </p>
            <div>
              <label className="block text-sm font-medium mb-1">Section Title</label>
              <input
                type="text"
                value={editData.content?.heading || ""}
                onChange={(e) => setEditData({ ...editData, content: { ...editData.content, heading: e.target.value } })}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                placeholder="Get in Touch"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                value={editData.content?.description || ""}
                onChange={(e) => setEditData({ ...editData, content: { ...editData.content, description: e.target.value } })}
                rows={2}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background resize-none"
                placeholder="Fill out the form below and I'll get back to you..."
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Email Recipient</label>
                <input
                  type="email"
                  value={editData.settings?.recipientEmail || ""}
                  onChange={(e) => setEditData({ ...editData, settings: { ...editData.settings, recipientEmail: e.target.value } })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Submit Button Text</label>
                <input
                  type="text"
                  value={editData.content?.buttonText || "Send Message"}
                  onChange={(e) => setEditData({ ...editData, content: { ...editData.content, buttonText: e.target.value } })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                />
              </div>
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={editData.settings?.showContactInfo !== false}
                  onChange={(e) => setEditData({ ...editData, settings: { ...editData.settings, showContactInfo: e.target.checked } })}
                  className="rounded"
                />
                Show contact info cards (address, email, phone)
              </label>
            </div>
          </div>
        );

      case "video":
        return (
          <div className="space-y-4">
            <p className="text-xs text-muted-foreground bg-blue-50 p-2 rounded">
              🎬 <strong>Video Embed</strong> - Embed a YouTube or Vimeo video.
            </p>
            <div>
              <label className="block text-sm font-medium mb-1">Video URL (YouTube/Vimeo)</label>
              <input
                type="text"
                value={editData.content?.videoUrl || ""}
                onChange={(e) => setEditData({ ...editData, content: { ...editData.content, videoUrl: e.target.value } })}
                placeholder="https://youtube.com/watch?v=..."
                className="w-full px-3 py-2 border border-border rounded-lg bg-background"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                value={editData.content?.title || ""}
                onChange={(e) => setEditData({ ...editData, content: { ...editData.content, title: e.target.value } })}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background"
              />
            </div>
          </div>
        );

      case "spacer":
        return (
          <div>
            <label className="block text-sm font-medium mb-1">Height (px)</label>
            <input
              type="number"
              value={editData.settings?.height || 50}
              onChange={(e) => setEditData({ ...editData, settings: { ...editData.settings, height: parseInt(e.target.value) } })}
              className="w-32 px-3 py-2 border border-border rounded-lg bg-background"
            />
          </div>
        );

      case "html":
        return (
          <div>
            <label className="block text-sm font-medium mb-1">Custom HTML</label>
            <textarea
              value={editData.content?.html || ""}
              onChange={(e) => setEditData({ ...editData, content: { ...editData.content, html: e.target.value } })}
              rows={10}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background font-mono text-sm resize-y"
              placeholder="<div>Your custom HTML here...</div>"
            />
          </div>
        );

      case "social":
        return (
          <div className="space-y-4">
            <p className="text-xs text-muted-foreground bg-blue-50 p-2 rounded">
              📱 <strong>Social Feed</strong> - Display posts from your connected social media accounts.
            </p>
            <div>
              <label className="block text-sm font-medium mb-1">Section Title</label>
              <input
                type="text"
                value={editData.title || ""}
                onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                placeholder="Follow Us on Social Media"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Social Platform</label>
              <select
                value={editData.settings?.platform || "all"}
                onChange={(e) => setEditData({ ...editData, settings: { ...editData.settings, platform: e.target.value } })}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background"
              >
                <option value="all">All Platforms</option>
                <option value="facebook">Facebook Only</option>
                <option value="twitter">Twitter/X Only</option>
                <option value="instagram">Instagram Only</option>
                <option value="linkedin">LinkedIn Only</option>
                <option value="youtube">YouTube Only</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Number of Posts to Show</label>
              <input
                type="number"
                value={editData.settings?.postsCount || 6}
                onChange={(e) => setEditData({ ...editData, settings: { ...editData.settings, postsCount: parseInt(e.target.value) || 6 } })}
                min={1}
                max={20}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Layout</label>
              <select
                value={editData.settings?.layout || "grid"}
                onChange={(e) => setEditData({ ...editData, settings: { ...editData.settings, layout: e.target.value } })}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background"
              >
                <option value="grid">Grid (3 columns)</option>
                <option value="carousel">Carousel</option>
                <option value="list">List</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Media Type</label>
              <select
                value={editData.settings?.mediaType || "all"}
                onChange={(e) => setEditData({ ...editData, settings: { ...editData.settings, mediaType: e.target.value } })}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background"
              >
                <option value="all">All Content</option>
                <option value="images">Images Only</option>
                <option value="videos">Videos Only</option>
                <option value="text">Text Only (No Media)</option>
              </select>
            </div>
            <p className="text-xs text-muted-foreground">
              Connect social accounts in Admin → Social Feeds to display posts here.
            </p>
          </div>
        );

      default:
        return (
          <div>
            <label className="block text-sm font-medium mb-1">Section Title</label>
            <input
              type="text"
              value={editData.title || ""}
              onChange={(e) => setEditData({ ...editData, title: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background"
            />
          </div>
        );
    }
  };

  // Common color options for all sections
  const renderColorOptions = () => (
    <div className="border-t border-border pt-4 mt-4">
      <p className="text-xs font-medium text-muted-foreground mb-3">🎨 Section Styling</p>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Background Color</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={editData.settings?.backgroundColor || "#ffffff"}
              onChange={(e) => setEditData({ ...editData, settings: { ...editData.settings, backgroundColor: e.target.value } })}
              className="w-10 h-10 rounded border border-border cursor-pointer"
            />
            <select
              value={editData.settings?.backgroundColor || ""}
              onChange={(e) => setEditData({ ...editData, settings: { ...editData.settings, backgroundColor: e.target.value } })}
              className="flex-1 px-2 py-1 border border-border rounded-lg bg-background text-sm"
            >
              <option value="">Custom</option>
              <option value="#ffffff">White</option>
              <option value="#f8f9fa">Light Gray</option>
              <option value="#f1f5f9">Slate 100</option>
              <option value="#fef3c7">Amber 100</option>
              <option value="#dbeafe">Blue 100</option>
              <option value="#dcfce7">Green 100</option>
              <option value="#fce7f3">Pink 100</option>
              <option value="#1f2937">Dark Gray</option>
              <option value="#0f172a">Slate 900</option>
              <option value="transparent">Transparent</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Text Color</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={editData.settings?.textColor || "#1f2937"}
              onChange={(e) => setEditData({ ...editData, settings: { ...editData.settings, textColor: e.target.value } })}
              className="w-10 h-10 rounded border border-border cursor-pointer"
            />
            <select
              value={editData.settings?.textColor || ""}
              onChange={(e) => setEditData({ ...editData, settings: { ...editData.settings, textColor: e.target.value } })}
              className="flex-1 px-2 py-1 border border-border rounded-lg bg-background text-sm"
            >
              <option value="">Custom</option>
              <option value="#1f2937">Dark Gray</option>
              <option value="#0f172a">Slate 900</option>
              <option value="#374151">Gray 700</option>
              <option value="#ffffff">White</option>
              <option value="#f8f9fa">Light</option>
              <option value="#3b82f6">Blue</option>
              <option value="#10b981">Green</option>
              <option value="#8b5cf6">Purple</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {renderFields()}
      {renderColorOptions()}
      <div className="flex gap-2 pt-2">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-sm border border-border rounded-lg hover:bg-muted"
        >
          Cancel
        </button>
        <button
          onClick={onSave}
          className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
        >
          Save Section
        </button>
      </div>
    </div>
  );
};

// Main Page Builder Component
const PageBuilder = ({
  sections,
  onSectionsChange,
  onSectionAdd,
  onSectionUpdate,
  onSectionDelete,
}: PageBuilderProps) => {
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<any>({});

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = sections.findIndex((s) => s.id === active.id);
      const newIndex = sections.findIndex((s) => s.id === over.id);
      const newSections = arrayMove(sections, oldIndex, newIndex).map((s, i) => ({
        ...s,
        sort_order: i,
      }));
      onSectionsChange(newSections);
    }
  };

  const handleAddSection = (type: string) => {
    const sectionType = SECTION_TYPES.find((t) => t.type === type);
    onSectionAdd({
      section_type: type,
      title: sectionType?.label || "",
      content: {},
      settings: {},
      sort_order: sections.length,
      is_visible: true,
    });
    setShowAddMenu(false);
  };

  const handleEdit = (section: Section) => {
    setEditingId(section.id);
    setEditData({
      title: section.title,
      content: section.content || {},
      settings: section.settings || {},
    });
  };

  const handleSave = () => {
    if (editingId) {
      onSectionUpdate(editingId, editData);
      setEditingId(null);
      setEditData({});
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditData({});
  };

  const handleToggleVisibility = (id: number, is_visible: boolean) => {
    onSectionUpdate(id, { is_visible });
  };

  const handleDelete = (id: number) => {
    if (confirm("Delete this section?")) {
      onSectionDelete(id);
    }
  };

  return (
    <div>
      {/* Sections List */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={sections.map((s) => s.id)}
          strategy={verticalListSortingStrategy}
        >
          {sections.map((section) => (
            <SortableSection
              key={section.id}
              section={section}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggleVisibility={handleToggleVisibility}
              isEditing={editingId === section.id}
              editData={editData}
              setEditData={setEditData}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          ))}
        </SortableContext>
      </DndContext>

      {sections.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed border-border rounded-lg mb-4">
          <p className="text-muted-foreground mb-2">No sections yet</p>
          <p className="text-sm text-muted-foreground">Add sections to build your page</p>
        </div>
      )}

      {/* Add Section Button */}
      <div className="relative">
        <button
          onClick={() => setShowAddMenu(!showAddMenu)}
          className="w-full py-3 border-2 border-dashed border-border rounded-lg text-muted-foreground hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2"
        >
          <Plus size={18} />
          Add Section
          {showAddMenu ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {showAddMenu && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg z-10 p-2 grid grid-cols-3 gap-2">
            {SECTION_TYPES.map((type) => (
              <button
                key={type.type}
                onClick={() => handleAddSection(type.type)}
                className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-muted text-left"
              >
                <span>{type.icon}</span>
                <span>{type.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageBuilder;
