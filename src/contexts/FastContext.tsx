import React, { createContext, useContext, useState, useEffect } from 'react';

export interface FastType {
  id: string;
  name: string;
  duration: number; // in hours
  description: string;
}

export interface FastState {
  isActive: boolean;
  startTime: Date | null;
  endTime: Date | null;
  currentType: FastType;
  remainingTime: number; // in seconds
}

interface FastContextType {
  fastState: FastState;
  fastTypes: FastType[];
  startFast: (type: FastType) => void;
  stopFast: () => void;
  setFastType: (type: FastType) => void;
}

const defaultFastTypes: FastType[] = [
  { id: '12-12', name: '12:12 Fast', duration: 12, description: '12 hours fasting, 12 hours eating' },
  { id: '16-8', name: '16:8 Fast', duration: 16, description: '16 hours fasting, 8 hours eating' },
  { id: '1-day', name: '1 Day Fast', duration: 24, description: '24 hours of fasting' },
  { id: '3-day', name: '3 Day Fast', duration: 72, description: '72 hours of fasting' },
  { id: '5-day', name: '5 Day Fast', duration: 120, description: '120 hours of fasting' },
];

const FastContext = createContext<FastContextType | undefined>(undefined);

export function FastProvider({ children }: { children: React.ReactNode }) {
  const [fastState, setFastState] = useState<FastState>({
    isActive: false,
    startTime: null,
    endTime: null,
    currentType: defaultFastTypes[1], // Default to 16:8
    remainingTime: 0,
  });

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (fastState.isActive && fastState.endTime) {
      interval = setInterval(() => {
        const now = new Date();
        const remaining = Math.max(0, fastState.endTime!.getTime() - now.getTime());
        
        if (remaining === 0) {
          setFastState(prev => ({
            ...prev,
            isActive: false,
            remainingTime: 0,
          }));
        } else {
          setFastState(prev => ({
            ...prev,
            remainingTime: Math.floor(remaining / 1000),
          }));
        }
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [fastState.isActive, fastState.endTime]);

  const startFast = (type: FastType) => {
    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + type.duration * 60 * 60 * 1000);
    
    setFastState({
      isActive: true,
      startTime,
      endTime,
      currentType: type,
      remainingTime: type.duration * 60 * 60,
    });
  };

  const stopFast = () => {
    setFastState(prev => ({
      ...prev,
      isActive: false,
      startTime: null,
      endTime: null,
      remainingTime: 0,
    }));
  };

  const setFastType = (type: FastType) => {
    setFastState(prev => ({
      ...prev,
      currentType: type,
    }));
  };

  return (
    <FastContext.Provider value={{
      fastState,
      fastTypes: defaultFastTypes,
      startFast,
      stopFast,
      setFastType,
    }}>
      {children}
    </FastContext.Provider>
  );
}

export function useFastContext() {
  const context = useContext(FastContext);
  if (context === undefined) {
    throw new Error('useFastContext must be used within a FastProvider');
  }
  return context;
}