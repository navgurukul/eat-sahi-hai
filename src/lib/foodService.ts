import { supabase, FoodDatabaseItem } from "./supabase";
import { SelectedFoodItem } from "@/contexts/FoodContext";

// Helper function to get emoji based on food name
const getFoodEmoji = (foodName: string): string => {
  const lowerName = foodName.toLowerCase();

  // Common food emojis mapping
  if (lowerName.includes("juice") || lowerName.includes("liquid")) return "🥤";
  if (lowerName.includes("green") && lowerName.includes("juice")) return "🥬";
  if (lowerName.includes("vegetable") || lowerName.includes("salad"))
    return "🥗";
  if (lowerName.includes("cucumber")) return "🥒";
  if (lowerName.includes("radish")) return "🥕";
  if (lowerName.includes("carrot")) return "🥕";
  if (lowerName.includes("moringa")) return "🌿";
  if (lowerName.includes("wheatgrass")) return "🌱";
  if (lowerName.includes("beetroot")) return "🍎";
  if (lowerName.includes("fermented")) return "🫙";
  if (lowerName.includes("powder")) return "🥤";

  // Default emoji
  return "🍽️";
};

// Helper function to get food category
const getFoodCategory = (
  foodName: string,
  recommendationType: string
): string => {
  const lowerName = foodName.toLowerCase();

  if (lowerName.includes("juice") || lowerName.includes("liquid"))
    return "beverage";
  if (
    lowerName.includes("vegetable") ||
    lowerName.includes("salad") ||
    lowerName.includes("green")
  )
    return "vegetable";
  if (lowerName.includes("powder")) return "supplement";
  if (recommendationType === "R") return "recommended";
  if (recommendationType === "OR") return "optional";

  return "other";
};

// Helper function to safely convert to number
const safeNumber = (
  value: string | number | null | undefined,
  defaultValue: number = 0
): number => {
  if (value === null || value === undefined) return defaultValue;
  if (typeof value === "number") return value;
  const parsed = parseFloat(value.toString());
  return isNaN(parsed) ? defaultValue : parsed;
};

// Map Supabase food item to app's SelectedFoodItem interface
const mapFoodDatabaseItemToSelectedFoodItem = (
  dbItem: FoodDatabaseItem
): SelectedFoodItem => {
  // Use only net_carbs_g for carbs (as per user requirement)
  const totalCarbs = safeNumber(dbItem.net_carbs_g);

  // Calculate total fat: mixed_fat_with_refined_carbs_g + pure_fats_with_protein_and_greens_g
  const mixedFat = safeNumber(dbItem.mixed_fat_with_refined_carbs_g);
  const pureFat = safeNumber(dbItem.pure_fats_with_protein_and_greens_g);
  const totalFat = mixedFat + pureFat;

  return {
    id: `supabase-${dbItem.id}`,
    name: dbItem.food_list || "Unknown Food",
    calories: safeNumber(dbItem.calories),
    protein: safeNumber(dbItem.protein_g),
    carbs: totalCarbs,
    fat: totalFat,
    glycemicLoad: safeNumber(dbItem.gl),
    emoji: getFoodEmoji(dbItem.food_list || ""),
    category: getFoodCategory(
      dbItem.food_list || "",
      dbItem.recommendation_type || ""
    ),
    portion: dbItem.portion_size || "1 serving",
    quantity: 1,
  };
};

