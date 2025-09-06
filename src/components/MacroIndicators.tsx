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
      {/* Main Metrics - Calories & Sugar Level */}
      <div className="grid grid-cols-2 gap-4">
        {/* Calories Card */}
        <div className="bg-card p-4 rounded-xl border border-border/50 shadow-sm">
          <h3 className="text-sm font-baloo font-semibold text-foreground mb-2">🔥 Calories</h3>
          <div className="flex flex-col items-center">
            <ProgressRing value={macros.calories.current} max={macros.calories.target} size={60} color="calories">
              <div className="text-center">
                <div className="text-sm font-fredoka font-semibold text-foreground">{macros.calories.current}</div>
              </div>
            </ProgressRing>
            <p className="text-xs text-muted-foreground mt-2">{macros.calories.current}/{macros.calories.target} kcal</p>
          </div>
        </div>

        {/* Sugar Level Card */}
        <div className="bg-card p-4 rounded-xl border border-border/50 shadow-sm">
          <h3 className="text-sm font-baloo font-semibold text-foreground mb-2">🍯 Sugar Level</h3>
          <div className="flex flex-col items-center">
            <ProgressRing value={macros.glycemic.current} max={macros.glycemic.target} size={60} color="glycemic">
              <div className="text-center">
                <div className="text-sm font-fredoka font-semibold text-foreground">{macros.glycemic.current}</div>
              </div>
            </ProgressRing>
            <p className="text-xs text-muted-foreground mt-2">{macros.glycemic.current}/{macros.glycemic.target} GI</p>
          </div>
        </div>
      </div>

      {/* Protein, Carbs, Fat Cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-card p-3 rounded-xl border border-border/50 shadow-sm hover:shadow-md transition-all duration-300">
          <h3 className="text-xs font-baloo font-semibold text-foreground mb-2 text-center">🥩 Protein</h3>
          <div className="flex flex-col items-center">
            <ProgressRing value={macros.protein.current} max={macros.protein.target} size={50} color="protein">
              <div className="text-center">
                <div className="text-sm font-fredoka font-semibold text-foreground">{macros.protein.current}</div>
              </div>
            </ProgressRing>
            <p className="text-xs text-muted-foreground mt-2">{macros.protein.current}/{macros.protein.target}g</p>
          </div>
        </div>

        <div className="bg-card p-3 rounded-xl border border-border/50 shadow-sm hover:shadow-md transition-all duration-300">
          <h3 className="text-xs font-baloo font-semibold text-foreground mb-2 text-center">🍞 Carbs</h3>
          <div className="flex flex-col items-center">
            <ProgressRing value={macros.carbs.current} max={macros.carbs.target} size={50} color="carbs">
              <div className="text-center">
                <div className="text-sm font-fredoka font-semibold text-foreground">{macros.carbs.current}</div>
              </div>
            </ProgressRing>
            <p className="text-xs text-muted-foreground mt-2">{macros.carbs.current}/{macros.carbs.target}g</p>
          </div>
        </div>

        <div className="bg-card p-3 rounded-xl border border-border/50 shadow-sm hover:shadow-md transition-all duration-300">
          <h3 className="text-xs font-baloo font-semibold text-foreground mb-2 text-center">🥑 Fat</h3>
          <div className="flex flex-col items-center">
            <ProgressRing value={macros.fat.current} max={macros.fat.target} size={50} color="fat">
              <div className="text-center">
                <div className="text-sm font-fredoka font-semibold text-foreground">{macros.fat.current}</div>
              </div>
            </ProgressRing>
            <p className="text-xs text-muted-foreground mt-2">{macros.fat.current}/{macros.fat.target}g</p>
          </div>
        </div>
      </div>

      {/* Pet bhar gaya suggestion */}
      <div className="bg-card p-4 rounded-xl border border-border/50 shadow-sm">
        <div className="text-center">
          <div className="text-sm font-baloo text-primary font-semibold">Pet bhar gaya? 😋</div>
          <div className="text-xs text-muted-foreground">{macros.calories.target - macros.calories.current} kcal left</div>
        </div>
      </div>
    </div>
  );
}