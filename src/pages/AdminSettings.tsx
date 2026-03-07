import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { settingsApi, filesApi } from "@/lib/api";
import AdminLayout from "@/components/AdminLayout";
import { Save, Upload, AlertTriangle, Globe, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Youtube } from "lucide-react";
import { toast } from "sonner";

const AdminSettings = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("general");
  const [formData, setFormData] = useState({
    site_name: "",
    site_tagline: "",
    site_logo: "",
    site_favicon: "",
    maintenance_mode: false,
    maintenance_message: "",
    contact_email: "",
    contact_phone: "",
    contact_address: "",
    social_facebook: "",
    social_twitter: "",
    social_instagram: "",
    social_linkedin: "",
    social_youtube: "",
    social_tiktok: "",
    google_analytics_id: "",
    meta_description: "",
    meta_keywords: "",
    footer_text: "",
  });

  const { data: settings, isLoading } = useQuery({
    queryKey: ["settings"],
    queryFn: settingsApi.get,
  });

  useEffect(() => {
    if (settings) {
      setFormData((prev) => ({ ...prev, ...settings }));
    }
  }, [settings]);

  const updateMutation = useMutation({
    mutationFn: settingsApi.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
      toast.success("Settings saved successfully");
    },
    onError: (err: any) => toast.error(err.message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Filter out id, created_at, updated_at before sending
    const { id, created_at, updated_at, ...dataToSend } = formData as any;
    updateMutation.mutate(dataToSend);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const result = await filesApi.upload(file, "branding");
      setFormData({ ...formData, [field]: result.url });
      toast.success("Image uploaded");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const tabs = [
    { id: "general", label: "General", icon: Globe },
    { id: "contact", label: "Contact", icon: Mail },
    { id: "social", label: "Social Media", icon: Facebook },
    { id: "seo", label: "SEO", icon: Globe },
    { id: "maintenance", label: "Maintenance", icon: AlertTriangle },
  ];

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="p-6">
          <p className="text-muted-foreground">Loading settings...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Site Settings</h1>
          <p className="text-sm text-muted-foreground">Configure your website settings</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 border-b border-border">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* General Tab */}
          {activeTab === "general" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Site Name</label>
                <input
                  type="text"
                  value={formData.site_name}
                  onChange={(e) => setFormData({ ...formData, site_name: e.target.value })}
                  className="w-full px-4 py-2.5 border border-border rounded-lg bg-background"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Tagline</label>
                <input
                  type="text"
                  value={formData.site_tagline}
                  onChange={(e) => setFormData({ ...formData, site_tagline: e.target.value })}
                  className="w-full px-4 py-2.5 border border-border rounded-lg bg-background"
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Site Logo</label>
                  {formData.site_logo && (
                    <img src={formData.site_logo} alt="Logo" className="h-16 mb-2" />
                  )}
                  <label className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg cursor-pointer hover:bg-muted">
                    <Upload size={16} />
                    Upload Logo
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, "site_logo")} className="hidden" />
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Favicon</label>
                  {formData.site_favicon && (
                    <img src={formData.site_favicon} alt="Favicon" className="h-8 mb-2" />
                  )}
                  <label className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg cursor-pointer hover:bg-muted">
                    <Upload size={16} />
                    Upload Favicon
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, "site_favicon")} className="hidden" />
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Footer Text</label>
                <textarea
                  value={formData.footer_text}
                  onChange={(e) => setFormData({ ...formData, footer_text: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2.5 border border-border rounded-lg bg-background resize-none"
                />
              </div>
            </div>
          )}

          {/* Contact Tab */}
          {activeTab === "contact" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  <Mail size={14} className="inline mr-1" /> Email Address
                </label>
                <input
                  type="email"
                  value={formData.contact_email}
                  onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                  className="w-full px-4 py-2.5 border border-border rounded-lg bg-background"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  <Phone size={14} className="inline mr-1" /> Phone Number
                </label>
                <input
                  type="text"
                  value={formData.contact_phone}
                  onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                  className="w-full px-4 py-2.5 border border-border rounded-lg bg-background"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  <MapPin size={14} className="inline mr-1" /> Address
                </label>
                <textarea
                  value={formData.contact_address}
                  onChange={(e) => setFormData({ ...formData, contact_address: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-border rounded-lg bg-background resize-none"
                />
              </div>
            </div>
          )}

          {/* Social Media Tab */}
          {activeTab === "social" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  <Facebook size={14} className="inline mr-1" /> Facebook URL
                </label>
                <input
                  type="url"
                  value={formData.social_facebook}
                  onChange={(e) => setFormData({ ...formData, social_facebook: e.target.value })}
                  placeholder="https://facebook.com/..."
                  className="w-full px-4 py-2.5 border border-border rounded-lg bg-background"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  <Twitter size={14} className="inline mr-1" /> Twitter/X URL
                </label>
                <input
                  type="url"
                  value={formData.social_twitter}
                  onChange={(e) => setFormData({ ...formData, social_twitter: e.target.value })}
                  placeholder="https://twitter.com/..."
                  className="w-full px-4 py-2.5 border border-border rounded-lg bg-background"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  <Instagram size={14} className="inline mr-1" /> Instagram URL
                </label>
                <input
                  type="url"
                  value={formData.social_instagram}
                  onChange={(e) => setFormData({ ...formData, social_instagram: e.target.value })}
                  placeholder="https://instagram.com/..."
                  className="w-full px-4 py-2.5 border border-border rounded-lg bg-background"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  <Linkedin size={14} className="inline mr-1" /> LinkedIn URL
                </label>
                <input
                  type="url"
                  value={formData.social_linkedin}
                  onChange={(e) => setFormData({ ...formData, social_linkedin: e.target.value })}
                  placeholder="https://linkedin.com/in/..."
                  className="w-full px-4 py-2.5 border border-border rounded-lg bg-background"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  <Youtube size={14} className="inline mr-1" /> YouTube URL
                </label>
                <input
                  type="url"
                  value={formData.social_youtube}
                  onChange={(e) => setFormData({ ...formData, social_youtube: e.target.value })}
                  placeholder="https://youtube.com/..."
                  className="w-full px-4 py-2.5 border border-border rounded-lg bg-background"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">TikTok URL</label>
                <input
                  type="url"
                  value={formData.social_tiktok}
                  onChange={(e) => setFormData({ ...formData, social_tiktok: e.target.value })}
                  placeholder="https://tiktok.com/@..."
                  className="w-full px-4 py-2.5 border border-border rounded-lg bg-background"
                />
              </div>
            </div>
          )}

          {/* SEO Tab */}
          {activeTab === "seo" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Meta Description</label>
                <textarea
                  value={formData.meta_description}
                  onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                  rows={3}
                  placeholder="A brief description of your website for search engines"
                  className="w-full px-4 py-2.5 border border-border rounded-lg bg-background resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Meta Keywords</label>
                <input
                  type="text"
                  value={formData.meta_keywords}
                  onChange={(e) => setFormData({ ...formData, meta_keywords: e.target.value })}
                  placeholder="keyword1, keyword2, keyword3"
                  className="w-full px-4 py-2.5 border border-border rounded-lg bg-background"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Google Analytics ID</label>
                <input
                  type="text"
                  value={formData.google_analytics_id}
                  onChange={(e) => setFormData({ ...formData, google_analytics_id: e.target.value })}
                  placeholder="G-XXXXXXXXXX or UA-XXXXXXXX-X"
                  className="w-full px-4 py-2.5 border border-border rounded-lg bg-background"
                />
              </div>
            </div>
          )}

          {/* Maintenance Tab */}
          {activeTab === "maintenance" && (
            <div className="space-y-4">
              <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="text-yellow-500" size={24} />
                  <div>
                    <h3 className="font-medium text-yellow-600">Maintenance Mode</h3>
                    <p className="text-sm text-muted-foreground">
                      When enabled, visitors will see a maintenance message instead of the website.
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="maintenance_mode"
                  checked={formData.maintenance_mode}
                  onChange={(e) => setFormData({ ...formData, maintenance_mode: e.target.checked })}
                  className="w-5 h-5 rounded"
                />
                <label htmlFor="maintenance_mode" className="font-medium">
                  Enable Maintenance Mode
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Maintenance Message</label>
                <textarea
                  value={formData.maintenance_message}
                  onChange={(e) => setFormData({ ...formData, maintenance_message: e.target.value })}
                  rows={4}
                  placeholder="We're currently performing scheduled maintenance. Please check back soon."
                  className="w-full px-4 py-2.5 border border-border rounded-lg bg-background resize-none"
                />
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="pt-4 border-t border-border">
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50"
            >
              <Save size={16} />
              {updateMutation.isPending ? "Saving..." : "Save Settings"}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
