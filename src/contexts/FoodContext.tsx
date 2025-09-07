import React, { createContext, useContext, useState } from 'react';
import { startOfWeek, endOfWeek, isWithinInterval, subWeeks } from 'date-fns';

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
  addLoggedItems: (items: SelectedFoodItem[], date: Date) => void;
  removeLoggedItem: (id: string) => void;
  updateLoggedItemQuantity: (id: string, quantity: number) => void;
  setSelectedDate: (date: Date) => void;
  getLoggedItemsForDate: (date: Date) => LoggedFoodItem[];
  getWeekData: (weekDate: Date) => LoggedFoodItem[];
}

const FoodContext = createContext<FoodContextType | undefined>(undefined);

export function FoodProvider({ children }: { children: React.ReactNode }) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  // Mock data for logged items - current week (incomplete) and previous week (complete)
  const [loggedItems, setLoggedItems] = useState<LoggedFoodItem[]>([
    // Current week - only today's data
    {
      id: '1',
      name: 'Roti',
      emoji: '🫓',
      category: 'Grains',
      portion: '1 piece',
      quantity: 2,
      calories: 154,
      protein: 5.5,
      carbs: 29.4,
      fat: 2.3,
      glycemicLoad: 25,
      time: '08:30',
      date: new Date(),
    },
    {
      id: '2',
      name: 'Dal',
      emoji: '🍛',
      category: 'Legumes',
      portion: '1 bowl',
      quantity: 1,
      calories: 198,
      protein: 14.5,
      carbs: 32.1,
      fat: 1.2,
      glycemicLoad: 15,
      time: '13:15',
      date: new Date(),
    },
    // Previous week - complete data
    ...Array.from({ length: 7 }, (_, dayIndex) => {
      const date = new Date();
      date.setDate(date.getDate() - (7 + dayIndex));
      
      return [
        {
          id: `prev-${dayIndex}-1`,
          name: 'Paratha',
          emoji: '🥞',
          category: 'Grains',
          portion: '1 piece',
          quantity: 1,
          calories: 250 + Math.random() * 50,
          protein: 8 + Math.random() * 4,
          carbs: 35 + Math.random() * 10,
          fat: 8 + Math.random() * 4,
          glycemicLoad: 40 + Math.random() * 30,
          time: '08:00',
          date,
        },
        {
          id: `prev-${dayIndex}-2`,
          name: 'Chicken Curry',
          emoji: '🍛',
          category: 'Protein',
          portion: '1 serving',
          quantity: 1,
          calories: 300 + Math.random() * 100,
          protein: 25 + Math.random() * 10,
          carbs: 15 + Math.random() * 10,
          fat: 12 + Math.random() * 8,
          glycemicLoad: 20 + Math.random() * 20,
          time: '13:00',
          date,
        },
        {
          id: `prev-${dayIndex}-3`,
          name: 'Rice',
          emoji: '🍚',
          category: 'Grains',
          portion: '1 cup',
          quantity: 1,
          calories: 200 + Math.random() * 50,
          protein: 4 + Math.random() * 2,
          carbs: 45 + Math.random() * 10,
          fat: 1 + Math.random() * 2,
          glycemicLoad: 50 + Math.random() * 30,
          time: '20:00',
          date,
        },
      ];
    }).flat(),
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
      emoji: item.emoji,
      category: item.category,
      portion: item.portion,
      quantity: item.quantity,
      calories: item.calories * item.quantity,
      protein: item.protein * item.quantity,
      carbs: item.carbs * item.quantity,
      fat: item.fat * item.quantity,
      glycemicLoad: item.glycemicLoad * item.quantity,
      time: "Just now",
      date: date
    }));

    setLoggedItems(prev => [...newLoggedItems, ...prev]);
  };

  const removeLoggedItem = (id: string) => {
    setLoggedItems(items => items.filter(item => item.id !== id));
  };

  const updateLoggedItemQuantity = (id: string, quantity: number) => {
    setLoggedItems(items =>
      items.map(item =>
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
    
    return loggedItems.filter(item => 
      isWithinInterval(item.date, { start: weekStart, end: weekEnd })
    );
  };

  const getLoggedItemsForDate = (date: Date) => {
    return loggedItems.filter(item => 
      item.date.toDateString() === date.toDateString()
    );
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
      getLoggedItemsForDate,
      getWeekData,
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