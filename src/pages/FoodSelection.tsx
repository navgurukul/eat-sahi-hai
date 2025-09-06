import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useFoodContext } from "@/contexts/FoodContext";

interface FoodItem {
  id: string;
  name: string;
  calories: number;
  emoji: string;
  category: string;
}

const mockFoodItems: FoodItem[] = [
  { id: "1", name: "Roti", calories: 80, emoji: "🫓", category: "staple" },
  { id: "2", name: "Dal", calories: 120, emoji: "🫘", category: "protein" },
  { id: "3", name: "Chawal", calories: 150, emoji: "🍚", category: "staple" },
  { id: "4", name: "Sabzi", calories: 90, emoji: "🥬", category: "vegetable" },
  { id: "5", name: "Chai", calories: 80, emoji: "🫖", category: "beverage" },
];

export default function FoodSelection() {
  const navigate = useNavigate();
  const { addLoggedItems } = useFoodContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const filteredItems = mockFoodItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleItemToggle = (itemId: string) => {
    setSelectedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleDone = () => {
    const selectedFoodItems = mockFoodItems.filter(item => 
      selectedItems.includes(item.id)
    );
    addLoggedItems(selectedFoodItems);
    navigate('/');
  };

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
          <Button
            onClick={handleDone}
            disabled={selectedItems.length === 0}
            size="sm"
            className="font-baloo font-semibold"
          >
            Done
          </Button>
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
        <div className="space-y-3">
          <h2 className="text-lg font-fredoka font-semibold text-foreground mb-4">
            Popular Indian Food 🍽️
          </h2>
          
          {filteredItems.map((item) => {
            const isSelected = selectedItems.includes(item.id);
            
            return (
              <button
                key={item.id}
                onClick={() => handleItemToggle(item.id)}
                className={cn(
                  "w-full bg-card p-4 rounded-xl border border-border/50 shadow-sm transition-all duration-300 hover:shadow-md",
                  isSelected && "border-primary bg-primary/5"
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-3xl">{item.emoji}</div>
                    <div className="text-left">
                      <h3 className="font-fredoka font-semibold text-foreground">
                        {item.name}
                      </h3>
                      <p className="text-sm text-muted-foreground font-quicksand">
                        {item.calories} calories
                      </p>
                    </div>
                  </div>
                  
                  {isSelected && (
                    <div className="bg-primary text-primary-foreground rounded-full p-1">
                      <Check className="h-4 w-4" />
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected items counter */}
        {selectedItems.length > 0 && (
          <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground px-4 py-2 rounded-full shadow-lg">
            <span className="font-baloo font-semibold">
              {selectedItems.length} item{selectedItems.length > 1 ? 's' : ''} selected
            </span>
          </div>
        )}
      </div>
    </div>
  );
}