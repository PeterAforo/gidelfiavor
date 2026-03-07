import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { socialFeedsApi } from "@/lib/api";
import AdminLayout from "@/components/AdminLayout";
import { Plus, Trash2, Facebook, Twitter, Instagram, Linkedin, Youtube, Link2, CheckCircle, XCircle, RefreshCw, Edit, ExternalLink } from "lucide-react";
import { toast } from "sonner";

const PLATFORMS = [
  { id: "facebook", name: "Facebook", icon: Facebook, color: "text-blue-600" },
  { id: "twitter", name: "Twitter/X", icon: Twitter, color: "text-sky-500" },
  { id: "instagram", name: "Instagram", icon: Instagram, color: "text-pink-500" },
  { id: "linkedin", name: "LinkedIn", icon: Linkedin, color: "text-blue-700" },
  { id: "youtube", name: "YouTube", icon: Youtube, color: "text-red-600" },
];

const AdminSocialFeeds = () => {
  const queryClient = useQueryClient();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingFeed, setEditingFeed] = useState<any>(null);
  const [syncing, setSyncing] = useState<number | null>(null);
  const [newFeed, setNewFeed] = useState({
    platform: "",
    account_name: "",
    access_token: "",
  });

  const { data: feeds = [], isLoading } = useQuery({
    queryKey: ["social-feeds"],
    queryFn: socialFeedsApi.getAll,
  });

  const { data: posts = [] } = useQuery({
    queryKey: ["social-posts"],
    queryFn: () => socialFeedsApi.getPosts(10),
  });

  const createMutation = useMutation({
    mutationFn: socialFeedsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["social-feeds"] });
      toast.success("Social feed connected");
      setShowAddModal(false);
      setNewFeed({ platform: "", account_name: "", access_token: "" });
    },
    onError: (err: any) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: socialFeedsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["social-feeds"] });
      toast.success("Social feed disconnected");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, ...data }: any) => socialFeedsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["social-feeds"] });
      toast.success("Social feed updated");
      setEditingFeed(null);
    },
    onError: (err: any) => toast.error(err.message),
  });

  const handleSync = async (feedId: number) => {
    setSyncing(feedId);
    try {
      const result = await socialFeedsApi.sync(feedId);
      queryClient.invalidateQueries({ queryKey: ["social-feeds"] });
      queryClient.invalidateQueries({ queryKey: ["social-posts"] });
      toast.success("Feed synced! Connection verified ✓");
    } catch (err: any) {
      toast.error(err.message || "Sync failed - check your access token");
    } finally {
      setSyncing(null);
    }
  };

  const handleEditSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFeed) return;
    updateMutation.mutate(editingFeed);
  };

  const handleAddFeed = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFeed.platform || !newFeed.account_name) {
      toast.error("Platform and account name are required");
      return;
    }
    createMutation.mutate(newFeed);
  };

  const getPlatformInfo = (platformId: string) => {
    return PLATFORMS.find((p) => p.id === platformId) || PLATFORMS[0];
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Social Media Feeds</h1>
            <p className="text-sm text-muted-foreground">Connect your social media accounts to display feeds on your website</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            <Plus size={16} /> Connect Account
          </button>
        </div>

        {/* Connected Accounts */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Connected Accounts</h2>
          {isLoading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : feeds.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-border rounded-lg">
              <Link2 size={48} className="mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-2">No social accounts connected</p>
              <p className="text-sm text-muted-foreground">Connect your social media accounts to display feeds on your website</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {feeds.map((feed: any) => {
                const platform = getPlatformInfo(feed.platform);
                const Icon = platform.icon;
                return (
                  <div key={feed.id} className="bg-card border border-border rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-10 h-10 rounded-full bg-muted flex items-center justify-center ${platform.color}`}>
                        <Icon size={20} />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{platform.name}</p>
                        <p className="text-sm text-muted-foreground">@{feed.account_name}</p>
                      </div>
                      {feed.is_connected ? (
                        <CheckCircle size={20} className="text-green-500" />
                      ) : (
                        <XCircle size={20} className="text-red-500" />
                      )}
                    </div>
                    <div className="flex justify-between items-center text-sm mt-2">
                      <div>
                        {feed.last_synced ? (
                          <span className="text-green-600 flex items-center gap-1">
                            <CheckCircle size={12} />
                            Synced {new Date(feed.last_synced).toLocaleDateString()}
                          </span>
                        ) : (
                          <span className="text-yellow-600 flex items-center gap-1">
                            <XCircle size={12} />
                            Not synced yet - click sync to verify
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleSync(feed.id)}
                          disabled={syncing === feed.id}
                          className="p-1.5 text-primary hover:bg-primary/10 rounded transition-colors disabled:opacity-50"
                          title="Sync & verify connection"
                        >
                          <RefreshCw size={16} className={syncing === feed.id ? "animate-spin" : ""} />
                        </button>
                        <button
                          onClick={() => setEditingFeed(feed)}
                          className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm("Disconnect this account?")) {
                              deleteMutation.mutate(feed.id);
                            }
                          }}
                          className="p-1.5 text-destructive hover:bg-destructive/10 rounded transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Posts Preview Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Posts Preview</h2>
            {posts.length > 0 && (
              <span className="text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
                ✓ {posts.length} posts synced
              </span>
            )}
          </div>
          
          {posts.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed border-border rounded-lg bg-muted/30">
              <p className="text-muted-foreground mb-2">No posts synced yet</p>
              <p className="text-sm text-muted-foreground">
                Click the <RefreshCw size={14} className="inline" /> sync button on a connected account to fetch posts
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {posts.map((post: any) => {
                const platform = getPlatformInfo(post.platform);
                const Icon = platform.icon;
                return (
                  <div key={post.id} className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-3">
                      <div className={`w-8 h-8 rounded-full bg-muted flex items-center justify-center ${platform.color}`}>
                        <Icon size={16} />
                      </div>
                      <div>
                        <span className="text-sm font-medium">{platform.name}</span>
                        <p className="text-xs text-muted-foreground">
                          {post.posted_at ? new Date(post.posted_at).toLocaleDateString() : 'Just now'}
                        </p>
                      </div>
                    </div>
                    {post.media_url && (
                      <img src={post.media_url} alt="" className="w-full h-32 object-cover rounded mb-3" />
                    )}
                    <p className="text-sm line-clamp-3 mb-3">{post.content}</p>
                    <div className="flex gap-4 text-xs text-muted-foreground border-t border-border pt-2">
                      <span>❤️ {post.likes_count || 0}</span>
                      <span>💬 {post.comments_count || 0}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Add Feed Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto py-8">
            <div className="bg-card rounded-lg p-6 w-full max-w-lg mx-4">
              <h2 className="text-xl font-bold mb-4">Connect Social Account</h2>
              <form onSubmit={handleAddFeed} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Platform</label>
                  <select
                    value={newFeed.platform}
                    onChange={(e) => setNewFeed({ ...newFeed, platform: e.target.value })}
                    className="w-full px-4 py-2.5 border border-border rounded-lg bg-background"
                  >
                    <option value="">Select platform...</option>
                    {PLATFORMS.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Account Username/Handle</label>
                  <input
                    type="text"
                    value={newFeed.account_name}
                    onChange={(e) => setNewFeed({ ...newFeed, account_name: e.target.value })}
                    placeholder="@username or page name"
                    className="w-full px-4 py-2.5 border border-border rounded-lg bg-background"
                  />
                </div>
                
                {/* Platform-specific API credentials */}
                {newFeed.platform && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
                    <p className="text-sm font-medium text-blue-800">
                      🔑 API Credentials for Live Feed
                    </p>
                    
                    {newFeed.platform === "twitter" && (
                      <>
                        <div>
                          <label className="block text-xs font-medium mb-1 text-blue-700">Bearer Token</label>
                          <input
                            type="password"
                            value={newFeed.access_token}
                            onChange={(e) => setNewFeed({ ...newFeed, access_token: e.target.value })}
                            placeholder="Get from developer.twitter.com"
                            className="w-full px-3 py-2 border border-blue-300 rounded-lg bg-white text-sm"
                          />
                        </div>
                        <p className="text-xs text-blue-600">
                          Get your Bearer Token from <a href="https://developer.twitter.com" target="_blank" rel="noopener" className="underline">developer.twitter.com</a> → Projects & Apps → Your App → Keys and tokens
                        </p>
                      </>
                    )}
                    
                    {newFeed.platform === "facebook" && (
                      <>
                        <div>
                          <label className="block text-xs font-medium mb-1 text-blue-700">Page Access Token</label>
                          <input
                            type="password"
                            value={newFeed.access_token}
                            onChange={(e) => setNewFeed({ ...newFeed, access_token: e.target.value })}
                            placeholder="Get from Facebook Graph API Explorer"
                            className="w-full px-3 py-2 border border-blue-300 rounded-lg bg-white text-sm"
                          />
                        </div>
                        <p className="text-xs text-blue-600">
                          Get from <a href="https://developers.facebook.com/tools/explorer" target="_blank" rel="noopener" className="underline">Graph API Explorer</a>. Select your page and get a Page Access Token.
                        </p>
                      </>
                    )}
                    
                    {newFeed.platform === "instagram" && (
                      <>
                        <div>
                          <label className="block text-xs font-medium mb-1 text-blue-700">Instagram Access Token</label>
                          <input
                            type="password"
                            value={newFeed.access_token}
                            onChange={(e) => setNewFeed({ ...newFeed, access_token: e.target.value })}
                            placeholder="Get from Instagram Basic Display API"
                            className="w-full px-3 py-2 border border-blue-300 rounded-lg bg-white text-sm"
                          />
                        </div>
                        <p className="text-xs text-blue-600">
                          For business accounts, use Facebook Graph API. For personal, use <a href="https://developers.facebook.com/docs/instagram-basic-display-api" target="_blank" rel="noopener" className="underline">Basic Display API</a>.
                        </p>
                      </>
                    )}
                    
                    {newFeed.platform === "linkedin" && (
                      <>
                        <div>
                          <label className="block text-xs font-medium mb-1 text-blue-700">OAuth Access Token</label>
                          <input
                            type="password"
                            value={newFeed.access_token}
                            onChange={(e) => setNewFeed({ ...newFeed, access_token: e.target.value })}
                            placeholder="Get from LinkedIn Developer Portal"
                            className="w-full px-3 py-2 border border-blue-300 rounded-lg bg-white text-sm"
                          />
                        </div>
                        <p className="text-xs text-blue-600">
                          Get from <a href="https://www.linkedin.com/developers" target="_blank" rel="noopener" className="underline">LinkedIn Developers</a>. Requires Marketing API access.
                        </p>
                      </>
                    )}
                    
                    {newFeed.platform === "youtube" && (
                      <>
                        <div>
                          <label className="block text-xs font-medium mb-1 text-blue-700">YouTube API Key</label>
                          <input
                            type="password"
                            value={newFeed.access_token}
                            onChange={(e) => setNewFeed({ ...newFeed, access_token: e.target.value })}
                            placeholder="Get from Google Cloud Console"
                            className="w-full px-3 py-2 border border-blue-300 rounded-lg bg-white text-sm"
                          />
                        </div>
                        <p className="text-xs text-blue-600">
                          Get from <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener" className="underline">Google Cloud Console</a> → APIs & Services → Credentials → Create API Key. Enable YouTube Data API v3.
                        </p>
                      </>
                    )}
                    
                    <p className="text-xs text-blue-500 italic">
                      Leave blank to use demo posts instead of live feed.
                    </p>
                  </div>
                )}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createMutation.isPending}
                    className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50"
                  >
                    {createMutation.isPending ? "Connecting..." : "Connect"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Feed Modal */}
        {editingFeed && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto py-8">
            <div className="bg-card rounded-lg p-6 w-full max-w-lg mx-4">
              <h2 className="text-xl font-bold mb-4">Edit Social Account</h2>
              <form onSubmit={handleEditSave} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Platform</label>
                  <div className="flex items-center gap-2 px-4 py-2.5 border border-border rounded-lg bg-muted">
                    {(() => {
                      const platform = getPlatformInfo(editingFeed.platform);
                      const Icon = platform.icon;
                      return (
                        <>
                          <Icon size={20} className={platform.color} />
                          <span>{platform.name}</span>
                        </>
                      );
                    })()}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Account Username/Handle</label>
                  <input
                    type="text"
                    value={editingFeed.account_name || ""}
                    onChange={(e) => setEditingFeed({ ...editingFeed, account_name: e.target.value })}
                    placeholder="@username or page name"
                    className="w-full px-4 py-2.5 border border-border rounded-lg bg-background"
                  />
                </div>
                
                {/* Platform-specific API credentials */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
                  <p className="text-sm font-medium text-blue-800">
                    🔑 API Credentials for Live Feed
                  </p>
                  
                  {editingFeed.platform === "twitter" && (
                    <>
                      <div>
                        <label className="block text-xs font-medium mb-1 text-blue-700">Bearer Token</label>
                        <input
                          type="password"
                          value={editingFeed.access_token || ""}
                          onChange={(e) => setEditingFeed({ ...editingFeed, access_token: e.target.value })}
                          placeholder="Leave blank to keep existing"
                          className="w-full px-3 py-2 border border-blue-300 rounded-lg bg-white text-sm"
                        />
                      </div>
                      <p className="text-xs text-blue-600">
                        Get from <a href="https://developer.twitter.com" target="_blank" rel="noopener" className="underline">developer.twitter.com</a> → Projects & Apps → Keys and tokens
                      </p>
                    </>
                  )}
                  
                  {editingFeed.platform === "facebook" && (
                    <>
                      <div>
                        <label className="block text-xs font-medium mb-1 text-blue-700">Page Access Token</label>
                        <input
                          type="password"
                          value={editingFeed.access_token || ""}
                          onChange={(e) => setEditingFeed({ ...editingFeed, access_token: e.target.value })}
                          placeholder="Leave blank to keep existing"
                          className="w-full px-3 py-2 border border-blue-300 rounded-lg bg-white text-sm"
                        />
                      </div>
                      <p className="text-xs text-blue-600">
                        Get from <a href="https://developers.facebook.com/tools/explorer" target="_blank" rel="noopener" className="underline">Graph API Explorer</a>
                      </p>
                    </>
                  )}
                  
                  {editingFeed.platform === "instagram" && (
                    <>
                      <div>
                        <label className="block text-xs font-medium mb-1 text-blue-700">Instagram Access Token</label>
                        <input
                          type="password"
                          value={editingFeed.access_token || ""}
                          onChange={(e) => setEditingFeed({ ...editingFeed, access_token: e.target.value })}
                          placeholder="Leave blank to keep existing"
                          className="w-full px-3 py-2 border border-blue-300 rounded-lg bg-white text-sm"
                        />
                      </div>
                      <p className="text-xs text-blue-600">
                        For business: Facebook Graph API. Personal: <a href="https://developers.facebook.com/docs/instagram-basic-display-api" target="_blank" rel="noopener" className="underline">Basic Display API</a>
                      </p>
                    </>
                  )}
                  
                  {editingFeed.platform === "linkedin" && (
                    <>
                      <div>
                        <label className="block text-xs font-medium mb-1 text-blue-700">OAuth Access Token</label>
                        <input
                          type="password"
                          value={editingFeed.access_token || ""}
                          onChange={(e) => setEditingFeed({ ...editingFeed, access_token: e.target.value })}
                          placeholder="Leave blank to keep existing"
                          className="w-full px-3 py-2 border border-blue-300 rounded-lg bg-white text-sm"
                        />
                      </div>
                      <p className="text-xs text-blue-600">
                        Get from <a href="https://www.linkedin.com/developers" target="_blank" rel="noopener" className="underline">LinkedIn Developers</a>
                      </p>
                    </>
                  )}
                  
                  {editingFeed.platform === "youtube" && (
                    <>
                      <div>
                        <label className="block text-xs font-medium mb-1 text-blue-700">YouTube API Key</label>
                        <input
                          type="password"
                          value={editingFeed.access_token || ""}
                          onChange={(e) => setEditingFeed({ ...editingFeed, access_token: e.target.value })}
                          placeholder="Leave blank to keep existing"
                          className="w-full px-3 py-2 border border-blue-300 rounded-lg bg-white text-sm"
                        />
                      </div>
                      <p className="text-xs text-blue-600">
                        Get from <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener" className="underline">Google Cloud Console</a>
                      </p>
                    </>
                  )}
                  
                  <p className="text-xs text-blue-500 italic">
                    Leave blank to keep existing credentials or use demo posts.
                  </p>
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setEditingFeed(null)}
                    className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updateMutation.isPending}
                    className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50"
                  >
                    {updateMutation.isPending ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* How to Use Info */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">How to Display Social Feeds on Your Website</h3>
          <ol className="text-sm text-blue-700 space-y-2 list-decimal list-inside">
            <li>Connect your social media accounts above by clicking "Connect Account"</li>
            <li>Click the <RefreshCw size={14} className="inline" /> sync button to fetch latest posts</li>
            <li>Go to <strong>Pages</strong> → Edit a page → <strong>Add Section</strong> → Choose "Social Feed"</li>
            <li>The social feed section will display your connected accounts' posts</li>
          </ol>
          <p className="text-xs text-blue-600 mt-3">
            Note: For automatic syncing, you need API access tokens from each platform's developer settings.
          </p>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSocialFeeds;
