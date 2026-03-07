import { useQuery } from "@tanstack/react-query";
import AdminLayout from "@/components/AdminLayout";
import { useBooks, useArticles, useGalleryImages, useTestimonials } from "@/hooks/useCms";
import { analyticsApi, commentsApi } from "@/lib/api";
import { BookOpen, FileText, Image, MessageSquare, Eye, Users, TrendingUp, Clock, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";

const stats = [
  { label: "Books", icon: BookOpen, hook: useBooks, to: "/admin/books" },
  { label: "Articles", icon: FileText, hook: () => useArticles(false), to: "/admin/articles" },
  { label: "Gallery Images", icon: Image, hook: useGalleryImages, to: "/admin/gallery" },
  { label: "Testimonials", icon: MessageSquare, hook: useTestimonials, to: "/admin/testimonials" },
];

const StatCard = ({ label, icon: Icon, hook, to }: any) => {
  const { data } = hook();
  return (
    <Link to={to} className="bg-card border border-border rounded-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          <Icon size={22} className="text-primary" />
        </div>
        <div>
          <p className="font-display text-2xl font-bold text-foreground">{data?.length ?? 0}</p>
          <p className="text-sm font-body text-muted-foreground">{label}</p>
        </div>
      </div>
    </Link>
  );
};

const AdminDashboard = () => {
  const { data: analytics } = useQuery({
    queryKey: ["analytics-dashboard"],
    queryFn: () => analyticsApi.getDashboard(30),
  });

  const { data: comments = [] } = useQuery({
    queryKey: ["admin-comments"],
    queryFn: commentsApi.getAll,
  });

  const pendingComments = comments.filter((c: any) => !c.is_approved);

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground font-body mt-1">Overview of your website performance</p>
      </div>

      {/* Analytics Overview */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Page Views (30d)</p>
              <p className="text-3xl font-bold">{analytics?.totalPageViews || 0}</p>
            </div>
            <Eye size={32} className="text-blue-200" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Unique Visitors</p>
              <p className="text-3xl font-bold">{analytics?.uniqueVisitors || 0}</p>
            </div>
            <Users size={32} className="text-green-200" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Total Comments</p>
              <p className="text-3xl font-bold">{analytics?.commentStats?.total_comments || 0}</p>
            </div>
            <MessageSquare size={32} className="text-purple-200" />
          </div>
        </div>
        <Link to="/admin/comments" className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white rounded-lg p-5 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm">Pending Comments</p>
              <p className="text-3xl font-bold">{pendingComments.length}</p>
            </div>
            <Clock size={32} className="text-yellow-200" />
          </div>
        </Link>
      </div>

      {/* Content Stats */}
      <h2 className="font-display text-xl font-bold text-foreground mb-4">Content Overview</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      {/* Charts and Tables */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Pages */}
        <div className="bg-card border border-border rounded-lg p-5">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <BarChart3 size={18} className="text-primary" />
            Top Pages (Last 30 Days)
          </h3>
          {analytics?.topPages?.length > 0 ? (
            <div className="space-y-3">
              {analytics.topPages.slice(0, 5).map((page: any, i: number) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{page.page_title || page.page_path}</p>
                    <p className="text-xs text-muted-foreground truncate">{page.page_path}</p>
                  </div>
                  <span className="text-sm font-semibold text-primary ml-4">{page.views}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No page view data yet</p>
          )}
        </div>

        {/* Top Articles */}
        <div className="bg-card border border-border rounded-lg p-5">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <TrendingUp size={18} className="text-primary" />
            Popular Articles
          </h3>
          {analytics?.topArticles?.length > 0 ? (
            <div className="space-y-3">
              {analytics.topArticles.slice(0, 5).map((article: any) => (
                <div key={article.id} className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{article.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {article.comment_count || 0} comments
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-primary ml-4">
                    {article.view_count || 0} views
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No article data yet</p>
          )}
        </div>

        {/* Recent Comments */}
        <div className="bg-card border border-border rounded-lg p-5">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <MessageSquare size={18} className="text-primary" />
            Recent Comments
          </h3>
          {comments.length > 0 ? (
            <div className="space-y-3">
              {comments.slice(0, 5).map((comment: any) => (
                <div key={comment.id} className="border-b border-border pb-2 last:border-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{comment.author_name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      comment.is_approved 
                        ? "bg-green-100 text-green-700" 
                        : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {comment.is_approved ? "Approved" : "Pending"}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{comment.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No comments yet</p>
          )}
          {comments.length > 0 && (
            <Link to="/admin/comments" className="block text-center text-sm text-primary mt-4 hover:underline">
              View All Comments →
            </Link>
          )}
        </div>

        {/* Top Referrers */}
        <div className="bg-card border border-border rounded-lg p-5">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <TrendingUp size={18} className="text-primary" />
            Top Referrers
          </h3>
          {analytics?.topReferrers?.length > 0 ? (
            <div className="space-y-3">
              {analytics.topReferrers.slice(0, 5).map((ref: any, i: number) => (
                <div key={i} className="flex items-center justify-between">
                  <p className="text-sm truncate flex-1">{ref.referrer || "Direct"}</p>
                  <span className="text-sm font-semibold text-primary ml-4">{ref.count}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No referrer data yet</p>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
