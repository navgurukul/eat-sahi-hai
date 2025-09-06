import { useState } from "react";
import { TimeHeader } from "@/components/TimeHeader";
import { MacroIndicators } from "@/components/MacroIndicators";
import { FoodLogging } from "@/components/FoodLogging";
import { BottomNavigation } from "@/components/BottomNavigation";

const Index = () => {
  const [activeTab, setActiveTab] = useState("home");

  const renderTabContent = () => {
    switch (activeTab) {
      case "home":
        return (
          <div className="space-y-6">
            <TimeHeader />
            <MacroIndicators />
            <FoodLogging />
          </div>
        );
      case "history":
        return (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <h2 className="text-xl font-comico font-bold text-foreground mb-2">
                History
              </h2>
              <p className="text-muted-foreground">
                Yahan aapka food history dikhega! Your food history will appear here.
              </p>
            </div>
          </div>
        );
      case "fast":
        return (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <h2 className="text-xl font-comico font-bold text-foreground mb-2">
                Fasting
              </h2>
              <p className="text-muted-foreground">
                Fasting tracker aayega yahan! Fasting features coming soon.
              </p>
            </div>
          </div>
        );
      case "profile":
        return (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <h2 className="text-xl font-comico font-bold text-foreground mb-2">
                Profile
              </h2>
              <p className="text-muted-foreground">
                Apni profile manage kariye! Manage your profile settings here.
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
