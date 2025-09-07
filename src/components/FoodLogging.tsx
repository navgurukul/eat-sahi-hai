import { Edit2, Trash2, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFoodContext } from "@/contexts/FoodContext";
import { useState } from "react";

interface EditingItem {
  id: string;
  quantity: number;
}

export function FoodLogging() {
  const { selectedDate, getLoggedItemsForDate, removeLoggedItem, updateLoggedItemQuantity } = useFoodContext();
  const [editingItem, setEditingItem] = useState<EditingItem | null>(null);
  
  const loggedItems = getLoggedItemsForDate(selectedDate);

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity >= 0.5) {
      updateLoggedItemQuantity(itemId, newQuantity);
      setEditingItem(null);
    }
  };

  const startEditing = (itemId: string, currentQuantity: number) => {
    setEditingItem({ id: itemId, quantity: currentQuantity });
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
              {editingItem?.id === item.id ? (
                /* Edit Mode - Simplified */
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-fredoka font-semibold text-lg text-card-foreground mb-4">
                      {item.name}
                    </h4>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleQuantityChange(item.id, editingItem.quantity - 0.5)}
                        disabled={editingItem.quantity <= 0.5}
                        className="h-8 w-8 p-0 rounded-full"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="text-sm font-semibold min-w-[80px] text-center">
                        {editingItem.quantity} {item.portion}
                      </span>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleQuantityChange(item.id, editingItem.quantity + 0.5)}
                        className="h-8 w-8 p-0 rounded-full"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="default" 
                      size="sm"
                      onClick={() => handleQuantityChange(item.id, editingItem.quantity)}
                      className="px-4"
                    >
                      Save
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setEditingItem(null)}
                      className="px-4"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                /* Normal Mode */
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-fredoka font-semibold text-lg text-card-foreground mb-2">
                      {item.name}
                    </h4>
                    
                    <div className="flex items-center gap-4 mb-2 text-xs">
                      <span>P: {Math.round(item.protein)}g</span>
                      <span>C: {Math.round(item.carbs)}g</span>
                      <span>F: {Math.round(item.fat)}g</span>
                      <span>GL: {Math.round(item.glycemicLoad)}</span>
                    </div>
                    
                    <p className="text-xs text-muted-foreground font-baloo font-medium">
                      {item.time}
                    </p>
                  </div>
                  
                  <div className="flex flex-col items-end gap-1">
                    <div className="text-right text-sm">
                      <p className="text-subtle-foreground font-quicksand font-medium">
                        {item.quantity} {item.portion}
                      </p>
                      <p className="text-accent font-semibold">
                        {Math.round(item.calories)} cal
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => startEditing(item.id, item.quantity)}
                        className="h-8 w-8 p-0 text-info hover:text-info-light hover:bg-info/20 rounded-full transition-all duration-200"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => removeLoggedItem(item.id)}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/20 rounded-full transition-all duration-200"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}