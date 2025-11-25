import { cn } from "@/lib/utils";

interface DateSelectorProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

export function DateSelector({
  selectedDate,
  onDateSelect,
}: DateSelectorProps) {
  const generateScrollableDates = () => {
    const dates = [];
    const today = new Date();

    // Generate past 30 days + today (no future dates)
    for (let i = 30; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      dates.push(date);
    }
    return dates;
  };

  const scrollableDates = generateScrollableDates();
  const today = new Date();

  const formatSelectedDate = () => {
    const dayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const dayName = dayNames[selectedDate.getDay()];
    const month = monthNames[selectedDate.getMonth()];
    const date = selectedDate.getDate();

    return `${dayName}, ${month} ${date}`;
  };

  const isSameDate = (date1: Date, date2: Date) => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  return (
    <div className="sticky top-0 z-50 bg-white border-b border-border/20 pb-4 shadow-sm">
      {/* Current Date Display */}
      <div className="text-center mb-4">
        <h2 className="text-xl font-fredoka font-medium text-foreground">
          {formatSelectedDate()}
        </h2>
      </div>

      {/* Date Selection - Horizontal Scroll with Circular Buttons */}
      <div
        className="flex items-center gap-2 overflow-x-auto px-2 pb-2 scrollbar-hide"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >

        {scrollableDates.map((date, index) => {
          const isSelected = isSameDate(date, selectedDate);
          const isToday = isSameDate(date, today);

          return (
            <button
              key={index}
              onClick={() => onDateSelect(date)}
              className={cn(
                "flex flex-col items-center justify-center min-w-[48px] transition-all duration-300 flex-shrink-0",
                "font-quicksand hover:scale-105"
              )}
            >
              {/* Weekday Label */}
              <span className="text-xs font-bold text-muted-foreground mb-1">
                {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"][date.getDay()]}
              </span>

              {/* Circular Date Button */}
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
                  "relative",
                  isSelected && [
                    "bg-primary text-primary-foreground font-bold shadow-lg",
                    "ring-2 ring-primary/20",
                  ],
                  !isSelected && [
                    "border-2 border-dashed border-primary/40 text-foreground",
                    "hover:border-primary/60 hover:bg-primary/5",
                  ],
                  isToday && !isSelected && "border-primary/60 border-solid"
                )}
              >
                <span className={cn("text-base font-bold")}>
                  {date.getDate()}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
