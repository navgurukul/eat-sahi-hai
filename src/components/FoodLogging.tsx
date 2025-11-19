import { Edit2, Trash2, Plus, Minus, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFoodContext } from "@/contexts/FoodContext";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

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
  const [modalOpen, setModalOpen] = useState(false);
  const [modalItem, setModalItem] = useState<any>(null);
  const [modalQuantity, setModalQuantity] = useState(1);

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
    const item = loggedItems.find((i) => i.id === itemId);
    if (!item) return;

    setModalItem(item);
    setModalQuantity(currentQuantity);
    setModalOpen(true);
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
                transform: `perspective(600px) rotateX(${1 + index * 0.3
                  }deg) rotateY(${-0.3 + index * 0.1}deg)`,
              }}
            >

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
            </div>
          ))}
        </div>
      )}
      {modalOpen && modalItem && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setModalOpen(false)}
          />
          <div className="relative w-full max-w-md bg-card rounded-2xl p-5 shadow-xl z-10">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="text-2xl">{modalItem.emoji}</div>
                <div>
                  <h3 className="font-medium text-lg">{modalItem.name}</h3>
                  <div className="text-xs text-muted-foreground">{modalItem.portion}</div>
                </div>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-full hover:bg-border/20"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Quantity input */}
            <div className="mb-3">
              <label className="text-xs text-muted-foreground">Quantity</label>
              <div className="flex items-center gap-3 mt-2">
                <input
                  type="number"
                  step={0.5}
                  min={0.5}
                  value={modalQuantity}
                  onChange={(e) =>
                    setModalQuantity(Math.max(0.5, parseFloat(e.target.value || "0")))
                  }
                  className="w-28 p-2 rounded-lg border text-center"
                />
                <div className="text-sm">
                  {formatLoggedItemQuantity(modalQuantity, modalItem.portion)}
                  <div className="text-xs text-muted-foreground">
                    {Math.round(modalItem.calories * modalQuantity)} cal
                  </div>
                </div>
              </div>
            </div>

            {/* Presets */}
            <div className="mb-4 flex flex-wrap gap-2">
              {[0.5, 1, 1.5, 2].map((q) => (
                <button
                  key={q}
                  onClick={() => setModalQuantity(q)}
                  className={cn(
                    "px-3 py-1 rounded-lg border text-sm",
                    modalQuantity === q
                      ? "bg-primary/10 border-primary"
                      : "bg-background"
                  )}
                >
                  {formatLoggedItemQuantity(q, modalItem.portion)}
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => {
                  updateLoggedItemQuantity(modalItem.id, modalQuantity);
                  setModalOpen(false);
                  toast.success("Food item updated!");
                }}
                className="flex-1 bg-primary text-primary-foreground"
              >
                Save {formatLoggedItemQuantity(modalQuantity, modalItem.portion)}
              </Button>

              <Button
                variant="outline"
                onClick={() => setModalOpen(false)}
                className="flex-0"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
