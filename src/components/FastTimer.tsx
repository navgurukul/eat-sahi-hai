import { Play, Square, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProgressRing } from "@/components/ui/progress-ring";
import { useFastContext } from "@/contexts/FastContext";
import { format } from "date-fns";

interface FastTimerProps {
  selectedDate?: Date;
}

export function FastTimer({ selectedDate = new Date() }: FastTimerProps) {
  const { fastState, startFast, stopFast, getFastsForDate } = useFastContext();

  const formatTime = (seconds: number): string => {
    if (seconds <= 0) return "00:00:00";

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const formatDuration = (minutes: number): string => {
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

  // Calculate progress based on elapsed time (gradual progress)
  const getProgressPercentage = (): number => {
    if (!fastState.isActive || fastState.elapsedTime === 0) return 0;

    // Progressive increase: 1% per minute for first 60 minutes, then slower
    const minutes = fastState.elapsedTime / 60;

    if (minutes <= 60) {
      // 1% per minute for first hour
      return Math.min(minutes, 60);
    } else if (minutes <= 240) {
      // 0.5% per minute for hours 1-4 (additional 30%)
      return 60 + (minutes - 60) * 0.5;
    } else {
      // 0.25% per minute after 4 hours (slower progress)
      return 90 + (minutes - 240) * 0.25;
    }
  };

  const handleStartStop = async () => {
    if (fastState.isActive) {
      await stopFast();
    } else {
      await startFast(selectedDate);
    }
  };

  const elapsedTime = fastState.elapsedTime;
  const progressPercentage = getProgressPercentage();

  // Get completed fasts for today to show last completed duration
  const todaysFasts = getFastsForDate(new Date());
  const lastCompletedFast = todaysFasts.find(
    (fast) => !fast.isActive && fast.durationMinutes
  );

  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      {/* Large Circular Timer */}
      <div className="relative">
        <ProgressRing
          value={progressPercentage}
          max={100}
          size={220}
          strokeWidth={16}
          color="calories"
          className="drop-shadow-lg"
        >
          <div className="text-center">
            <div className="text-2xl font-fredoka text-foreground mb-1">
              {fastState.isActive ? formatTime(elapsedTime) : "Ready to Fast"}
            </div>
          </div>
        </ProgressRing>
      </div>

      {/* Timer Info */}
      {fastState.isActive && fastState.startTime && (
        <div className="text-center space-y-2">
          <div className="text-sm text-muted-foreground">
            Started at {format(fastState.startTime, "h:mm a")}
          </div>
          <div className="text-xs text-primary font-medium">
            Keep going! Duration: {formatDuration(Math.floor(elapsedTime / 60))}
          </div>
        </div>
      )}

      {/* Control Button */}
      <div className="flex space-x-4">
        <Button
          onClick={handleStartStop}
          size="lg"
          className={`px-8 py-3 font-baloo font-medium ${
            fastState.isActive
              ? "bg-destructive hover:bg-destructive/90 text-destructive-foreground"
              : "bg-primary hover:bg-primary/90 text-primary-foreground"
          }`}
        >
          {fastState.isActive ? (
            <>
              <Square className="h-5 w-5 mr-2" />
              Stop Fast
            </>
          ) : (
            <>
              <Play className="h-5 w-5 mr-2" />
              Start Fast
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
