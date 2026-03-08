import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { authApi } from "@/lib/api";

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  getAuthHeader: () => { Authorization: string } | {};
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper to check if token is expired
const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session in localStorage
    const savedUser = localStorage.getItem("auth_user");
    const savedToken = localStorage.getItem("auth_token");
    const savedIsAdmin = localStorage.getItem("auth_is_admin");
    
    if (savedUser && savedToken) {
      // Check if token is still valid
      if (!isTokenExpired(savedToken)) {
        setUser(JSON.parse(savedUser));
        setToken(savedToken);
        setIsAdmin(savedIsAdmin === "true");
      } else {
        // Token expired, clear storage
        localStorage.removeItem("auth_user");
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_is_admin");
      }
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const result = await authApi.login(email, password);
      setUser(result.user);
      setToken(result.token);
      setIsAdmin(result.isAdmin);
      localStorage.setItem("auth_user", JSON.stringify(result.user));
      localStorage.setItem("auth_token", result.token);
      localStorage.setItem("auth_is_admin", String(result.isAdmin));
      return { error: null };
    } catch (err: any) {
      return { error: { message: err.message || "Login failed" } };
    }
  };

  const signOut = async () => {
    setUser(null);
    setToken(null);
    setIsAdmin(false);
    localStorage.removeItem("auth_user");
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_is_admin");
  };

  // Helper to get authorization header for API calls
  const getAuthHeader = () => {
    if (token) {
      return { Authorization: `Bearer ${token}` };
    }
    return {};
  };

  return (
    <AuthContext.Provider value={{ user, token, isAdmin, loading, signIn, signOut, getAuthHeader }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
