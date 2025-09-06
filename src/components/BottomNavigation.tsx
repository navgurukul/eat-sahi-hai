import { UtensilsCrossed, ClipboardList, Timer, ChefHat } from "lucide-react";
import { cn } from "@/lib/utils";

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  const tabs = [
    { id: "home", label: "Khana", icon: UtensilsCrossed },
    { id: "history", label: "History", icon: ClipboardList },
    { id: "fast", label: "Fast", icon: Timer },
    { id: "profile", label: "Profile", icon: ChefHat },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background/95 border-t border-border backdrop-blur-md px-4 py-3 safe-area-bottom">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex flex-col items-center py-2 px-3 rounded-xl transition-all duration-200 transform",
                isActive 
                  ? "bg-primary text-primary-foreground scale-105 shadow-lg" 
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/20 hover:scale-102"
              )}
            >
              <Icon className={cn("h-5 w-5 mb-1", isActive && "text-primary-foreground")} />
              <span className={cn(
                "text-xs font-baloo font-medium", 
                isActive ? "text-primary-foreground font-bold" : "text-muted-foreground"
              )}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}