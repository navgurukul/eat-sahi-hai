import { supabase, UserFastItem } from "./supabase";
import { AuthService } from "./authService";

export interface FastLogItem {
  id: string;
  fastDate: Date;
  startTime: Date;
  endTime: Date | null;
  durationMinutes: number | null;
  fastType: string;
  notes: string | null;
  isActive: boolean;
}

export class UserFastService {
  // Start a new fast
  static async startFast(
    fastDate: Date,
    fastType: string = "intermittent",
    notes?: string
  ): Promise<string | null> {
    try {
      // Get current authenticated user
      const user = await AuthService.getCurrentUser();
      if (!user) {
        console.error("[ERROR] No authenticated user found");
        return null;
      }

      const startTime = new Date().toISOString();
      const dateString = fastDate.toISOString().split("T")[0]; // YYYY-MM-DD format

      // Check if there's already an active fast for this date
      const { data: existingFast, error: existingError } = await supabase
        .from("user_fasts")
        .select("*")
        .eq("user_id", user.id) // Filter by current user
        .eq("fast_date", dateString)
        .eq("is_active", true)
        .maybeSingle();

      if (existingError) {
        console.error("Error checking existing fast:", existingError);
        // Continue with creating new fast
      }

      if (existingFast) {
        console.warn("Active fast already exists for this date");
        return existingFast.id.toString();
      }

      const fastEntry = {
        user_id: user.id, // Add user ID to the entry
        fast_date: dateString,
        start_time: startTime,
        end_time: null,
        duration_minutes: null,
        fast_type: fastType,
        notes: notes || null,
        is_active: true,
      };

      const { data, error } = await supabase
        .from("user_fasts")
        .insert([fastEntry])
        .select()
        .single();

      if (error) {
        console.error("Error starting fast:", error);
        return null;
      }

      console.log("Successfully started fast in database");
      return data.id.toString();
    } catch (error) {
      console.error("Error in startFast:", error);
      return null;
    }
  }

  // End a fast
  static async endFast(fastId: string): Promise<boolean> {
    try {
      // Get current authenticated user
      const user = await AuthService.getCurrentUser();
      if (!user) {
        console.error("[ERROR] No authenticated user found");
        return false;
      }

      const endTime = new Date().toISOString();
      const dbId = fastId.replace("db-", "");

      console.log("Ending fast with ID:", dbId);

      // Get the fast record to calculate duration
      const { data: fastRecord, error: fetchError } = await supabase
        .from("user_fasts")
        .select("start_time")
        .eq("id", dbId)
        .eq("user_id", user.id) // Ensure user can only end their own fasts
        .maybeSingle();

      if (fetchError) {
        console.error("Error fetching fast record:", fetchError);
        return false;
      }

      if (!fastRecord) {
        console.error("Fast record not found for ID:", dbId);
        return false;
      }

      // Calculate duration in minutes
      const startTime = new Date(fastRecord.start_time);
      const endTimeDate = new Date(endTime);
      const durationMinutes = Math.floor(
        (endTimeDate.getTime() - startTime.getTime()) / (1000 * 60)
      );

      console.log("Calculated duration:", durationMinutes, "minutes");

      const { error } = await supabase
        .from("user_fasts")
        .update({
          end_time: endTime,
          duration_minutes: durationMinutes,
          is_active: false, // CRITICAL: Mark as inactive
        })
        .eq("id", dbId)
        .eq("user_id", user.id); // Ensure user can only update their own fasts

      if (error) {
        console.error("Error ending fast:", error);
        return false;
      }

      console.log("Successfully ended fast in database");
      return true;
    } catch (error) {
      console.error("Error in endFast:", error);
      return false;
    }
  }

  // Get fasts for a specific date
  static async getFastsForDate(date: Date): Promise<FastLogItem[]> {
    try {
      // Get current authenticated user
      const user = await AuthService.getCurrentUser();
      if (!user) {
        console.error("[ERROR] No authenticated user found");
        return [];
      }

      const dateString = date.toISOString().split("T")[0]; // YYYY-MM-DD format

      const { data, error } = await supabase
        .from("user_fasts")
        .select("*")
        .eq("user_id", user.id) // Filter by current user
        .eq("fast_date", dateString)
        .order("start_time", { ascending: false });

      if (error) {
        console.error("Error fetching fasts from database:", error);
        return [];
      }

      if (!data) {
        return [];
      }

      // Convert database records to FastLogItem format
      return data.map((dbItem: UserFastItem) => ({
        id: `db-${dbItem.id}`,
        fastDate: new Date(dbItem.fast_date + "T00:00:00"),
        startTime: new Date(dbItem.start_time),
        endTime: dbItem.end_time ? new Date(dbItem.end_time) : null,
        durationMinutes: dbItem.duration_minutes,
        fastType: dbItem.fast_type,
        notes: dbItem.notes,
        isActive: dbItem.is_active,
      }));
    } catch (error) {
      console.error("Error in getFastsForDate:", error);
      return [];
    }
  }

