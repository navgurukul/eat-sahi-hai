import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface LoggedFoodItem {
  id: string;
  name: string;
  quantity: number;
  portion: "bowl" | "plate" | "cup" | "piece";
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  glycemicLoad: number;
  time: string;
  date: string;
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
  portion: "bowl" | "plate" | "cup" | "piece";
  quantity: number;
}

interface FoodContextType {
  loggedItems: LoggedFoodItem[];
  pastFoodItems: SelectedFoodItem[];
  selectedDate: Date;
  addLoggedItems: (items: SelectedFoodItem[], date: Date) => void;
  removeLoggedItem: (id: string) => void;
  updateLoggedItemQuantity: (id: string, quantity: number) => void;
  setSelectedDate: (date: Date) => void;
  getLoggedItemsForDate: (date: Date) => LoggedFoodItem[];
}

const FoodContext = createContext<FoodContextType | undefined>(undefined);

export function FoodProvider({ children }: { children: ReactNode }) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [loggedItems, setLoggedItems] = useState<LoggedFoodItem[]>([
    // Mock data to show how it looks for today
    {
      id: "mock-1",
      name: "Roti",
      quantity: 2,
      portion: "piece",
      calories: 160,
      protein: 6,
      carbs: 30,
      fat: 2,
      glycemicLoad: 15,
      time: "10 minutes ago",
      date: new Date().toDateString()
    },
    {
      id: "mock-2", 
      name: "Dal",
      quantity: 1,
      portion: "bowl",
      calories: 120,
      protein: 8,
      carbs: 18,
      fat: 1,
      glycemicLoad: 10,
      time: "15 minutes ago",
      date: new Date().toDateString()
    }
  ]);

  // Past food items for quick selection
  const [pastFoodItems] = useState<SelectedFoodItem[]>([
    { id: "past-1", name: "Roti", calories: 80, protein: 3, carbs: 15, fat: 1, glycemicLoad: 8, emoji: "🫓", category: "staple", portion: "piece", quantity: 1 },
    { id: "past-2", name: "Dal", calories: 120, protein: 8, carbs: 18, fat: 1, glycemicLoad: 10, emoji: "🫘", category: "protein", portion: "bowl", quantity: 1 },
    { id: "past-3", name: "Chawal", calories: 150, protein: 3, carbs: 32, fat: 0.5, glycemicLoad: 20, emoji: "🍚", category: "staple", portion: "plate", quantity: 1 },
    { id: "past-4", name: "Sabzi", calories: 90, protein: 4, carbs: 12, fat: 3, glycemicLoad: 5, emoji: "🥬", category: "vegetable", portion: "bowl", quantity: 1 },
    { id: "past-5", name: "Chai", calories: 80, protein: 2, carbs: 10, fat: 3, glycemicLoad: 6, emoji: "🫖", category: "beverage", portion: "cup", quantity: 1 },
    { id: "past-6", name: "Paratha", calories: 200, protein: 5, carbs: 25, fat: 8, glycemicLoad: 12, emoji: "🫓", category: "staple", portion: "piece", quantity: 1 },
    { id: "past-7", name: "Curd", calories: 60, protein: 3, carbs: 4, fat: 3, glycemicLoad: 2, emoji: "🥛", category: "dairy", portion: "bowl", quantity: 1 },
    { id: "past-8", name: "Aloo Gobi", calories: 110, protein: 3, carbs: 18, fat: 4, glycemicLoad: 8, emoji: "🥔", category: "vegetable", portion: "plate", quantity: 1 },
    { id: "past-9", name: "Rajma", calories: 140, protein: 10, carbs: 20, fat: 2, glycemicLoad: 12, emoji: "🫘", category: "protein", portion: "bowl", quantity: 1 },
    { id: "past-10", name: "Roti with Ghee", calories: 120, protein: 3, carbs: 15, fat: 5, glycemicLoad: 10, emoji: "🫓", category: "staple", portion: "piece", quantity: 1 }
  ]);

  const addLoggedItems = (items: SelectedFoodItem[], date: Date) => {
    const newLoggedItems: LoggedFoodItem[] = items.map(item => ({
      id: `logged-${item.id}-${Date.now()}-${Math.random()}`,
      name: item.name,
      quantity: item.quantity,
      portion: item.portion,
      calories: item.calories * item.quantity,
      protein: item.protein * item.quantity,
      carbs: item.carbs * item.quantity,
      fat: item.fat * item.quantity,
      glycemicLoad: item.glycemicLoad * item.quantity,
      time: "Just now",
      date: date.toDateString()
    }));

    setLoggedItems(prev => [...newLoggedItems, ...prev]);
  };

  const removeLoggedItem = (id: string) => {
    setLoggedItems(prev => prev.filter(item => item.id !== id));
  };

  const updateLoggedItemQuantity = (id: string, quantity: number) => {
    setLoggedItems(prev => prev.map(item => {
      if (item.id === id) {
        const baseCalories = item.calories / item.quantity;
        const baseProtein = item.protein / item.quantity;
        const baseCarbs = item.carbs / item.quantity;
        const baseFat = item.fat / item.quantity;
        const baseGlycemicLoad = item.glycemicLoad / item.quantity;
        
        return {
          ...item,
          quantity,
          calories: baseCalories * quantity,
          protein: baseProtein * quantity,
          carbs: baseCarbs * quantity,
          fat: baseFat * quantity,
          glycemicLoad: baseGlycemicLoad * quantity,
        };
      }
      return item;
    }));
  };

  const getLoggedItemsForDate = (date: Date) => {
    return loggedItems.filter(item => item.date === date.toDateString());
  };

  return (
    <FoodContext.Provider value={{ 
      loggedItems, 
      pastFoodItems,
      selectedDate,
      addLoggedItems, 
      removeLoggedItem, 
      updateLoggedItemQuantity,
      setSelectedDate,
      getLoggedItemsForDate
    }}>
      {children}
    </FoodContext.Provider>
  );
}

export function useFoodContext() {
  const context = useContext(FoodContext);
  if (context === undefined) {
    throw new Error('useFoodContext must be used within a FoodProvider');
  }
  return context;
}