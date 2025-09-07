import { cn } from "@/lib/utils";

interface DateSelectorProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

export function DateSelector({ selectedDate, onDateSelect }: DateSelectorProps) {
  const generatePast7Days = () => {
    const dates = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      dates.push(date);
    }
    return dates;
  };

  const past7Days = generatePast7Days();
  const today = new Date();

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

      {/* Date Selection - Horizontal Scroll */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide px-2">
        {past7Days.map((date, index) => {
          const isSelected = isSameDate(date, selectedDate);
          const isToday = isSameDate(date, today);
          
          return (
            <button
              key={index}
              onClick={() => onDateSelect(date)}
              className={cn(
                "flex flex-col items-center justify-center min-w-[48px] h-16 rounded-xl transition-all duration-200 flex-shrink-0",
                "font-quicksand text-sm",
                isSelected && "bg-primary text-primary-foreground shadow-md scale-105",
                !isSelected && "bg-card hover:bg-accent/10 text-card-foreground",
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
    </div>
  );
}