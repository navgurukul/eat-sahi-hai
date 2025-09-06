import { cn } from "@/lib/utils";

interface ProgressRingProps {
  value: number;
  max: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  color?: "calories" | "protein" | "carbs" | "fat" | "glycemic";
  children?: React.ReactNode;
}

export function ProgressRing({
  value,
  max,
  size = 80,
  strokeWidth = 6,
  className,
  color = "calories",
  children,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const percentage = Math.min((value / max) * 100, 100);
  const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;

  const colorClasses = {
    calories: "stroke-progress-calories",
    protein: "stroke-progress-protein", 
    carbs: "stroke-progress-carbs",
    fat: "stroke-progress-fat",
    glycemic: "stroke-progress-glycemic",
  };

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-progress-bg"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeLinecap="round"
          className={cn("progress-ring transition-all duration-500 ease-out", colorClasses[color])}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {children}
      </div>
    </div>
  );
}