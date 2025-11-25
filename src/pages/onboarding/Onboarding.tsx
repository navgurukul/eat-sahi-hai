import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { User, Activity, Target, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import GenderStep from "./GenderStep";
import AgeStep from "./AgeStep";
import HeightStep from "./HeightStep";
import WeightStep from "./WeightStep";
import ActivityStep from "./ActivityStep";
import GoalStep from "./GoalStep";
import { useFoodContext } from "../../contexts/FoodContext";
import {
  UserProfileService,
  OnboardingData as ProfileData,
} from "../../lib/userProfileService";

interface OnboardingData {
  gender: string;
  age: string;
  height: string;
  weight: string;
  activity: string;
  goal: string;
}

const steps = [
  { id: 1, title: "Gender", key: "gender" },
  { id: 2, title: "Age", key: "age" },
  { id: 3, title: "Height", key: "height" },
  { id: 4, title: "Weight", key: "weight" },
  { id: 5, title: "Activity Level", key: "activity" },
  { id: 6, title: "Fitness Goal", key: "goal" },
  { id: 7, title: "Summary", key: "summary" },
];

const activityOptions = [
  {
    value: "sedentary",
    label: "Sedentary",
    description: "Little or no exercise",
    multiplier: 1.2,
  },
  {
    value: "light",
    label: "Light",
    description: "Exercise 1-3 days/week",
    multiplier: 1.375,
  },
  {
    value: "moderate",
    label: "Moderate",
    description: "Exercise 3-5 days/week",
    multiplier: 1.55,
  },
  {
    value: "active",
    label: "Active",
    description: "Exercise 6-7 days/week",
    multiplier: 1.725,
  },
  {
    value: "very-active",
    label: "Very Active",
    description: "Hard exercise daily",
    multiplier: 1.9,
  },
];

const goalOptions = [
  {
    value: "lose",
    label: "Lose Weight",
    description: "Create a calorie deficit",
    icon: TrendingUp,
  },
  {
    value: "maintain",
    label: "Maintain",
    description: "Keep current weight",
    icon: Activity,
  },
  {
    value: "gain",
    label: "Gain Weight",
    description: "Build muscle mass",
    icon: Target,
  },
];

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();
  const { setDailyCaloriesTarget } = useFoodContext();
  const [data, setData] = useState<OnboardingData>({
    gender: "",
    age: "",
    height: "",
    weight: "",
    activity: "",
    goal: "",
  });

  const progress = (currentStep / steps.length) * 100;
  const handleNext = () => {
    // Convert height if needed
    if (currentStep === 3) {
      if (heightUnit === "ft") {
        const totalCm =
          (parseFloat(heightFeet) || 0) * 30.48 +
          (parseFloat(heightInch) || 0) * 2.54;
        updateData("height", totalCm.toFixed(2));
      }
    }

    // Convert weight if needed
    if (currentStep === 4) {
      if (weightUnit === "lbs") {
        const weightKg = (parseFloat(weightLbs) || 0) * 0.453592;
        updateData("weight", weightKg.toFixed(2));
      }
    }

    // If final step → save to Supabase → set context → navigate home
    if (currentStep === steps.length) {
      handleOnboardingComplete();
      return;
    }

    // Otherwise → next step
    setCurrentStep(currentStep + 1);
  };

  const handleBack = () => currentStep > 1 && setCurrentStep(currentStep - 1);

  const updateData = (key: keyof OnboardingData, value: string) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const handleOnboardingComplete = async () => {
    try {
      // Get calculated values
      const calculationResult = calculateCaloriesWithDetails();

      // Prepare profile data for Supabase
      const profileData: ProfileData = {
        gender: data.gender,
        age: parseInt(data.age) || 0,
        height_cm: calculationResult.height_cm,
        weight_kg: calculationResult.weight_kg,
        activity_level: data.activity,
        fitness_goal: data.goal,
        daily_calories_target: calculationResult.calories,
        bmr: calculationResult.bmr,
        tdee: calculationResult.tdee,
      };

      // Save to Supabase
      const success = await UserProfileService.saveUserProfile(profileData);

      if (success) {
        // Set in context for immediate use
        setDailyCaloriesTarget(calculationResult.calories);

        // Clear any localStorage data that might be cached
        localStorage.removeItem("onboardingData");

        console.log(
          "[Onboarding] Profile saved successfully, navigating to home"
        );

        // Navigate to home - use replace to prevent going back to onboarding
        navigate("/home", { replace: true });
      } else {
        // Handle error - could show toast notification
        console.error("Failed to save profile");
        alert("Failed to save your profile. Please try again.");
      }
    } catch (error) {
      console.error("Error completing onboarding:", error);
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("An error occurred. Please check your inputs and try again.");
      }
    }
  };

  const calculateCalories = () => {
    const age = parseInt(data.age) || 0;

    // Height in cm - use the current state values
    let heightInCm;
    if (heightUnit === "cm") {
      heightInCm = parseFloat(data.height) || 0;
    } else {
      // Use the feet/inches values from state
      heightInCm =
        (parseFloat(heightFeet) || 0) * 30.48 +
        (parseFloat(heightInch) || 0) * 2.54;
    }

    // Weight in kg - use the current state values
    let weightInKg;
    if (weightUnit === "kg") {
      weightInKg = parseFloat(data.weight) || 0;
    } else {
      // Use the lbs value from state
      weightInKg = (parseFloat(weightLbs) || 0) * 0.453592;
    }

    // Validate all required fields
    if (!age || !heightInCm || !weightInKg || !data.gender || !data.activity) {
      console.log("Missing data:", {
        age,
        heightInCm,
        weightInKg,
        gender: data.gender,
        activity: data.activity,
      });
      return 0;
    }

    // Mifflin-St Jeor Equation
    let bmr =
      data.gender === "male"
        ? 10 * weightInKg + 6.25 * heightInCm - 5 * age + 5
        : 10 * weightInKg + 6.25 * heightInCm - 5 * age - 161;

    const activityMultiplier =
      activityOptions.find((a) => a.value === data.activity)?.multiplier || 1.2;

    let tdee = bmr * activityMultiplier;

    // Adjust for goal
    if (data.goal === "lose") tdee -= 500;
    else if (data.goal === "gain") tdee += 500;

    return Math.round(tdee);
  };

  const calculateCaloriesWithDetails = () => {
    const age = parseInt(data.age) || 0;

    // Height in cm - use the current state values
    let heightInCm;
    if (heightUnit === "cm") {
      heightInCm = parseFloat(data.height) || 0;
    } else {
      // Use the feet/inches values from state
      heightInCm =
        (parseFloat(heightFeet) || 0) * 30.48 +
        (parseFloat(heightInch) || 0) * 2.54;
    }

    // Weight in kg - use the current state values
    let weightInKg;
    if (weightUnit === "kg") {
      weightInKg = parseFloat(data.weight) || 0;
    } else {
      // Use the lbs value from state
      weightInKg = (parseFloat(weightLbs) || 0) * 0.453592;
    }

    // Use UserProfileService calculation for consistency
    const result = UserProfileService.calculateCalories({
      gender: data.gender,
      age: age,
      height_cm: heightInCm,
      weight_kg: weightInKg,
      activity_level: data.activity,
      fitness_goal: data.goal,
    });

    return {
      ...result,
      height_cm: heightInCm,
      weight_kg: weightInKg,
    };
  };

  const isStepValid = () => {
    const step = steps[currentStep - 1];

    switch (step.key) {
      case "age":
        return data.age !== "";
      case "height":
        if (heightUnit === "cm") return data.height !== "";
        else return heightFeet !== "" || heightInch !== "";
      case "weight":
        if (weightUnit === "kg") return data.weight !== "";
        else return weightLbs !== "";
      case "gender":
        return data.gender !== "";
      case "activity":
        return true;
      case "goal":
        return data.goal !== "";
      case "summary":
        return true;
      default:
        return false;
    }
  };

  const [heightUnit, setHeightUnit] = useState<"cm" | "ft">("cm");
  const [heightFeet, setHeightFeet] = useState("");
  const [heightInch, setHeightInch] = useState("");
  const [weightUnit, setWeightUnit] = useState<"kg" | "lbs">("kg");
  const [weightLbs, setWeightLbs] = useState("");
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <GenderStep
            selectedGender={data.gender}
            updateGender={(g) => updateData("gender", g)}
          />
        );
      case 2:
        return (
          <AgeStep age={data.age} updateAge={(a) => updateData("age", a)} />
        );
      case 3:
        return (
          <HeightStep
            heightUnit={heightUnit}
            setHeightUnit={setHeightUnit}
            heightCm={data.height}
            heightFeet={heightFeet}
            heightInch={heightInch}
            updateHeightCm={(val) => updateData("height", val)}
            updateHeightFeet={setHeightFeet}
            updateHeightInch={setHeightInch}
          />
        );

      case 4:
        return (
          <WeightStep
            weightUnit={weightUnit}
            setWeightUnit={setWeightUnit}
            weightKg={data.weight}
            weightLbs={weightLbs}
            updateWeightKg={(val) => updateData("weight", val)}
            updateWeightLbs={setWeightLbs}
          />
        );
      case 5:
        return (
          <ActivityStep
            gender={data.gender}
            selectedActivity={data.activity}
            updateActivity={(val) => updateData("activity", val)}
          />
        );
      case 6:
        return (
          <GoalStep
            gender={data.gender}
            selectedGoal={data.goal}
            updateGoal={(val) => updateData("goal", val)}
          />
        );
      case 7:
        const calories = calculateCalories();
        return renderSummary(calories);

      default:
        return null;
    }
  };

  const renderSummary = (calories: number) => (
    console.log("Total Calories to display:", calories),
    (
      <div className="space-y-4 animate-fade-in text-center">
        <h2 className="text-3xl font-bold">Your Fitness Profile</h2>
        <p className="text-muted-foreground">
          Here's your personalized summary
        </p>

        <Card
          className="max-w-lg mx-auto p-4 "
          style={{ backgroundColor: "#21C45D" }}
        >
          <div className="text-center space-y-2 mb-2">
            <p className="text-white/90 text-sm font-medium">
              Daily Calorie Target
            </p>
            <p className="text-6xl text-white">{calories}</p>
            <p className="text-white/80 text-sm">calories per day</p>
          </div>
        </Card>

        <div className="max-w-lg mx-auto grid grid-cols-2 gap-2">
          <Card className="p-4 shadow-elegant">
            <p className="text-sm text-muted-foreground mb-1">Gender</p>
            <p className="font-semibold text-lg capitalize">{data.gender}</p>
          </Card>
          <Card className="p-4 shadow-elegant">
            <p className="text-sm text-muted-foreground mb-1">Age</p>
            <p className="font-semibold text-lg">{data.age} years</p>
          </Card>
          <Card className="p-4 shadow-elegant">
            <p className="text-sm text-muted-foreground mb-1">Height</p>
            <p className="font-semibold text-lg">{data.height} cm</p>
          </Card>
          <Card className="p-4 shadow-elegant">
            <p className="text-sm text-muted-foreground mb-1">Weight</p>
            <p className="font-semibold text-lg">{data.weight} kg</p>
          </Card>
          <Card className="p-4 shadow-elegant ">
            <p className="text-sm text-muted-foreground mb-1">Activity Level</p>
            <p className="font-semibold capitalize">
              {activityOptions.find((a) => a.value === data.activity)?.label}
            </p>
          </Card>
          <Card className="p-4 shadow-elegant">
            <p className="text-sm text-muted-foreground mb-1">Goal</p>
            <p className="font-semibold">
              {goalOptions.find((g) => g.value === data.goal)?.label}
            </p>
          </Card>
        </div>
      </div>
    )
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Progress Bar */}
      <div className="sticky top-0 z-10 bg-card shadow-md">
        <div className="container max-w-4xl mx-auto px-4 py-6">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-muted-foreground">
                Step {currentStep} of {steps.length}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className={cn(
                    "h-2 w-2 rounded-full transition-smooth",
                    index < currentStep
                      ? "bg-primary"
                      : index === currentStep - 1
                      ? "bg-primary scale-150"
                      : "bg-muted"
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 container max-w-4xl mx-auto px-4 py-12">
        {renderStep()}
      </div>

      {/* Navigation Buttons */}
      <div className="sticky bottom-0 bg-card shadow-lg border-t">
        <div className="container max-w-4xl mx-auto px-4 py-6 flex justify-between gap-4">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
            className="min-w-[120px]"
          >
            Back
          </Button>
          <Button
            onClick={handleNext}
            disabled={!isStepValid()}
            className="min-w-[120px] gradient-fitness border-0"
          >
            {currentStep === steps.length ? "Finish" : "Next"}
          </Button>
        </div>
      </div>
    </div>
  );
}
