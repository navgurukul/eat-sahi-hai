import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOut, User, Mail } from "lucide-react";
import { AuthService } from "@/lib/authService";
import { toast } from "sonner";

interface UserProfile {
  email: string;
  fullName: string;
}

export function ProfilePage() {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const user = await AuthService.getCurrentUser();
      if (user) {
        setUserProfile({
          email: user.email || "",
          fullName:
            user.user_metadata?.full_name ||
            user.user_metadata?.display_name ||
            "User",
        });
      }
    } catch (error) {
      console.error("Error loading user profile:", error);
      // Don't redirect here - let AuthGuard handle authentication
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const { error } = await AuthService.signOut();
      if (error) {
        toast.error("Failed to log out. Please try again.");
        console.error("Logout error:", error);
      } else {
        toast.success("Successfully logged out!");
        navigate("/auth");
      }
    } catch (error) {
      console.error("Unexpected logout error:", error);
      toast.error("An unexpected error occurred during logout.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-fredoka font-medium text-foreground">
            Profile 👤
          </h1>
          <p className="text-sm text-muted-foreground font-quicksand">
            Loading your profile...
          </p>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-fredoka font-medium text-foreground">
            Profile 👤
          </h1>
          <p className="text-sm text-muted-foreground font-quicksand">
            Please log in to view your profile
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-fredoka font-medium text-foreground">
          Profile 👤
        </h1>
        <p className="text-sm text-muted-foreground font-quicksand">
          Your account information
        </p>
      </div>

      {/* Profile Card */}
      <Card>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Avatar className="w-24 h-24">
              <AvatarFallback className="text-2xl font-medium bg-primary text-primary-foreground">
                {getInitials(userProfile.fullName)}
              </AvatarFallback>
            </Avatar>
          </div>
          <CardTitle className="text-2xl font-fredoka">
            {userProfile.fullName}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* User Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
              <User className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Name
                </p>
                <p className="text-base font-medium">
                  {userProfile.fullName}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Email
                </p>
                <p className="text-base font-medium">{userProfile.email}</p>
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <Button
            variant="destructive"
            size="lg"
            className="w-full justify-center"
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            <LogOut className="h-5 w-5 mr-2" />
            {isLoggingOut ? "Logging out..." : "Logout"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
