import { supabase, FoodDatabaseItem } from "./supabase";
import { SelectedFoodItem } from "@/contexts/FoodContext";
import Fuse from "fuse.js";

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
  // Fuzzy search configuration - optimized for typo tolerance
  private static fuseOptions = {
    keys: [
      { name: "food_list", weight: 1.0 }, // Only search food names
    ],
    threshold: 0.5, // Balanced threshold for typo tolerance (0.0 = perfect, 1.0 = anything)
    distance: 1000, // Higher distance allows more character variations
    minMatchCharLength: 1, // Allow single character matches
    includeScore: true,
    includeMatches: true,
    ignoreLocation: true, // Ignore position of match in string
    ignoreFieldNorm: true, // Ignore field length normalization
    useExtendedSearch: false,
    findAllMatches: false,
  };

  // Perform fuzzy search on local data
  private static performFuzzySearch(
    data: FoodDatabaseItem[],
    query: string,
    limit: number = 20
  ): SelectedFoodItem[] {
    if (!data || data.length === 0) {
      return [];
    }

    const fuse = new Fuse(data, this.fuseOptions);
    const results = fuse.search(query);

    // Sort by score (lower score = better match) and map to SelectedFoodItem
    return results
      .slice(0, limit)
      .map((result) => mapFoodDatabaseItemToSelectedFoodItem(result.item));
  }

  // Search foods in the database
  static async searchFoods(
    query: string,
    limit: number = 20
  ): Promise<SelectedFoodItem[]> {
    try {
      if (!query.trim()) {
        // If no query, return some popular items
        const { data, error } = await supabase
          .from("food_database")
          .select("*")
          .limit(limit);

        if (error) {
          console.error("Error fetching foods:", error);
          return [];
        }

        if (!data || data.length === 0) {
          return [];
        }

        return data?.map(mapFoodDatabaseItemToSelectedFoodItem) || [];
      }

      // Try multiple search strategies with fuzzy search fallback
      let data, error;

      // Strategy 1: Case-insensitive partial match (fastest, most direct)
      const result1 = await supabase
        .from("food_database")
        .select("*")
        .ilike("food_list", `%${query}%`)
        .limit(limit);

      data = result1.data;
      error = result1.error;

      // Strategy 2: If no results, try fuzzy search on all data
      if ((!data || data.length === 0) && !error) {
        // Get more data for fuzzy search (we need a larger dataset to search through)
        const allDataResult = await supabase
          .from("food_database")
          .select("*")
          .limit(200); // Get more records for better fuzzy matching

        if (allDataResult.data && allDataResult.data.length > 0) {
          const fuzzyResults = this.performFuzzySearch(
            allDataResult.data,
            query,
            limit
          );

          if (fuzzyResults.length > 0) {
            return fuzzyResults;
          }
        }

        // Strategy 3: If fuzzy search fails, try case-sensitive search
        const result2 = await supabase
          .from("food_database")
          .select("*")
          .like("food_list", `%${query}%`)
          .limit(limit);

        data = result2.data;
        error = result2.error;
      }

      if (error) {
        console.error("Error searching foods:", error);
        return [];
      }

      if (!data || data.length === 0) {
        return [];
      }

      return data?.map(mapFoodDatabaseItemToSelectedFoodItem) || [];
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
      const { data, error } = await supabase
        .from("food_database")
        .select("*")
        .limit(limit);

      if (error) {
        console.error("Error fetching all foods:", error);
        return [];
      }

      if (!data || data.length === 0) {
        return [];
      }

      const mappedData = data?.map(mapFoodDatabaseItemToSelectedFoodItem) || [];
      return mappedData;
    } catch (error) {
      console.error("Error in getAllFoods:", error);
      return [];
    }
  }
}
