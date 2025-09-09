import React, { createContext, useContext, useState, useEffect } from "react";
import { startOfWeek, endOfWeek, isWithinInterval, subWeeks } from "date-fns";
import { useAllFoods } from "@/hooks/useFoodSearch";
import { UserFoodLogService } from "@/lib/userFoodLogService";

// Storage key for localStorage (fallback)
const LOGGED_ITEMS_STORAGE_KEY = "eat-sahi-hai-logged-items";

export interface LoggedFoodItem {
  id: string;
  name: string;
  emoji: string;
  category: string;
  portion: string;
  quantity: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  glycemicLoad: number;
  time: string;
  date: Date;
}

export interface SelectedFoodItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  glycemicLoad: number;
  emoji: string;
  category: string;
  portion: string;
  quantity: number;
}

interface FoodContextType {
  loggedItems: LoggedFoodItem[];
  pastFoodItems: SelectedFoodItem[];
  selectedDate: Date;
  addLoggedItems: (items: SelectedFoodItem[], date: Date) => Promise<void>;
  removeLoggedItem: (id: string) => Promise<void>;
  updateLoggedItemQuantity: (id: string, quantity: number) => Promise<void>;
  setSelectedDate: (date: Date) => void;
  getLoggedItemsForDate: (date: Date) => LoggedFoodItem[];
  getWeekData: (weekDate: Date) => LoggedFoodItem[];
  refreshLoggedItemsFromDatabase: () => Promise<void>;
}

const FoodContext = createContext<FoodContextType | undefined>(undefined);

