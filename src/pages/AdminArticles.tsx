import { useNavigate } from "react-router-dom";
import AdminLayout from "@/components/AdminLayout";
import { useArticles, useDeleteArticle } from "@/hooks/useCms";
import { Plus, Trash2, Edit, Eye, EyeOff, Calendar, User, Clock, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { format, formatDistanceToNow, isFuture } from "date-fns";

const AdminArticles = () => {
  const navigate = useNavigate();
  const { data: articles, isLoading } = useArticles(false);
  const remove = useDeleteArticle();

  const getPublishStatus = (article: any) => {
    if (!article.published) return { label: "Draft", color: "bg-gray-100 text-gray-600" };
    if (article.publish_date && isFuture(new Date(article.publish_date))) {
      return { label: "Scheduled", color: "bg-amber-100 text-amber-700" };
    }
    return { label: "Published", color: "bg-green-100 text-green-700" };
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Articles</h1>
          <p className="text-muted-foreground font-body mt-1">Write and publish articles</p>
        </div>
        <button 
          onClick={() => navigate("/admin/articles/new")} 
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground font-body font-semibold text-sm rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus size={16} /> New Article
        </button>
      </div>

      {isLoading ? (
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-4 animate-pulse">
              <div className="flex gap-4">
                <div className="w-24 h-24 bg-muted rounded-lg" />
                <div className="flex-1 space-y-2">
                  <div className="h-5 bg-muted rounded w-3/4" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                  <div className="h-3 bg-muted rounded w-1/4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {articles?.length === 0 && (
            <div className="text-center py-12 bg-card border border-border rounded-xl">
              <ImageIcon size={48} className="mx-auto text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground font-body">No articles yet.</p>
              <button 
                onClick={() => navigate("/admin/articles/new")}
                className="mt-4 text-primary hover:underline text-sm"
              >
                Create your first article
              </button>
            </div>
          )}
          {articles?.map((article: any) => {
            const status = getPublishStatus(article);
            return (
              <div 
                key={article.id} 
                className="bg-card border border-border rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer group"
                onClick={() => navigate(`/admin/articles/${article.id}`)}
              >
                <div className="flex gap-4">
                  {/* Article Image */}
                  <div className="w-28 h-28 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
                    {article.image_url ? (
                      <img 
                        src={article.image_url} 
                        alt={article.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon size={24} className="text-muted-foreground/30" />
                      </div>
                    )}
                  </div>
                  
                  {/* Article Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${status.color}`}>
                            {status.label}
                          </span>
                          {article.category && (
                            <span className="px-2 py-0.5 text-xs bg-primary/10 text-primary rounded-full">
                              {article.category}
                            </span>
                          )}
                        </div>
                        <h3 className="font-display font-bold text-foreground text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                          {article.title}
                        </h3>
                        {article.excerpt && (
                          <p className="text-sm text-muted-foreground font-body mt-1 line-clamp-1">
                            {article.excerpt}
                          </p>
                        )}
                      </div>
                      
                      {/* Actions */}
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/admin/articles/${article.id}`);
                          }} 
                          className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <a
                          href={`/articles/${article.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                          title="Preview"
                        >
                          <Eye size={16} />
                        </a>
                        <button 
                          onClick={async (e) => { 
                            e.stopPropagation();
                            if (confirm("Delete this article?")) {
                              await remove.mutateAsync(article.id); 
                              toast.success("Deleted"); 
                            }
                          }} 
                          className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    
                    {/* Meta Info */}
                    <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User size={12} />
                        <span>{article.author_name || "Admin"}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar size={12} />
                        <span>
                          {article.publish_date 
                            ? (isFuture(new Date(article.publish_date)) 
                                ? `Scheduled: ${format(new Date(article.publish_date), "MMM d, yyyy 'at' h:mm a")}`
                                : format(new Date(article.publish_date), "MMM d, yyyy"))
                            : (article.created_at ? format(new Date(article.created_at), "MMM d, yyyy") : "No date")}
                        </span>
                      </div>
                      {article.updated_at && (
                        <div className="flex items-center gap-1">
                          <Clock size={12} />
                          <span>Updated {formatDistanceToNow(new Date(article.updated_at), { addSuffix: true })}</span>
                        </div>
                      )}
                      {article.view_count > 0 && (
                        <div className="flex items-center gap-1">
                          <Eye size={12} />
                          <span>{article.view_count} views</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminArticles;
