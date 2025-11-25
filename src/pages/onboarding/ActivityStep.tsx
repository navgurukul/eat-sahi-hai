// components/onboardingSteps/ActivityStep.tsx
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import MalesedentaryImg from "@/assets/male-sedentary.png";
import MalelightActivityImg from "@/assets/male-light.png";
import MalemoderateActivityImg from "@/assets/male-mod.png";
import MaleactiveImg from "@/assets/male-active.png";
import MaleveryActiveImg from "@/assets/male-gym.png";
import FemalesedentaryImg from "@/assets/female-sedentary.png";
import FemalelightActivityImg from "@/assets/female-light.png";
import FemalemoderateActivityImg from "@/assets/female-mod.png";
import FemaleactiveImg from "@/assets/female-active.png";
import FemaleveryActiveImg from "@/assets/female-gym.png";

interface ActivityStepProps {
  gender: string;
  selectedActivity: string;
  updateActivity: (val: string) => void;
}

const activityOptions = [
    { value: "sedentary", label: "Sedentary", description: "Little or no exercise", multiplier: 1.2 },
    { value: "light", label: "Light", description: "Exercise 1-3 days/week", multiplier: 1.375 },
    { value: "moderate", label: "Moderate", description: "Exercise 3-5 days/week", multiplier: 1.55 },
    { value: "active", label: "Active", description: "Exercise 6-7 days/week", multiplier: 1.725 },
    { value: "very-active", label: "Very Active", description: "Hard exercise daily", multiplier: 1.9 },
];


export default function ActivityStep({ gender, selectedActivity, updateActivity }: ActivityStepProps) {
  return (
    <div className="space-y-6 animate-slide-in text-center">
      <h2 className="text-3xl font-bold">Activity Level (optional)</h2>
      <p className="text-muted-foreground">How active are you typically?</p>

      <div className="grid gap-3 max-w-lg mx-auto mt-4">
        {activityOptions.map(option => {
          let imgSrc;
          if (gender === "male") {
            imgSrc = option.value === "sedentary" ? MalesedentaryImg
              : option.value === "light" ? MalelightActivityImg
                : option.value === "moderate" ? MalemoderateActivityImg
                  : option.value === "active" ? MaleactiveImg
                    : MaleveryActiveImg;
          } else {
            imgSrc = option.value === "sedentary" ? FemalesedentaryImg
              : option.value === "light" ? FemalelightActivityImg
                : option.value === "moderate" ? FemalemoderateActivityImg
                  : option.value === "active" ? FemaleactiveImg
                    : FemaleveryActiveImg;
          }

          return (
            <Card
              key={option.value}
              className={cn(
                "p-4 cursor-pointer transition-smooth hover:shadow-elegant border-2 overflow-hidden",
                selectedActivity === option.value
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              )}
              onClick={() => updateActivity(option.value)}
            >
              <div className="flex items-center gap-4">
                <img src={imgSrc} alt={option.label} className="h-16 w-16 object-cover rounded-lg flex-shrink-0" />
                <div className="flex-1 text-left">
                  <h3 className="font-semibold">{option.label}</h3>
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
