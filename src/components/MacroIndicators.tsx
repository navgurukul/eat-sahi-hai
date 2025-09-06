import { ProgressRing } from "@/components/ui/progress-ring";

export function MacroIndicators() {
  // Sample delicious data 🍽️
  const macros = {
    calories: { current: 1420, target: 2000 },
    glycemic: { current: 65, target: 100 },
    protein: { current: 45, target: 80 },
    carbs: { current: 120, target: 200 },
    fat: { current: 35, target: 65 },
  };

  return (
    <div className="space-y-8">
      {/* Main delicious indicators */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-card rounded-3xl p-8 shadow-food border-2 border-primary/20">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-fredoka font-bold text-card-foreground mb-2">
                Calories Today 🔥
              </h3>
              <p className="text-sm text-subtle-foreground font-quicksand font-semibold">
                {macros.calories.current} / {macros.calories.target}
              </p>
            </div>
            <ProgressRing
              value={macros.calories.current}
              max={macros.calories.target}
              color="calories"
              size={75}
            >
              <span className="text-sm font-baloo font-bold text-accent">
                {Math.round((macros.calories.current / macros.calories.target) * 100)}%
              </span>
            </ProgressRing>
          </div>
        </div>

        <div className="bg-card rounded-3xl p-8 shadow-food border-2 border-success/20">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-fredoka font-bold text-card-foreground mb-2">
                Sugar Level 📊
              </h3>
              <p className="text-sm text-subtle-foreground font-quicksand font-semibold">
                {macros.glycemic.current} / {macros.glycemic.target}
              </p>
            </div>
            <ProgressRing
              value={macros.glycemic.current}
              max={macros.glycemic.target}
              color="glycemic"
              size={75}
            >
              <span className="text-sm font-baloo font-bold text-success">
                {Math.round((macros.glycemic.current / macros.glycemic.target) * 100)}%
              </span>
            </ProgressRing>
          </div>
        </div>
      </div>

      {/* Fun mini nutrition trackers */}
      <div className="grid grid-cols-3 gap-5">
        <div className="bg-card rounded-2xl p-5 shadow-food border-2 border-info/20">
          <div className="text-center">
            <ProgressRing
              value={macros.protein.current}
              max={macros.protein.target}
              color="protein"
              size={60}
              strokeWidth={5}
            >
              <span className="text-xs font-baloo font-bold text-info">
                {Math.round((macros.protein.current / macros.protein.target) * 100)}%
              </span>
            </ProgressRing>
            <h4 className="text-sm font-fredoka font-bold mt-3 text-card-foreground">
              Protein 💪
            </h4>
            <p className="text-xs text-subtle-foreground font-quicksand font-medium">
              {macros.protein.current}g / {macros.protein.target}g
            </p>
          </div>
        </div>

        <div className="bg-card rounded-2xl p-5 shadow-food border-2 border-secondary/20">
          <div className="text-center">
            <ProgressRing
              value={macros.carbs.current}
              max={macros.carbs.target}
              color="carbs"
              size={60}
              strokeWidth={5}
            >
              <span className="text-xs font-baloo font-bold text-secondary">
                {Math.round((macros.carbs.current / macros.carbs.target) * 100)}%
              </span>
            </ProgressRing>
            <h4 className="text-sm font-fredoka font-bold mt-3 text-card-foreground">
              Carbs 🍞
            </h4>
            <p className="text-xs text-subtle-foreground font-quicksand font-medium">
              {macros.carbs.current}g / {macros.carbs.target}g
            </p>
          </div>
        </div>

        <div className="bg-card rounded-2xl p-5 shadow-food border-2 border-primary/20">
          <div className="text-center">
            <ProgressRing
              value={macros.fat.current}
              max={macros.fat.target}
              color="fat"
              size={60}
              strokeWidth={5}
            >
              <span className="text-xs font-baloo font-bold text-primary">
                {Math.round((macros.fat.current / macros.fat.target) * 100)}%
              </span>
            </ProgressRing>
            <h4 className="text-sm font-fredoka font-bold mt-3 text-card-foreground">
              Fat 🥑
            </h4>
            <p className="text-xs text-subtle-foreground font-quicksand font-medium">
              {macros.fat.current}g / {macros.fat.target}g
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}