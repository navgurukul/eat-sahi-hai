// components/onboardingSteps/HeightStep.tsx
import { Input } from "@/components/ui/input";
import HeightIcon from "@/assets/height.png";
import { cn } from "@/lib/utils";

interface HeightStepProps {
  heightUnit: "cm" | "ft";
  setHeightUnit: (unit: "cm" | "ft") => void;
  heightCm: string;
  heightFeet: string;
  heightInch: string;
  updateHeightCm: (value: string) => void;
  updateHeightFeet: (value: string) => void;
  updateHeightInch: (value: string) => void;
}

export default function HeightStep({
  heightUnit,
  setHeightUnit,
  heightCm,
  heightFeet,
  heightInch,
  updateHeightCm,
  updateHeightFeet,
  updateHeightInch,
}: HeightStepProps) {
  return (
    <div className="space-y-4 animate-slide-in text-center">
      <h2 className="text-3xl font-bold">What's your height?</h2>
      <p className="text-muted-foreground">We'll use this for accurate calculations</p>

      <div className="flex justify-center -mb-4">
        <img src={HeightIcon} alt="User" className="h-32 w-32 object-contain" />
      </div>

      <div className="flex justify-center gap-4 mb-2">
        <button
          className={cn("px-4 py-2 border rounded-lg", heightUnit === "cm" ? "bg-primary text-white" : "bg-card")}
          onClick={() => setHeightUnit("cm")}
        >
          cm
        </button>
        <button
          className={cn("px-4 py-2 border rounded-lg", heightUnit === "ft" ? "bg-primary text-white" : "bg-card")}
          onClick={() => setHeightUnit("ft")}
        >
          ft
        </button>
      </div>

      {heightUnit === "cm" ? (
        <div className="max-w-sm mx-auto relative">
          <Input
            type="number"
            placeholder="Enter your height in cm"
            value={heightCm}
            onChange={(e) => updateHeightCm(e.target.value)}
            className="text-center text-l h-16 border-2 focus:border-primary"
            min="50"
            max="300"
          />
          <span className="absolute right-10 top-1/2 -translate-y-1/2 text-muted-foreground">cm</span>
          <p className="text-xs text-muted-foreground mt-1">Height should be between 50-300 cm</p>
        </div>
      ) : (
        <div className="max-w-sm mx-auto">
          <div className="flex justify-center gap-4">
            <div className="relative flex-1">
              <Input
                type="number"
                placeholder="Feet"
                value={heightFeet}
                onChange={(e) => updateHeightFeet(e.target.value)}
                className="text-center text-2xl h-16 border-2 focus:border-primary"
                min="1"
                max="9"
              />
              <span className="absolute right-10 top-1/2 -translate-y-1/2 text-muted-foreground">ft</span>
            </div>
            <div className="relative flex-1">
              <Input
                type="number"
                placeholder="Inches"
                value={heightInch}
                onChange={(e) => updateHeightInch(e.target.value)}
                className="text-center text-2xl h-16 border-2 focus:border-primary"
                min="0"
                max="11"
              />
              <span className="absolute right-10 top-1/2 -translate-y-1/2 text-muted-foreground">in</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Height should be between 1'8" - 9'10"</p>
        </div>
      )}
    </div>
  );
}
