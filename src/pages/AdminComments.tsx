import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { commentsApi } from "@/lib/api";
import AdminLayout from "@/components/AdminLayout";
import { Check, X, Trash2, MessageSquare, Clock, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

const AdminComments = () => {
  const queryClient = useQueryClient();

  const { data: comments = [], isLoading } = useQuery({
    queryKey: ["admin-comments"],
    queryFn: commentsApi.getAll,
  });

  const approveMutation = useMutation({
    mutationFn: ({ id, is_approved }: { id: string; is_approved: boolean }) =>
      commentsApi.approve(id, is_approved),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-comments"] });
      toast.success("Comment updated");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: commentsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-comments"] });
      toast.success("Comment deleted");
    },
  });

  const pendingComments = comments.filter((c: any) => !c.is_approved);
  const approvedComments = comments.filter((c: any) => c.is_approved);

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Comment Moderation</h1>
          <p className="text-sm text-muted-foreground">Review and moderate article comments</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center gap-3">
              <MessageSquare className="text-primary" size={24} />
              <div>
                <p className="text-2xl font-bold">{comments.length}</p>
                <p className="text-sm text-muted-foreground">Total Comments</p>
              </div>
            </div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center gap-3">
              <Clock className="text-yellow-500" size={24} />
              <div>
                <p className="text-2xl font-bold">{pendingComments.length}</p>
                <p className="text-sm text-muted-foreground">Pending Review</p>
              </div>
            </div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="text-green-500" size={24} />
              <div>
                <p className="text-2xl font-bold">{approvedComments.length}</p>
                <p className="text-sm text-muted-foreground">Approved</p>
              </div>
            </div>
          </div>
        </div>

        {isLoading ? (
          <p className="text-muted-foreground">Loading comments...</p>
        ) : comments.length === 0 ? (
          <div className="text-center py-12 border border-border rounded-lg">
            <MessageSquare size={48} className="mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No comments yet</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Pending Comments */}
            {pendingComments.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Clock size={18} className="text-yellow-500" />
                  Pending Review ({pendingComments.length})
                </h2>
                <div className="space-y-3">
                  {pendingComments.map((comment: any) => (
                    <div key={comment.id} className="bg-yellow-500/5 border border-yellow-500/30 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="font-medium">{comment.author_name}</span>
                          <span className="text-muted-foreground text-sm ml-2">({comment.author_email})</span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(comment.created_at), "MMM d, yyyy HH:mm")}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">
                        On: <span className="text-foreground">{comment.article_title || "Unknown Article"}</span>
                      </p>
                      <p className="text-sm mb-3 bg-background p-3 rounded">{comment.content}</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => approveMutation.mutate({ id: comment.id, is_approved: true })}
                          className="flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white text-sm rounded hover:bg-green-600"
                        >
                          <Check size={14} /> Approve
                        </button>
                        <button
                          onClick={() => {
                            if (confirm("Delete this comment?")) {
                              deleteMutation.mutate(comment.id);
                            }
                          }}
                          className="flex items-center gap-1 px-3 py-1.5 bg-destructive text-white text-sm rounded hover:bg-destructive/90"
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Approved Comments */}
            {approvedComments.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <CheckCircle size={18} className="text-green-500" />
                  Approved ({approvedComments.length})
                </h2>
                <div className="space-y-3">
                  {approvedComments.map((comment: any) => (
                    <div key={comment.id} className="bg-card border border-border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="font-medium">{comment.author_name}</span>
                          <span className="text-muted-foreground text-sm ml-2">({comment.author_email})</span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(comment.created_at), "MMM d, yyyy HH:mm")}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">
                        On: <span className="text-foreground">{comment.article_title || "Unknown Article"}</span>
                      </p>
                      <p className="text-sm mb-3">{comment.content}</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => approveMutation.mutate({ id: comment.id, is_approved: false })}
                          className="flex items-center gap-1 px-3 py-1.5 border border-border text-sm rounded hover:bg-muted"
                        >
                          <X size={14} /> Unapprove
                        </button>
                        <button
                          onClick={() => {
                            if (confirm("Delete this comment?")) {
                              deleteMutation.mutate(comment.id);
                            }
                          }}
                          className="flex items-center gap-1 px-3 py-1.5 text-destructive border border-destructive text-sm rounded hover:bg-destructive/10"
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminComments;
