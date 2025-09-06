import { useState } from "react";
import { MacroIndicators } from "@/components/MacroIndicators";
import { FoodLogging } from "@/components/FoodLogging";
import { BottomNavigation } from "@/components/BottomNavigation";
import { DarkModeToggle } from "@/components/DarkModeToggle";

const Index = () => {
  const [activeTab, setActiveTab] = useState("home");

  const renderTabContent = () => {
    switch (activeTab) {
      case "home":
        return (
          <div className="space-y-6">
            <MacroIndicators />
            <FoodLogging />
          </div>
        );
      case "history":
        return (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <h2 className="text-2xl font-fredoka font-bold text-foreground mb-3">
                Khana History 📚
              </h2>
              <p className="text-muted-foreground font-quicksand">
                Yahan aapka purana khana record dikhega! 🍽️
              </p>
            </div>
          </div>
        );
      case "fast":
        return (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <h2 className="text-2xl font-fredoka font-bold text-foreground mb-3">
                Fasting Timer ⏰
              </h2>
              <p className="text-muted-foreground font-quicksand">
                Apna fasting time track karo! Coming soon... 🕐
              </p>
            </div>
          </div>
        );
      case "profile":
        return (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <h2 className="text-2xl font-fredoka font-bold text-foreground mb-3">
                Mera Profile 👨‍🍳
              </h2>
              <p className="text-muted-foreground font-quicksand">
                Apni cooking profile banao aur settings change karo! 🔧
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
      {/* Header with time and dark mode toggle */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border/40">
        <div className="container max-w-md mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="text-left">
              <h1 className="text-lg font-fredoka font-bold text-foreground">
                Khana Tracker 🍽️
              </h1>
              <p className="text-xs text-muted-foreground font-quicksand">
                {new Date().toLocaleDateString("en-IN", { 
                  weekday: "short",
                  day: "numeric", 
                  month: "short" 
                })} • {new Date().toLocaleTimeString("en-IN", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}
              </p>
            </div>
            <DarkModeToggle />
          </div>
        </div>
      </div>

      <div className="container max-w-md mx-auto p-4">
        {renderTabContent()}
      </div>
      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
