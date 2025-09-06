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
      {/* Compact Main Metrics Row */}
      <div className="bg-gradient-to-r from-primary/5 via-secondary/10 to-accent/5 p-4 rounded-2xl border border-primary/20 food-card-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            {/* Calories */}
            <div className="flex items-center space-x-3">
              <ProgressRing value={macros.calories.current} max={macros.calories.target} size={50} color="calories">
                <div className="text-center">
                  <div className="text-sm font-fredoka font-bold text-foreground">{macros.calories.current}</div>
                </div>
              </ProgressRing>
              <div>
                <h3 className="text-sm font-baloo font-bold text-foreground">🔥 Calories</h3>
                <p className="text-xs text-muted-foreground">{macros.calories.current}/{macros.calories.target} kcal</p>
              </div>
            </div>

            {/* Sugar Level */}
            <div className="flex items-center space-x-3">
              <ProgressRing value={macros.glycemic.current} max={macros.glycemic.target} size={50} color="glycemic">
                <div className="text-center">
                  <div className="text-sm font-fredoka font-bold text-foreground">{macros.glycemic.current}</div>
                </div>
              </ProgressRing>
              <div>
                <h3 className="text-sm font-baloo font-bold text-foreground">🍯 Sugar Level</h3>
                <p className="text-xs text-muted-foreground">{macros.glycemic.current}/{macros.glycemic.target} GI</p>
              </div>
            </div>
          </div>
          
          {/* Quick Status */}
          <div className="text-right">
            <div className="text-xs font-baloo text-primary font-semibold">Pet bhar gaya? 😋</div>
            <div className="text-xs text-muted-foreground">{macros.calories.target - macros.calories.current} kcal left</div>
          </div>
        </div>
      </div>

      {/* Detailed Macros Row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-card p-3 rounded-xl border border-border/50 shadow-food hover:shadow-food-hover transition-all duration-300 hover:scale-105">
          <div className="flex flex-col items-center space-y-2">
            <ProgressRing value={macros.protein.current} max={macros.protein.target} size={45} color="protein">
              <div className="text-center">
                <div className="text-sm font-fredoka font-bold text-foreground">{macros.protein.current}</div>
              </div>
            </ProgressRing>
            <div className="text-center">
              <h3 className="text-xs font-baloo font-bold text-foreground">🥩 Protein</h3>
              <p className="text-xs text-muted-foreground">{macros.protein.current}/{macros.protein.target}g</p>
            </div>
          </div>
        </div>

        <div className="bg-card p-3 rounded-xl border border-border/50 shadow-food hover:shadow-food-hover transition-all duration-300 hover:scale-105">
          <div className="flex flex-col items-center space-y-2">
            <ProgressRing value={macros.carbs.current} max={macros.carbs.target} size={45} color="carbs">
              <div className="text-center">
                <div className="text-sm font-fredoka font-bold text-foreground">{macros.carbs.current}</div>
              </div>
            </ProgressRing>
            <div className="text-center">
              <h3 className="text-xs font-baloo font-bold text-foreground">🍞 Carbs</h3>
              <p className="text-xs text-muted-foreground">{macros.carbs.current}/{macros.carbs.target}g</p>
            </div>
          </div>
        </div>

        <div className="bg-card p-3 rounded-xl border border-border/50 shadow-food hover:shadow-food-hover transition-all duration-300 hover:scale-105">
          <div className="flex flex-col items-center space-y-2">
            <ProgressRing value={macros.fat.current} max={macros.fat.target} size={45} color="fat">
              <div className="text-center">
                <div className="text-sm font-fredoka font-bold text-foreground">{macros.fat.current}</div>
              </div>
            </ProgressRing>
            <div className="text-center">
              <h3 className="text-xs font-baloo font-bold text-foreground">🥑 Fat</h3>
              <p className="text-xs text-muted-foreground">{macros.fat.current}/{macros.fat.target}g</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}