import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import { UserPlus } from "lucide-react";

const AdminSetup = () => {
  const { user, isAdmin, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-background"><p className="text-muted-foreground font-body">Loading...</p></div>;
  if (user && isAdmin) return <Navigate to="/admin/dashboard" replace />;

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    // Sign up the user
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: window.location.origin },
    });

    if (signUpError) {
      setError(signUpError.message);
      setSubmitting(false);
      return;
    }

    if (signUpData.user) {
      // Assign admin role via edge function (bypasses RLS)
      const { data: fnData, error: fnError } = await supabase.functions.invoke("assign-admin-role", {
        body: { user_id: signUpData.user.id },
      });

      if (fnError || fnData?.error) {
        setError("Account created but failed to assign admin role: " + (fnData?.error || fnError?.message));
      } else {
        setSuccess(true);
        // Sign in immediately
        await supabase.auth.signInWithPassword({ email, password });
      }
    }

    setSubmitting(false);
  };

  if (success) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background px-6">
        <div className="text-center">
          <h1 className="font-display text-3xl font-bold text-foreground mb-4">Admin Account Created!</h1>
          <p className="text-muted-foreground font-body mb-6">You are now signed in as admin.</p>
          <a href="/admin/dashboard" className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground font-body font-semibold text-sm uppercase tracking-wider rounded-sm hover:bg-primary/90 transition-colors">
            Go to Dashboard
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">Admin Setup</h1>
          <p className="text-muted-foreground font-body text-sm">Create your admin account to manage the website</p>
        </div>
        <form onSubmit={handleSetup} className="space-y-4">
          <div>
            <label className="block text-sm font-body text-muted-foreground mb-1">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-3 bg-card border border-border rounded-sm font-body text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          <div>
            <label className="block text-sm font-body text-muted-foreground mb-1">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="w-full px-4 py-3 bg-card border border-border rounded-sm font-body text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          {error && <p className="text-destructive font-body text-sm">{error}</p>}
          <button type="submit" disabled={submitting} className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-body font-semibold text-sm uppercase tracking-wider rounded-sm hover:bg-primary/90 transition-colors disabled:opacity-50">
            <UserPlus size={16} />
            {submitting ? "Creating..." : "Create Admin Account"}
          </button>
        </form>
      </div>
    </main>
  );
};

export default AdminSetup;
