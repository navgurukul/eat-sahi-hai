import { useState } from "react";
import { ChefHat, Trash2 } from "lucide-react";
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
  // Sample logged food items - empty by default for empty state
  const [loggedItems] = useState<FoodItem[]>([]);

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
      <h2 className="text-2xl font-fredoka font-semibold text-foreground">
        Aaj ka khana log 📝
      </h2>
      
      {/* Empty state or logged items */}
      {loggedItems.length === 0 ? (
        <div className="bg-card p-8 rounded-2xl border border-border/50 shadow-sm">
          <div className="text-center">
            <div className="text-6xl mb-4">🫗</div>
            <h3 className="text-lg font-fredoka font-semibold text-foreground mb-2">
              Khali pet hai abhi!
            </h3>
            <p className="text-sm text-muted-foreground font-quicksand">
              Kuch khana add karo Plus button se 😋
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {loggedItems.map((item, index) => (
            <div 
              key={item.id}
              className="bg-card rounded-2xl p-5 border border-border/50 shadow-sm"
              style={{
                transform: `perspective(600px) rotateX(${1 + index * 0.3}deg) rotateY(${-0.3 + index * 0.1}deg)`,
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-fredoka font-semibold text-lg text-card-foreground">
                      {item.name}
                    </h4>
                    <span className={`text-xs px-3 py-1.5 rounded-full font-baloo font-semibold border-2 ${getPortionColor(item.portion)}`}>
                      {item.portion}
                    </span>
                  </div>
                  <p className="text-sm text-subtle-foreground mb-2 font-quicksand font-medium">
                    {item.quantity} • <span className="text-accent font-semibold">{item.calories} cal</span>
                  </p>
                  <p className="text-xs text-muted-foreground font-baloo font-medium">
                    {item.time}
                  </p>
                </div>
                
                <div className="flex items-center gap-3">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="h-10 w-10 p-0 text-info hover:text-info-light hover:bg-info/20 rounded-full transition-all duration-200"
                  >
                    <ChefHat className="h-5 w-5" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="h-10 w-10 p-0 text-destructive hover:text-destructive hover:bg-destructive/20 rounded-full transition-all duration-200"
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}