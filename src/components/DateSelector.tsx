import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DateSelectorProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

export function DateSelector({ selectedDate, onDateSelect }: DateSelectorProps) {
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(() => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - dayOfWeek);
    return startOfWeek;
  });

  const generateWeekDates = (startDate: Date) => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const weekDates = generateWeekDates(currentWeekStart);
  const today = new Date();

  const goToPreviousWeek = () => {
    const newWeekStart = new Date(currentWeekStart);
    newWeekStart.setDate(currentWeekStart.getDate() - 7);
    setCurrentWeekStart(newWeekStart);
  };

  const goToNextWeek = () => {
    const newWeekStart = new Date(currentWeekStart);
    newWeekStart.setDate(currentWeekStart.getDate() + 7);
    setCurrentWeekStart(newWeekStart);
  };

  const formatSelectedDate = () => {
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const dayName = dayNames[selectedDate.getDay()];
    const month = monthNames[selectedDate.getMonth()];
    const date = selectedDate.getDate();
    
    return `${dayName}, ${month} ${date}`;
  };

  const isSameDate = (date1: Date, date2: Date) => {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  };

  const isDateDisabled = (date: Date) => {
    return date > today;
  };

  const canGoNext = () => {
    const nextWeekStart = new Date(currentWeekStart);
    nextWeekStart.setDate(currentWeekStart.getDate() + 7);
    return nextWeekStart <= today;
  };

  return (
    <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/50 pb-4">
      {/* Current Date Display */}
      <div className="text-center mb-4">
        <h2 className="text-xl font-fredoka font-semibold text-foreground">
          {formatSelectedDate()}
        </h2>
        <p className="text-sm text-muted-foreground font-quicksand">
          Khana Log
        </p>
      </div>

      {/* Week Navigation */}
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={goToPreviousWeek}
          className="h-8 w-8 p-0 rounded-full"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
          {weekDates.map((date, index) => {
            const isSelected = isSameDate(date, selectedDate);
            const isToday = isSameDate(date, today);
            const isDisabled = isDateDisabled(date);
            
            return (
              <button
                key={index}
                onClick={() => !isDisabled && onDateSelect(date)}
                disabled={isDisabled}
                className={cn(
                  "flex flex-col items-center justify-center min-w-[48px] h-16 rounded-xl transition-all duration-200",
                  "font-quicksand text-sm",
                  isSelected && "bg-primary text-primary-foreground shadow-md scale-105",
                  !isSelected && !isDisabled && "bg-card hover:bg-accent/10 text-card-foreground",
                  isDisabled && "bg-muted text-muted-foreground cursor-not-allowed opacity-50",
                  isToday && !isSelected && "ring-2 ring-primary/30"
                )}
              >
                <span className="text-xs font-medium">
                  {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'][date.getDay()]}
                </span>
                <span className="text-lg font-semibold">
                  {date.getDate()}
                </span>
              </button>
            );
          })}
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={goToNextWeek}
          disabled={!canGoNext()}
          className="h-8 w-8 p-0 rounded-full disabled:opacity-50"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}