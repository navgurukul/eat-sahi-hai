import { ProgressRing } from "@/components/ui/progress-ring";

export function MacroIndicators() {
  // Sample data - you can replace with real data later
  const macros = {
    calories: { current: 1420, target: 2000 },
    glycemic: { current: 65, target: 100 },
    protein: { current: 45, target: 80 },
    carbs: { current: 120, target: 200 },
    fat: { current: 35, target: 65 },
  };

  return (
    <div className="space-y-6">
      {/* Main indicators row */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-card rounded-2xl p-6 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-comico font-bold text-card-foreground">
                Calories
              </h3>
              <p className="text-sm text-subtle-foreground">
                {macros.calories.current} / {macros.calories.target}
              </p>
            </div>
            <ProgressRing
              value={macros.calories.current}
              max={macros.calories.target}
              color="calories"
              size={60}
            >
              <span className="text-xs font-bold text-secondary">
                {Math.round((macros.calories.current / macros.calories.target) * 100)}%
              </span>
            </ProgressRing>
          </div>
        </div>

        <div className="bg-card rounded-2xl p-6 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-comico font-bold text-card-foreground">
                Glycemic Load
              </h3>
              <p className="text-sm text-subtle-foreground">
                {macros.glycemic.current} / {macros.glycemic.target}
              </p>
            </div>
            <ProgressRing
              value={macros.glycemic.current}
              max={macros.glycemic.target}
              color="glycemic"
              size={60}
            >
              <span className="text-xs font-bold text-success">
                {Math.round((macros.glycemic.current / macros.glycemic.target) * 100)}%
              </span>
            </ProgressRing>
          </div>
        </div>
      </div>

      {/* Secondary indicators row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-card rounded-xl p-4 shadow-card">
          <div className="text-center">
            <ProgressRing
              value={macros.protein.current}
              max={macros.protein.target}
              color="protein"
              size={50}
              strokeWidth={4}
            >
              <span className="text-xs font-bold text-info">
                {Math.round((macros.protein.current / macros.protein.target) * 100)}%
              </span>
            </ProgressRing>
            <h4 className="text-sm font-comico font-bold mt-2 text-card-foreground">
              Protein
            </h4>
            <p className="text-xs text-subtle-foreground">
              {macros.protein.current}g / {macros.protein.target}g
            </p>
          </div>
        </div>

        <div className="bg-card rounded-xl p-4 shadow-card">
          <div className="text-center">
            <ProgressRing
              value={macros.carbs.current}
              max={macros.carbs.target}
              color="carbs"
              size={50}
              strokeWidth={4}
            >
              <span className="text-xs font-bold text-primary">
                {Math.round((macros.carbs.current / macros.carbs.target) * 100)}%
              </span>
            </ProgressRing>
            <h4 className="text-sm font-comico font-bold mt-2 text-card-foreground">
              Carbs
            </h4>
            <p className="text-xs text-subtle-foreground">
              {macros.carbs.current}g / {macros.carbs.target}g
            </p>
          </div>
        </div>

        <div className="bg-card rounded-xl p-4 shadow-card">
          <div className="text-center">
            <ProgressRing
              value={macros.fat.current}
              max={macros.fat.target}
              color="fat"
              size={50}
              strokeWidth={4}
            >
              <span className="text-xs font-bold text-accent">
                {Math.round((macros.fat.current / macros.fat.target) * 100)}%
              </span>
            </ProgressRing>
            <h4 className="text-sm font-comico font-bold mt-2 text-card-foreground">
              Fat
            </h4>
            <p className="text-xs text-subtle-foreground">
              {macros.fat.current}g / {macros.fat.target}g
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}