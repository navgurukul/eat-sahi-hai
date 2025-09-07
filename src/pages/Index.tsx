import { useState } from "react";
import { MacroIndicators } from "@/components/MacroIndicators";
import { FoodLogging } from "@/components/FoodLogging";
import { BottomNavigation } from "@/components/BottomNavigation";
import { DateSelector } from "@/components/DateSelector";
import { useFoodContext } from "@/contexts/FoodContext";

const Index = () => {
  const [activeTab, setActiveTab] = useState("home");
  const { selectedDate, setSelectedDate } = useFoodContext();

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
      case "history":
        return (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <h2 className="text-2xl font-fredoka font-semibold text-foreground mb-3">
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
              <h2 className="text-2xl font-fredoka font-semibold text-foreground mb-3">
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
              <h2 className="text-2xl font-fredoka font-semibold text-foreground mb-3">
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
      <div className="max-w-md mx-auto px-4 py-6">
        {renderTabContent()}
      </div>
      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
