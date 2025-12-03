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
    toggleUseCustomTargets,
    calculateMacroFromCalories,
    updateSugarPreferences,
    calculateSugarTarget,
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

  const [sugarMode, setSugarMode] = useState<'percentage' | 'grams'>(
    preferences.sugarPreferences?.mode || 'percentage'
  );
  const [sugarPercentage, setSugarPercentage] = useState<number>(
    preferences.sugarPreferences?.percentage || 10
  );
  const [sugarGrams, setSugarGrams] = useState<number>(
    preferences.sugarPreferences?.grams || Math.round((dailyCaloriesTarget * 0.1) / 4)
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

    // Save sugar preferences
    updateSugarPreferences({
      mode: sugarMode,
      percentage: sugarPercentage,
      grams: sugarGrams
    });

    onClose();
  };

  const handlePercentageChange = (type: keyof typeof percentageSplit, value: number) => {
    const newSplit = { ...percentageSplit };
    const oldValue = newSplit[type];
    const diff = value - oldValue;

    const otherTypes = Object.keys(percentageSplit).filter(k => k !== type) as Array<keyof typeof percentageSplit>;
    const totalOther = otherTypes.reduce((sum, key) => sum + newSplit[key], 0);

    otherTypes.forEach(key => {
      if (totalOther > 0) {
        newSplit[key] = Math.max(0, Math.round((newSplit[key] - (newSplit[key] / totalOther) * diff) * 10) / 10);
      }
    });

    newSplit[type] = value;
    setPercentageSplit(newSplit);
  };

  const calculateTotalCaloriesFromCustom = () => {
    return (customTargets.protein * 4) + (customTargets.carbs * 4) + (customTargets.fat * 9);
  };

  const getCalorieDifference = () => {
    const customCalories = calculateTotalCaloriesFromCustom();
    return customCalories - dailyCaloriesTarget;
  };

  const calculateGramsFromSugarPercentage = (percent: number) => {
    return Math.round((dailyCaloriesTarget * percent / 100) / 4);
  };

  const calculatePercentageFromSugarGrams = (grams: number) => {
    return Math.round((grams * 4 / dailyCaloriesTarget) * 100);
  };

  const getSugarGuidance = () => {
    const currentGrams = sugarMode === 'percentage'
      ? calculateGramsFromSugarPercentage(sugarPercentage)
      : sugarGrams;

    const currentPercentage = sugarMode === 'percentage'
      ? sugarPercentage
      : calculatePercentageFromSugarGrams(sugarGrams);

    if (currentPercentage <= 5) {
      return { text: "Very Low (Ketosis-friendly)", color: "text-green-600", border: "border-green-200", bg: "bg-green-50" };
    } else if (currentPercentage <= 10) {
      return { text: "WHO Recommended (≤10%)", color: "text-blue-600", border: "border-blue-200", bg: "bg-blue-50" };
    } else if (currentPercentage <= 20) {
      return { text: "Moderate", color: "text-yellow-600", border: "border-yellow-200", bg: "bg-yellow-50" };
    } else {
      return { text: "High (Consider reducing)", color: "text-red-600", border: "border-red-200", bg: "bg-red-50" };
    }
  };

  const sugarGuidance = getSugarGuidance();

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
              <TabsTrigger value="sugar">Sugar Control</TabsTrigger>
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
                    {remainingPercentage === 0 && (
                      <div className="text-xs text-green-700 mt-1">✓ Perfect! Total is 100%</div>
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

            {/* Sugar Control Tab */}
            <TabsContent value="sugar" className="space-y-6 mt-6">
              {/* Info Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-700">
                    <p className="font-medium">Sugar Guidelines:</p>
                    <ul className="mt-1 space-y-1">
                      <li>• <strong>WHO recommends</strong> ≤10% of calories from added sugar</li>
                      <li>• <strong>For diabetics:</strong> Often aim for ≤5% of calories</li>
                      <li>• <strong>1 teaspoon</strong> ≈ 4g sugar ≈ 16 calories</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Sugar Mode Toggle */}
              <div className="flex items-center space-x-4">
                <Button
                  type="button"
                  variant={sugarMode === 'percentage' ? 'default' : 'outline'}
                  onClick={() => setSugarMode('percentage')}
                  className="flex-1"
                >
                  <Percent className="h-4 w-4 mr-2" />
                  Percentage
                </Button>
                <Button
                  type="button"
                  variant={sugarMode === 'grams' ? 'default' : 'outline'}
                  onClick={() => setSugarMode('grams')}
                  className="flex-1"
                >
                  <Scale className="h-4 w-4 mr-2" />
                  Grams
                </Button>
              </div>

              {/* Percentage Mode */}
              {sugarMode === 'percentage' && (
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <Label htmlFor="sugar-percent">Sugar (% of calories)</Label>
                      <span className="text-sm font-medium">{sugarPercentage}%</span>
                    </div>
                    <Slider
                      id="sugar-percent"
                      min={0}
                      max={30}
                      step={1}
                      value={[sugarPercentage]}
                      onValueChange={([value]) => setSugarPercentage(value)}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-2">
                      <span>0% (None)</span>
                      <span>10% (WHO)</span>
                      <span>30% (High)</span>
                    </div>
                  </div>

                  {/* Quick Sugar Presets */}
                  <div className="space-y-3">
                    <div className="text-sm font-medium">Quick Presets:</div>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSugarMode('percentage');
                          setSugarPercentage(5);
                        }}
                      >
                        Ketosis (5%)
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSugarMode('percentage');
                          setSugarPercentage(10);
                        }}
                      >
                        WHO Max (10%)
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSugarMode('grams');
                          setSugarGrams(25);
                        }}
                      >
                        25g (6 tsp)
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSugarMode('grams');
                          setSugarGrams(50);
                        }}
                      >
                        50g (12 tsp)
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Grams Mode */}
              {sugarMode === 'grams' && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="sugar-grams">Sugar (grams per day)</Label>
                    <Input
                      id="sugar-grams"
                      type="number"
                      min={0}
                      max={200}
                      value={sugarGrams}
                      onChange={(e) => setSugarGrams(parseInt(e.target.value) || 0)}
                      className="mt-2 text-center text-lg"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-3">
                      <div className="text-center">
                        <div>Keto</div>
                        <div className="font-medium">&lt;20g</div>
                      </div>
                      <div className="text-center">
                        <div>Low</div>
                        <div className="font-medium">20-40g</div>
                      </div>
                      <div className="text-center">
                        <div>Moderate</div>
                        <div className="font-medium">40-60g</div>
                      </div>
                      <div className="text-center">
                        <div>High</div>
                        <div className="font-medium">60g+</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Sugar Summary */}
              <div className={`p-4 rounded-lg border ${sugarGuidance.border} ${sugarGuidance.bg}`}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">Current Setting:</h3>
                  <span className={`text-sm font-medium ${sugarGuidance.color}`}>
                    {sugarGuidance.text}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">Sugar Amount:</div>
                    <div className="font-medium">
                      {sugarMode === 'percentage'
                        ? `${calculateGramsFromSugarPercentage(sugarPercentage)}g (${sugarPercentage}%)`
                        : `${sugarGrams}g (${calculatePercentageFromSugarGrams(sugarGrams)}%)`
                      }
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Equivalent to:</div>
                    <div className="font-medium">
                      {Math.round((sugarMode === 'percentage'
                        ? calculateGramsFromSugarPercentage(sugarPercentage)
                        : sugarGrams) / 4)} tsp sugar
                    </div>
                  </div>
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