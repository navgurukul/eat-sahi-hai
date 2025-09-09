import React, { createContext, useContext, useState, useEffect } from "react";
import { UserFastService, FastLogItem } from "@/lib/userFastService";

// LocalStorage key for fast state persistence
const FAST_STATE_STORAGE_KEY = "eat-sahi-hai-fast-state";

export interface FastState {
  isActive: boolean;
  startTime: Date | null;
  currentFastId: string | null;
  elapsedTime: number; // in seconds
}

interface FastContextType {
  fastState: FastState;
  startFast: (fastDate?: Date) => Promise<void>;
  stopFast: () => Promise<void>;
  getFastsForDate: (date: Date) => FastLogItem[];
  refreshFastsFromDatabase: () => Promise<void>;
  fastHistory: FastLogItem[];
}

const FastContext = createContext<FastContextType | undefined>(undefined);

export function FastProvider({ children }: { children: React.ReactNode }) {
  // Initialize state from localStorage if available
  const getInitialFastState = (): FastState => {
    try {
      const stored = localStorage.getItem(FAST_STATE_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Convert startTime back to Date object if exists
        if (parsed.startTime) {
          parsed.startTime = new Date(parsed.startTime);
          // Recalculate elapsed time
          parsed.elapsedTime = Math.floor(
            (Date.now() - parsed.startTime.getTime()) / 1000
          );
        }
        return parsed;
      }
    } catch (error) {
      console.error("Error loading fast state from localStorage:", error);
    }

    return {
      isActive: false,
      startTime: null,
      currentFastId: null,
      elapsedTime: 0,
    };
  };

  const [fastState, setFastState] = useState<FastState>(getInitialFastState);
  const [fastHistory, setFastHistory] = useState<FastLogItem[]>([]);

  // Save fast state to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(FAST_STATE_STORAGE_KEY, JSON.stringify(fastState));
    } catch (error) {
      console.error("Error saving fast state to localStorage:", error);
    }
  }, [fastState]);

  // Load fast data on mount
  useEffect(() => {
    loadFastData();
  }, []);

  // Timer effect for active fasts
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (fastState.isActive && fastState.startTime) {
      interval = setInterval(() => {
        const now = new Date();
        const elapsed = Math.floor(
          (now.getTime() - fastState.startTime!.getTime()) / 1000
        );

        setFastState((prev) => ({
          ...prev,
          elapsedTime: elapsed,
        }));
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [fastState.isActive, fastState.startTime]);

  // Function to load fast data from database
  const loadFastData = async () => {
    try {
      // Don't reload if we already have an active fast running locally
      if (fastState.isActive && fastState.startTime) {
        console.log("Fast is already active locally, skipping database reload");
        return;
      }

      // Get fasts for the last 30 days
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);

      const fasts = await UserFastService.getFastsForDateRange(
        startDate,
        endDate
      );
      setFastHistory(fasts);

      // Check if there's an ACTIVE fast for today (only resume if truly active)
      const today = new Date();
      const activeFast = await UserFastService.getActiveFastForDate(today);

      if (activeFast && activeFast.isActive) {
        console.log("Resuming active fast from database:", activeFast);
        setFastState({
          isActive: true,
          startTime: activeFast.startTime,
          currentFastId: activeFast.id,
          elapsedTime: Math.floor(
            (Date.now() - activeFast.startTime.getTime()) / 1000
          ),
        });
      } else {
        // Only reset state if we don't have an active fast locally
        if (!fastState.isActive) {
          console.log("No active fast found, state already inactive");
        }
      }
    } catch (error) {
      console.error("Error loading fast data:", error);
      // Don't reset state on error if we have an active fast
      if (!fastState.isActive) {
        setFastState({
          isActive: false,
          startTime: null,
          currentFastId: null,
          elapsedTime: 0,
        });
      }
    }
  };

  const refreshFastsFromDatabase = async () => {
    try {
      console.log("[DEBUG] Refreshing fasts from database...");
      
      // Get fasts for the last 30 days (always refresh, ignore local state)
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);

      const fasts = await UserFastService.getFastsForDateRange(
        startDate,
        endDate
      );
      
      console.log("[DEBUG] Fetched fasts from database:", fasts.length, "fasts");
      setFastHistory(fasts);
      
      // Also check for any active fasts (but don't override local state if we're actively running a timer)
      if (!fastState.isActive) {
        const today = new Date();
        const activeFast = await UserFastService.getActiveFastForDate(today);
        
        if (activeFast && activeFast.isActive) {
          console.log("[DEBUG] Found active fast in database, resuming:", activeFast);
          setFastState({
            isActive: true,
            startTime: activeFast.startTime,
            currentFastId: activeFast.id,
            elapsedTime: Math.floor(
              (Date.now() - activeFast.startTime.getTime()) / 1000
            ),
          });
        }
      }
    } catch (error) {
      console.error("Error refreshing fast data:", error);
    }
  };

  const startFast = async (fastDate: Date = new Date()) => {
    try {
      console.log("Starting fast for date:", fastDate);
      const fastId = await UserFastService.startFast(fastDate, "intermittent");

      if (fastId) {
        const startTime = new Date();
        console.log("Fast started successfully, setting local state");
        setFastState({
          isActive: true,
          startTime,
          currentFastId: fastId,
          elapsedTime: 0,
        });

        // DON'T refresh from database immediately - let the timer run
        console.log("Fast is now active with ID:", fastId);
      } else {
        // Fallback: Start timer locally if database fails
        console.warn("Database operation failed, starting local timer");
        const startTime = new Date();
        setFastState({
          isActive: true,
          startTime,
          currentFastId: `local-${Date.now()}`,
          elapsedTime: 0,
        });
      }
    } catch (error) {
      console.error("Error starting fast:", error);
      // Still start local timer as fallback
      const startTime = new Date();
      setFastState({
        isActive: true,
        startTime,
        currentFastId: `local-${Date.now()}`,
        elapsedTime: 0,
      });
    }
  };

  const stopFast = async () => {
    try {
      if (
        fastState.currentFastId &&
        !fastState.currentFastId.startsWith("local-")
      ) {
        console.log("Stopping fast in database:", fastState.currentFastId);
        const success = await UserFastService.endFast(fastState.currentFastId);

        if (success) {
          console.log("Fast successfully stopped in database");
          // Refresh history to show the completed fast
          console.log("[DEBUG] About to refresh fast history after stopping fast");
          await refreshFastsFromDatabase();
          console.log("[DEBUG] Fast history refresh completed");
        } else {
          console.error("Failed to stop fast in database");
        }
      } else {
        console.log("Stopping local fast or no fast ID");
      }

      // Always stop the local timer regardless of database success
      console.log("Resetting local fast state");
      const newState = {
        isActive: false,
        startTime: null,
        currentFastId: null,
        elapsedTime: 0,
      };

      setFastState(newState);

      // Clear from localStorage
      try {
        localStorage.removeItem(FAST_STATE_STORAGE_KEY);
      } catch (error) {
        console.error("Error clearing fast state from localStorage:", error);
      }
    } catch (error) {
      console.error("Error stopping fast:", error);
      // Still stop local timer
      const newState = {
        isActive: false,
        startTime: null,
        currentFastId: null,
        elapsedTime: 0,
      };
      setFastState(newState);

      try {
        localStorage.removeItem(FAST_STATE_STORAGE_KEY);
      } catch (error) {
        console.error("Error clearing fast state from localStorage:", error);
      }
    }
  };

  const getFastsForDate = (date: Date): FastLogItem[] => {
    const targetDateString = date.toDateString();
    
    console.log("[DEBUG] Getting fasts for date:", targetDateString);
    console.log("[DEBUG] Total fasts in history:", fastHistory.length);
    
    const filtered = fastHistory.filter((fast) => {
      const fastDateString = fast.fastDate.toDateString();
      const matches = fastDateString === targetDateString;
      console.log("[DEBUG] Fast date:", fastDateString, "matches:", matches);
      return matches;
    });
    
    console.log("[DEBUG] Filtered fasts for date:", filtered.length);
    return filtered;
  };

  return (
    <FastContext.Provider
      value={{
        fastState,
        startFast,
        stopFast,
        getFastsForDate,
        refreshFastsFromDatabase,
        fastHistory,
      }}
    >
      {children}
    </FastContext.Provider>
  );
}

export function useFastContext() {
  const context = useContext(FastContext);
  if (context === undefined) {
    throw new Error("useFastContext must be used within a FastProvider");
  }
  return context;
}
