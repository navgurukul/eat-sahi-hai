import { useQuery } from "@tanstack/react-query";
import { FoodService } from "@/lib/foodService";
import { SelectedFoodItem } from "@/contexts/FoodContext";
import { useState, useEffect } from "react";

// Custom hook for debounced search
export const useDebounce = (value: string, delay: number): string => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Custom hook for food search
export const useFoodSearch = (query: string, enabled: boolean = true) => {
  const debouncedQuery = useDebounce(query, 300); // 300ms debounce

  return useQuery({
    queryKey: ["foodSearch", debouncedQuery],
    queryFn: () => FoodService.searchFoods(debouncedQuery),
    enabled: enabled && debouncedQuery.length >= 0, // Enable for any input including empty
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });
};

// Custom hook for recommended foods
export const useRecommendedFoods = () => {
  return useQuery({
    queryKey: ["recommendedFoods"],
    queryFn: () => FoodService.getRecommendedFoods(),
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
  });
};

// Custom hook for all foods (fallback)
export const useAllFoods = () => {
  return useQuery({
    queryKey: ["allFoods"],
    queryFn: () => FoodService.getAllFoods(),
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 2 * 60 * 60 * 1000, // 2 hours
  });
};
