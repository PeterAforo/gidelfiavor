import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { menusApi, pagesApi } from "@/lib/api";
import AdminLayout from "@/components/AdminLayout";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";

const AdminMenuEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isNew = id === "new";

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    page_id: null as number | null,
    parent_id: null as number | null,
    sort_order: 0,
    is_visible: true,
  });

  const { data: menu, isLoading } = useQuery({
    queryKey: ["menu", id],
    queryFn: async () => {
      const menus = await menusApi.getAll();
      return menus.find((m: any) => m.id === Number(id));
    },
    enabled: !isNew && !!id,
  });

  const { data: pages = [] } = useQuery({
    queryKey: ["pages"],
    queryFn: pagesApi.getAll,
  });

  const { data: menus = [] } = useQuery({
    queryKey: ["menus"],
    queryFn: menusApi.getAll,
  });

  useEffect(() => {
    if (menu) {
      setFormData({
        title: menu.title || "",
        slug: menu.slug || "",
        page_id: menu.page_id || null,
        parent_id: menu.parent_id || null,
        sort_order: menu.sort_order || 0,
        is_visible: menu.is_visible ?? true,
      });
    }
  }, [menu]);

  const createMutation = useMutation({
    mutationFn: menusApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menus"] });
      toast.success("Menu created successfully");
      navigate("/admin/menus");
    },
    onError: (err: any) => toast.error(err.message),
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => menusApi.update(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menus"] });
      toast.success("Menu updated successfully");
    },
    onError: (err: any) => toast.error(err.message),
  });

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
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
      <div className="p-6 max-w-2xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate("/admin/menus")}
            className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {isNew ? "Create New Menu" : "Edit Menu"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {isNew ? "Add a new menu item to navigation" : `Editing: ${formData.title}`}
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Menu Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => {
                setFormData({ 
                  ...formData, 
                  title: e.target.value,
                  slug: isNew ? generateSlug(e.target.value) : formData.slug
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

          <div>
            <label className="block text-sm font-medium mb-2">Link to Page</label>
            <select
              value={formData.page_id || ""}
              onChange={(e) => setFormData({ ...formData, page_id: e.target.value ? Number(e.target.value) : null })}
              className="w-full px-4 py-2.5 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="">-- No linked page --</option>
              {pages.map((page: any) => (
                <option key={page.id} value={page.id}>
                  {page.title}
                </option>
              ))}
            </select>
            <p className="text-xs text-muted-foreground mt-1">
              Optional: Link this menu to a page for dynamic content
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Parent Menu</label>
            <select
              value={formData.parent_id || ""}
              onChange={(e) => setFormData({ ...formData, parent_id: e.target.value ? Number(e.target.value) : null })}
              className="w-full px-4 py-2.5 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="">-- No parent (top level) --</option>
              {menus
                .filter((m: any) => m.id !== Number(id))
                .map((m: any) => (
                  <option key={m.id} value={m.id}>
                    {m.title}
                  </option>
                ))}
            </select>
            <p className="text-xs text-muted-foreground mt-1">
              Optional: Make this a submenu of another menu item
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Sort Order</label>
            <input
              type="number"
              value={formData.sort_order}
              onChange={(e) => setFormData({ ...formData, sort_order: Number(e.target.value) })}
              className="w-32 px-4 py-2.5 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Lower numbers appear first in navigation
            </p>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="is_visible"
              checked={formData.is_visible}
              onChange={(e) => setFormData({ ...formData, is_visible: e.target.checked })}
              className="w-4 h-4 rounded"
            />
            <label htmlFor="is_visible" className="text-sm">
              Visible in navigation
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={() => navigate("/admin/menus")}
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
              {isNew ? "Create Menu" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default AdminMenuEdit;
