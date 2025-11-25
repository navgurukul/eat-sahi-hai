import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { UserProfileService } from "@/lib/userProfileService";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export function AuthGuard({ children, requireAuth = true }: AuthGuardProps) {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [onboardingComplete, setOnboardingComplete] = useState<boolean | null>(
    null
  );
  const [checkingOnboarding, setCheckingOnboarding] = useState(true);

  // Check onboarding status when user is authenticated
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      console.log("[AuthGuard] Starting onboarding check...", {
        user: user?.id,
        requireAuth,
        loading,
        path: location.pathname,
      });

      if (user && requireAuth) {
        try {
          setCheckingOnboarding(true);
          console.log(
            "[AuthGuard] Checking onboarding status for user:",
            user.id
          );
          const hasCompleted =
            await UserProfileService.hasCompletedOnboarding();
          console.log("[AuthGuard] Onboarding check result:", hasCompleted);
          setOnboardingComplete(hasCompleted);
        } catch (error) {
          console.error("[AuthGuard] Error checking onboarding status:", error);
          setOnboardingComplete(false);
        }
      } else {
        setOnboardingComplete(null);
      }
      setCheckingOnboarding(false);
    };

    if (!loading) {
      checkOnboardingStatus();
    }
  }, [user, loading, requireAuth, location.pathname]);

  // Show loading state while checking authentication and onboarding
  if (loading || (requireAuth && user && checkingOnboarding)) {
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

  // If auth is not required (auth page) and user is authenticated
  if (!requireAuth && isAuthenticated) {
    // Check if onboarding is complete
    if (onboardingComplete === true) {
      console.log(
        "[AuthGuard] Redirecting to home - user is authenticated and onboarded"
      );
      return <Navigate to="/home" replace />;
    } else if (onboardingComplete === false) {
      console.log(
        "[AuthGuard] Redirecting to onboarding - user needs to complete profile"
      );
      return <Navigate to="/onboarding" replace />;
    }
    // Still checking onboarding status, show loading
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🍽️</div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // If auth is required and user is authenticated, check onboarding
  if (requireAuth && isAuthenticated) {
    console.log("[AuthGuard] Authenticated user on protected route:", {
      path: location.pathname,
      onboardingComplete,
      checkingOnboarding,
    });

    // If accessing onboarding page, check if it's needed
    if (location.pathname === "/onboarding") {
      if (onboardingComplete === true) {
        console.log(
          "[AuthGuard] Redirecting from onboarding to home - already completed"
        );
        return <Navigate to="/home" replace />;
      }
      console.log(
        "[AuthGuard] Allowing access to onboarding page - not completed"
      );
      return <>{children}</>;
    }

    // For other protected routes, check onboarding completion
    if (onboardingComplete === false) {
      console.log("[AuthGuard] Redirecting to onboarding - profile incomplete");
      return <Navigate to="/onboarding" replace />;
    }

    if (onboardingComplete === null) {
      console.log("[AuthGuard] Still checking onboarding status...");
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-4">🍽️</div>
            <p className="text-muted-foreground">Checking profile...</p>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
}
