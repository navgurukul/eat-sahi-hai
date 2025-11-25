// components/onboardingSteps/GenderStep.tsx
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { genderOptions } from "./constants"; // You can export genderOptions from a constants file

interface GenderStepProps {
  selectedGender: string;
  updateGender: (gender: string) => void;
}

export default function GenderStep({ selectedGender, updateGender }: GenderStepProps) {
  return (
    <div className="space-y-6 animate-slide-in text-center">
      <h2 className="text-3xl font-bold">What's your gender?</h2>
      <p className="text-muted-foreground">Help us personalize your experience</p>
      <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mt-4">
        {genderOptions.map(option => (
          <Card
            key={option.value}
            className={cn(
              "p-6 cursor-pointer transition-smooth hover:shadow-elegant-lg hover:scale-105 border-2 overflow-hidden",
              selectedGender === option.value
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            )}
            onClick={() => updateGender(option.value)}
          >
            <div className="flex flex-col items-center gap-3">
              <img src={option.image} alt={option.label} className="h-24 w-24 object-contain" />
              <span className="font-semibold text-lg">{option.label}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
