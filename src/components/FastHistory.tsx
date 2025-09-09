import { Clock, CheckCircle } from "lucide-react";
import { useFastContext } from "@/contexts/FastContext";
import { format } from "date-fns";
import { useEffect, useRef } from "react";

interface FastHistoryProps {
  selectedDate: Date;
}

export function FastHistory({ selectedDate }: FastHistoryProps) {
  const { getFastsForDate, fastHistory } = useFastContext();
  const previousHistoryLength = useRef(fastHistory.length);

  // Only update when history actually changes (new fast added/removed)
  useEffect(() => {
    if (fastHistory.length !== previousHistoryLength.current) {
      console.log("[FastHistory] History length changed:", previousHistoryLength.current, "→", fastHistory.length);
      previousHistoryLength.current = fastHistory.length;
    }
  }, [fastHistory.length]);

  const fastsForDate = getFastsForDate(selectedDate);

  const formatDuration = (minutes: number | null): string => {
    if (!minutes) return "N/A";

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (hours === 0) {
      return `${remainingMinutes}m`;
    } else if (remainingMinutes === 0) {
      return `${hours}h`;
    } else {
      return `${hours}h ${remainingMinutes}m`;
    }
  };

  // Only show Fast History when there are actual fasts (active or completed)
  if (fastsForDate.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-fredoka font-semibold text-foreground">
        Fast History - {format(selectedDate, "MMM d, yyyy")}
      </h3>

      <div className="space-y-3">
        {fastsForDate.map((fast) => (
          <div
            key={fast.id}
            className="bg-card p-4 rounded-xl border border-border/50 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {fast.isActive ? (
                    <Clock className="h-4 w-4 text-primary" />
                  ) : (
                    <CheckCircle className="h-4 w-4 text-success" />
                  )}
                  <span className="font-fredoka font-semibold text-foreground">
                    {fast.isActive ? "Active Fast" : "Completed Fast"}
                  </span>
                </div>

                <div className="text-sm text-muted-foreground space-y-1">
                  <div>
                    <strong>Started:</strong> {format(fast.startTime, "h:mm a")}
                  </div>
                  {fast.endTime && (
                    <div>
                      <strong>Ended:</strong> {format(fast.endTime, "h:mm a")}
                    </div>
                  )}
                  <div>
                    <strong>Duration:</strong>{" "}
                    {formatDuration(fast.durationMinutes)}
                  </div>
                  {fast.notes && (
                    <div>
                      <strong>Notes:</strong> {fast.notes}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-end gap-1">
                <div className="text-right">
                  <p className="text-lg font-fredoka font-bold text-primary">
                    {formatDuration(fast.durationMinutes)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {fast.fastType}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
