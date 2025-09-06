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
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-fredoka font-bold text-foreground mb-6">
          Aaj kya khaya tumne? 🍽️
        </h2>
        
        {/* Enhanced Food Search */}
        <div className="bg-gradient-to-r from-primary/5 to-secondary/5 p-3 rounded-2xl border border-primary/20 mb-8">
          <div className="relative">
            <UtensilsCrossed className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary h-4 w-4" />
            <Input
              placeholder="Kya khana hai? Dhundho yahan... 🍽️"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 food-search border-primary/30 font-baloo bg-background/80"
            />
            <Button 
              size="sm" 
              className="absolute right-2 top-1/2 transform -translate-y-1/2 food-button font-baloo bg-primary hover:bg-primary/90"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Logged food items */}
      <div className="space-y-5">
        <h3 className="text-xl font-fredoka font-bold text-foreground">
          Aaj ka khana log 📝
        </h3>
        
        {loggedItems.map((item, index) => (
          <div 
            key={item.id}
            className="slanted-card food-card-border bg-card rounded-3xl p-6 shadow-food"
            style={{
              transform: `perspective(600px) rotateX(${1 + index * 0.3}deg) rotateY(${-0.3 + index * 0.1}deg)`,
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="font-fredoka font-bold text-lg text-card-foreground">
                    {item.name}
                  </h4>
                  <span className={`text-xs px-3 py-1.5 rounded-full font-baloo font-bold border-2 ${getPortionColor(item.portion)}`}>
                    {item.portion}
                  </span>
                </div>
                <p className="text-sm text-subtle-foreground mb-2 font-quicksand font-semibold">
                  {item.quantity} • <span className="text-accent font-bold">{item.calories} cal</span>
                </p>
                <p className="text-xs text-muted-foreground font-baloo font-medium">
                  {item.time}
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="h-10 w-10 p-0 text-info hover:text-info-light hover:bg-info/20 rounded-full transition-all duration-200 hover:scale-110"
                >
                  <ChefHat className="h-5 w-5" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="h-10 w-10 p-0 text-destructive hover:text-destructive hover:bg-destructive/20 rounded-full transition-all duration-200 hover:scale-110"
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}