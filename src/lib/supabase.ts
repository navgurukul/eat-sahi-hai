import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Database types for the food_database table
export interface FoodDatabaseItem {
  id: number;
  food_list: string;
  portion_size: string;
  protein_g: number | string; // Could be string in database
  green_carbs_g: number | string;
  net_carbs_g: number | string;
  mixed_fat_with_refined_carbs_g: string;
  pure_fats_with_protein_and_greens_g: number | string;
  fiber_g: string | number;
  gl: number | string; // Glycemic load could be string
  calories: number | string; // Could be string in database
  recommendation_type: string;
}

// Database types for the user_food_logs table
export interface UserFoodLogItem {
  id: number;
  user_id: string; // Supabase Auth User ID
  food_name: string;
  emoji: string;
  category: string;
  portion_size: string;
  quantity: number;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  glycemic_load: number;
  logged_at: string; // ISO timestamp
  logged_date: string; // Date in YYYY-MM-DD format
  created_at: string;
}

// Database types for the user_fasts table
export interface UserFastItem {
  id: number;
  user_id: string; // Supabase Auth User ID
  fast_date: string; // Date in YYYY-MM-DD format
  start_time: string; // ISO timestamp
  end_time: string | null; // ISO timestamp or null if active
  duration_minutes: number | null; // Total duration in minutes
  fast_type: string; // Type of fast (intermittent, water, dry, etc.)
  notes: string | null; // Optional user notes
  is_active: boolean; // Whether the fast is currently active
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
}
