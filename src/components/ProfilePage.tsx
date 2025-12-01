import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOut, User, Mail, TrendingUp, Activity, Target } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { UserProfileService } from "@/lib/userProfileService";

interface UserProfile {
  email: string;
  fullName: string;
}

interface FitnessData {
  gender: string;
  age: number;
  height_cm: number;
  weight_kg: number;
  activity_level: string;
  fitness_goal: string;
  daily_calories_target: number;
}

export function ProfilePage() {
  const navigate = useNavigate();
  const { user, signOut, loading } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [fitnessData, setFitnessData] = useState<any>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

   useEffect(() => {
    if (!user) return;

    setUserProfile({
      email: user.email || "",
      fullName:
        user.user_metadata?.full_name ||
        user.user_metadata?.display_name ||
        "User",
    });

    loadFitnessProfile();
  }, [user]);

  const loadFitnessProfile = async () => {
    const profile = await UserProfileService.getUserProfile();

    if (profile) {
      setFitnessData(profile);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut();
      toast.success("Successfully logged out!");
      navigate("/auth");
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4 animate-fade-in">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-lg text-muted-foreground">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="max-w-md w-full animate-fade-in">
          <CardContent className="pt-6 text-center space-y-4">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto">
              <Mail className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold">Not Logged In</h2>
            <p className="text-muted-foreground">
              Please log in to view your profile
            </p>
            <Button onClick={() => navigate("/auth")} className="w-full">
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header with Avatar */}
        <div className="text-center space-y-4 animate-fade-in">
          <div className="relative inline-block">
            <Avatar className="w-32 h-32 border-4 border-primary/20 shadow-md hover:scale-105 transition-transform duration-300">
              <AvatarFallback className="text-4xl font-bold bg-gradient-to-br from-primary to-primary/70 text-primary-foreground">
                {getInitials(userProfile.fullName)}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-fitness-success rounded-full flex items-center justify-center border-4 border-background shadow-lg animate-pulse">
              <TrendingUp className="w-6 h-6 text-fitness-success-foreground" />
            </div>
          </div>

          <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            {userProfile.fullName}
          </h1>
          <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
            <Mail className="w-4 h-4" />
            {userProfile.email}
          </div>
        </div>

        {/* Fitness Profile Card */}
        {fitnessData && (
          <Card className="overflow-hidden border border-gray-200 rounded-xl hover:shadow-xl transition-all duration-300 animate-fade-in">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                  <Activity className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Your Fitness Profile</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Personalized health metrics
                  </p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-4">
                {[
                  { label: "Gender", value: fitnessData.gender, emoji: "👤" },
                  { label: "Age", value: fitnessData.age, emoji: "🎂", unit: "years" },
                  { label: "Height", value: fitnessData.height_cm, emoji: "📏", unit: "cm" },
                  { label: "Weight", value: fitnessData.weight_kg, emoji: "⚖️", unit: "kg" },
                  { label: "Activity", value: fitnessData.activity_level, emoji: "💪" },
                  { label: "Goal", value: fitnessData.fitness_goal, emoji: "🎯" },
                ].map((item, index) => (
                  <Card
                    key={index}
                    className="text-center border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-transform hover:-translate-y-1"
                  >
                    <div className="text-2xl mb-2">{item.emoji}</div>
                    <p className="text-xs text-muted-foreground uppercase font-medium">{item.label}</p>
                    <p className="text-lg font-bold capitalize">
                      {item.value} {item.unit && <span className="text-sm font-normal">{item.unit}</span>}
                    </p>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

        )}

        {/* Logout Button */}
        <Button
          variant="destructive"
          size="lg"
          className="w-full justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          <LogOut className="h-5 w-5 mr-2" />
          {isLoggingOut ? "Logging out..." : "Logout"}
        </Button>
      </div>
    </div>
  );
}
