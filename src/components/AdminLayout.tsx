import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { LayoutDashboard, FileText, BookOpen, Image, MessageSquare, Settings, LogOut, Menu, X, Navigation, FileCode, FolderOpen, Upload, Cog, MessageCircle, Share2, Mail, Users } from "lucide-react";

const navItems = [
  { label: "Dashboard", to: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Menus", to: "/admin/menus", icon: Navigation },
  { label: "Pages", to: "/admin/pages", icon: FileCode },
  { label: "Books", to: "/admin/books", icon: BookOpen },
  { label: "Articles", to: "/admin/articles", icon: FileText },
  { label: "Albums", to: "/admin/albums", icon: FolderOpen },
  { label: "Testimonials", to: "/admin/testimonials", icon: MessageSquare },
  { label: "Comments", to: "/admin/comments", icon: MessageCircle },
  { label: "Social Feeds", to: "/admin/social-feeds", icon: Share2 },
  { label: "Newsletter", to: "/admin/newsletter", icon: Mail },
  { label: "File Manager", to: "/admin/files", icon: Upload },
  { label: "Users", to: "/admin/users", icon: Users },
  { label: "Site Content", to: "/admin/site-content", icon: Settings },
  { label: "Settings", to: "/admin/settings", icon: Cog },
];

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const { signOut } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-muted flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:static md:block`}>
        <div className="p-6 border-b border-border flex items-center justify-between">
          <Link to="/" className="font-display text-lg font-bold text-foreground">
            Gidel Fiavor
          </Link>
          <button className="md:hidden text-muted-foreground" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>
        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-sm font-body text-sm transition-colors ${
                location.pathname === item.to
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
          <button
            onClick={signOut}
            className="flex items-center gap-3 px-4 py-2.5 rounded-sm font-body text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors w-full"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && <div className="fixed inset-0 z-40 bg-charcoal/50 md:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main */}
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="bg-card border-b border-border px-6 py-4 flex items-center gap-4 md:hidden">
          <button onClick={() => setSidebarOpen(true)} className="text-foreground">
            <Menu size={24} />
          </button>
          <span className="font-display font-bold text-foreground">CMS</span>
        </header>
        <main className="flex-1 p-6 md:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