  // Get fasts for a date range
  static async getFastsForDateRange(
    startDate: Date,
    endDate: Date
  ): Promise<FastLogItem[]> {
    try {
      // Get current authenticated user
      const user = await AuthService.getCurrentUser();
      if (!user) {
        console.error("[ERROR] No authenticated user found");
        return [];
      }

      const startDateString = startDate.toISOString().split("T")[0];
      const endDateString = endDate.toISOString().split("T")[0];

      const { data, error } = await supabase
        .from("user_fasts")
        .select("*")
        .eq("user_id", user.id) // Filter by current user
        .gte("fast_date", startDateString)
        .lte("fast_date", endDateString)
        .order("start_time", { ascending: false });

      if (error) {
        console.error("Error fetching fasts from database:", error);
        return [];
      }

      if (!data) {
        return [];
      }

      // Convert database records to FastLogItem format
      return data.map((dbItem: UserFastItem) => ({
        id: `db-${dbItem.id}`,
        fastDate: new Date(dbItem.fast_date + "T00:00:00"),
        startTime: new Date(dbItem.start_time),
        endTime: dbItem.end_time ? new Date(dbItem.end_time) : null,
        durationMinutes: dbItem.duration_minutes,
        fastType: dbItem.fast_type,
        notes: dbItem.notes,
        isActive: dbItem.is_active,
      }));
    } catch (error) {
      console.error("Error in getFastsForDateRange:", error);
      return [];
    }
  }

  // Get active fast for a specific date
  static async getActiveFastForDate(date: Date): Promise<FastLogItem | null> {
    try {
      // Get current authenticated user
      const user = await AuthService.getCurrentUser();
      if (!user) {
        console.error("[ERROR] No authenticated user found");
        return null;
      }

      const dateString = date.toISOString().split("T")[0];

      const { data, error } = await supabase
        .from("user_fasts")
        .select("*")
        .eq("user_id", user.id) // Filter by current user
        .eq("fast_date", dateString)
        .eq("is_active", true)
        .maybeSingle();

      if (error) {
        console.error("Error fetching active fast:", error);
        return null;
      }

      if (!data) {
        return null;
      }

      return {
        id: `db-${data.id}`,
        fastDate: new Date(data.fast_date + "T00:00:00"),
        startTime: new Date(data.start_time),
        endTime: data.end_time ? new Date(data.end_time) : null,
        durationMinutes: data.duration_minutes,
        fastType: data.fast_type,
        notes: data.notes,
        isActive: data.is_active,
      };
    } catch (error) {
      console.error("Error in getActiveFastForDate:", error);
      return null;
    }
  }

  // Delete a fast
  static async deleteFast(id: string): Promise<boolean> {
    try {
      // Get current authenticated user
      const user = await AuthService.getCurrentUser();
      if (!user) {
        console.error("[ERROR] No authenticated user found");
        return false;
      }

      // Extract the database ID from the prefixed ID
      const dbId = id.replace("db-", "");

      const { error } = await supabase
        .from("user_fasts")
        .delete()
        .eq("id", dbId)
        .eq("user_id", user.id); // Ensure user can only delete their own fasts

      if (error) {
        console.error("Error deleting fast from database:", error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error in deleteFast:", error);
      return false;
    }
  }

  // Update fast notes
  static async updateFastNotes(id: string, notes: string): Promise<boolean> {
    try {
      // Get current authenticated user
      const user = await AuthService.getCurrentUser();
      if (!user) {
        console.error("[ERROR] No authenticated user found");
        return false;
      }

      const dbId = id.replace("db-", "");

      const { error } = await supabase
        .from("user_fasts")
        .update({ notes })
        .eq("id", dbId)
        .eq("user_id", user.id); // Ensure user can only update their own fasts

      if (error) {
        console.error("Error updating fast notes:", error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error in updateFastNotes:", error);
      return false;
    }
  }
}
