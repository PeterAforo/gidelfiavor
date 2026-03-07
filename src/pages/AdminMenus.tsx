import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { menusApi, pagesApi } from "@/lib/api";
import AdminLayout from "@/components/AdminLayout";
import { Plus, Edit2, Trash2, GripVertical, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

const AdminMenus = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: menus = [], isLoading } = useQuery({
    queryKey: ["menus"],
    queryFn: menusApi.getAll,
  });

  const { data: pages = [] } = useQuery({
    queryKey: ["pages"],
    queryFn: pagesApi.getAll,
  });

  const deleteMutation = useMutation({
    mutationFn: menusApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menus"] });
      toast.success("Menu deleted");
    },
  });

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-foreground">Menus</h1>
          <button
            onClick={() => navigate("/admin/menus/new")}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            <Plus size={18} /> Add Menu
          </button>
        </div>

        {isLoading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : (
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Order</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Title</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Slug</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Linked Page</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Visible</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {menus.map((menu: any) => (
                  <tr key={menu.id} className="border-t border-border hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <GripVertical size={16} className="text-muted-foreground" />
                    </td>
                    <td className="px-4 py-3 font-medium text-foreground">{menu.title}</td>
                    <td className="px-4 py-3 text-muted-foreground">/{menu.slug}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {pages.find((p: any) => p.id === menu.page_id)?.title || "-"}
                    </td>
                    <td className="px-4 py-3">
                      {menu.is_visible ? (
                        <Eye size={16} className="text-green-500" />
                      ) : (
                        <EyeOff size={16} className="text-muted-foreground" />
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => navigate(`/admin/menus/${menu.id}`)}
                        className="p-2 text-muted-foreground hover:text-primary"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm("Delete this menu?")) {
                            deleteMutation.mutate(menu.id);
                          }
                        }}
                        className="p-2 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
                {menus.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                      No menus yet. Create your first menu.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminMenus;
