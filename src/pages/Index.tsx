import { useState } from "react";
import { MacroIndicators } from "@/components/MacroIndicators";
import { FoodLogging } from "@/components/FoodLogging";
import { TimeHeader } from "@/components/TimeHeader";
import { DateSelector } from "@/components/DateSelector";
import { BottomNavigation } from "@/components/BottomNavigation";
import { WeekNavigator } from "@/components/WeekNavigator";
import { GlycemicChart } from "@/components/GlycemicChart";
import { MacroChart } from "@/components/MacroChart";
import { InsightsSuggestions } from "@/components/InsightsSuggestions";
import { FastTypeSelector } from "@/components/FastTypeSelector";
import { FastTimer } from "@/components/FastTimer";
import { useFoodContext } from "@/contexts/FoodContext";
import { format, startOfWeek, endOfWeek, eachDayOfInterval } from "date-fns";

const Index = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const { selectedDate, setSelectedDate, getWeekData } = useFoodContext();

  function InsightsTab() {
    const weekData = getWeekData(currentWeek);
    
    const generateGlycemicData = () => {
      const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
      const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 1 });
      const days = eachDayOfInterval({ start: weekStart, end: weekEnd });
      
      return days.map(day => {
        const dayData = weekData.filter(item => 
          format(item.date, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
        );
        const glycemicLoad = dayData.reduce((sum, item) => sum + (item.glycemicLoad || 0), 0);
        
        return {
          date: format(day, 'yyyy-MM-dd'),
          glycemicLoad,
          isHigh: glycemicLoad > 100
        };
      });
    };

    const calculateWeeklyMacros = () => {
      return weekData.reduce(
        (totals, item) => ({
          calories: totals.calories + (item.calories || 0),
          protein: totals.protein + (item.protein || 0),
          carbs: totals.carbs + (item.carbs || 0),
          fat: totals.fat + (item.fat || 0),
        }),
        { calories: 0, protein: 0, carbs: 0, fat: 0 }
      );
    };

    const glycemicData = generateGlycemicData();
    const weeklyMacros = calculateWeeklyMacros();

    return (
      <div className="space-y-6">
        <WeekNavigator 
          currentWeek={currentWeek} 
          onWeekChange={setCurrentWeek} 
        />
        
        <GlycemicChart data={glycemicData} />
        
        {weekData.length >= 3 && (
          <MacroChart 
            totalCalories={weeklyMacros.calories}
            macros={{
              protein: weeklyMacros.protein,
              carbs: weeklyMacros.carbs,
              fat: weeklyMacros.fat
            }}
          />
        )}
        
        <InsightsSuggestions weekData={weekData} />
      </div>
    );
  }

  function FastTab() {
    return (
      <div className="space-y-6">
        <FastTypeSelector />
        <FastTimer />
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "home":
        return (
          <div className="food-pattern-bg min-h-screen">
            <DateSelector 
              selectedDate={selectedDate} 
              onDateSelect={setSelectedDate} 
            />
            <div className="space-y-6 pt-4">
              <MacroIndicators />
              <FoodLogging />
            </div>
          </div>
        );
      case "insights":
        return <InsightsTab />;
      case "fast":
        return <FastTab />;
      case "profile":
        return (
          <div className="space-y-6">
            <div className="bg-muted/30 rounded-lg p-4 text-center">
              <p className="text-muted-foreground">Profile view coming soon</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-md mx-auto px-4 py-6">
        {renderTabContent()}
      </div>
      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;