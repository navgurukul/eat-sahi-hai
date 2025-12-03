// contexts/UserPreferencesContext.tsx
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface MacroPreferences {
  protein: number; // as percentage of total calories
  carbs: number;   // as percentage of total calories
  fat: number;     // as percentage of total calories
}

interface SugarPreferences {
  mode: 'percentage' | 'grams';
  percentage: number; // When mode is 'percentage'
  grams: number;      // When mode is 'grams'
}

interface UserPreferences {
  macroSplit: MacroPreferences;
  customMacroTargets?: {
    protein: number; // in grams
    carbs: number;   // in grams
    fat: number;     // in grams
  };
  useCustomTargets: boolean; // flag to use custom gram targets instead of percentages
  sugarPreferences: SugarPreferences;
}

const defaultMacroSplit: MacroPreferences = {
  protein: 25,  // 25% of calories
  carbs: 45,    // 45% of calories
  fat: 30       // 30% of calories
};

const defaultPreferences: UserPreferences = {
  macroSplit: defaultMacroSplit,
  useCustomTargets: false,
  sugarPreferences: {
    mode: 'percentage',
    percentage: 10, // WHO recommendation: 10% of calories
    grams: 50 // Default grams for 2000 calories: (2000 * 0.1) / 4 = 50g
  }
};

interface UserPreferencesContextType {
  preferences: UserPreferences;
  updateMacroSplit: (split: MacroPreferences) => void;
  updateCustomTargets: (targets: { protein: number; carbs: number; fat: number }) => void;
  toggleUseCustomTargets: (useCustom: boolean) => void;
  validateMacroSplit: (split: MacroPreferences) => boolean;
  calculateMacroFromCalories: (calories: number) => { protein: number; carbs: number; fat: number };
  updateSugarPreferences: (prefs: SugarPreferences) => void;
  calculateSugarTarget: (calories: number) => number;
}

const UserPreferencesContext = createContext<UserPreferencesContextType | undefined>(undefined);

export function UserPreferencesProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    // Load from localStorage if available
    const saved = localStorage.getItem('userMacroPreferences');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Ensure backward compatibility - add sugarPreferences if missing
      if (!parsed.sugarPreferences) {
        parsed.sugarPreferences = defaultPreferences.sugarPreferences;
      }
      return parsed;
    }
    return defaultPreferences;
  });

  // Save to localStorage when preferences change
  useEffect(() => {
    localStorage.setItem('userMacroPreferences', JSON.stringify(preferences));
  }, [preferences]);

  const validateMacroSplit = (split: MacroPreferences): boolean => {
    const total = split.protein + split.carbs + split.fat;
    return total === 100 && split.protein >= 0 && split.carbs >= 0 && split.fat >= 0;
  };

  const updateMacroSplit = (split: MacroPreferences) => {
    if (validateMacroSplit(split)) {
      setPreferences(prev => ({
        ...prev,
        macroSplit: split,
        useCustomTargets: false // Auto-switch to percentage mode
      }));
    }
  };

  const updateCustomTargets = (targets: { protein: number; carbs: number; fat: number }) => {
    setPreferences(prev => ({
      ...prev,
      customMacroTargets: targets,
      useCustomTargets: true
    }));
  };

  const toggleUseCustomTargets = (useCustom: boolean) => {
    setPreferences(prev => ({
      ...prev,
      useCustomTargets: useCustom
    }));
  };

  const updateSugarPreferences = (prefs: SugarPreferences) => {
    setPreferences(prev => ({
      ...prev,
      sugarPreferences: prefs
    }));
  };

  const calculateMacroFromCalories = (calories: number) => {
    if (preferences.useCustomTargets && preferences.customMacroTargets) {
      // Use custom gram targets
      return preferences.customMacroTargets;
    } else {
      // Calculate from percentages
      return {
        protein: Math.round((calories * preferences.macroSplit.protein / 100) / 4),
        carbs: Math.round((calories * preferences.macroSplit.carbs / 100) / 4),
        fat: Math.round((calories * preferences.macroSplit.fat / 100) / 9)
      };
    }
  };

  const calculateSugarTarget = (calories: number) => {
    // Safe destructuring with default values
    const { mode, percentage, grams } = preferences.sugarPreferences || defaultPreferences.sugarPreferences;
    
    if (mode === 'percentage') {
      // Calculate grams from percentage
      return Math.round((calories * percentage / 100) / 4);
    } else {
      // Use fixed grams
      return grams;
    }
  };

  return (
    <UserPreferencesContext.Provider value={{
      preferences,
      updateMacroSplit,
      updateCustomTargets,
      toggleUseCustomTargets,
      validateMacroSplit,
      calculateMacroFromCalories,
      updateSugarPreferences,
      calculateSugarTarget
    }}>
      {children}
    </UserPreferencesContext.Provider>
  );
}

export function useUserPreferences() {
  const context = useContext(UserPreferencesContext);
  if (context === undefined) {
    throw new Error('useUserPreferences must be used within a UserPreferencesProvider');
  }
  return context;
}