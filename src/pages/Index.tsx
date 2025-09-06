import { useState } from "react";
import { MacroIndicators } from "@/components/MacroIndicators";
import { FoodLogging } from "@/components/FoodLogging";
import { BottomNavigation } from "@/components/BottomNavigation";

const Index = () => {
  const [activeTab, setActiveTab] = useState("home");

  const renderTabContent = () => {
    switch (activeTab) {
      case "home":
        return (
          <div className="space-y-6 food-pattern-bg min-h-screen">
            {/* Clean date/time header */}
            <div className="flex justify-between items-center pt-2">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Today's Nutrition</h1>
                <p className="text-sm text-muted-foreground">
                  {new Date().toLocaleDateString("en-IN", { 
                    weekday: "long",
                    day: "numeric", 
                    month: "long" 
                  })}
                </p>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold text-primary">
                  {new Date().toLocaleTimeString("en-IN", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </div>
              </div>
            </div>
            <MacroIndicators />
            <FoodLogging />
          </div>
        );
      case "history":
        return (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground mb-3">
                Food History
              </h2>
              <p className="text-muted-foreground">
                View your previous meal records
              </p>
            </div>
          </div>
        );
      case "fast":
        return (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground mb-3">
                Fasting Timer
              </h2>
              <p className="text-muted-foreground">
                Track your fasting periods
              </p>
            </div>
          </div>
        );
      case "profile":
        return (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground mb-3">
                My Profile
              </h2>
              <p className="text-muted-foreground">
                Manage your preferences and settings
              </p>
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
