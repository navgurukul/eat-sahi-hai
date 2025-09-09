import { AlertTriangle, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LoggedFoodItem } from "@/contexts/FoodContext";
import { format } from "date-fns";

interface Suggestion {
  type: 'warning' | 'positive';
  title: string;
  description: string;
  foods: string[];
  date: string;
}

interface InsightsSuggestionsProps {
  weekData: LoggedFoodItem[];
}

export function InsightsSuggestions({ weekData }: InsightsSuggestionsProps) {
  const generateSuggestions = (): Suggestion[] => {
    const suggestions: Suggestion[] = [];
    
    // Group by date
    const dailyData = weekData.reduce((acc, item) => {
      const dateKey = format(item.date, 'yyyy-MM-dd');
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(item);
      return acc;
    }, {} as Record<string, LoggedFoodItem[]>);

    // Find high glycemic load days
    Object.entries(dailyData).forEach(([dateKey, items]) => {
      const totalGL = items.reduce((sum, item) => sum + (item.glycemicLoad || 0), 0);
      
      if (totalGL > 100) {
        const highGLFoods = items
          .filter(item => (item.glycemicLoad || 0) > 20)
          .map(item => item.name);
        
        if (highGLFoods.length > 0) {
          suggestions.push({
            type: 'warning',
            title: 'High Glycemic Load Alert',
            description: 'These foods caused a spike in your glycemic load. Consider reducing portions or finding alternatives.',
            foods: highGLFoods,
            date: format(new Date(dateKey), 'EEE, MMM dd')
          });
        }
      }

      // Find high protein foods for positive reinforcement
      const highProteinFoods = items
        .filter(item => (item.protein || 0) > 15)
        .map(item => item.name);

      if (highProteinFoods.length > 0) {
        suggestions.push({
          type: 'positive',
          title: 'Great Protein Choices!',
          description: 'These foods are excellent sources of protein. Keep including them in your diet.',
          foods: highProteinFoods,
          date: format(new Date(dateKey), 'EEE, MMM dd')
        });
      }
    });

    return suggestions.slice(0, 4); // Limit to 4 suggestions
  };

  const suggestions = generateSuggestions();

  if (suggestions.length === 0) {
    return (
      <Card>
        <CardContent className="py-6">
          <p className="text-center text-muted-foreground">
            No specific suggestions available. Keep logging your food for personalized insights!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="font-fredoka text-lg text-foreground mb-4">Weekly Insights</h3>
      
      {suggestions.map((suggestion, index) => (
        <Card key={index} className={`border-l-4 ${
          suggestion.type === 'warning' 
            ? 'border-l-destructive bg-destructive/5' 
            : 'border-l-success bg-success/5'
        }`}>
          <CardContent className="py-4">
            <div className="flex items-start space-x-3">
              <div className={`p-2 rounded-full ${
                suggestion.type === 'warning' 
                  ? 'bg-destructive/10' 
                  : 'bg-success/10'
              }`}>
                {suggestion.type === 'warning' ? (
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                ) : (
                  <TrendingUp className="h-4 w-4 text-success" />
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-sm">{suggestion.title}</h4>
                  <Badge variant="outline" className="text-xs">
                    {suggestion.date}
                  </Badge>
                </div>
                
                <p className="text-sm text-muted-foreground mb-3">
                  {suggestion.description}
                </p>
                
                <div className="flex flex-wrap gap-1">
                  {suggestion.foods.map((food, foodIndex) => (
                    <Badge 
                      key={foodIndex} 
                      variant="secondary" 
                      className="text-xs"
                    >
                      {food}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}