import { useState } from "react";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MacroSettingsModal } from "../components/MacroSettingsModal";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";
import { ProgressRing } from "@/components/ui/progress-ring";
import { useFoodContext } from "@/contexts/FoodContext";

export function MacroIndicators({
  dailyCaloriesTarget,
}: {
  dailyCaloriesTarget: number;
}) {
  const { selectedDate, getLoggedItemsForDate } = useFoodContext();
  const { preferences, calculateMacroFromCalories } = useUserPreferences();
  const [showSettings, setShowSettings] = useState(false);

  const loggedItems = getLoggedItemsForDate(selectedDate);
  const macroTargets = calculateMacroFromCalories(dailyCaloriesTarget);

  const proteinTarget = macroTargets.protein;
  const carbsTarget = macroTargets.carbs;
  const fatTarget = macroTargets.fat;

  const glTarget = preferences.glycemicPreferences?.dailyGLTarget || 100;

  // Calculate actual GL from food items (you need glycemicIndex in your food data)
  const calculateDayGL = () => {
    const itemsForSelectedDate = loggedItems.filter((item) => {
      const itemDate = new Date(item.date).toDateString();
      const selectedDateString = selectedDate.toDateString();
      return itemDate === selectedDateString;
    });

    return itemsForSelectedDate.reduce((totalGL, item) => {
      // GL = (GI × Carbs) ÷ 100
      const gl = (item.glycemicIndex || 50) * (item.carbs || 0) / 100;
      return totalGL + gl;
    }, 0);
  };

  const currentGL = Math.round(calculateDayGL());


  const DAILY_TARGETS = {
    calories: Math.round(dailyCaloriesTarget),
    protein: proteinTarget,
    carbs: carbsTarget,
    fat: fatTarget,
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


  const getGLColor = (current: number, target: number) => {
    const percentage = (current / target) * 100;
    if (percentage <= 60) return "#21c45d"; // Green
    if (percentage <= 80) return "#eab308"; // Yellow  
    if (percentage <= 100) return "#f97316"; // Orange
    return "#ef4444"; // Red
  };

  // Helper function for GL guidance
  const getGLGuidance = (current: number, target: number) => {
    if (current === 0) return "No food logged";
    if (current <= target * 0.6) return "Very Low GL";
    if (current <= target * 0.8) return "Low GL";
    if (current <= target) return "Moderate GL";
    if (current <= target * 1.2) return "High GL";
    return "Very High GL";
  };

  // Round the values for display
  const macros = {
    calories: {
      current: Math.round(dayTotals.calories),
      target: DAILY_TARGETS.calories,
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

  const glGuidance = getGLGuidance(currentGL, glTarget);
  const glColor = getGLColor(currentGL, glTarget);


  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Daily Nutrition Targets</h2>
          <p className="text-sm text-muted-foreground">
            Track your daily macros and glycemic load
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowSettings(true)}
          className="flex items-center gap-2"
        >
          <Settings className="h-4 w-4" />
          Customize
        </Button>
      </div>
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
            🍯 Glycemic Load
          </h3>
          <div className="flex flex-col items-center">
            <ProgressRing
              value={currentGL}
              max={glTarget}
              size={60}
              color="dynamic"
              dynamicColor={glColor}
            />
            <p className="text-xs text-muted-foreground mt-2 font-bold">
              {currentGL}/{glTarget} GL
            </p>
            <p className="text-xs mt-1" style={{ color: glColor }}>
              {glGuidance}
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
                🍽️ {macros.calories.target - macros.calories.current} kcal left
                for today 🍽️
              </div>
            </>
          )}
        </div>
      </div>

      <MacroSettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        dailyCaloriesTarget={dailyCaloriesTarget}
      />
    </div>
  );
}
