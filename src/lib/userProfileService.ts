import { supabase } from "./supabaseClient";

export interface UserProfile {
  id?: string;
  user_id: string;
  gender: string;
  age: number;
  height_cm: number;
  weight_kg: number;
  activity_level: string;
  fitness_goal: string;
  daily_calories_target: number;
  bmr?: number;
  tdee?: number;
  created_at?: string;
  updated_at?: string;
}

export interface OnboardingData {
  gender: string;
  age: number;
  height_cm: number;
  weight_kg: number;
  activity_level: string;
  fitness_goal: string;
  daily_calories_target: number;
  bmr: number;
  tdee: number;
}

export class UserProfileService {
  /**
   * Save user profile after onboarding completion
   */
  static async saveUserProfile(profileData: OnboardingData): Promise<boolean> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        console.error("[ERROR] No authenticated user found");
        return false;
      }

      console.log("[DEBUG] Saving user profile:", {
        userId: user.id,
        profileData,
      });

      // Use upsert with onConflict to handle both insert and update cases
      const { data, error } = await supabase
        .from("user_profiles")
        .upsert({
          user_id: user.id,
          gender: profileData.gender,
          age: profileData.age,
          height_cm: profileData.height_cm,
          weight_kg: profileData.weight_kg,
          activity_level: profileData.activity_level,
          fitness_goal: profileData.fitness_goal,
          daily_calories_target: profileData.daily_calories_target,
          bmr: profileData.bmr,
          tdee: profileData.tdee,
        }, {
          onConflict: 'user_id'
        })
        .select()
        .single();

      if (error) {
        console.error("[ERROR] Failed to save user profile:", {
          error,
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint,
          userId: user.id
        });
        
        // Return specific error messages for validation failures
        if (error.code === '23514') { // Check constraint violation
          if (error.message.includes('height_cm_check')) {
            throw new Error('Height must be between 50 and 300 cm (1.6 - 9.8 feet)');
          }
          if (error.message.includes('weight_kg_check')) {
            throw new Error('Weight must be between 20 and 500 kg (44 - 1100 lbs)');
          }
          if (error.message.includes('age')) {
            throw new Error('Age must be between 1 and 149 years');
          }
        }
        
        return false;
      }

      console.log("[SUCCESS] User profile saved successfully:", data);
      return true;
    } catch (error) {
      console.error("[ERROR] Exception in saveUserProfile:", error);
      return false;
    }
  }

  /**
   * Get user profile (check if user has completed onboarding)
   */
  static async getUserProfile(): Promise<UserProfile | null> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        console.error("[ERROR] No authenticated user found");
        return null;
      }

      const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          // No profile found - user hasn't completed onboarding
          console.log(
            "[INFO] No user profile found - onboarding not completed"
          );
          return null;
        }
        console.error("[ERROR] Failed to fetch user profile:", error);
        return null;
      }

      console.log("[SUCCESS] User profile retrieved:", data);
      return data;
    } catch (error) {
      console.error("[ERROR] Exception in getUserProfile:", error);
      return null;
    }
  }

  /**
   * Update user profile (for profile editing)
   */
  static async updateUserProfile(
    updates: Partial<OnboardingData>
  ): Promise<boolean> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        console.error("[ERROR] No authenticated user found");
        return false;
      }

      console.log("[DEBUG] Updating user profile:", {
        userId: user.id,
        updates,
      });

      const { data, error } = await supabase
        .from("user_profiles")
        .update(updates)
        .eq("user_id", user.id)
        .select()
        .single();

      if (error) {
        console.error("[ERROR] Failed to update user profile:", error);
        return false;
      }

      console.log("[SUCCESS] User profile updated successfully:", data);
      return true;
    } catch (error) {
      console.error("[ERROR] Exception in updateUserProfile:", error);
      return false;
    }
  }

  /**
   * Delete user profile
   */
  static async deleteUserProfile(): Promise<boolean> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        console.error("[ERROR] No authenticated user found");
        return false;
      }

      const { error } = await supabase
        .from("user_profiles")
        .delete()
        .eq("user_id", user.id);

      if (error) {
        console.error("[ERROR] Failed to delete user profile:", error);
        return false;
      }

      console.log("[SUCCESS] User profile deleted successfully");
      return true;
    } catch (error) {
      console.error("[ERROR] Exception in deleteUserProfile:", error);
      return false;
    }
  }

  /**
   * Check if user has completed onboarding
   */
  static async hasCompletedOnboarding(): Promise<boolean> {
    console.log("[DEBUG] Checking onboarding completion...");
    const profile = await this.getUserProfile();
    const hasCompleted = profile !== null;
    console.log("[DEBUG] Onboarding completion result:", {
      hasProfile: hasCompleted,
      profile: profile ? { id: profile.id, user_id: profile.user_id } : null,
    });
    return hasCompleted;
  }

  /**
   * Recalculate calories based on updated profile data
   */
  static calculateCalories(profileData: {
    gender: string;
    age: number;
    height_cm: number;
    weight_kg: number;
    activity_level: string;
    fitness_goal: string;
  }): { calories: number; bmr: number; tdee: number } {
    const { gender, age, height_cm, weight_kg, activity_level, fitness_goal } =
      profileData;

    // Mifflin-St Jeor Equation for BMR
    let bmr =
      gender === "male"
        ? 10 * weight_kg + 6.25 * height_cm - 5 * age + 5
        : 10 * weight_kg + 6.25 * height_cm - 5 * age - 161;

    // Activity multipliers
    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      "very-active": 1.9,
    };

    const multiplier =
      activityMultipliers[activity_level as keyof typeof activityMultipliers] ||
      1.2;
    let tdee = bmr * multiplier;

    // Goal adjustments
    let calories = tdee;
    if (fitness_goal === "lose") calories -= 500;
    else if (fitness_goal === "gain") calories += 500;

    return {
      calories: Math.round(calories),
      bmr: Math.round(bmr * 100) / 100, // Round to 2 decimal places
      tdee: Math.round(tdee * 100) / 100,
    };
  }
}
