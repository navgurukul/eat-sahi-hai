import { Clock, CheckCircle } from "lucide-react";
import { useFastContext } from "@/contexts/FastContext";
import { format } from "date-fns";
import { useEffect, useRef } from "react";
import type { FastLogItem } from "@/lib/userFastService";


interface FastHistoryProps {
  selectedDate: Date;
}

export function FastHistory({ selectedDate }: FastHistoryProps) {
  const { getFastsForDate, fastHistory, fastState } = useFastContext();
  const previousHistoryLength = useRef(fastHistory.length);

  // Only update when history actually changes (new fast added/removed)
  useEffect(() => {
    if (fastHistory.length !== previousHistoryLength.current) {
      console.log("[FastHistory] History length changed:", previousHistoryLength.current, "→", fastHistory.length);
      previousHistoryLength.current = fastHistory.length;
    }
  }, [fastHistory.length]);

  const fastsForDate = getFastsForDate(selectedDate);

  function formatDuration(totalSeconds) {
  // Convert to number safely
  totalSeconds = Number(totalSeconds);

  // If invalid → treat as 0
  if (isNaN(totalSeconds) || totalSeconds < 0) totalSeconds = 0;

  totalSeconds = Math.floor(totalSeconds);

  const days = Math.floor(totalSeconds / 86400);
  totalSeconds %= 86400;

  const hours = Math.floor(totalSeconds / 3600);
  totalSeconds %= 3600;

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  let result = [];

  if (days > 0) result.push(`${days} day${days > 1 ? 's' : ''}`);
  if (hours > 0) result.push(`${hours} hr`);
  if (minutes > 0) result.push(`${minutes} min`);
  if (seconds > 0 || result.length === 0) result.push(`${seconds} sec`);

  return result.join(" ");
}



  // Only show Fast History when there are actual fasts (active or completed)
  if (fastsForDate.length === 0) {
    return null;
  }

function getDurationInSeconds(fast: FastLogItem) {
  // Active fast → from state
  if (fast.isActive) {
    return fastState?.elapsedTime ?? 0;
  }

  // Completed fast
  if (!fast.startTime || !fast.endTime) return 0;

  const start = new Date(fast.startTime).getTime();
  const end = new Date(fast.endTime).getTime();

  const diff = Math.floor((end - start) / 1000);

  return diff > 0 ? diff : 0;
}


  return (
    <div className="space-y-4">
      <h3 className="text-lg font-fredoka font-medium text-foreground">
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
                  <span className="font-fredoka font-medium text-foreground">
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
                    {formatDuration(getDurationInSeconds(fast))}

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
                    {formatDuration(getDurationInSeconds(fast))}

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
