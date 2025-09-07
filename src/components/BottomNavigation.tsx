import { UtensilsCrossed, TrendingUp, Timer, ChefHat, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  const navigate = useNavigate();
  
  const tabs = [
    { id: "home", label: "Khana", icon: UtensilsCrossed },
    { id: "insights", label: "Insights", icon: TrendingUp },
    { id: "fast", label: "Fast", icon: Timer },
    { id: "profile", label: "Profile", icon: ChefHat },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border/20 px-4 py-3 safe-area-bottom backdrop-blur-sm">
      <div className="flex items-center justify-center relative">
        {/* Left tabs */}
        <div className="flex items-center space-x-4">
          {tabs.slice(0, 2).map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  "flex flex-col items-center py-3 px-4 rounded-xl transition-all duration-300",
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-sm" 
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/10"
                )}
              >
                <Icon className={cn("h-5 w-5 mb-1", isActive && "text-primary-foreground")} />
                <span className={cn(
                  "text-xs font-baloo font-medium", 
                  isActive ? "text-primary-foreground font-semibold" : "text-muted-foreground"
                )}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Center Plus button */}
        <button
          onClick={() => navigate('/food-selection')}
          className="mx-8 bg-primary text-primary-foreground rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          <Plus className="h-6 w-6" />
        </button>

        {/* Right tabs */}
        <div className="flex items-center space-x-4">
          {tabs.slice(2, 4).map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  "flex flex-col items-center py-3 px-4 rounded-xl transition-all duration-300",
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-sm" 
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/10"
                )}
              >
                <Icon className={cn("h-5 w-5 mb-1", isActive && "text-primary-foreground")} />
                <span className={cn(
                  "text-xs font-baloo font-medium", 
                  isActive ? "text-primary-foreground font-semibold" : "text-muted-foreground"
                )}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}