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
            className="w-full justify-between h-12 text-left font-normal"
            disabled={fastState.isActive}
          >
            <div>
              <div className="font-semibold">{fastState.currentType.name}</div>
              <div className="text-xs text-muted-foreground">
                {fastState.currentType.description}
              </div>
            </div>
            <ChevronDown className="h-4 w-4 opacity-50" />
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
                  <div className="font-semibold">{type.name}</div>
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