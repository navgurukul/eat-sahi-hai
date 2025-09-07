import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, Plus, Minus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useFoodContext, SelectedFoodItem } from "@/contexts/FoodContext";

interface ItemWithQuantity extends SelectedFoodItem {
  selectedQuantity: number;
}

export default function FoodSelection() {
  const navigate = useNavigate();
  const { addLoggedItems, pastFoodItems, selectedDate } = useFoodContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItems, setSelectedItems] = useState<Map<string, ItemWithQuantity>>(new Map());

  const filteredItems = pastFoodItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayItems = searchQuery ? filteredItems : pastFoodItems.slice(0, 10);

  const updateItemQuantity = (itemId: string, quantity: number) => {
    const item = pastFoodItems.find(item => item.id === itemId);
    if (!item) return;

    if (quantity <= 0) {
      const newSelected = new Map(selectedItems);
      newSelected.delete(itemId);
      setSelectedItems(newSelected);
    } else {
      const newSelected = new Map(selectedItems);
      newSelected.set(itemId, {
        ...item,
        selectedQuantity: quantity
      });
      setSelectedItems(newSelected);
    }
  };

  const handleDone = () => {
    const itemsToLog = Array.from(selectedItems.values()).map(item => ({
      ...item,
      quantity: item.selectedQuantity
    }));
    
    addLoggedItems(itemsToLog, selectedDate);
    navigate('/');
  };

  const selectedCount = selectedItems.size;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/')}
            className="p-2 rounded-xl hover:bg-accent/10 transition-colors"
          >
            <ArrowLeft className="h-6 w-6 text-foreground" />
          </button>
          <h1 className="text-xl font-fredoka font-semibold text-foreground">
            Khana Select Karo
          </h1>
          <div className="w-8" /> {/* Spacer */}
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Kya khana hai? Search karo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 font-baloo bg-card"
          />
        </div>

        {/* Food Items */}
        <div className="space-y-3 pb-24">
          <h2 className="text-lg font-fredoka font-semibold text-foreground mb-4">
            {searchQuery ? "Search Results 🔍" : "Aapka Past Food 🍽️"}
          </h2>
          
          {displayItems.map((item) => {
            const selectedItem = selectedItems.get(item.id);
            const isSelected = !!selectedItem;
            const quantity = selectedItem?.selectedQuantity || 0;
            
            return (
              <div
                key={item.id}
                className={cn(
                  "w-full bg-card p-4 rounded-xl border border-border/50 shadow-sm transition-all duration-300",
                  isSelected && "border-primary bg-primary/5 shadow-md"
                )}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-4">
                    <div className="text-3xl">{item.emoji}</div>
                    <div className="text-left">
                      <h3 className="font-fredoka font-semibold text-foreground">
                        {item.name}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground font-quicksand">
                        <span>{item.calories} cal</span>
                        <span>•</span>
                        <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                          {item.portion}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Nutritional Info */}
                <div className="flex items-center gap-4 mb-3 text-xs text-subtle-foreground">
                  <span>P: {item.protein}g</span>
                  <span>C: {item.carbs}g</span>
                  <span>F: {item.fat}g</span>
                  <span>GL: {item.glycemicLoad}</span>
                </div>

                {/* Quantity Selector */}
                {isSelected ? (
                  <div className="flex items-center justify-center gap-3">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => updateItemQuantity(item.id, quantity - 0.5)}
                      className="h-8 w-8 p-0 rounded-full"
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="text-sm font-semibold min-w-[80px] text-center">
                      {quantity} {item.portion}
                    </span>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => updateItemQuantity(item.id, quantity + 0.5)}
                      className="h-8 w-8 p-0 rounded-full"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex justify-center">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => updateItemQuantity(item.id, 1)}
                      className="font-baloo"
                    >
                      Add Item
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Action Button */}
        {selectedCount > 0 && (
          <div className="fixed bottom-20 left-0 right-0 p-4">
            <div className="max-w-md mx-auto">
              <Button
                onClick={handleDone}
                className="w-full bg-primary text-primary-foreground font-baloo font-semibold py-4 rounded-xl shadow-lg"
              >
                Khana Log Kare ({selectedCount} item{selectedCount > 1 ? 's' : ''})
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}