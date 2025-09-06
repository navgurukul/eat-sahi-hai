import { ProgressRing } from "@/components/ui/progress-ring";

export function MacroIndicators() {
  const macros = {
    calories: { current: 1847, target: 2000 },
    glycemic: { current: 67, target: 100 },
    protein: { current: 68, target: 120 },
    carbs: { current: 198, target: 250 },
    fat: { current: 73, target: 67 },
  };

  return (
    <div className="space-y-4">
      {/* Clean Main Metrics Card */}
      <div className="bg-card p-6 rounded-xl border shadow-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            {/* Calories */}
            <div className="flex items-center space-x-3">
              <ProgressRing value={macros.calories.current} max={macros.calories.target} size={56} color="calories">
                <div className="text-center">
                  <div className="text-sm font-bold text-foreground">{macros.calories.current}</div>
                </div>
              </ProgressRing>
              <div>
                <h3 className="text-sm font-semibold text-foreground">Calories</h3>
                <p className="text-xs text-muted-foreground">{macros.calories.current}/{macros.calories.target} kcal</p>
              </div>
            </div>

            {/* Sugar Level */}
            <div className="flex items-center space-x-3">
              <ProgressRing value={macros.glycemic.current} max={macros.glycemic.target} size={56} color="glycemic">
                <div className="text-center">
                  <div className="text-sm font-bold text-foreground">{macros.glycemic.current}</div>
                </div>
              </ProgressRing>
              <div>
                <h3 className="text-sm font-semibold text-foreground">Sugar Level</h3>
                <p className="text-xs text-muted-foreground">{macros.glycemic.current}/{macros.glycemic.target} GI</p>
              </div>
            </div>
          </div>
          
          {/* Quick Status */}
          <div className="text-right">
            <div className="text-xs text-primary font-medium">Remaining</div>
            <div className="text-xs text-muted-foreground">{macros.calories.target - macros.calories.current} kcal</div>
          </div>
        </div>
      </div>

      {/* Clean Macro Details */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-card p-4 rounded-xl border shadow-card hover:shadow-food transition-all duration-200">
          <div className="flex flex-col items-center space-y-3">
            <ProgressRing value={macros.protein.current} max={macros.protein.target} size={48} color="protein">
              <div className="text-center">
                <div className="text-sm font-bold text-foreground">{macros.protein.current}</div>
              </div>
            </ProgressRing>
            <div className="text-center">
              <h3 className="text-sm font-semibold text-foreground">Protein</h3>
              <p className="text-xs text-muted-foreground">{macros.protein.current}/{macros.protein.target}g</p>
            </div>
          </div>
        </div>

        <div className="bg-card p-4 rounded-xl border shadow-card hover:shadow-food transition-all duration-200">
          <div className="flex flex-col items-center space-y-3">
            <ProgressRing value={macros.carbs.current} max={macros.carbs.target} size={48} color="carbs">
              <div className="text-center">
                <div className="text-sm font-bold text-foreground">{macros.carbs.current}</div>
              </div>
            </ProgressRing>
            <div className="text-center">
              <h3 className="text-sm font-semibold text-foreground">Carbs</h3>
              <p className="text-xs text-muted-foreground">{macros.carbs.current}/{macros.carbs.target}g</p>
            </div>
          </div>
        </div>

        <div className="bg-card p-4 rounded-xl border shadow-card hover:shadow-food transition-all duration-200">
          <div className="flex flex-col items-center space-y-3">
            <ProgressRing value={macros.fat.current} max={macros.fat.target} size={48} color="fat">
              <div className="text-center">
                <div className="text-sm font-bold text-foreground">{macros.fat.current}</div>
              </div>
            </ProgressRing>
            <div className="text-center">
              <h3 className="text-sm font-semibold text-foreground">Fat</h3>
              <p className="text-xs text-muted-foreground">{macros.fat.current}/{macros.fat.target}g</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}