import { supabase, UserFoodLogItem } from "./supabase";
import { LoggedFoodItem, SelectedFoodItem } from "@/contexts/FoodContext";

export class UserFoodLogService {
  // Save logged food items to database
  static async saveLoggedItems(
    items: SelectedFoodItem[],
    loggedDate: Date
  ): Promise<boolean> {
    try {
      // Get current authenticated user
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        console.error("[ERROR] No authenticated user found");
        return false;
      }

      console.log("[DEBUG] saveLoggedItems called with:", {
        userId: user.id,
        itemsCount: items.length,
        loggedDate: loggedDate.toISOString(),
        items: items.map((item) => ({
          name: item.name,
          quantity: item.quantity,
        })),
      });

      const loggedAt = new Date().toISOString();
      const dateString = loggedDate.toISOString().split("T")[0]; // YYYY-MM-DD format

      const foodLogEntries = items.map((item) => ({
        user_id: user.id, // Add user ID to each entry
        food_name: item.name,
        emoji: item.emoji,
        category: item.category,
        portion_size: item.portion,
        quantity: item.quantity,
        calories: item.calories * item.quantity,
        protein_g: item.protein * item.quantity,
        carbs_g: item.carbs * item.quantity,
        fat_g: item.fat * item.quantity,
        glycemic_load: item.glycemicLoad * item.quantity,
        logged_at: loggedAt,
        logged_date: dateString,
      }));

      console.log(
        "[DEBUG] Attempting to insert food log entries:",
        foodLogEntries
      );

      const { error } = await supabase
        .from("user_food_logs")
        .insert(foodLogEntries);

      if (error) {
        console.error("[ERROR] Error saving food logs to database:", error);
        return false;
      }

      console.log("[SUCCESS] Successfully saved food logs to database");
      return true;
    } catch (error) {
      console.error("[ERROR] Error in saveLoggedItems:", error);
      return false;
    }
  }

  // Get logged food items for a specific date
  static async getLoggedItemsForDate(date: Date): Promise<LoggedFoodItem[]> {
    try {
      // Get current authenticated user
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        console.error("[ERROR] No authenticated user found");
        return [];
      }

      const dateString = date.toISOString().split("T")[0]; // YYYY-MM-DD format

      const { data, error } = await supabase
        .from("user_food_logs")
        .select("*")
        .eq("user_id", user.id) // Filter by current user
        .eq("logged_date", dateString)
        .order("logged_at", { ascending: false });

      if (error) {
        console.error("Error fetching food logs from database:", error);
        return [];
      }

      if (!data) {
        return [];
      }

      // Convert database records to LoggedFoodItem format
      return data.map((dbItem: UserFoodLogItem) => ({
        id: `db-${dbItem.id}`,
        name: dbItem.food_name,
        emoji: dbItem.emoji,
        category: dbItem.category,
        portion: dbItem.portion_size,
        quantity: dbItem.quantity,
        calories: dbItem.calories,
        protein: dbItem.protein_g,
        carbs: dbItem.carbs_g,
        fat: dbItem.fat_g,
        glycemicLoad: dbItem.glycemic_load,
        time: new Date(dbItem.logged_at).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
        date: new Date(dbItem.logged_date + "T00:00:00"),
      }));
    } catch (error) {
      console.error("Error in getLoggedItemsForDate:", error);
      return [];
    }
  }

  // Get logged food items for a date range
  static async getLoggedItemsForDateRange(
    startDate: Date,
    endDate: Date
  ): Promise<LoggedFoodItem[]> {
    try {
      // Get current authenticated user
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        console.error("[ERROR] No authenticated user found");
        return [];
      }

      const startDateString = startDate.toISOString().split("T")[0];
      const endDateString = endDate.toISOString().split("T")[0];

      const { data, error } = await supabase
        .from("user_food_logs")
        .select("*")
        .eq("user_id", user.id) // Filter by current user
        .gte("logged_date", startDateString)
        .lte("logged_date", endDateString)
        .order("logged_at", { ascending: false });

      if (error) {
        console.error("Error fetching food logs from database:", error);
        return [];
      }

      if (!data) {
        return [];
      }

      // Convert database records to LoggedFoodItem format
      return data.map((dbItem: UserFoodLogItem) => ({
        id: `db-${dbItem.id}`,
        name: dbItem.food_name,
        emoji: dbItem.emoji,
        category: dbItem.category,
        portion: dbItem.portion_size,
        quantity: dbItem.quantity,
        calories: dbItem.calories,
        protein: dbItem.protein_g,
        carbs: dbItem.carbs_g,
        fat: dbItem.fat_g,
        glycemicLoad: dbItem.glycemic_load,
        time: new Date(dbItem.logged_at).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
        date: new Date(dbItem.logged_date + "T00:00:00"),
      }));
    } catch (error) {
      console.error("Error in getLoggedItemsForDateRange:", error);
      return [];
    }
  }

  // Delete a logged food item
  static async deleteLoggedItem(id: string): Promise<boolean> {
    try {
      // Get current authenticated user
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        console.error("[ERROR] No authenticated user found");
        return false;
      }

      // Extract the database ID from the prefixed ID
      const dbId = id.replace("db-", "");

      const { error } = await supabase
        .from("user_food_logs")
        .delete()
        .eq("id", dbId)
        .eq("user_id", user.id); // Ensure user can only delete their own items

      if (error) {
        console.error("Error deleting food log from database:", error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error in deleteLoggedItem:", error);
      return false;
    }
  }

  // Update quantity of a logged food item
  static async updateLoggedItemQuantity(
    id: string,
    quantity: number
  ): Promise<boolean> {
    try {
      // Get current authenticated user
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        console.error("[ERROR] No authenticated user found");
        return false;
      }

      // Extract the database ID from the prefixed ID
      const dbId = id.replace("db-", "");

      // First get the current item to calculate new nutritional values
      const { data: currentItem, error: fetchError } = await supabase
        .from("user_food_logs")
        .select("*")
        .eq("id", dbId)
        .eq("user_id", user.id) // Ensure user can only update their own items
        .maybeSingle();

      if (fetchError) {
        console.error("Error fetching current item:", fetchError);
        return false;
      }

      if (!currentItem) {
        console.error("Food log item not found for ID:", dbId);
        return false;
      }

      // Calculate per-unit values
      const perUnitCalories = currentItem.calories / currentItem.quantity;
      const perUnitProtein = currentItem.protein_g / currentItem.quantity;
      const perUnitCarbs = currentItem.carbs_g / currentItem.quantity;
      const perUnitFat = currentItem.fat_g / currentItem.quantity;
      const perUnitGL = currentItem.glycemic_load / currentItem.quantity;

      // Update with new quantity and recalculated values
      const { error: updateError } = await supabase
        .from("user_food_logs")
        .update({
          quantity,
          calories: perUnitCalories * quantity,
          protein_g: perUnitProtein * quantity,
          carbs_g: perUnitCarbs * quantity,
          fat_g: perUnitFat * quantity,
          glycemic_load: perUnitGL * quantity,
        })
        .eq("id", dbId)
        .eq("user_id", user.id); // Ensure user can only update their own items

      if (updateError) {
        console.error("Error updating food log quantity:", updateError);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error in updateLoggedItemQuantity:", error);
      return false;
    }
  }
}
