import { useState } from "react";
import { Search, Edit2, Trash2, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface FoodItem {
  id: string;
  name: string;
  quantity: string;
  portion: "small" | "medium" | "large";
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
      portion: "medium",
      calories: 320,
      time: "8:30 AM"
    },
    {
      id: "2", 
      name: "Chai",
      quantity: "1 glass",
      portion: "small",
      calories: 80,
      time: "8:45 AM"
    },
    {
      id: "3",
      name: "Dal Chawal",
      quantity: "1 plate",
      portion: "large",
      calories: 450,
      time: "1:30 PM"
    },
    {
      id: "4",
      name: "Mixed Sabzi",
      quantity: "1 bowl",
      portion: "medium",
      calories: 180,
      time: "1:30 PM"
    },
    {
      id: "5",
      name: "Samosa",
      quantity: "2 pieces",
      portion: "small",
      calories: 280,
      time: "5:00 PM"
    }
  ]);

  const getPortionColor = (portion: string) => {
    switch (portion) {
      case "small": return "text-success";
      case "medium": return "text-warning";
      case "large": return "text-secondary";
      default: return "text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-comico font-bold text-foreground mb-4">
          Aaj kya khaya? What did you eat today?
        </h2>
        
        {/* Search bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search for food items... (e.g., roti, dal, sabzi)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-card border-border rounded-xl h-12"
          />
          <Button 
            size="sm" 
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary hover:bg-primary-dark text-primary-foreground rounded-lg"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Logged food items */}
      <div className="space-y-3">
        <h3 className="text-lg font-comico font-bold text-foreground">
          Today's meals
        </h3>
        
        {loggedItems.map((item, index) => (
          <div 
            key={item.id}
            className="slanted-card bg-card rounded-xl p-4 shadow-card border border-border"
            style={{
              transform: `perspective(600px) rotateX(${1 + index * 0.5}deg) rotateY(${-0.5 + index * 0.2}deg)`,
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-comico font-bold text-card-foreground">
                    {item.name}
                  </h4>
                  <span className={`text-xs px-2 py-1 rounded-full bg-background-secondary ${getPortionColor(item.portion)}`}>
                    {item.portion}
                  </span>
                </div>
                <p className="text-sm text-subtle-foreground mb-1">
                  {item.quantity} • {item.calories} cal
                </p>
                <p className="text-xs text-muted-foreground">
                  {item.time}
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="h-8 w-8 p-0 text-info hover:text-info-light hover:bg-info/10"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
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