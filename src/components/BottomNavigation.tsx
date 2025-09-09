import {
  UtensilsCrossed,
  TrendingUp,
  Timer,
  ChefHat,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function BottomNavigation({
  activeTab,
  onTabChange,
}: BottomNavigationProps) {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const tabs = [
    { id: "home", label: "Khana", icon: UtensilsCrossed },
    { id: "insights", label: "Insights", icon: TrendingUp },
    { id: "fast", label: "Fast", icon: Timer },
    { id: "profile", label: "Profile", icon: ChefHat },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border/20 px-2 xs:px-3 sm:px-4 py-2 xs:py-3 safe-area-bottom backdrop-blur-sm">
      <div className="flex items-center justify-between max-w-md mx-auto">
        {/* Navigation items with responsive spacing */}
        <div className="flex items-center justify-around w-full">
          {/* Left tabs */}
          {tabs.slice(0, 2).map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  "flex flex-col items-center min-w-0 flex-1 py-2 xs:py-3 px-1 xs:px-2 sm:px-3 rounded-lg xs:rounded-xl transition-all duration-300 touch-manipulation",
                  "min-h-[48px] xs:min-h-[52px]", // Ensure minimum touch target
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/10"
                )}
              >
                <Icon
                  className={cn(
                    "h-4 w-4 xs:h-5 xs:w-5 mb-0.5 xs:mb-1 shrink-0",
                    isActive && "text-primary-foreground"
                  )}
                />
                <span
                  className={cn(
                    "text-[10px] xs:text-xs font-baloo font-medium leading-none truncate max-w-full",
                    isActive
                      ? "text-primary-foreground font-semibold"
                      : "text-muted-foreground"
                  )}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}

          {/* Center Plus button */}
          <button
            onClick={() => navigate("/food-selection")}
            className="bg-primary text-primary-foreground rounded-full p-3 xs:p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 mx-1 xs:mx-2 shrink-0 touch-manipulation"
          >
            <Plus className="h-5 w-5 xs:h-6 xs:w-6" />
          </button>

          {/* Right tabs */}
          {tabs.slice(2, 4).map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  "flex flex-col items-center min-w-0 flex-1 py-2 xs:py-3 px-1 xs:px-2 sm:px-3 rounded-lg xs:rounded-xl transition-all duration-300 touch-manipulation",
                  "min-h-[48px] xs:min-h-[52px]", // Ensure minimum touch target
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/10"
                )}
              >
                <Icon
                  className={cn(
                    "h-4 w-4 xs:h-5 xs:w-5 mb-0.5 xs:mb-1 shrink-0",
                    isActive && "text-primary-foreground"
                  )}
                />
                <span
                  className={cn(
                    "text-[10px] xs:text-xs font-baloo font-medium leading-none truncate max-w-full",
                    isActive
                      ? "text-primary-foreground font-semibold"
                      : "text-muted-foreground"
                  )}
                >
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
