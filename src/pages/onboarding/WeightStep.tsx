// components/onboardingSteps/WeightStep.tsx
import { Input } from "@/components/ui/input";
import WeightIcon from "@/assets/weight.png";
import { cn } from "@/lib/utils";

interface WeightStepProps {
  weightUnit: "kg" | "lbs";
  setWeightUnit: (unit: "kg" | "lbs") => void;
  weightKg: string;
  weightLbs: string;
  updateWeightKg: (val: string) => void;
  updateWeightLbs: (val: string) => void;
}

export default function WeightStep({
  weightUnit,
  setWeightUnit,
  weightKg,
  weightLbs,
  updateWeightKg,
  updateWeightLbs,
}: WeightStepProps) {
  return (
    <div className="space-y-2 animate-slide-in text-center">
      <h2 className="text-3xl font-bold">What's your weight?</h2>
      <p className="text-muted-foreground">
        Current weight for personalized goals
      </p>

      <div className="flex justify-center mb-4">
        <img src={WeightIcon} alt="User" className="h-32 w-32 object-contain" />
      </div>

      {/* Unit Selection */}
      <div className="flex justify-center gap-4 mb-2">
        <button
          className={cn(
            "px-4 py-2 border rounded-lg",
            weightUnit === "kg" ? "bg-primary text-white" : "bg-card"
          )}
          onClick={() => setWeightUnit("kg")}
        >
          kg
        </button>
        <button
          className={cn(
            "px-4 py-2 border rounded-lg",
            weightUnit === "lbs" ? "bg-primary text-white" : "bg-card"
          )}
          onClick={() => setWeightUnit("lbs")}
        >
          lbs
        </button>
      </div>

      <div className="max-w-sm mx-auto">
        <div className="relative">
          {weightUnit === "kg" ? (
            <>
              <Input
                type="number"
                placeholder="Enter your weight in kg"
                value={weightKg}
                onChange={(e) => updateWeightKg(e.target.value)}
                className="text-center text-l h-16 border-2 focus:border-primary"
                min="20"
                max="500"
              />
              <span className="absolute right-10 top-1/2 -translate-y-1/2 text-muted-foreground">
                kg
              </span>
            </>
          ) : (
            <>
              <Input
                type="number"
                placeholder="Enter your weight in lbs"
                value={weightLbs}
                onChange={(e) => updateWeightLbs(e.target.value)}
                className="text-center text-2xl h-16 border-2 focus:border-primary"
                min="44"
                max="1100"
              />
              <span className="absolute right-10 top-1/2 -translate-y-1/2 text-muted-foreground">
                lbs
              </span>
            </>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-4">
          Weight should be between{" "}
          {weightUnit === "kg" ? "20-500 kg" : "44-1100 lbs"}
        </p>
      </div>
    </div>
  );
}
