import { cn } from "@/lib/utils";

interface ProgressRingProps {
  value: number;
  max: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  color?: "calories" | "protein" | "carbs" | "fat" | "glycemic" | "dynamic";
  dynamicColor?: string; // For custom dynamic colors
  children?: React.ReactNode;
}

export function ProgressRing({
  value,
  max,
  size = 80,
  strokeWidth = 6,
  className,
  color = "calories",
  dynamicColor,
  children,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const percentage = Math.min((value / max) * 100, 100);
  const strokeDasharray = `${
    (percentage / 100) * circumference
  } ${circumference}`;

  const colorClasses = {
    calories: "stroke-progress-calories",
    protein: "stroke-progress-protein",
    carbs: "stroke-progress-carbs",
    fat: "stroke-progress-fat",
    glycemic: "stroke-progress-glycemic",
    dynamic: "", // Will use dynamicColor instead
  };

  // Determine the stroke color
  const getStrokeColor = () => {
    if (color === "dynamic" && dynamicColor) {
      return dynamicColor;
    }
    return "currentColor";
  };

  const getStrokeClass = () => {
    if (color === "dynamic") {
      return "progress-ring transition-all duration-500 ease-out";
    }
    return cn(
      "progress-ring transition-all duration-500 ease-out",
      colorClasses[color]
    );
  };

  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center",
        className
      )}
    >
      <svg width={size} height={size} className="transform -rotate-90">
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
          stroke={getStrokeColor()}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeLinecap="round"
          className={cn(
            getStrokeClass(),
            value > 0 ? "" : "stroke-transparent"
          )}
          style={
            color === "dynamic" && dynamicColor ? { stroke: dynamicColor } : {}
          }
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {children}
      </div>
    </div>
  );
}
