import { ProgressRing } from "@/components/ui/progress-ring";
import { useFoodContext } from "@/contexts/FoodContext";

// Daily target values - these can be made configurable later


export function MacroIndicators({ dailyCaloriesTarget }: { dailyCaloriesTarget: number }) {
  const { selectedDate, getLoggedItemsForDate } = useFoodContext();


  // Get logged items for the selected date
  const loggedItems = getLoggedItemsForDate(selectedDate);
  // const proteinTarget = Math.round(dailyCaloriesTarget * 0.30 / 4);
  // const carbsTarget   = Math.round(dailyCaloriesTarget * 0.40 / 4);
  // const fatTarget     = Math.round(dailyCaloriesTarget * 0.30 / 9);
  const proteinTarget = Math.round(dailyCaloriesTarget * 0.25 / 4); // Changed 0.30 to 0.25
const carbsTarget   = Math.round(dailyCaloriesTarget * 0.45 / 4); // Changed 0.40 to 0.45
const fatTarget     = Math.round(dailyCaloriesTarget * 0.30 / 9); // Keep same

  // dynamic sugar per WHO (10% of calories) — or choose fixed 25g if you prefer
  const sugarTarget = Math.round((dailyCaloriesTarget * 0.10) / 4);

  const DAILY_TARGETS = {
    calories: Math.round(dailyCaloriesTarget),
    protein: proteinTarget,
    carbs: carbsTarget,
    fat: fatTarget,
    glycemicLoad: sugarTarget,
  };
  // Calculate dynamic totals from logged food items for the specific date only
  const calculateDayTotals = () => {
    const itemsForSelectedDate = loggedItems.filter((item) => {
      const itemDate = new Date(item.date).toDateString();
      const selectedDateString = selectedDate.toDateString();
      return itemDate === selectedDateString;
    });

    return itemsForSelectedDate.reduce(
      (totals, item) => ({
        calories: totals.calories + (item.calories || 0),
        protein: totals.protein + (item.protein || 0),
        carbs: totals.carbs + (item.carbs || 0),
        fat: totals.fat + (item.fat || 0),
        glycemicLoad: totals.glycemicLoad + (item.glycemicLoad || 0),
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0, glycemicLoad: 0 }
    );
  };

  const dayTotals = calculateDayTotals();

  // Function to get dynamic color for Sugar Level based on glycemic load
  const getSugarLevelColor = (glValue: number): string => {
    if (glValue >= 1 && glValue <= 40) {
      return "#22c55e"; // Green (good)
    } else if (glValue >= 41 && glValue <= 60) {
      return "#eab308"; // Yellow (moderate)
    } else if (glValue >= 61) {
      return "#ef4444"; // Red (high)
    }
    return "#6b7280"; // Gray for 0 or invalid values
  };

  // Round the values for display
  const macros = {
    calories: {
      current: Math.round(dayTotals.calories),
      target: DAILY_TARGETS.calories,
    },
    glycemic: {
      current: Math.round(dayTotals.glycemicLoad),
      target: DAILY_TARGETS.glycemicLoad,
    },
    protein: {
      current: Math.round(dayTotals.protein),
      target: DAILY_TARGETS.protein,
    },
    carbs: {
      current: Math.round(dayTotals.carbs),
      target: DAILY_TARGETS.carbs,
    },
    fat: {
      current: Math.round(dayTotals.fat),
      target: DAILY_TARGETS.fat,
    },
    
  };

  return (
    <div className="space-y-4">
      {/* Main Metrics - Calories & Sugar Level */}
      <div className="grid grid-cols-2 gap-4">
        {/* Calories Card */}
        <div className="bg-card p-4 rounded-xl border border-border/50 shadow-sm">
          <h3 className="text-base font-baloo font-medium text-foreground mb-2">
            🔥 Calories
          </h3>
          <div className="flex flex-col items-center">
            <ProgressRing
              value={macros.calories.current}
              max={macros.calories.target}
              size={60}
              color="calories"
            >
              {/* Empty - no text inside circle */}
            </ProgressRing>
            <p className="text-xs text-muted-foreground mt-2 font-bold">
              {macros.calories.current}/{macros.calories.target} kcal
            </p>
          </div>
        </div>

        {/* Sugar Level Card */}
        <div className="bg-card p-4 rounded-xl border border-border/50 shadow-sm">
          <h3 className="text-base font-baloo font-medium text-foreground mb-2">
            🍯 Sugar Level
          </h3>
          <div className="flex flex-col items-center">
            <ProgressRing
              value={macros.glycemic.current}
              max={macros.glycemic.target}
              size={60}
              color="dynamic"
              dynamicColor={getSugarLevelColor(macros.glycemic.current)}
            >
              {/* Empty - no text inside circle */}
            </ProgressRing>
            <p className="text-xs text-muted-foreground mt-2 font-bold">
              {macros.glycemic.current}/{macros.glycemic.target} GI
            </p>
          </div>
        </div>
      </div>

      {/* Protein, Carbs, Fat Cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-card p-3 rounded-xl border border-border/50 shadow-sm hover:shadow-md transition-all duration-300">
          <h3 className="text-base font-baloo font-medium text-foreground mb-2 text-center">
            🥩 Protein
          </h3>
          <div className="flex flex-col items-center">
            <ProgressRing
              value={macros.protein.current}
              max={macros.protein.target}
              size={50}
              color="protein"
            >
              {/* Empty - no text inside circle */}
            </ProgressRing>
            <p className="text-xs text-muted-foreground mt-2 font-bold">
              {macros.protein.current}/{macros.protein.target}g
            </p>
          </div>
        </div>

        <div className="bg-card p-3 rounded-xl border border-border/50 shadow-sm hover:shadow-md transition-all duration-300">
          <h3 className="text-base font-baloo font-medium text-foreground mb-2 text-center">
            🍞 Carbs
          </h3>
          <div className="flex flex-col items-center">
            <ProgressRing
              value={macros.carbs.current}
              max={macros.carbs.target}
              size={50}
              color="carbs"
            >
              {/* Empty - no text inside circle */}
            </ProgressRing>
            <p className="text-xs text-muted-foreground mt-2 font-bold">
              {macros.carbs.current}/{macros.carbs.target}g
            </p>
          </div>
        </div>

        <div className="bg-card p-3 rounded-xl border border-border/50 shadow-sm hover:shadow-md transition-all duration-300">
          <h3 className="text-base font-baloo font-medium text-foreground mb-2 text-center">
            🥑 Fat
          </h3>
          <div className="flex flex-col items-center">
            <ProgressRing
              value={macros.fat.current}
              max={macros.fat.target}
              size={50}
              color="fat"
            >
              {/* Empty - no text inside circle */}
            </ProgressRing>
            <p className="text-xs text-muted-foreground mt-2 font-bold">
              {macros.fat.current}/{macros.fat.target}g
            </p>
          </div>
        </div>
        

      </div>

      {/* Dynamic nutrition message */}
      <div className="bg-card p-4 rounded-xl border border-border/50 shadow-sm">
        <div className="text-center">
          {macros.calories.current === 0 ? (
            <>
              <div className="text-sm font-baloo text-muted-foreground font-medium">
                Kuch khana add karo! 🍽️
              </div>
              <div className="text-xs text-muted-foreground">
                Target: {macros.calories.target} kcal for today
              </div>
            </>
          ) : macros.calories.current >= macros.calories.target ? (
            <>
              <div className="text-sm font-baloo text-success font-medium">
                Pet bhar gaya! 😋
              </div>
              <div className="text-xs text-muted-foreground">
                Target achieved: {macros.calories.current} kcal
              </div>
            </>
          ) : (
            <>
              <div className="text-lg font-baloo font-bold bg-gradient-to-r from-primary to-success bg-clip-text text-transparent animate-pulse">
                ✨ Aur khana hai! 🥗 ✨
              </div>
              <div className="text-sm text-foreground font-medium bg-gradient-to-r from-muted-foreground to-foreground bg-clip-text text-transparent">
                🍽️ {macros.calories.target - macros.calories.current} kcal left for today 🍽️
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
