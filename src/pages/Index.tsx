import { useState } from "react";
import { MacroIndicators } from "@/components/MacroIndicators";
import { FoodLogging } from "@/components/FoodLogging";
import { BottomNavigation } from "@/components/BottomNavigation";

const Index = () => {
  const [activeTab, setActiveTab] = useState("home");

  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning! 🌅";
    if (hour < 17) return "Good Afternoon! ☀️";
    if (hour < 20) return "Good Evening! 🌆";
    return "Good Night! 🌙";
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "home":
        return (
          <div className="space-y-6 food-pattern-bg min-h-screen">
            <h1 className="text-3xl font-fredoka font-semibold text-foreground text-center">
              {getTimeBasedGreeting()}
            </h1>
            <MacroIndicators />
            <FoodLogging />
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
