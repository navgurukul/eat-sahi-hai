import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export function AuthGuard({ children, requireAuth = true }: AuthGuardProps) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🍽️</div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const isAuthenticated = !!user;

  console.log("[AuthGuard] Auth state:", {
    isAuthenticated,
    requireAuth,
    path: location.pathname,
    user: user ? { id: user.id, email: user.email } : null,
  });

  // If auth is required and user is not authenticated, redirect to auth
  if (requireAuth && !isAuthenticated) {
    console.log("[AuthGuard] Redirecting to auth - user not authenticated");
    return <Navigate to="/auth" replace />;
  }

  // If auth is not required (auth page) and user is authenticated, redirect to home
  if (!requireAuth && isAuthenticated) {
    console.log("[AuthGuard] Redirecting to home - user is authenticated");
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
}
