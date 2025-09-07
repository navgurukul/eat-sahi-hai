import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format, startOfWeek, endOfWeek, addWeeks, subWeeks } from "date-fns";

interface WeekNavigatorProps {
  currentWeek: Date;
  onWeekChange: (week: Date) => void;
}

export function WeekNavigator({ currentWeek, onWeekChange }: WeekNavigatorProps) {
  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 1 });
  
  const isCurrentWeek = () => {
    const now = new Date();
    const thisWeekStart = startOfWeek(now, { weekStartsOn: 1 });
    return weekStart.getTime() === thisWeekStart.getTime();
  };

  const navigatePrevious = () => {
    onWeekChange(subWeeks(currentWeek, 1));
  };

  const navigateNext = () => {
    if (!isCurrentWeek()) {
      onWeekChange(addWeeks(currentWeek, 1));
    }
  };

  return (
    <div className="flex items-center justify-between py-4 px-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={navigatePrevious}
        className="h-8 w-8 p-0"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      <div className="text-center">
        <h3 className="font-fredoka text-lg text-foreground">
          {format(weekStart, 'dd MMM yyyy')} to {format(weekEnd, 'dd MMM yyyy')}
        </h3>
      </div>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={navigateNext}
        disabled={isCurrentWeek()}
        className="h-8 w-8 p-0 disabled:opacity-50"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}