// components/MacroSettingsModal.tsx
import { useState, useEffect } from 'react';
import { X, Save, Percent, Scale, Info } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";

interface MacroSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  dailyCaloriesTarget: number;
}

export function MacroSettingsModal({ isOpen, onClose, dailyCaloriesTarget }: MacroSettingsModalProps) {
  const {
    preferences,
    updateMacroSplit,
    updateCustomTargets,
    calculateMacroFromCalories,
    updateGlycemicPreferences,
  } = useUserPreferences();

  const [macroMode, setMacroMode] = useState<'percentage' | 'custom'>(
    preferences.useCustomTargets ? 'custom' : 'percentage'
  );

  const [percentageSplit, setPercentageSplit] = useState<{
    protein: number;
    carbs: number;
    fat: number;
  }>(preferences.macroSplit);

  const [customTargets, setCustomTargets] = useState<{
    protein: number;
    carbs: number;
    fat: number;
  }>(preferences.customMacroTargets || calculateMacroFromCalories(dailyCaloriesTarget));

  const [glTarget, setGlTarget] = useState<number>(
    preferences.glycemicPreferences?.dailyGLTarget || 100
  );

  const [remainingPercentage, setRemainingPercentage] = useState(0);
  const [activeTab, setActiveTab] = useState('macros');

  useEffect(() => {
    const total = percentageSplit.protein + percentageSplit.carbs + percentageSplit.fat;
    setRemainingPercentage(100 - total);
  }, [percentageSplit]);

  useEffect(() => {
    if (!preferences.useCustomTargets) {
      const calculated = calculateMacroFromCalories(dailyCaloriesTarget);
      setCustomTargets(calculated);
    }
  }, [dailyCaloriesTarget, preferences.useCustomTargets]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (macroMode === 'percentage') {
      updateMacroSplit(percentageSplit);
    } else {
      updateCustomTargets(customTargets);
    }

    // Save glycemic load preferences
    updateGlycemicPreferences({
      dailyGLTarget: glTarget
    });

    onClose();
  };

  const handlePercentageChange = (type: keyof typeof percentageSplit, value: number) => {
    setPercentageSplit(prev => ({
      ...prev,
      [type]: value
    }));
  };

  const calculateTotalCaloriesFromCustom = () => {
    return (customTargets.protein * 4) + (customTargets.carbs * 4) + (customTargets.fat * 9);
  };

  const getCalorieDifference = () => {
    const customCalories = calculateTotalCaloriesFromCustom();
    return customCalories - dailyCaloriesTarget;
  };

  const autoBalancePercentages = () => {
    const total = percentageSplit.protein + percentageSplit.carbs + percentageSplit.fat;

    if (total === 100) return; // Already balanced

    // Adjust proportionally to reach 100%
    setPercentageSplit(prev => ({
      protein: Math.round((prev.protein / total) * 100),
      carbs: Math.round((prev.carbs / total) * 100),
      fat: 100 - Math.round((prev.protein / total) * 100) - Math.round((prev.carbs / total) * 100)
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Nutrition Targets</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="macros">Macronutrients</TabsTrigger>
              <TabsTrigger value="glycemic">Glycemic Load</TabsTrigger>
            </TabsList>

            {/* Macronutrients Tab */}
            <TabsContent value="macros" className="space-y-6 mt-6">
              {/* Mode Toggle */}
              <div className="flex items-center space-x-4">
                <Button
                  type="button"
                  variant={macroMode === 'percentage' ? 'default' : 'outline'}
                  onClick={() => setMacroMode('percentage')}
                  className="flex-1"
                >
                  <Percent className="h-4 w-4 mr-2" />
                  Percentage
                </Button>
                <Button
                  type="button"
                  variant={macroMode === 'custom' ? 'default' : 'outline'}
                  onClick={() => setMacroMode('custom')}
                  className="flex-1"
                >
                  <Scale className="h-4 w-4 mr-2" />
                  Grams
                </Button>
              </div>

              {/* Percentage Mode */}
              {macroMode === 'percentage' && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    {/* Protein */}
                    <div>
                      <div className="flex justify-between mb-2">
                        <Label htmlFor="protein" className="flex items-center gap-2">
                          Protein
                          <span className="text-xs text-muted-foreground">(4 cal/g)</span>
                        </Label>
                        <span className="text-sm font-medium">{percentageSplit.protein}%</span>
                      </div>
                      <Slider
                        id="protein"
                        min={10}
                        max={50}
                        step={1}
                        value={[percentageSplit.protein]}
                        onValueChange={([value]) => handlePercentageChange('protein', value)}
                        className="w-full"
                      />
                      <div className="text-xs text-muted-foreground mt-1">
                        {Math.round((dailyCaloriesTarget * percentageSplit.protein / 100) / 4)}g protein
                      </div>
                    </div>

                    {/* Carbs */}
                    <div>
                      <div className="flex justify-between mb-2">
                        <Label htmlFor="carbs" className="flex items-center gap-2">
                          Carbohydrates
                          <span className="text-xs text-muted-foreground">(4 cal/g)</span>
                        </Label>
                        <span className="text-sm font-medium">{percentageSplit.carbs}%</span>
                      </div>
                      <Slider
                        id="carbs"
                        min={20}
                        max={70}
                        step={1}
                        value={[percentageSplit.carbs]}
                        onValueChange={([value]) => handlePercentageChange('carbs', value)}
                        className="w-full"
                      />
                      <div className="text-xs text-muted-foreground mt-1">
                        {Math.round((dailyCaloriesTarget * percentageSplit.carbs / 100) / 4)}g carbs
                      </div>
                    </div>

                    {/* Fat */}
                    <div>
                      <div className="flex justify-between mb-2">
                        <Label htmlFor="fat" className="flex items-center gap-2">
                          Fat
                          <span className="text-xs text-muted-foreground">(9 cal/g)</span>
                        </Label>
                        <span className="text-sm font-medium">{percentageSplit.fat}%</span>
                      </div>
                      <Slider
                        id="fat"
                        min={15}
                        max={50}
                        step={1}
                        value={[percentageSplit.fat]}
                        onValueChange={([value]) => handlePercentageChange('fat', value)}
                        className="w-full"
                      />
                      <div className="text-xs text-muted-foreground mt-1">
                        {Math.round((dailyCaloriesTarget * percentageSplit.fat / 100) / 9)}g fat
                      </div>
                    </div>
                  </div>

                  {/* Total Percentage Display */}
                  <div className={`p-3 rounded-lg ${remainingPercentage === 0 ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'}`}>
                    <div className="text-sm font-medium flex justify-between items-center">
                      <span>Total: {percentageSplit.protein + percentageSplit.carbs + percentageSplit.fat}%</span>
                      {remainingPercentage !== 0 && (
                        <span className="text-yellow-700 text-xs">
                          {remainingPercentage > 0 ? '+' : ''}{remainingPercentage}% remaining
                        </span>
                      )}
                    </div>
                    {remainingPercentage !== 0 && (
                      <div className="flex justify-end mt-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={autoBalancePercentages}
                          className="text-xs"
                        >
                          Auto-balance to 100%
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Quick Presets - Only in Percentage Mode */}
                  <div className="space-y-3">
                    <div className="text-sm font-medium">Quick Presets:</div>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setPercentageSplit({ protein: 30, carbs: 40, fat: 30 });
                        }}
                      >
                        High Protein
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setPercentageSplit({ protein: 25, carbs: 45, fat: 30 });
                        }}
                      >
                        Balanced
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setPercentageSplit({ protein: 20, carbs: 50, fat: 30 });
                        }}
                      >
                        High Carb
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setPercentageSplit({ protein: 25, carbs: 35, fat: 40 });
                        }}
                      >
                        Low Carb
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Custom Grams Mode */}
              {macroMode === 'custom' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-3 gap-4">
                    {/* Protein Input */}
                    <div>
                      <Label htmlFor="protein-g" className="text-xs">Protein (g)</Label>
                      <Input
                        id="protein-g"
                        type="number"
                        min={0}
                        max={300}
                        value={customTargets.protein}
                        onChange={(e) => setCustomTargets(prev => ({ ...prev, protein: parseInt(e.target.value) || 0 }))}
                        className="mt-1"
                      />
                      <div className="text-xs text-muted-foreground mt-1">
                        {customTargets.protein * 4} cal
                      </div>
                    </div>

                    {/* Carbs Input */}
                    <div>
                      <Label htmlFor="carbs-g" className="text-xs">Carbs (g)</Label>
                      <Input
                        id="carbs-g"
                        type="number"
                        min={0}
                        max={500}
                        value={customTargets.carbs}
                        onChange={(e) => setCustomTargets(prev => ({ ...prev, carbs: parseInt(e.target.value) || 0 }))}
                        className="mt-1"
                      />
                      <div className="text-xs text-muted-foreground mt-1">
                        {customTargets.carbs * 4} cal
                      </div>
                    </div>

                    {/* Fat Input */}
                    <div>
                      <Label htmlFor="fat-g" className="text-xs">Fat (g)</Label>
                      <Input
                        id="fat-g"
                        type="number"
                        min={0}
                        max={200}
                        value={customTargets.fat}
                        onChange={(e) => setCustomTargets(prev => ({ ...prev, fat: parseInt(e.target.value) || 0 }))}
                        className="mt-1"
                      />
                      <div className="text-xs text-muted-foreground mt-1">
                        {customTargets.fat * 9} cal
                      </div>
                    </div>
                  </div>

                  {/* Calorie Summary */}
                  <div className="p-4 bg-muted/30 rounded-lg border border-border">
                    <div className="text-sm font-medium mb-2 flex items-center justify-between">
                      <span>Calorie Summary</span>
                      <span className={`text-xs ${Math.abs(getCalorieDifference()) > 50 ? 'text-amber-600' : 'text-green-600'}`}>
                        {Math.abs(getCalorieDifference()) > 50 ? '⚠️' : '✓'}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <div className="text-muted-foreground text-xs">From macros:</div>
                        <div className="font-medium">{calculateTotalCaloriesFromCustom()} cal</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground text-xs">Daily target:</div>
                        <div className="font-medium">{dailyCaloriesTarget} cal</div>
                      </div>
                    </div>

                    {Math.abs(getCalorieDifference()) > 10 && (
                      <div className={`mt-3 text-sm ${getCalorieDifference() > 0 ? 'text-amber-600' : 'text-blue-600'} border-t pt-2`}>
                        <div className="flex items-center">
                          {getCalorieDifference() > 0 ? '▲' : '▼'}
                          <span className="ml-1">
                            {Math.abs(getCalorieDifference())} cal {getCalorieDifference() > 0 ? 'above' : 'below'} target
                          </span>
                        </div>
                        {Math.abs(getCalorieDifference()) > 100 && (
                          <div className="text-xs text-muted-foreground mt-1">
                            Consider adjusting grams to match your calorie target
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </TabsContent>

            {/* Glycemic Load Tab */}
            <TabsContent value="glycemic" className="space-y-6 mt-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-700">
                    <p className="font-medium">Glycemic Load (GL) Guidelines:</p>
                    <ul className="mt-1 space-y-1">
                      <li>• <strong>Low GL diet:</strong> 80 or less per day</li>
                      <li>• <strong>Moderate GL diet:</strong> 80-120 per day</li>
                      <li>• <strong>High GL diet:</strong> 120+ per day</li>
                      <li>• <strong>GL = (GI × Carbs) ÷ 100</strong></li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="gl-target" className="text-base font-medium">
                  Daily Glycemic Load Target
                </Label>
                <div className="mt-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Target GL:</span>
                    <span className="text-sm font-medium">{glTarget}</span>
                  </div>
                  <Slider
                    id="gl-target"
                    min={50}
                    max={150}
                    step={5}
                    value={[glTarget]}
                    onValueChange={([value]) => setGlTarget(value)}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-2">
                    <span>Low (50)</span>
                    <span>Moderate (100)</span>
                    <span>High (150)</span>
                  </div>
                </div>
              </div>

              {/* Quick Presets */}
              <div className="space-y-3">
                <div className="text-sm font-medium">Quick Presets:</div>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setGlTarget(80)}
                  >
                    Low GL (80)
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setGlTarget(100)}
                  >
                    Moderate (100)
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setGlTarget(120)}
                  >
                    High GL (120)
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setGlTarget(60)}
                  >
                    Very Low (60)
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="flex items-center justify-end gap-2 p-6 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="gap-2">
            <Save className="h-4 w-4" />
            Save All Changes
          </Button>
        </div>
      </div>
    </div>
  );
}