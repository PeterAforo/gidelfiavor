import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/components/AdminLayout";
import { testimonialsApi } from "@/lib/api";
import { Plus, Trash2, Edit, X, Save, CheckCircle, XCircle, Clock } from "lucide-react";
import { toast } from "sonner";
import ImageUpload from "@/components/ImageUpload";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  quote: string;
  image_url: string;
  sort_order: number;
  is_approved: boolean;
  submitter_email?: string;
}

const emptyTestimonial: Partial<Testimonial> = { quote: "", name: "", role: "", sort_order: 0, is_approved: true };

const AdminTestimonials = () => {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<Partial<Testimonial> | null>(null);
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("all");

  const { data: testimonials = [], isLoading } = useQuery({
    queryKey: ["testimonials"],
    queryFn: testimonialsApi.getAll,
  });

  const createMutation = useMutation({
    mutationFn: (data: Partial<Testimonial>) => testimonialsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
      toast.success("Testimonial created!");
      setEditing(null);
    },
    onError: (err: any) => toast.error(err.message),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, ...data }: Partial<Testimonial> & { id: number }) => 
      testimonialsApi.update(String(id), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
      toast.success("Testimonial updated!");
      setEditing(null);
    },
    onError: (err: any) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => testimonialsApi.delete(String(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
      toast.success("Testimonial deleted!");
    },
    onError: (err: any) => toast.error(err.message),
  });

  const handleSave = async () => {
    if (!editing?.quote || !editing?.name) return toast.error("Quote and name are required");
    if (editing.id) {
      updateMutation.mutate(editing as Testimonial);
    } else {
      createMutation.mutate(editing);
    }
  };

  const handleApprove = (t: Testimonial, approve: boolean) => {
    updateMutation.mutate({ ...t, is_approved: approve });
  };

  const filteredTestimonials = testimonials.filter((t: Testimonial) => {
    if (filter === "pending") return !t.is_approved;
    if (filter === "approved") return t.is_approved;
    return true;
  });

  const pendingCount = testimonials.filter((t: Testimonial) => !t.is_approved).length;

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Testimonials</h1>
          <p className="text-muted-foreground font-body mt-1">Manage reader testimonials</p>
        </div>
        <button onClick={() => setEditing({ ...emptyTestimonial, sort_order: testimonials.length })} className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground font-body font-semibold text-sm rounded-lg hover:bg-primary/90 transition-colors">
          <Plus size={16} /> Add Testimonial
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === "all" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}
        >
          All ({testimonials.length})
        </button>
        <button
          onClick={() => setFilter("pending")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${filter === "pending" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}
        >
          <Clock size={14} /> Pending ({pendingCount})
        </button>
        <button
          onClick={() => setFilter("approved")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === "approved" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}
        >
          Approved ({testimonials.length - pendingCount})
        </button>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-background border border-border rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-bold text-foreground">{editing.id ? "Edit" : "New"} Testimonial</h2>
              <button onClick={() => setEditing(null)} className="text-muted-foreground hover:text-foreground"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Quote *</label>
                <textarea value={editing.quote || ""} onChange={(e) => setEditing({ ...editing, quote: e.target.value })} rows={4} className="w-full px-4 py-2.5 bg-background border border-border rounded-lg font-body text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-y" placeholder="What did they say?" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Name *</label>
                <input value={editing.name || ""} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className="w-full px-4 py-2.5 bg-background border border-border rounded-lg font-body text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Role / Title</label>
                <input value={editing.role || ""} onChange={(e) => setEditing({ ...editing, role: e.target.value })} className="w-full px-4 py-2.5 bg-background border border-border rounded-lg font-body text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="CEO, Company Name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Photo</label>
                <ImageUpload
                  value={editing.image_url}
                  onChange={(url) => setEditing({ ...editing, image_url: url })}
                  folder="testimonials"
                  placeholder="Upload photo"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_approved"
                  checked={editing.is_approved !== false}
                  onChange={(e) => setEditing({ ...editing, is_approved: e.target.checked })}
                  className="w-4 h-4 rounded border-border"
                />
                <label htmlFor="is_approved" className="text-sm text-foreground">Approved (visible on website)</label>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setEditing(null)} className="px-4 py-2 font-body text-sm text-muted-foreground hover:text-foreground">Cancel</button>
              <button onClick={handleSave} disabled={createMutation.isPending || updateMutation.isPending} className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground font-body font-semibold text-sm rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50">
                <Save size={16} /> Save
              </button>
            </div>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTestimonials.length === 0 && (
            <div className="text-center py-12 bg-card border border-border rounded-lg">
              <p className="text-muted-foreground font-body">No testimonials found.</p>
            </div>
          )}
          {filteredTestimonials.map((t: Testimonial) => (
            <div key={t.id} className={`bg-card border rounded-lg p-4 ${!t.is_approved ? 'border-yellow-500/50 bg-yellow-50/5' : 'border-border'}`}>
              <div className="flex items-start gap-4">
                {t.image_url && (
                  <img src={t.image_url} alt={t.name} className="w-12 h-12 rounded-full object-cover" />
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {!t.is_approved && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                        <Clock size={12} /> Pending Review
                      </span>
                    )}
                  </div>
                  <p className="text-foreground font-body italic mb-2">"{t.quote}"</p>
                  <p className="text-sm text-muted-foreground font-body">— {t.name}{t.role ? `, ${t.role}` : ""}</p>
                  {t.submitter_email && (
                    <p className="text-xs text-muted-foreground mt-1">Submitted by: {t.submitter_email}</p>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  {!t.is_approved && (
                    <button
                      onClick={() => handleApprove(t, true)}
                      className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                      title="Approve"
                    >
                      <CheckCircle size={18} />
                    </button>
                  )}
                  {t.is_approved && (
                    <button
                      onClick={() => handleApprove(t, false)}
                      className="p-2 text-yellow-600 hover:bg-yellow-100 rounded-lg transition-colors"
                      title="Unapprove"
                    >
                      <XCircle size={18} />
                    </button>
                  )}
                  <button onClick={() => setEditing(t)} className="p-2 text-muted-foreground hover:text-primary hover:bg-muted rounded-lg transition-colors" title="Edit">
                    <Edit size={18} />
                  </button>
                  <button onClick={() => deleteMutation.mutate(t.id)} className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors" title="Delete">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminTestimonials;
