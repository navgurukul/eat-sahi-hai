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
  const [isCheckingOnboarding, setIsCheckingOnboarding] = useState(false);

  // Check onboarding status
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (user && !isCheckingOnboarding) {
        // Force recheck if we're on /home and status is false (likely stale)
        const shouldRecheck =
          onboardingComplete === null ||
          (location.pathname === "/home" && onboardingComplete === false);

        if (shouldRecheck) {
          setIsCheckingOnboarding(true);
          try {
            console.log(
              "[AuthGuard] Checking onboarding status for user:",
              user.id,
              "path:",
              location.pathname
            );
            const profile = await UserProfileService.getUserProfile();
            console.log("[AuthGuard] Profile check result:", profile);

            const isComplete = profile !== null;
            console.log("[AuthGuard] Onboarding complete:", isComplete);
            setOnboardingComplete(isComplete);
          } catch (error) {
            console.error("[AuthGuard] Error checking onboarding:", error);
            setOnboardingComplete(false);
          } finally {
            setIsCheckingOnboarding(false);
          }
        }
      }
    };

    if (!loading && user) {
      checkOnboardingStatus();
    }
  }, [
    user,
    loading,
    location.pathname,
    onboardingComplete,
    isCheckingOnboarding,
  ]);

  // Show loading state
  if (loading || (user && isCheckingOnboarding)) {
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

  console.log("[AuthGuard] State:", {
    path: location.pathname,
    hash: location.hash,
    fullPath: location.pathname + location.hash,
    isAuthenticated,
    onboardingComplete,
    requireAuth,
  });

  // Special case: If user is authenticated, has completed onboarding, but is on onboarding page
  if (
    isAuthenticated &&
    onboardingComplete === true &&
    location.pathname.startsWith("/onboarding")
  ) {
    console.log(
      "[AuthGuard] ⚡ IMMEDIATE REDIRECT: User has completed profile but is on onboarding page"
    );
    return <Navigate to="/home" replace />;
  }

  // Not authenticated - redirect to auth
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  // Authenticated user logic
  if (isAuthenticated) {
    // On auth page - redirect based on onboarding
    if (!requireAuth) {
      if (onboardingComplete === true) {
        return <Navigate to="/home" replace />;
      }
      if (onboardingComplete === false) {
        return <Navigate to="/onboarding" replace />;
      }
    }

    // On onboarding page but complete - redirect to home
    if (
      location.pathname.startsWith("/onboarding") &&
      onboardingComplete === true
    ) {
      console.log(
        "[AuthGuard] 🚀 REDIRECTING: Onboarding complete, going to home"
      );
      return <Navigate to="/home" replace />;
    }

    // On protected route but incomplete - redirect to onboarding
    if (
      requireAuth &&
      location.pathname !== "/onboarding" &&
      onboardingComplete === false
    ) {
      return <Navigate to="/onboarding" replace />;
    }

    // Allow access
    return <>{children}</>;
  }

  return <>{children}</>;
}
