import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, Plus, Minus, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useFoodContext, SelectedFoodItem } from "@/contexts/FoodContext";
import { useFoodSearch } from "@/hooks/useFoodSearch";
import { debugSupabaseConnection } from "@/lib/debugSupabase";

interface ItemWithQuantity extends SelectedFoodItem {
  selectedQuantity: number;
}

// Helper function to format quantity display dynamically
const formatQuantityDisplay = (
  quantity: number,
  portionSize: string
): string => {
  // Extract unit name without measurements
  // Handle patterns like "1 glass - 250 ml" -> "glass"
  // Handle patterns like "1 katori - 80 g" -> "katori"
  // Handle patterns like "1 roti" -> "roti"

  const match = portionSize.match(/^(\d+(?:\.\d+)?)\s*([^-]+?)(?:\s*-\s*.+)?$/);
  if (match) {
    const [, , unitName] = match; // Only extract unit name, ignore base amount
    const cleanUnitName = unitName.trim();
    return `${quantity} ${cleanUnitName}`;
  }

  // If no number in portion, just multiply the quantity
  return `${quantity} × ${portionSize}`;
};

export default function FoodSelection() {
  const navigate = useNavigate();
  const { addLoggedItems, pastFoodItems, selectedDate } = useFoodContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItems, setSelectedItems] = useState<
    Map<string, ItemWithQuantity>
  >(new Map());

  // Use Supabase search with fallback to local data
  const {
    data: searchResults,
    isLoading: isSearchLoading,
    error: searchError,
  } = useFoodSearch(searchQuery);

  // Debug Supabase connection on component mount
  useEffect(() => {
    const testConnection = async () => {
      console.log("=== SUPABASE DEBUG SESSION ===");
      const result = await debugSupabaseConnection();
      console.log("Supabase debug result:", result);
      console.log("=== END DEBUG SESSION ===");
    };
    testConnection();
  }, []);

  // Debug search results
  // useEffect(() => {
  //   console.log("Search query:", searchQuery);
  //   console.log("Search results:", searchResults);
  //   console.log("Search loading:", isSearchLoading);
  //   console.log("Search error:", searchError);
  // }, [searchQuery, searchResults, isSearchLoading, searchError]);

  // Determine which items to display
  const getDisplayItems = (): SelectedFoodItem[] => {
    console.log("getDisplayItems called with:", {
      searchQuery: searchQuery.trim(),
      searchResults,
      pastFoodItemsLength: pastFoodItems.length,
    });

    if (searchQuery.trim()) {
      // If searching and Supabase data is available, use it
      if (searchResults && searchResults.length > 0) {
        console.log("Using Supabase search results:", searchResults.length);
        return searchResults;
      }
      // Fallback to local filtered data if Supabase fails or has no results
      const filteredLocal = pastFoodItems.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      console.log("Using local filtered data:", filteredLocal.length);
      return filteredLocal;
    }

    // If no search query, show Supabase results or fallback to local data
    if (searchResults && searchResults.length > 0) {
      console.log(
        "Using Supabase results for empty query:",
        searchResults.length
      );
      return searchResults.slice(0, 10);
    }

    // Fallback to local data
    console.log("Using local data fallback:", pastFoodItems.length);
    return pastFoodItems.slice(0, 10);
  };

  const displayItems = getDisplayItems();

  const updateItemQuantity = (itemId: string, quantity: number) => {
    // Find item in displayItems instead of pastFoodItems to support Supabase items
    const item = displayItems.find((item) => item.id === itemId);
    if (!item) return;

    if (quantity <= 0) {
      const newSelected = new Map(selectedItems);
      newSelected.delete(itemId);
      setSelectedItems(newSelected);
    } else {
      const newSelected = new Map(selectedItems);
      newSelected.set(itemId, {
        ...item,
        selectedQuantity: quantity,
      });
      setSelectedItems(newSelected);
    }
  };

  const handleDone = async () => {
    const itemsToLog = Array.from(selectedItems.values()).map((item) => ({
      ...item,
      quantity: item.selectedQuantity,
    }));

    try {
      await addLoggedItems(itemsToLog, selectedDate);
      navigate("/");
    } catch (error) {
      console.error("Error logging food items:", error);
      // Still navigate even if there's an error, as fallback should handle it
      navigate("/");
    }
  };

  const selectedCount = selectedItems.size;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="sticky top-0 bg-background z-10 px-4 py-6 border-b border-border/20">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigate("/")}
              className="p-2 rounded-xl hover:bg-accent/10 transition-colors"
            >
              <ArrowLeft className="h-6 w-6 text-foreground" />
            </button>
            <h1 className="text-xl font-fredoka font-semibold text-foreground">
              Khana Select Karo
            </h1>
            <div className="w-8" />
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Kya khana hai? Search karo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 font-baloo bg-card"
            />
          </div>
        </div>

        {/* Sticky Action Button */}
        {selectedCount > 0 && (
          <div className="sticky top-[140px] z-20 px-4 py-3 bg-background/95 backdrop-blur-sm border-b border-border/20">
            <Button
              onClick={handleDone}
              className="w-full bg-primary text-primary-foreground font-baloo font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Khana Log Kare ({selectedCount} item
              {selectedCount > 1 ? "s" : ""})
            </Button>
          </div>
        )}

        {/* Food Items */}
        <div className="px-4 space-y-3 pb-24">
          <div className="flex items-center justify-between mb-4 pt-6">
            <h2 className="text-lg font-fredoka font-semibold text-foreground">
              {searchQuery ? "Search Results 🔍" : "Khana Options 🍽️"}
            </h2>
            {isSearchLoading && (
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
            )}
          </div>

          {/* Show error message if Supabase fails but continue with fallback */}
          {searchError && (
            <div className="bg-warning/10 border border-warning/20 rounded-lg p-3 mb-4">
              <p className="text-sm text-warning-foreground">
                🌐 Using offline data - online search temporarily unavailable
              </p>
            </div>
          )}

          {displayItems.length === 0 && !isSearchLoading ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">🔍</div>
              <p className="text-muted-foreground">
                {searchQuery
                  ? "Koi food nahi mila. Kuch aur try karo!"
                  : "Loading foods..."}
              </p>
            </div>
          ) : (
            displayItems.map((item) => {
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
                    <span>Protein: {item.protein}g</span>
                    <span>Carbs: {item.carbs}g</span>
                    <span>Fat: {item.fat}g</span>
                    <span>GL: {item.glycemicLoad}</span>
                  </div>

                  {/* Quantity Selector */}
                  {isSelected ? (
                    <div className="flex items-center justify-center gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          updateItemQuantity(item.id, quantity - 1)
                        }
                        disabled={quantity <= 1}
                        className="h-8 w-8 p-0 rounded-full"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="text-sm font-semibold min-w-[80px] text-center">
                        {formatQuantityDisplay(quantity, item.portion)}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          updateItemQuantity(item.id, quantity + 1)
                        }
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
            })
          )}
        </div>
      </div>
    </div>
  );
}
