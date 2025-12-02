import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOut, User, Mail, TrendingUp, Activity, Target } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { UserProfileService } from "@/lib/userProfileService";
import { Pencil } from "lucide-react";
import { useFoodContext } from "@/contexts/FoodContext";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";


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

interface CalorieResult {
  calories: number;
  bmi: string;
  bmiCategory: string;
  bmiWarning: string | null;
  bmr: number;
  tdee: number;
}

export function ProfilePage() {
  const navigate = useNavigate();
  const { user, signOut, loading } = useAuth();
  const { refreshLoggedItemsFromDatabase, setDailyCaloriesTarget } = useFoodContext();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [fitnessData, setFitnessData] = useState<any>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [calories, setCalories] = useState(0);

  // Edit form data
  const [editForm, setEditForm] = useState({
    age: "",
    height_cm: "",
    weight_kg: "",
    activity_level: "",
    fitness_goal: "",
  });

  // Recalculate calories when edit form changes
  useEffect(() => {
    if (editForm.age && editForm.height_cm && editForm.weight_kg && editForm.activity_level && editForm.fitness_goal) {
      const result = calculateCalories({
        gender: fitnessData?.gender || "female",
        age: Number(editForm.age),
        height_cm: Number(editForm.height_cm),
        weight_kg: Number(editForm.weight_kg),
        activity_level: mapActivityForBackend(editForm.activity_level),
        fitness_goal: mapGoalForBackend(editForm.fitness_goal),
      });
      setCalories(result.calories);
    }
  }, [editForm, fitnessData]);

  // Load current data into edit form when modal opens
    useEffect(() => {
    if (editOpen && fitnessData) {
      setEditForm({
        age: fitnessData.age.toString(),
        height_cm: fitnessData.height_cm.toString(),
        weight_kg: fitnessData.weight_kg.toString(),
        activity_level: mapActivityForSelect(fitnessData.activity_level),
        fitness_goal: mapGoalForSelect(fitnessData.fitness_goal),
      });
    }
  }, [editOpen, fitnessData]);

  function mapActivityForSelect(value: string) {
    const map: Record<string, string> = {
      "sedentary": "sedentary",
      "light": "light",
      "moderate": "moderate",
      "active": "active",
      "very-active": "very_active", 
    };
    return map[value] || value;
  }

  function mapGoalForSelect(value: string) {
    const map: Record<string, string> = {
      "lose": "lose_weight",
      "maintain": "maintain",
      "gain": "gain_weight",
    };
    return map[value] || value;
  }

  function mapActivityForBackend(value: string) {
    const map: Record<string, string> = {
      sedentary: "sedentary",
      light: "light",
      moderate: "moderate",
      active: "active",
      very_active: "very-active", 
    };
    return map[value] || value;
  }

  function mapGoalForBackend(value: string) {
    const map: Record<string, string> = {
      lose_weight: "lose",
      maintain: "maintain",
      gain_weight: "gain",
    };
    return map[value] || value;
  }

 const handleSaveProfile = async () => {
    try {
      // Recalculate calories - now returns an object
      const result = calculateCalories({
        gender: fitnessData?.gender || "female",
        age: Number(editForm.age),
        height_cm: Number(editForm.height_cm),
        weight_kg: Number(editForm.weight_kg),
        activity_level: mapActivityForBackend(editForm.activity_level),
        fitness_goal: mapGoalForBackend(editForm.fitness_goal),
      });

      const newCalories = result.calories;

      // Update the profile with recalculated calories
      const updatedProfile = {
        gender: fitnessData?.gender || "female",
        age: Number(editForm.age),
        height_cm: Number(editForm.height_cm),
        weight_kg: Number(editForm.weight_kg),
        activity_level: mapActivityForBackend(editForm.activity_level),
        fitness_goal: mapGoalForBackend(editForm.fitness_goal),
        daily_calories_target: newCalories,
      };

      const success = await UserProfileService.updateUserProfile(updatedProfile);

      if (success) {
        // Update state
        setFitnessData(updatedProfile);

        // Update FoodContext
        setDailyCaloriesTarget(newCalories);

        // Update localStorage as backup
        localStorage.setItem("dailyCaloriesTarget", newCalories.toString());

        // Refresh food data if needed
        await refreshLoggedItemsFromDatabase();

        // Show BMI warning if present
        if (result.bmiWarning) {
          toast.warning(result.bmiWarning, {
            duration: 5000,
          });
        }

        toast.success("Profile updated successfully! Daily calories target has been updated.");
        setEditOpen(false);
      } else {
        toast.error("Failed to update profile.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile.");
    }
  };

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

  const calculateCalories = (profile: {
    gender: string;
    age: number;
    height_cm: number;
    weight_kg: number;
    activity_level: string;
    fitness_goal: string;
  }): CalorieResult => {
    const { gender, age, height_cm, weight_kg, activity_level, fitness_goal } = profile;

    if (!age || !height_cm || !weight_kg || !activity_level || !gender) {
      return {
        calories: 0,
        bmi: "0.0",
        bmiCategory: "normal",
        bmiWarning: null,
        bmr: 0,
        tdee: 0
      };
    }

    // Calculate BMI
    const heightInMeters = height_cm / 100;
    const bmi = weight_kg / (heightInMeters * heightInMeters);

    // BMI categories
    let bmiCategory = "normal";
    let bmiWarning: string | null = null;

    if (bmi < 16.5) {
      bmiCategory = "severely_underweight";
      bmiWarning = "Severely underweight - Please consult a healthcare professional";
    } else if (bmi < 18.5) {
      bmiCategory = "underweight";
      bmiWarning = "Underweight";
    } else if (bmi >= 25 && bmi < 30) {
      bmiCategory = "overweight";
      bmiWarning = "Overweight";
    } else if (bmi >= 30) {
      bmiCategory = "obese";
      bmiWarning = "Obese - Please consult a healthcare professional";
    }

    // BMR using Mifflin-St Jeor Equation
    const bmr =
      gender === "male"
        ? 10 * weight_kg + 6.25 * height_cm - 5 * age + 5
        : 10 * weight_kg + 6.25 * height_cm - 5 * age - 161;

    // Map activity level to multiplier
    let activityMultiplier = 1.2;
    switch (activity_level) {
      case "sedentary":
        activityMultiplier = 1.2;
        break;
      case "light":
        activityMultiplier = 1.375;
        break;
      case "moderate":
        activityMultiplier = 1.55;
        break;
      case "active":
        activityMultiplier = 1.725;
        break;
      case "very-active":
        activityMultiplier = 1.9;
        break;
      default:
        activityMultiplier = 1.2;
    }

    let tdee = bmr * activityMultiplier;

    // Base goal adjustment
    if (fitness_goal === "lose") tdee -= 500;
    else if (fitness_goal === "gain") tdee += 500;

    // BMI-based adjustments for extreme cases
    if (bmiCategory === "severely_underweight") {
      if (fitness_goal === "gain") {
        // More aggressive weight gain for severely underweight
        tdee += 300;
      } else if (fitness_goal === "lose") {
        // Don't allow weight loss for severely underweight
        tdee = bmr * activityMultiplier;
        bmiWarning += " - Weight loss not recommended";
      }
    } else if (bmiCategory === "underweight") {
      if (fitness_goal === "gain") {
        tdee += 200;
      }
    } else if (bmiCategory === "overweight" || bmiCategory === "obese") {
      if (fitness_goal === "lose") {
        tdee -= 300;
      } else if (fitness_goal === "gain") {
        bmiWarning += " - Weight gain may not be advisable";
      }
    }

    const finalCalories = Math.round(tdee);

    return {
      calories: finalCalories,
      bmi: bmi.toFixed(1),
      bmiCategory,
      bmiWarning,
      bmr: Math.round(bmr),
      tdee: Math.round(bmr * activityMultiplier)
    };
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

  const getBmiResult = () => {
    if (!fitnessData) return null;
    return calculateCalories({
      gender: fitnessData.gender,
      age: fitnessData.age,
      height_cm: fitnessData.height_cm,
      weight_kg: fitnessData.weight_kg,
      activity_level: fitnessData.activity_level,
      fitness_goal: fitnessData.fitness_goal
    });
  };

  const bmiResult = getBmiResult();


  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10 py-6 px-3 sm:px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header with Avatar */}
        <div className="text-center space-y-4 animate-fade-in">
          <div className="relative inline-block">
            <Avatar className="w-32 h-32 sm:w-32 sm:h-32 border-4 border-primary/20 shadow-md hover:scale-105 transition-transform duration-300">
              <AvatarFallback className="text-4xl font-bold bg-gradient-to-br from-primary to-primary/70 text-primary-foreground">
                {getInitials(userProfile.fullName)}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-fitness-success rounded-full flex items-center justify-center border-4 border-background shadow-lg animate-pulse">
              <TrendingUp className="w-6 h-6 text-fitness-success-foreground" />
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold  bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            {userProfile.fullName}
          </h1>
          <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
            <Mail className="w-4 h-4" />
            {userProfile.email}
          </div>
        </div>

        {fitnessData && (
          <>
            <Card className="overflow-hidden border border-gray-200 rounded-xl hover:shadow-xl transition-all duration-300 animate-fade-in">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b">
                <div className="flex items-center justify-between gap-3">
                  {/* LEFT SECTION */}
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                      <Activity className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div>
                      <CardTitle className="text-m">Your Fitness Profile</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        Personalized health metrics
                      </p>
                    </div>
                  </div>

                  {/* EDIT BUTTON */}
                  <Pencil
                    className="w-5 h-5 cursor-pointer hover:text-primary shrink-0"
                    onClick={() => setEditOpen(true)}
                  />
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {bmiResult.bmiWarning && (
                  <div className={`p-3 rounded-lg ${bmiResult.bmiCategory === "severely_underweight" || bmiResult.bmiCategory === "obese" ? 'bg-red-50 border border-red-200' : 'bg-yellow-50 border border-yellow-200'}`}>
                    <div className="flex items-center gap-2">
                      <span className={`text-lg ${bmiResult.bmiCategory === "severely_underweight" || bmiResult.bmiCategory === "obese" ? 'text-red-600' : 'text-yellow-600'}`}>
                        {bmiResult.bmiCategory === "severely_underweight" || bmiResult.bmiCategory === "obese" ? '⚠️' : 'ℹ️'}
                      </span>
                      <div>
                        <p className={`font-medium ${bmiResult.bmiCategory === "severely_underweight" || bmiResult.bmiCategory === "obese" ? 'text-red-800' : 'text-yellow-800'}`}>
                          BMI: {bmiResult.bmi} ({bmiResult.bmiCategory.replace('_', ' ')})
                        </p>
                        <p className={`text-sm ${bmiResult.bmiCategory === "severely_underweight" || bmiResult.bmiCategory === "obese" ? 'text-red-600' : 'text-yellow-600'}`}>
                          {bmiResult.bmiWarning}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 gap-4">
                  {[
                    { label: "Gender", value: fitnessData.gender, emoji: "👤" },
                    { label: "Age", value: fitnessData.age, emoji: "🎂", unit: "years" },
                    { label: "Height", value: fitnessData.height_cm, emoji: "📏", unit: "cm" },
                    { label: "Weight", value: fitnessData.weight_kg, emoji: "⚖️", unit: "kg" },
                    { label: "Activity", value: fitnessData.activity_level, emoji: "💪" },
                    { label: "Goal", value: fitnessData.fitness_goal, emoji: "🎯" },
                    { label: "Calories", value: calories || fitnessData.daily_calories_target, emoji: "🔥", unit: "cal" },
                  ].map((item, index) => (
                    <Card
                      key={index}
                      className="text-center border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-lg transition-transform hover:-translate-y-1"
                    >
                      <div className="text-2xl mb-2">{item.emoji}</div>
                      <p className="text-xs text-muted-foreground uppercase font-medium">
                        {item.label}
                      </p>
                      <p className="text-lg font-bold">
                        {item.value}{" "}
                        {item.unit && (
                          <span className="text-sm font-normal">{item.unit}</span>
                        )}
                      </p>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 🚀 EDIT MODAL */}
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
              <DialogContent className="max-w-md w-[95%] rounded-xl px-4 sm:px-6">
                <DialogHeader>
                  <DialogTitle>Edit Fitness Profile</DialogTitle>
                </DialogHeader>

                {/* FORM */}
                <div className="grid gap-3 py-4">

                  {/* Age */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-3">
                    <Label>Age</Label>
                    <Input
                      type="number"
                      className="sm:col-span-3"
                      value={editForm.age}
                      onChange={(e) =>
                        setEditForm({ ...editForm, age: e.target.value })
                      }
                    />
                  </div>

                  {/* Height */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-3">
                    <Label>Height (cm)</Label>
                    <Input
                      type="number"
                      className="sm:col-span-3"
                      value={editForm.height_cm}
                      onChange={(e) =>
                        setEditForm({ ...editForm, height_cm: e.target.value })
                      }
                    />
                  </div>

                  {/* Weight */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-3">
                    <Label>Weight (kg)</Label>
                    <Input
                      type="number"
                      className="sm:col-span-3"
                      value={editForm.weight_kg}
                      onChange={(e) =>
                        setEditForm({ ...editForm, weight_kg: e.target.value })
                      }
                    />
                  </div>

                  {/* Activity */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-3">
                    <Label>Activity</Label>
                    <Select
                      value={editForm.activity_level}
                      onValueChange={(v) =>
                        setEditForm({ ...editForm, activity_level: v })
                      }
                    >
                      <SelectTrigger className=" col-span-3 min-h-[48px] whitespace-normal break-words [&>span]:whitespace-normal [&>span]:break-words">
                        <SelectValue placeholder="Select activity level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sedentary">Sedentary</SelectItem>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="moderate">Moderate</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="very_active">Very Active</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Goal */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-3">
                    <Label>Goal</Label>
                    <Select
                      value={editForm.fitness_goal}
                      onValueChange={(v) =>
                        setEditForm({ ...editForm, fitness_goal: v })
                      }
                    >
                      <SelectTrigger className="col-span-3 whitespace-normal break-words min-h-[48px]">
                        <SelectValue placeholder="Select goal" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lose_weight">Lose Weight</SelectItem>
                        <SelectItem value="maintain">Maintain</SelectItem>
                        <SelectItem value="gain_weight">Gain Weight</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <DialogFooter className="flex justify-end gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditOpen(false)}
                  >
                    Cancel
                  </Button>

                  <Button
                    size="sm"
                    onClick={handleSaveProfile}
                    className="bg-primary text-white"
                  >
                    Save
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
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