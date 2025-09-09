import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useFastContext } from "@/contexts/FastContext";
import { useState } from "react";

export function FastTypeSelector() {
  const { fastState, fastTypes, setFastType } = useFastContext();
  const [isOpen, setIsOpen] = useState(false);

  const handleSelectType = (type: any) => {
    setFastType(type);
    setIsOpen(false);
  };

  return (
    <div className="w-full mb-6">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between h-14 text-left font-normal border-2 border-primary/30 bg-gradient-to-r from-background to-background-secondary hover:border-primary/50 transition-all duration-200"
            disabled={fastState.isActive}
          >
            <div>
              <div className="font-fredoka font-medium text-base">{fastState.currentType.name}</div>
              <div className="text-xs text-muted-foreground font-quicksand">
                {fastState.currentType.description}
              </div>
            </div>
            <ChevronDown className="h-5 w-5 opacity-70 text-primary" />
          </Button>
        </SheetTrigger>
        
        <SheetContent side="bottom" className="h-[400px]">
          <SheetHeader>
            <SheetTitle className="font-fredoka">Choose Fast Type</SheetTitle>
            <SheetDescription>
              Select the type of fast you want to perform. You can change this before starting your fast.
            </SheetDescription>
          </SheetHeader>
          
          <div className="mt-6 space-y-3">
            {fastTypes.map((type) => (
              <Button
                key={type.id}
                variant={fastState.currentType.id === type.id ? "default" : "outline"}
                className="w-full h-auto p-4 text-left justify-start"
                onClick={() => handleSelectType(type)}
              >
                <div className="space-y-1">
                  <div className="font-medium">{type.name}</div>
                  <div className="text-xs opacity-80">
                    {type.description}
                  </div>
                  <div className="text-xs opacity-60">
                    Duration: {type.duration} hours
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}