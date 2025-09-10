import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MacroIndicators } from "@/components/MacroIndicators";
import { FoodLogging } from "@/components/FoodLogging";
import { TimeHeader } from "@/components/TimeHeader";
import { DateSelector } from "@/components/DateSelector";
import { BottomNavigation } from "@/components/BottomNavigation";
import { WeekNavigator } from "@/components/WeekNavigator";
import { GlycemicChart } from "@/components/GlycemicChart";
import { MacroChart } from "@/components/MacroChart";
import { FastTimer } from "@/components/FastTimer";
import { FastHistory } from "@/components/FastHistory";
import { ProfileTab } from "@/components/ProfileTab";
import { useFoodContext } from "@/contexts/FoodContext";
import { format, startOfWeek, endOfWeek, eachDayOfInterval } from "date-fns";

const Index = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get initial tab from URL path
  const getInitialTab = () => {
    const path = location.pathname;
    if (path === "/home") return "home";
    if (path === "/insights") return "insights";
    if (path === "/fast") return "fast";
    if (path === "/profile") return "profile";
    return "home"; // Default to home for root path
  };

  const [activeTab, setActiveTab] = useState(getInitialTab());
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const { selectedDate, setSelectedDate, getWeekData } = useFoodContext();

  // Update URL when tab changes
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    navigate(`/${tab}`);
  };

  // Update tab when URL changes (back/forward browser buttons)
  useEffect(() => {
    const newTab = getInitialTab();
    if (newTab !== activeTab) {
      setActiveTab(newTab);
    }
  }, [location.pathname]);

  function InsightsTab() {
    const weekData = getWeekData(currentWeek);

    const generateGlycemicData = () => {
      const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
      const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 1 });
      const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

      return days.map((day) => {
        const dayData = weekData.filter(
          (item) =>
            format(item.date, "yyyy-MM-dd") === format(day, "yyyy-MM-dd")
        );
        const glycemicLoad = dayData.reduce(
          (sum, item) => sum + (item.glycemicLoad || 0),
          0
        );

        return {
          date: format(day, "yyyy-MM-dd"),
          glycemicLoad,
          isHigh: glycemicLoad > 100,
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
              fat: weeklyMacros.fat,
            }}
          />
        )}
      </div>
    );
  }

  function FastTab() {
    return (
      <div className="space-y-4">
        {/* Page Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-fredoka font-semibold text-foreground">
            Track Your Fasting Journey 🏃‍♂️
          </h1>
          <p className="text-sm text-muted-foreground font-quicksand">
            Fast with confidence and track your progress
          </p>
        </div>

        {/* Date Selector for Fast Logging */}
        <DateSelector
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
        />

        {/* Fast Timer */}
        <FastTimer selectedDate={selectedDate} />

        {/* Fast History */}
        <FastHistory selectedDate={selectedDate} />
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
        return <ProfileTab />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-md mx-auto px-4 py-6">{renderTabContent()}</div>
      <BottomNavigation activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
};

export default Index;
