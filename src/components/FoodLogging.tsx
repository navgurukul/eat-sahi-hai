import { useState } from "react";
import { UtensilsCrossed, ChefHat, Trash2, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface FoodItem {
  id: string;
  name: string;
  quantity: string;
  portion: "thoda-sa" | "bharpet" | "zyada";
  calories: number;
  time: string;
}

export function FoodLogging() {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Sample logged food items
  const [loggedItems] = useState<FoodItem[]>([
    {
      id: "1",
      name: "Aloo Paratha",
      quantity: "2 pieces",
      portion: "bharpet",
      calories: 320,
      time: "8:30 AM"
    },
    {
      id: "2", 
      name: "Chai",
      quantity: "1 glass",
      portion: "thoda-sa",
      calories: 80,
      time: "8:45 AM"
    },
    {
      id: "3",
      name: "Dal Chawal",
      quantity: "1 plate",
      portion: "zyada",
      calories: 450,
      time: "1:30 PM"
    },
    {
      id: "4",
      name: "Mixed Sabzi",
      quantity: "1 bowl",
      portion: "bharpet",
      calories: 180,
      time: "1:30 PM"
    },
    {
      id: "5",
      name: "Samosa",
      quantity: "2 pieces",
      portion: "thoda-sa",
      calories: 280,
      time: "5:00 PM"
    }
  ]);

  const getPortionColor = (portion: string) => {
    switch (portion) {
      case "thoda-sa": return "text-success-foreground bg-success/20 border-success/40";
      case "bharpet": return "text-warning-foreground bg-warning/20 border-warning/40";
      case "zyada": return "text-destructive-foreground bg-destructive/20 border-destructive/40";
      default: return "text-muted-foreground bg-muted border-muted-foreground/20";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground mb-4">
          Food Log
        </h2>
        
        {/* Clean Food Search */}
        <div className="bg-card p-4 rounded-xl border shadow-card">
          <div className="relative">
            <UtensilsCrossed className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search for food items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 food-search"
            />
            <Button 
              size="sm" 
              className="absolute right-2 top-1/2 transform -translate-y-1/2 food-button"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Clean food items list */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">
          Today's Meals
        </h3>
        
        {loggedItems.map((item) => (
          <div 
            key={item.id}
            className="slanted-card bg-card rounded-xl p-4 shadow-card border"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="font-semibold text-base text-card-foreground">
                    {item.name}
                  </h4>
                  <span className={`text-xs px-2 py-1 rounded-md font-medium border ${getPortionColor(item.portion)}`}>
                    {item.portion}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-1">
                  {item.quantity} • <span className="text-accent font-medium">{item.calories} cal</span>
                </p>
                <p className="text-xs text-muted-foreground">
                  {item.time}
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg"
                >
                  <ChefHat className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}