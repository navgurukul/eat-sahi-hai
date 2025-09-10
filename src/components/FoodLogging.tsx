import { Edit2, Trash2, Plus, Minus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFoodContext } from "@/contexts/FoodContext";
import { useState } from "react";
import { toast } from "sonner";

interface EditingItem {
  id: string;
  quantity: number;
  isLoading?: boolean;
}

// Helper function to format quantity display for logged items
const formatLoggedItemQuantity = (
  quantity: number,
  portionSize: string
): string => {
  // Extract unit name without measurements for logged items
  const match = portionSize.match(/^(\d+(?:\.\d+)?)\s*([^-]+?)(?:\s*-\s*.+)?$/);
  if (match) {
    const [, , unitName] = match; // Only extract unit name, ignore base amount
    const cleanUnitName = unitName.trim();
    return `${quantity} ${cleanUnitName}`;
  }

  // If no number in portion, just use the quantity with portion
  return `${quantity} ${portionSize}`;
};

export function FoodLogging() {
  const {
    selectedDate,
    getLoggedItemsForDate,
    removeLoggedItem,
    updateLoggedItemQuantity,
  } = useFoodContext();
  const [editingItem, setEditingItem] = useState<EditingItem | null>(null);
  const [deletingItems, setDeletingItems] = useState<Set<string>>(new Set());

  const handleDeleteItem = async (itemId: string) => {
    // Add to deleting set for loading state
    setDeletingItems(prev => new Set([...prev, itemId]));
    
    try {
      await removeLoggedItem(itemId);
      toast.success("Food item deleted successfully! 🗑️");
    } catch (error) {
      console.error("Error deleting food item:", error);
      toast.error("Failed to delete food item. Please try again.");
    } finally {
      // Remove from deleting set
      setDeletingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  const loggedItems = getLoggedItemsForDate(selectedDate);

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && editingItem) {
      // Just update the local editing state, don't save yet
      setEditingItem({ ...editingItem, quantity: newQuantity });
    }
  };

  const handleSave = async () => {
    if (!editingItem) return;
    
    // Set loading state
    setEditingItem(prev => prev ? { ...prev, isLoading: true } : null);
    
    try {
      await updateLoggedItemQuantity(editingItem.id, editingItem.quantity);
      toast.success("Food item updated successfully! 🎉");
      setEditingItem(null);
    } catch (error) {
      console.error("Error updating food item:", error);
      toast.error("Failed to update food item. Please try again.");
      // Reset loading state on error
      setEditingItem(prev => prev ? { ...prev, isLoading: false } : null);
    }
  };

  const startEditing = (itemId: string, currentQuantity: number) => {
    // Round to whole number if it's a decimal
    const roundedQuantity = Math.round(currentQuantity);
    setEditingItem({ id: itemId, quantity: roundedQuantity });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-fredoka font-medium text-foreground">
        Aaj ka khana log 📝
      </h2>

      {/* Empty state or logged items */}
      {loggedItems.length === 0 ? (
        <div className="bg-card p-8 rounded-2xl border border-border/50 shadow-sm">
          <div className="text-center">
            <div className="text-6xl mb-4">🫗</div>
            <h3 className="text-lg font-fredoka font-medium text-foreground mb-2">
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
                transform: `perspective(600px) rotateX(${
                  1 + index * 0.3
                }deg) rotateY(${-0.3 + index * 0.1}deg)`,
              }}
            >
              {editingItem?.id === item.id ? (
                /* Edit Mode - Simplified */
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-fredoka font-medium text-lg text-card-foreground mb-4">
                      {item.name}
                    </h4>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleQuantityChange(editingItem.quantity - 1)
                        }
                        disabled={editingItem.quantity <= 1 || editingItem.isLoading}
                        className="h-8 w-8 p-0 rounded-full"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="text-sm font-medium min-w-[80px] text-center">
                        {formatLoggedItemQuantity(
                          editingItem.quantity,
                          item.portion
                        )}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleQuantityChange(editingItem.quantity + 1)
                        }
                        disabled={editingItem.isLoading}
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
                      onClick={handleSave}
                      disabled={editingItem.isLoading}
                      className="px-4"
                    >
                      {editingItem.isLoading ? (
                        <>
                          <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Save"
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingItem(null)}
                      disabled={editingItem.isLoading}
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
                    <h4 className="font-fredoka font-medium text-lg text-card-foreground mb-2">
                      {item.name}
                    </h4>

                    <div className="flex items-center gap-4 mb-2 text-xs">
                      <span>Protein: {Math.round(item.protein)}g</span>
                      <span>Carbs: {Math.round(item.carbs)}g</span>
                      <span>Fat: {Math.round(item.fat)}g</span>
                      <span>GL: {Math.round(item.glycemicLoad)}</span>
                    </div>

                    <p className="text-xs text-muted-foreground font-baloo font-medium">
                      {item.time}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <div className="text-right text-sm">
                      <p className="text-subtle-foreground font-quicksand font-medium">
                        {formatLoggedItemQuantity(item.quantity, item.portion)}
                      </p>
                      <p className="text-accent font-medium">
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
                        onClick={() => handleDeleteItem(item.id)}
                        disabled={deletingItems.has(item.id)}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/20 rounded-full transition-all duration-200"
                      >
                        {deletingItems.has(item.id) ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
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
