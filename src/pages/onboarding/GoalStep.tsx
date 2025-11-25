// components/onboardingSteps/GoalStep.tsx
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { User, Activity, Target, TrendingUp } from "lucide-react";
import MaleloseWeightImg from "@/assets/male-loose.png";
import MalemaintainWeightImg from "@/assets/male-fit.png";
import MalegainWeightImg from "@/assets/male-gain.png";
import FemaleloseWeightImg from "@/assets/female-loose.png";
import FemalemaintainWeightImg from "@/assets/female-fit.png";
import FemalegainWeightImg from "@/assets/female-gain.png";

interface GoalStepProps {
  gender: string;
  selectedGoal: string;
  updateGoal: (val: string) => void;
}

const goalOptions = [
    { value: "lose", label: "Lose Weight", description: "Create a calorie deficit", icon: TrendingUp },
    { value: "maintain", label: "Maintain", description: "Keep current weight", icon: Activity },
    { value: "gain", label: "Gain Weight", description: "Build muscle mass", icon: Target },
];

export default function GoalStep({ gender, selectedGoal, updateGoal }: GoalStepProps) {
  return (
    <div className="space-y-4 animate-slide-in text-center">
      <h2 className="text-3xl font-bold">Fitness Goal</h2>
      <p className="text-muted-foreground">What do you want to achieve?</p>

      <div className="grid gap-4 max-w-lg mx-auto mt-4">
        {goalOptions.map(option => {
          let imgSrc;
          if (gender === "male") {
            imgSrc = option.value === "lose" ? MaleloseWeightImg
              : option.value === "maintain" ? MalemaintainWeightImg
                : MalegainWeightImg;
          } else {
            imgSrc = option.value === "lose" ? FemaleloseWeightImg
              : option.value === "maintain" ? FemalemaintainWeightImg
                : FemalegainWeightImg;
          }

          return (
            <Card
              key={option.value}
              className={cn(
                "p-2 cursor-pointer transition-smooth hover:shadow-elegant-lg hover:scale-[1.02] border-2 overflow-hidden",
                selectedGoal === option.value
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              )}
              onClick={() => updateGoal(option.value)}
            >
              <div className="flex items-center gap-4">
                <img src={imgSrc} alt={option.label} className="h-20 w-20 object-cover rounded-lg flex-shrink-0" />
                <div className="flex-1 text-left">
                  <h3 className="font-semibold text-lg">{option.label}</h3>
                  <p className="text-sm text-muted-foreground">{option.description}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