// Helper functions for localStorage
const saveLoggedItemsToStorage = (items: LoggedFoodItem[]) => {
  try {
    localStorage.setItem(LOGGED_ITEMS_STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error("Failed to save logged items to localStorage:", error);
  }
};

const loadLoggedItemsFromStorage = (): LoggedFoodItem[] => {
  try {
    const stored = localStorage.getItem(LOGGED_ITEMS_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Convert date strings back to Date objects
      return parsed.map((item: any) => ({
        ...item,
        date: new Date(item.date),
      }));
    }
  } catch (error) {
    console.error("Failed to load logged items from localStorage:", error);
  }
  return [];
};

const getInitialLoggedItems = (): LoggedFoodItem[] => {
  // Load from localStorage first
  const storedItems = loadLoggedItemsFromStorage();

  // If we have stored items, return them
  if (storedItems.length > 0) {
    return storedItems;
  }

  // Generate mock data ONLY for previous weeks (not current week) to support charts
  // This ensures today's date will always start empty unless there's real data
  const mockItems: LoggedFoodItem[] = [];

  // Only create mock data for 2-4 weeks ago for chart visualization
  for (let weekOffset = 14; weekOffset <= 28; weekOffset++) {
    const date = new Date();
    date.setDate(date.getDate() - weekOffset);

    // Add some mock items for this date
    mockItems.push(
      {
        id: `mock-${weekOffset}-1`,
        name: "Paratha",
        emoji: "🥞",
        category: "Grains",
        portion: "1 piece",
        quantity: 1,
        calories: 250 + Math.random() * 50,
        protein: 8 + Math.random() * 4,
        carbs: 35 + Math.random() * 10,
        fat: 8 + Math.random() * 4,
        glycemicLoad: 40 + Math.random() * 30,
        time: "08:00",
        date,
      },
      {
        id: `mock-${weekOffset}-2`,
        name: "Chicken Curry",
        emoji: "🍛",
        category: "Protein",
        portion: "1 serving",
        quantity: 1,
        calories: 300 + Math.random() * 100,
        protein: 25 + Math.random() * 10,
        carbs: 15 + Math.random() * 10,
        fat: 12 + Math.random() * 8,
        glycemicLoad: 20 + Math.random() * 20,
        time: "13:00",
        date,
      },
      {
        id: `mock-${weekOffset}-3`,
        name: "Rice",
        emoji: "🍚",
        category: "Grains",
        portion: "1 cup",
        quantity: 1,
        calories: 200 + Math.random() * 50,
        protein: 4 + Math.random() * 2,
        carbs: 45 + Math.random() * 10,
        fat: 1 + Math.random() * 2,
        glycemicLoad: 50 + Math.random() * 30,
        time: "20:00",
        date,
      }
    );
  }

  return mockItems;
};

export function FoodProvider({ children }: { children: React.ReactNode }) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Fetch foods from Supabase (with React Query caching)
  const { data: supabaseFoods } = useAllFoods();

  // Mock data for logged items - only previous week (complete data) for charts
  const [loggedItems, setLoggedItems] = useState<LoggedFoodItem[]>(
    getInitialLoggedItems
  );

  // Save to localStorage whenever loggedItems change (fallback persistence)
  useEffect(() => {
    saveLoggedItemsToStorage(loggedItems);
  }, [loggedItems]);

  // Load data from database on mount
  useEffect(() => {
    loadDataFromDatabase();
  }, []);

  // Refresh data when selected date changes to ensure we show correct data for that date
  useEffect(() => {
    const refreshDataForDate = async () => {
      // Only refresh if we need to load more data for the selected date
      const existingItemsForDate = loggedItems.filter(
        (item) => item.date.toDateString() === selectedDate.toDateString()
      );

      // If we don't have data for the selected date and it's not today, try to load it
      if (existingItemsForDate.length === 0) {
        try {
          const itemsForDate = await UserFoodLogService.getLoggedItemsForDate(
            selectedDate
          );
          if (itemsForDate.length > 0) {
            // Merge new data with existing data
            setLoggedItems((prev) => {
              // Remove any existing items for this date to avoid duplicates
              const filteredPrev = prev.filter(
                (item) =>
                  item.date.toDateString() !== selectedDate.toDateString()
              );
              return [...itemsForDate, ...filteredPrev];
            });
          }
        } catch (error) {
          console.error("Error loading data for selected date:", error);
        }
      }
    };

    refreshDataForDate();
  }, [selectedDate]);

  // Function to refresh logged items from database
  const refreshLoggedItemsFromDatabase = async () => {
    try {
      // Get data for the last 30 days to include current data + previous weeks
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);

      const databaseItems = await UserFoodLogService.getLoggedItemsForDateRange(
        startDate,
        endDate
      );

      // Keep mock data only for dates older than 30 days (for chart history)
      const oldMockData = getInitialLoggedItems().filter((item) => {
        const itemDate = new Date(item.date);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return itemDate < thirtyDaysAgo;
      });

      // Combine real database items with old mock data only
      // This ensures recent dates (including today) only show real data
      setLoggedItems([...databaseItems, ...oldMockData]);
    } catch (error) {
      console.error("Error refreshing data from database:", error);
    }
  };

  // Function to load initial data from database
  const loadDataFromDatabase = async () => {
    await refreshLoggedItemsFromDatabase();
  };

  // Function to load data for a specific date (useful for date navigation)
  const loadDataForSpecificDate = async (date: Date) => {
    try {
      const itemsForDate = await UserFoodLogService.getLoggedItemsForDate(date);
      if (itemsForDate.length > 0) {
        // Merge new data with existing data, avoiding duplicates
        setLoggedItems((prev) => {
          const filteredPrev = prev.filter(
            (item) => item.date.toDateString() !== date.toDateString()
          );
          return [...itemsForDate, ...filteredPrev];
        });
      }
    } catch (error) {
      console.error("Error loading data for specific date:", error);
    }
  };

  // Past food items for quick selection - use Supabase data when available, fallback to hardcoded
  const hardcodedFoodItems: SelectedFoodItem[] = [
    {
      id: "past-1",
      name: "Roti",
      calories: 80,
      protein: 3,
      carbs: 15,
      fat: 1,
      glycemicLoad: 8,
      emoji: "🫓",
      category: "staple",
      portion: "piece",
      quantity: 1,
    },
    {
      id: "past-2",
      name: "Dal",
      calories: 120,
      protein: 8,
      carbs: 18,
      fat: 1,
      glycemicLoad: 10,
      emoji: "🫘",
      category: "protein",
      portion: "bowl",
      quantity: 1,
    },
    {
      id: "past-3",
      name: "Chawal",
      calories: 150,
      protein: 3,
      carbs: 32,
      fat: 0.5,
      glycemicLoad: 20,
      emoji: "🍚",
      category: "staple",
      portion: "plate",
      quantity: 1,
    },
    {
      id: "past-4",
      name: "Sabzi",
      calories: 90,
      protein: 4,
      carbs: 12,
      fat: 3,
      glycemicLoad: 5,
      emoji: "🥬",
      category: "vegetable",
      portion: "bowl",
      quantity: 1,
    },
    {
      id: "past-5",
      name: "Chai",
      calories: 80,
      protein: 2,
      carbs: 10,
      fat: 3,
      glycemicLoad: 6,
      emoji: "🫖",
      category: "beverage",
      portion: "cup",
      quantity: 1,
    },
    {
      id: "past-6",
      name: "Paratha",
      calories: 200,
      protein: 5,
      carbs: 25,
      fat: 8,
      glycemicLoad: 12,
      emoji: "🫓",
      category: "staple",
      portion: "piece",
      quantity: 1,
    },
    {
      id: "past-7",
      name: "Curd",
      calories: 60,
      protein: 3,
      carbs: 4,
      fat: 3,
      glycemicLoad: 2,
      emoji: "🥛",
      category: "dairy",
      portion: "bowl",
      quantity: 1,
    },
    {
      id: "past-8",
      name: "Aloo Gobi",
      calories: 110,
      protein: 3,
      carbs: 18,
      fat: 4,
      glycemicLoad: 8,
      emoji: "🥔",
      category: "vegetable",
      portion: "plate",
      quantity: 1,
    },
    {
      id: "past-9",
      name: "Rajma",
      calories: 140,
      protein: 10,
      carbs: 20,
      fat: 2,
      glycemicLoad: 12,
      emoji: "🫘",
      category: "protein",
      portion: "bowl",
      quantity: 1,
    },
    {
      id: "past-10",
      name: "Roti with Ghee",
      calories: 120,
      protein: 3,
      carbs: 15,
      fat: 5,
      glycemicLoad: 10,
      emoji: "🫓",
      category: "staple",
      portion: "piece",
      quantity: 1,
    },
  ];

  // Use Supabase foods when available, fallback to hardcoded items
  const pastFoodItems =
    supabaseFoods && supabaseFoods.length > 0
      ? supabaseFoods.slice(0, 10)
      : hardcodedFoodItems;

  const addLoggedItems = async (items: SelectedFoodItem[], date: Date) => {
    const currentTime = new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    // Try to save to Supabase first
    const savedToDatabase = await UserFoodLogService.saveLoggedItems(
      items,
      date
    );

    if (savedToDatabase) {
      // If saved to database, refresh the data from database
      await refreshLoggedItemsFromDatabase();
    } else {
      // Fallback to local storage if database save fails
      console.warn("Failed to save to database, using localStorage fallback");
      const newLoggedItems: LoggedFoodItem[] = items.map((item) => ({
        id: `local-${item.id}-${Date.now()}-${Math.random()}`,
        name: item.name,
        emoji: item.emoji,
        category: item.category,
        portion: item.portion,
        quantity: item.quantity,
        calories: item.calories * item.quantity,
        protein: item.protein * item.quantity,
        carbs: item.carbs * item.quantity,
        fat: item.fat * item.quantity,
        glycemicLoad: item.glycemicLoad * item.quantity,
        time: currentTime,
        date: date,
      }));

      setLoggedItems((prev) => [...newLoggedItems, ...prev]);
    }
  };

  const removeLoggedItem = async (id: string) => {
    // Try to delete from database first if it's a database item
    if (id.startsWith("db-")) {
      const deletedFromDatabase = await UserFoodLogService.deleteLoggedItem(id);
      if (deletedFromDatabase) {
        // Refresh data from database
        await refreshLoggedItemsFromDatabase();
        return;
      }
    }

    // Fallback to local removal
    setLoggedItems((items) => items.filter((item) => item.id !== id));
  };

  const updateLoggedItemQuantity = async (id: string, quantity: number) => {
    // Try to update in database first if it's a database item
    if (id.startsWith("db-")) {
      const updatedInDatabase =
        await UserFoodLogService.updateLoggedItemQuantity(id, quantity);
      if (updatedInDatabase) {
        // Refresh data from database
        await refreshLoggedItemsFromDatabase();
        return;
      }
    }

    // Fallback to local update
    setLoggedItems((items) =>
      items.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity,
              calories: (item.calories / item.quantity) * quantity,
              protein: (item.protein / item.quantity) * quantity,
              carbs: (item.carbs / item.quantity) * quantity,
              fat: (item.fat / item.quantity) * quantity,
              glycemicLoad: (item.glycemicLoad / item.quantity) * quantity,
            }
          : item
      )
    );
  };

  const getWeekData = (weekDate: Date) => {
    const weekStart = startOfWeek(weekDate, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(weekDate, { weekStartsOn: 1 });

    return loggedItems.filter((item) =>
      isWithinInterval(item.date, { start: weekStart, end: weekEnd })
    );
  };

  const getLoggedItemsForDate = (date: Date) => {
    // Filter items for the specific date, ensuring we only return items for that exact date
    const targetDateString = date.toDateString();

    const filteredItems = loggedItems.filter((item) => {
      const itemDateString = item.date.toDateString();
      return itemDateString === targetDateString;
    });

    return filteredItems;
  };

  return (
    <FoodContext.Provider
      value={{
        loggedItems,
        pastFoodItems, // Now dynamically computed from Supabase or fallback
        selectedDate,
        addLoggedItems,
        removeLoggedItem,
        updateLoggedItemQuantity,
        setSelectedDate,
        getLoggedItemsForDate,
        getWeekData,
        refreshLoggedItemsFromDatabase,
      }}
    >
      {children}
    </FoodContext.Provider>
  );
}

export function useFoodContext() {
  const context = useContext(FoodContext);
  if (context === undefined) {
    throw new Error("useFoodContext must be used within a FoodProvider");
  }
  return context;
}
