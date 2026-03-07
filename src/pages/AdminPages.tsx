import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { pagesApi } from "@/lib/api";
import AdminLayout from "@/components/AdminLayout";
import { Plus, Edit2, Trash2, FileText, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

const AdminPages = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: pages = [], isLoading } = useQuery({
    queryKey: ["pages"],
    queryFn: pagesApi.getAll,
  });

  const deleteMutation = useMutation({
    mutationFn: pagesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pages"] });
      toast.success("Page deleted");
    },
  });

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-foreground">Pages</h1>
          <button
            onClick={() => navigate("/admin/pages/new")}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            <Plus size={18} /> Add Page
          </button>
        </div>

        {isLoading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : (
          <div className="grid gap-4">
            {pages.map((page: any) => (
              <div
                key={page.id}
                className="bg-card rounded-lg border border-border p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <FileText size={20} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">{page.title}</h3>
                    <p className="text-sm text-muted-foreground">/{page.slug}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {page.is_published ? (
                    <span className="flex items-center gap-1 text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                      <Eye size={12} /> Published
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                      <EyeOff size={12} /> Draft
                    </span>
                  )}
                  <button
                    onClick={() => navigate(`/admin/pages/${page.id}`)}
                    className="p-2 text-muted-foreground hover:text-primary"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm("Delete this page?")) {
                        deleteMutation.mutate(page.id);
                      }
                    }}
                    className="p-2 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
            {pages.length === 0 && (
              <div className="bg-card rounded-lg border border-border p-8 text-center text-muted-foreground">
                No pages yet. Create your first page.
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminPages;
