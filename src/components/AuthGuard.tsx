import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthService } from "@/lib/authService";
import { supabase } from "@/lib/supabase";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export function AuthGuard({ children, requireAuth = true }: AuthGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await AuthService.getCurrentUser();
        console.log("[AuthGuard] Current user:", user);
        setIsAuthenticated(!!user);
      } catch (error) {
        console.error("[AuthGuard] Auth check error:", error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    // Check auth on mount
    checkAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("[AuthGuard] Auth state changed:", event, session?.user);
        setIsAuthenticated(!!session?.user);
        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🍽️</div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  console.log("[AuthGuard] Auth state:", { isAuthenticated, requireAuth, path: location.pathname });

  // If auth is required and user is not authenticated, redirect to auth
  if (requireAuth && !isAuthenticated) {
    console.log("[AuthGuard] Redirecting to auth - user not authenticated");
    return <Navigate to="/auth" replace />;
  }

  // If auth is not required (auth page) and user is authenticated, redirect to home
  if (!requireAuth && isAuthenticated) {
    console.log("[AuthGuard] Redirecting to home - user is authenticated");
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
}