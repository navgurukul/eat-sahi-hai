import { useState, useEffect } from "react";
import { X, Info, Clock, Target, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { useFastContext, FastGoal } from "@/contexts/FastContext";
import { cn } from "@/lib/utils";

interface FastGoalSelectorProps {
  isOpen?: boolean;
  onClose?: () => void;
  onGoalSelected?: () => void;
  isLoading?: boolean;
}

export function FastGoalSelector({
  isOpen = false,
  onClose = () => {},
  onGoalSelected = () => {},
  isLoading = false,
}: FastGoalSelectorProps) {
  const { fastState, fastGoals, setFastGoal } = useFastContext();
  const [selectedGoal, setSelectedGoal] = useState<FastGoal | null>(null);

  // Reset selected goal when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedGoal(null);
    }
  }, [isOpen]);

  const handleSelectGoal = (goal: FastGoal) => {
    setFastGoal(goal);
    onGoalSelected();
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-500/10 text-green-600 border-green-500/20";
      case "intermediate":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
      case "advanced":
        return "bg-red-500/10 text-red-600 border-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-500/20";
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="bottom"
        className="h-[95vh] xs:h-[90vh] sm:h-[85vh] md:h-[80vh] rounded-t-3xl"
      >
        <SheetHeader className="text-center pb-3 xs:pb-4 sm:pb-6">
          <SheetTitle className="font-fredoka text-lg xs:text-xl sm:text-2xl">
            Choose Your Fast Goal
          </SheetTitle>
          <SheetDescription className="font-quicksand text-xs xs:text-sm sm:text-base">
            Select a fasting schedule that matches your experience and goals
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-1">
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-2 xs:gap-3 sm:gap-4 pb-6">
            {fastGoals.map((goal) => (
              <Card
                key={goal.id}
                className={cn(
                  "relative overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] group",
                  selectedGoal?.id === goal.id
                    ? "ring-2 ring-primary shadow-lg scale-[1.02]"
                    : "hover:shadow-md"
                )}
                style={{
                  background: `linear-gradient(135deg, ${goal.color}15 0%, ${goal.color}05 100%)`,
                  borderColor:
                    selectedGoal?.id === goal.id ? goal.color : undefined,
                }}
                onClick={() => setSelectedGoal(goal)}
              >
                <CardContent className="p-3 xs:p-4 sm:p-5 md:p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-2 xs:mb-3 sm:mb-4">
                    <div
                      className="w-10 h-10 xs:w-12 xs:h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center text-lg xs:text-xl sm:text-2xl md:text-3xl transition-transform duration-300 group-hover:scale-110"
                      style={{ backgroundColor: goal.color + "20" }}
                    >
                      {goal.icon}
                    </div>
                    <Badge
                      variant="secondary"
                      className={cn(
                        "text-xs",
                        getDifficultyColor(goal.difficulty)
                      )}
                    >
                      {goal.difficulty}
                    </Badge>
                  </div>

                  {/* Title & Duration */}
                  <div className="mb-2 xs:mb-3">
                    <h3 className="font-fredoka font-bold text-sm xs:text-base sm:text-lg text-foreground mb-1">
                      {goal.name}
                    </h3>
                    <div className="flex items-center space-x-2 text-xs xs:text-sm text-muted-foreground">
                      <Clock className="w-3 h-3 xs:w-4 xs:h-4" />
                      <span className="font-medium">{goal.duration} hours</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs xs:text-sm text-muted-foreground font-quicksand mb-2 xs:mb-3 sm:mb-4 line-clamp-2">
                    {goal.description}
                  </p>

                  {/* Benefits */}
                  <div className="space-y-1 xs:space-y-2">
                    <div className="flex items-center space-x-1 text-xs font-medium text-foreground">
                      <Sparkles className="w-3 h-3" />
                      <span>Benefits:</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {goal.benefits.slice(0, 3).map((benefit, index) => (
                        <span
                          key={index}
                          className="inline-block px-1.5 xs:px-2 py-0.5 xs:py-1 text-xs bg-background/50 rounded-md text-muted-foreground"
                        >
                          {benefit}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Selection Indicator */}
                  {selectedGoal?.id === goal.id && (
                    <div className="absolute top-1.5 xs:top-2 sm:top-3 right-1.5 xs:right-2 sm:right-3">
                      <div className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 rounded-full bg-primary flex items-center justify-center animate-in zoom-in duration-200">
                        <svg
                          className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-4 sm:h-4 text-primary-foreground"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Detailed View for Selected Goal */}
          {selectedGoal && (
            <Card className="mb-3 xs:mb-4 sm:mb-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
              <CardContent className="p-3 xs:p-4 sm:p-6">
                <div className="flex items-center justify-between mb-2 xs:mb-3 sm:mb-4">
                  <div className="flex items-center space-x-2 xs:space-x-3">
                    <div
                      className="w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center text-lg xs:text-xl sm:text-2xl"
                      style={{ backgroundColor: selectedGoal.color + "30" }}
                    >
                      {selectedGoal.icon}
                    </div>
                    <div>
                      <h3 className="font-fredoka font-bold text-base xs:text-lg sm:text-xl text-foreground">
                        {selectedGoal.name}
                      </h3>
                      <p className="text-xs xs:text-sm text-muted-foreground">
                        {selectedGoal.duration} hour fast
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedGoal(null)}
                    className="h-5 w-5 xs:h-6 xs:w-6 sm:h-8 sm:w-8 p-0"
                  >
                    <X className="h-2.5 w-2.5 xs:h-3 xs:w-3 sm:h-4 sm:w-4" />
                  </Button>
                </div>

                <div className="space-y-2 xs:space-y-3 sm:space-y-4">
                  <div>
                    <h4 className="font-medium text-foreground mb-1 xs:mb-2 flex items-center space-x-1">
                      <Info className="w-3 h-3 xs:w-4 xs:h-4" />
                      <span className="text-xs xs:text-sm sm:text-base">
                        About this fast
                      </span>
                    </h4>
                    <p className="text-xs xs:text-sm text-muted-foreground">
                      {selectedGoal.description}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium text-foreground mb-1 xs:mb-2 flex items-center space-x-1">
                      <Sparkles className="w-3 h-3 xs:w-4 xs:h-4" />
                      <span className="text-xs xs:text-sm sm:text-base">
                        Key Benefits
                      </span>
                    </h4>
                    <div className="grid grid-cols-1 gap-1.5 xs:gap-2">
                      {selectedGoal.benefits.map((benefit, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2 p-1.5 xs:p-2 bg-background/50 rounded-lg"
                        >
                          <div className="w-1.5 h-1.5 xs:w-2 xs:h-2 rounded-full bg-primary flex-shrink-0"></div>
                          <span className="text-xs xs:text-sm text-foreground">
                            {benefit}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button
                    onClick={() => handleSelectGoal(selectedGoal)}
                    disabled={isLoading}
                    className="w-full h-8 xs:h-10 sm:h-12 font-baloo font-medium text-xs xs:text-sm sm:text-base"
                    style={{ backgroundColor: selectedGoal.color }}
                  >
                    <Target className="w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5 mr-1 xs:mr-2" />
                    {isLoading ? "Starting Fast..." : "Start This Fast"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
