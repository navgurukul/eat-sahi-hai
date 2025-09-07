import { Play, Pause, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProgressRing } from "@/components/ui/progress-ring";
import { useFastContext } from "@/contexts/FastContext";
import { format } from "date-fns";

export function FastTimer() {
  const { fastState, startFast, stopFast } = useFastContext();
  
  const formatTime = (seconds: number): string => {
    if (seconds <= 0) return "00:00:00";
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getProgress = (): number => {
    if (!fastState.isActive || !fastState.startTime || !fastState.endTime) return 0;
    
    const totalDuration = fastState.endTime.getTime() - fastState.startTime.getTime();
    const elapsed = Date.now() - fastState.startTime.getTime();
    
    return Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
  };

  const handleStartStop = () => {
    if (fastState.isActive) {
      stopFast();
    } else {
      startFast(fastState.currentType);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8">
      {/* Large Circular Timer */}
      <div className="relative">
        <ProgressRing
          value={getProgress()}
          max={100}
          size={200}
          strokeWidth={12}
          color="calories"
          className="drop-shadow-lg"
        >
          <div className="text-center">
            <div className="text-2xl font-fredoka text-foreground mb-1">
              {fastState.isActive ? formatTime(fastState.remainingTime) : "Ready to Fast"}
            </div>
            {fastState.isActive && (
              <div className="text-sm text-muted-foreground">
                {Math.round(getProgress())}% Complete
              </div>
            )}
          </div>
        </ProgressRing>
      </div>

      {/* Timer Info */}
      {fastState.isActive && fastState.startTime && fastState.endTime && (
        <div className="text-center space-y-2">
          <div className="grid grid-cols-2 gap-6 text-sm">
            <div>
              <p className="text-muted-foreground">Started</p>
              <p className="font-semibold">
                {format(fastState.startTime, 'h:mm a')}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Ends at</p>
              <p className="font-semibold">
                {format(fastState.endTime, 'h:mm a')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Control Buttons */}
      <div className="flex space-x-4">
        <Button
          onClick={handleStartStop}
          size="lg"
          className={`px-8 py-3 font-baloo font-semibold ${
            fastState.isActive 
              ? 'bg-destructive hover:bg-destructive/90 text-destructive-foreground' 
              : 'bg-primary hover:bg-primary/90 text-primary-foreground'
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

      {/* Fast Type Info */}
      <div className="text-center">
        <p className="text-lg font-fredoka text-foreground">
          {fastState.currentType.name}
        </p>
        <p className="text-sm text-muted-foreground max-w-xs">
          {fastState.currentType.description}
        </p>
      </div>
    </div>
  );
}