import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface LoggedFoodItem {
  id: string;
  name: string;
  quantity: string;
  portion: "thoda-sa" | "bharpet" | "zyada";
  calories: number;
  time: string;
}

export interface SelectedFoodItem {
  id: string;
  name: string;
  calories: number;
  emoji: string;
  category: string;
}

interface FoodContextType {
  loggedItems: LoggedFoodItem[];
  addLoggedItems: (items: SelectedFoodItem[]) => void;
  removeLoggedItem: (id: string) => void;
}

const FoodContext = createContext<FoodContextType | undefined>(undefined);

export function FoodProvider({ children }: { children: ReactNode }) {
  const [loggedItems, setLoggedItems] = useState<LoggedFoodItem[]>([
    // Mock data to show how it looks
    {
      id: "mock-1",
      name: "Roti",
      quantity: "2 piece",
      portion: "bharpet",
      calories: 160,
      time: "10 minutes ago"
    },
    {
      id: "mock-2", 
      name: "Dal",
      quantity: "1 bowl",
      portion: "bharpet",
      calories: 120,
      time: "15 minutes ago"
    }
  ]);

  const addLoggedItems = (items: SelectedFoodItem[]) => {
    const newLoggedItems: LoggedFoodItem[] = items.map(item => ({
      id: `logged-${item.id}-${Date.now()}`,
      name: item.name,
      quantity: "1 plate",
      portion: "bharpet" as const,
      calories: item.calories,
      time: "Just now"
    }));

    setLoggedItems(prev => [...newLoggedItems, ...prev]);
  };

  const removeLoggedItem = (id: string) => {
    setLoggedItems(prev => prev.filter(item => item.id !== id));
  };

  return (
    <FoodContext.Provider value={{ loggedItems, addLoggedItems, removeLoggedItem }}>
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