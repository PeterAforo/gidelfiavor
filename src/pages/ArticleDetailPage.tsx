import { useParams, Link } from "react-router-dom";
import { useArticle, useArticles } from "@/hooks/useCms";
import { Calendar, User, Search, ArrowRight, Facebook, Twitter, Linkedin, Instagram, Heart, Copy, Check, Share2, MessageCircle } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import PageHeader from "@/components/PageHeader";
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import authorPortrait from "@/assets/author-portrait.jpg";
import { toast } from "sonner";
import { commentsApi, articlesApi } from "@/lib/api";

const ArticleDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const { data: article, isLoading } = useArticle(id || "");
  const { data: allArticles } = useArticles(true);
  const [commentForm, setCommentForm] = useState({ name: "", email: "", message: "" });
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [copied, setCopied] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);

  const recentPosts = allArticles?.slice(0, 4) || [];

  // Initialize like state from localStorage and article data
  useEffect(() => {
    if (article && id) {
      setLikeCount(article.like_count || 0);
      const likedArticles = JSON.parse(localStorage.getItem('likedArticles') || '[]');
      setLiked(likedArticles.includes(id));
    }
  }, [article, id]);

  // Fetch comments for this article
  const { data: comments = [] } = useQuery({
    queryKey: ["comments", id],
    queryFn: () => commentsApi.getForArticle(id || ""),
    enabled: !!id,
  });

  // Submit comment mutation
  const submitComment = useMutation({
    mutationFn: (data: { author_name: string; author_email: string; content: string }) =>
      commentsApi.create(id || "", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", id] });
      toast.success("Comment submitted! It will appear after approval.");
      setCommentForm({ name: "", email: "", message: "" });
      setSubmittingComment(false);
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to submit comment");
      setSubmittingComment(false);
    },
  });

  const articleUrl = typeof window !== 'undefined' ? window.location.href : '';
  const articleTitle = article?.title || '';

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(articleUrl)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(articleUrl)}&text=${encodeURIComponent(articleTitle)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(articleUrl)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${articleTitle} - ${articleUrl}`)}`,
  };

  const handleCopyLink = async () => {
    try {
      const referenceText = `${articleTitle}\nRead more: ${articleUrl}\n\n— Gidel Kwasi Fiavor`;
      await navigator.clipboard.writeText(referenceText);
      setCopied(true);
      toast.success("Article link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };

  const handleLike = async () => {
    if (!id) return;
    
    const likedArticles = JSON.parse(localStorage.getItem('likedArticles') || '[]');
    
    try {
      if (liked) {
        // Unlike
        const result = await articlesApi.unlike(id);
        setLikeCount(result.like_count);
        setLiked(false);
        localStorage.setItem('likedArticles', JSON.stringify(likedArticles.filter((aid: string) => aid !== id)));
      } else {
        // Like
        const result = await articlesApi.like(id);
        setLikeCount(result.like_count);
        setLiked(true);
        localStorage.setItem('likedArticles', JSON.stringify([...likedArticles, id]));
        toast.success("Thanks for liking this article!");
      }
    } catch (err) {
      toast.error("Failed to update like");
    }
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentForm.name || !commentForm.email || !commentForm.message) {
      toast.error("Please fill in all fields");
      return;
    }
    setSubmittingComment(true);
    submitComment.mutate({
      author_name: commentForm.name,
      author_email: commentForm.email,
      content: commentForm.message,
    });
  };

  if (isLoading) {
    return (
      <main className="pt-20 min-h-screen bg-background">
        <div className="container mx-auto px-6 py-16 text-center">
          <p className="text-muted-foreground font-body">Loading...</p>
        </div>
      </main>
    );
  }

  if (!article) {
    return (
      <main className="pt-20 min-h-screen bg-background">
        <div className="container mx-auto px-6 py-16 text-center">
          <p className="text-muted-foreground font-body">Article not found.</p>
          <Link to="/articles" className="text-primary font-body mt-4 inline-block">← Back to Articles</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-20 min-h-screen bg-background">
      {/* Dark Header with Article Title */}
      <PageHeader
        title={article.title}
        breadcrumbs={[
          { label: "Home", to: "/" },
          { label: "Articles", to: "/articles" },
          { label: article.title }
        ]}
      />

      <div className="container mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Featured Image */}
            {(article as { image_url?: string }).image_url && (
              <div className="rounded-xl overflow-hidden mb-6">
                <img
                  src={(article as { image_url?: string }).image_url}
                  alt={article.title}
                  className="w-full aspect-video object-cover"
                />
              </div>
            )}

            {/* Author and Date */}
            <div className="flex items-center gap-4 mb-6 text-sm text-muted-foreground font-body">
              <span className="flex items-center gap-2">
                <User size={14} /> By {article.author_name || "Gidel Fiavor"}
              </span>
              <span className="flex items-center gap-2">
                <Calendar size={14} />
                {article.publish_date ? format(new Date(article.publish_date), "MMMM d, yyyy") : (article.created_at ? format(new Date(article.created_at), "MMMM d, yyyy") : "")}
              </span>
            </div>

            {/* Content */}
            <div 
              className="prose prose-lg max-w-none font-body text-muted-foreground leading-relaxed mb-8"
              dangerouslySetInnerHTML={{ __html: article.content || '' }}
            />

            {/* Engagement Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 py-6 border-t border-b border-border mb-10">
              <div className="flex items-center gap-4">
                {/* Like Button */}
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                    liked 
                      ? 'bg-red-100 text-red-600' 
                      : 'bg-secondary text-muted-foreground hover:bg-red-50 hover:text-red-500'
                  }`}
                >
                  <Heart size={18} className={liked ? 'fill-current' : ''} />
                  <span className="text-sm font-medium">{likeCount > 0 ? likeCount : 'Like'}</span>
                </button>

                {/* Copy Link */}
                <button
                  onClick={handleCopyLink}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all"
                >
                  {copied ? <Check size={18} /> : <Copy size={18} />}
                  <span className="text-sm font-medium">{copied ? 'Copied!' : 'Copy Link'}</span>
                </button>

                {/* Keywords */}
                {article.category && (
                  <span className="px-3 py-1.5 bg-primary/10 text-sm font-body text-primary rounded-full">
                    {article.category}
                  </span>
                )}
              </div>

              {/* Share Buttons */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground font-medium mr-2">Share:</span>
                <a 
                  href={shareLinks.facebook} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-[#1877F2] flex items-center justify-center text-white hover:opacity-90 transition-opacity"
                  title="Share on Facebook"
                >
                  <Facebook size={16} />
                </a>
                <a 
                  href={shareLinks.twitter} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-black flex items-center justify-center text-white hover:opacity-90 transition-opacity"
                  title="Share on X (Twitter)"
                >
                  <Twitter size={16} />
                </a>
                <a 
                  href={shareLinks.linkedin} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-[#0A66C2] flex items-center justify-center text-white hover:opacity-90 transition-opacity"
                  title="Share on LinkedIn"
                >
                  <Linkedin size={16} />
                </a>
                <a 
                  href={shareLinks.whatsapp} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-[#25D366] flex items-center justify-center text-white hover:opacity-90 transition-opacity"
                  title="Share on WhatsApp"
                >
                  <MessageCircle size={16} />
                </a>
              </div>
            </div>

            {/* Comments Section */}
            <div className="mb-10">
              <h3 className="font-display text-xl font-bold text-foreground mb-6">
                Comments ({comments.length})
              </h3>
              {comments.length === 0 ? (
                <p className="text-muted-foreground font-body text-sm mb-8">
                  No comments yet. Be the first to share your thoughts!
                </p>
              ) : (
                <div className="space-y-6 mb-8">
                  {comments.map((comment: any) => (
                    <div key={comment.id} className="bg-secondary/50 rounded-xl p-5">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                          {comment.author_name?.charAt(0).toUpperCase() || "?"}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-foreground">{comment.author_name}</span>
                            <span className="text-xs text-muted-foreground">
                              {comment.created_at && formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                            </span>
                          </div>
                          <p className="text-muted-foreground font-body text-sm leading-relaxed">
                            {comment.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Leave a Comment Form */}
            <div className="bg-secondary rounded-2xl p-6 md:p-8">
              <h3 className="font-display text-xl font-bold text-foreground mb-2">Leave A Comment</h3>
              <p className="text-sm text-muted-foreground font-body mb-6">
                By posting from a system on this message you can contact us directly now.
              </p>
              <form onSubmit={handleCommentSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-body text-muted-foreground mb-2">Your Name</label>
                    <input
                      type="text"
                      placeholder="Name"
                      value={commentForm.name}
                      onChange={(e) => setCommentForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-body text-muted-foreground mb-2">Your Email</label>
                    <input
                      type="email"
                      placeholder="E-mail"
                      value={commentForm.email}
                      onChange={(e) => setCommentForm(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-body text-muted-foreground mb-2">Message</label>
                  <textarea
                    placeholder="Message here..."
                    rows={4}
                    value={commentForm.message}
                    onChange={(e) => setCommentForm(prev => ({ ...prev, message: e.target.value }))}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 resize-none"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={submittingComment}
                  className="w-full py-4 bg-primary text-primary-foreground font-body font-semibold text-sm rounded-full hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {submittingComment ? "Submitting..." : "Submit Now"} {!submittingComment && <ArrowRight size={16} />}
                </button>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            {/* Search */}
            <div className="bg-secondary rounded-xl p-4">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Type here"
                  className="flex-1 px-4 py-3 bg-foreground text-background rounded-lg font-body text-sm placeholder:text-background/60 focus:outline-none"
                />
                <button className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center text-primary-foreground hover:bg-primary/90 transition-colors">
                  <Search size={18} />
                </button>
              </div>
            </div>

            {/* Recent Posts */}
            <div className="bg-secondary rounded-xl p-6">
              <h4 className="font-display font-bold text-foreground mb-4">Recent Post</h4>
              <div className="space-y-4">
                {recentPosts.length > 0 ? recentPosts.map((post) => (
                  <Link key={post.id} to={`/articles/${post.id}`} className="flex items-start gap-3 group">
                    <div className="w-16 h-16 bg-foreground/10 rounded-lg flex-shrink-0 overflow-hidden">
                      {(post as { image_url?: string }).image_url ? (
                        <img src={(post as { image_url?: string }).image_url} alt={post.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-foreground/5 to-foreground/10" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="font-body text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                      </h5>
                      <p className="text-xs text-muted-foreground font-body mt-1">{post.category}</p>
                    </div>
                  </Link>
                )) : (
                  <p className="text-sm text-muted-foreground font-body">No recent posts</p>
                )}
              </div>
            </div>

            {/* About Me */}
            <div className="bg-secondary rounded-xl p-6 text-center">
              <h4 className="font-display font-bold text-foreground mb-4">About Me</h4>
              <img
                src={authorPortrait}
                alt="Gidel Fiavor"
                className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
              />
              <h5 className="font-display font-bold text-foreground">Gidel Fiavor</h5>
              <p className="text-xs text-muted-foreground font-body mb-4">Author & Theologian</p>
              <div className="flex justify-center gap-2">
                {[Facebook, Twitter, Linkedin, Instagram].map((Icon, i) => (
                  <a key={i} href="#" className="w-8 h-8 rounded-full bg-foreground flex items-center justify-center text-background hover:bg-primary transition-colors">
                    <Icon size={12} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ArticleDetailPage;
