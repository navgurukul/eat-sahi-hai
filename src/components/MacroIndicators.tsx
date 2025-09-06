import { ProgressRing } from "@/components/ui/progress-ring";

export function MacroIndicators() {
  const currentCalories = 1230;
  const targetCalories = 2000;
  const currentSugar = 45;
  const targetSugar = 100;

  return (
    <div className="bg-card rounded-2xl border border-border p-5 shadow-lg">
      <h3 className="text-base font-fredoka font-bold text-foreground mb-4 text-center">
        Aaj ka Nutrition 📊
      </h3>
      
      <div className="grid grid-cols-2 gap-6">
        <div className="flex flex-col items-center">
          <ProgressRing 
            value={currentCalories} 
            max={targetCalories} 
            size={70} 
            color="calories"
            className="mb-2"
          >
            <div className="text-center">
              <div className="text-sm font-baloo font-bold text-progress-calories">
                {currentCalories}
              </div>
              <div className="text-[10px] text-muted-foreground font-quicksand">
                kcal
              </div>
            </div>
          </ProgressRing>
          <span className="text-xs font-quicksand font-medium text-muted-foreground">
            Calories
          </span>
        </div>

        <div className="flex flex-col items-center">
          <ProgressRing 
            value={currentSugar} 
            max={targetSugar} 
            size={70} 
            color="glycemic"
            className="mb-2"
          >
            <div className="text-center">
              <div className="text-sm font-baloo font-bold text-progress-glycemic">
                {currentSugar}g
              </div>
              <div className="text-[10px] text-muted-foreground font-quicksand">
                sugar
              </div>
            </div>
          </ProgressRing>
          <span className="text-xs font-quicksand font-medium text-muted-foreground">
            Sugar Level
          </span>
        </div>
      </div>

      <div className="mt-4 text-center">
        <p className="text-xs text-muted-foreground font-quicksand">
          🔥 {Math.round((currentCalories/targetCalories)*100)}% daily goal • 
          🍯 {Math.round((currentSugar/targetSugar)*100)}% sugar limit
        </p>
      </div>
    </div>
  );
}