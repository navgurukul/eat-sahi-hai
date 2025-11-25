// components/onboardingSteps/AgeStep.tsx
import { Input } from "@/components/ui/input";
import AgeIcon from "@/assets/age.png";

interface AgeStepProps {
  age: string;
  updateAge: (age: string) => void;
}

export default function AgeStep({ age, updateAge }: AgeStepProps) {
  return (
    <div className="space-y-1 animate-slide-in text-center">
      <div className="text-center space-y-1">
        <h2 className="text-3xl font-bold">How old are you?</h2>
        <p className="text-muted-foreground">This helps calculate your metabolic rate</p>
      </div>

      <div className="flex justify-center -mb-2">
        <img src={AgeIcon} alt="User" className="h-32 w-32 object-contain" />
      </div>

      <div className="max-w-sm mx-auto relative ">
        <Input
          type="number"
          placeholder="Enter your age"
          value={age}
          onChange={(e) => updateAge(e.target.value)}
          className="text-center text-l h-16 border-2 focus:border-primary"
        />
        <span className="absolute right-10 top-1/2 -translate-y-1/2 text-muted-foreground">
          years
        </span>
      </div>
    </div>
  );
}