export class FoodService {
  // Search foods in the database
  static async searchFoods(
    query: string,
    limit: number = 20
  ): Promise<SelectedFoodItem[]> {
    try {
      console.log("FoodService.searchFoods called with query:", query);

      if (!query.trim()) {
        console.log("Empty query, fetching all foods...");
        // If no query, return some popular items
        const { data, error } = await supabase
          .from("food_database")
          .select("*")
          .limit(limit);

        console.log("Supabase response for all foods:", { data, error });
        console.log("Raw data:", data);

        if (error) {
          console.error("Error fetching foods:", error);
          return [];
        }

        if (!data || data.length === 0) {
          console.log("No data returned from Supabase");
          return [];
        }

        const mappedData =
          data?.map(mapFoodDatabaseItemToSelectedFoodItem) || [];
        console.log("Mapped food data:", mappedData);
        return mappedData;
      }

      console.log("Searching for foods with query:", query);

      // Try multiple search strategies
      let data, error;

      // Strategy 1: Case-insensitive partial match
      console.log("Trying ilike search...");
      const result1 = await supabase
        .from("food_database")
        .select("*")
        .ilike("food_list", `%${query}%`)
        .limit(limit);

      data = result1.data;
      error = result1.error;

      console.log("ilike search result:", { data, error, count: data?.length });

      // Strategy 2: If no results, try case-sensitive search
      if ((!data || data.length === 0) && !error) {
        console.log("Trying case-sensitive like search...");
        const result2 = await supabase
          .from("food_database")
          .select("*")
          .like("food_list", `%${query}%`)
          .limit(limit);

        data = result2.data;
        error = result2.error;
        console.log("like search result:", {
          data,
          error,
          count: data?.length,
        });
      }

      // Strategy 3: If still no results, try text search (if supported)
      if ((!data || data.length === 0) && !error) {
        console.log("Trying text search...");
        try {
          const result3 = await supabase
            .from("food_database")
            .select("*")
            .textSearch("food_list", query)
            .limit(limit);

          data = result3.data;
          error = result3.error;
          console.log("text search result:", {
            data,
            error,
            count: data?.length,
          });
        } catch (textSearchError) {
          console.log("Text search not supported or failed:", textSearchError);
        }
      }

      console.log("Final search response:", { data, error });

      if (error) {
        console.error("Error searching foods:", error);
        return [];
      }

      if (!data || data.length === 0) {
        console.log("No search results found");
        return [];
      }

      const mappedData = data?.map(mapFoodDatabaseItemToSelectedFoodItem) || [];
      console.log("Mapped search results:", mappedData);
      return mappedData;
    } catch (error) {
      console.error("Error in searchFoods:", error);
      return [];
    }
  }

  // Get recommended foods
  static async getRecommendedFoods(
    limit: number = 10
  ): Promise<SelectedFoodItem[]> {
    try {
      const { data, error } = await supabase
        .from("food_database")
        .select("*")
        .eq("recommendation_type", "R")
        .limit(limit);

      if (error) {
        console.error("Error fetching recommended foods:", error);
        return [];
      }

      return data?.map(mapFoodDatabaseItemToSelectedFoodItem) || [];
    } catch (error) {
      console.error("Error in getRecommendedFoods:", error);
      return [];
    }
  }

  // Get all foods (for fallback or general browsing)
  static async getAllFoods(limit: number = 50): Promise<SelectedFoodItem[]> {
    try {
      console.log("\n=== FETCHING ALL FOODS ===");
      console.log("Limit:", limit);

      // Get total count first
      const { count, error: countError } = await supabase
        .from("food_database")
        .select("*", { count: "exact", head: true });

      console.log("Total records in database:", count);

      if (countError) {
        console.error("Error getting count:", countError);
      }

      const { data, error } = await supabase
        .from("food_database")
        .select("*")
        .limit(limit);

      console.log("getAllFoods response:", {
        data,
        error,
        count: data?.length,
      });

      if (data && data.length > 0) {
        console.log("Sample record from getAllFoods:", data[0]);
        console.log("All field names:", Object.keys(data[0]));
      }

      if (error) {
        console.error("Error fetching all foods:", error);
        return [];
      }

      if (!data || data.length === 0) {
        console.log("❌ NO DATA IN DATABASE - Database appears to be empty");
        return [];
      }

      const mappedData = data?.map(mapFoodDatabaseItemToSelectedFoodItem) || [];
      console.log("Mapped all foods:", mappedData.length, "items");
      console.log("First mapped item:", mappedData[0]);
      return mappedData;
    } catch (error) {
      console.error("Error in getAllFoods:", error);
      return [];
    }
  }
}
