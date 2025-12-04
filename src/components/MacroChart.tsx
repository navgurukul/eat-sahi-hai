import { useUserPreferences } from "@/contexts/UserPreferencesContext";
import { MacroSettingsModal } from "@/components/MacroSettingsModal";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, PieChart, Pie, LineChart, Line, CartesianGrid, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Target, Info } from "lucide-react";

interface MacroData {
  name: string;
  value: number;
  color: string;
  unit: string;
}

interface MacroChartProps {
  totalCalories: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
}

export function MacroChart({ totalCalories, macros }: MacroChartProps) {
  const [activeChart, setActiveChart] = useState<'bar' | 'pie' | 'comparison'>('bar');
  const [showSettings, setShowSettings] = useState(false); // Add this

  // Calculate percentages and recommendations
  const totalMacros = macros.protein + macros.carbs + macros.fat;
  const proteinPercentage = totalMacros > 0 ? Math.round((macros.protein * 4 / totalCalories) * 100) : 0;
  const carbsPercentage = totalMacros > 0 ? Math.round((macros.carbs * 4 / totalCalories) * 100) : 0;
  const fatPercentage = totalMacros > 0 ? Math.round((macros.fat * 9 / totalCalories) * 100) : 0;

  // Recommended ranges
  const recommendations = {
    protein: { min: 15, max: 25, current: proteinPercentage },
    carbs: { min: 45, max: 65, current: carbsPercentage },
    fat: { min: 20, max: 35, current: fatPercentage }
  };

  const data: MacroData[] = [
    {
      name: 'Calories',
      value: totalCalories,
      color: 'hsl(var(--progress-calories))',
      unit: 'kcal'
    },
    {
      name: 'Protein',
      value: macros.protein,
      color: 'hsl(var(--progress-protein))',
      unit: 'g'
    },
    {
      name: 'Carbs',
      value: macros.carbs,
      color: 'hsl(var(--progress-carbs))',
      unit: 'g'
    },
    {
      name: 'Fat',
      value: macros.fat,
      color: 'hsl(var(--progress-fat))',
      unit: 'g'
    }
  ];

  // Pie chart data for macronutrient distribution
  const pieData = [
    { name: 'Protein', value: macros.protein * 4, color: 'hsl(var(--progress-protein))', percentage: proteinPercentage },
    { name: 'Carbs', value: macros.carbs * 4, color: 'hsl(var(--progress-carbs))', percentage: carbsPercentage },
    { name: 'Fat', value: macros.fat * 9, color: 'hsl(var(--progress-fat))', percentage: fatPercentage }
  ].filter(item => item.value > 0);

  // Comparison data for recommendations
  const comparisonData = [
    {
      name: 'Protein',
      current: proteinPercentage,
      recommended: 20,
      min: 15,
      max: 25,
      color: 'hsl(var(--progress-protein))'
    },
    {
      name: 'Carbs',
      current: carbsPercentage,
      recommended: 55,
      min: 45,
      max: 65,
      color: 'hsl(var(--progress-carbs))'
    },
    {
      name: 'Fat',
      current: fatPercentage,
      recommended: 25,
      min: 20,
      max: 35,
      color: 'hsl(var(--progress-fat))'
    }
  ];

  const getRecommendationStatus = (current: number, min: number, max: number) => {
    if (current >= min && current <= max) return 'optimal';
    if (current < min) return 'low';
    return 'high';
  };

  const renderBarChart = () => (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        layout="horizontal"
        margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
      >
        <XAxis 
          type="number" 
          axisLine={true} 
          tickLine={true}
          tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
        />
        <YAxis 
          type="category" 
          dataKey="name" 
          axisLine={true} 
          tickLine={true}
          tick={{ fontSize: 12, fill: 'hsl(var(--foreground))' }}
          width={50}
        />
        <Tooltip 
          content={({ payload, label }) => {
            if (payload && payload[0]) {
              const data = payload[0].payload;
              return (
                <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
                  <p className="font-medium">{label}</p>
                  <p className="text-sm text-muted-foreground">
                    {payload[0].value?.toLocaleString()} {data.unit}
                  </p>
                </div>
              );
            }
            return null;
          }}
        />
        <Bar dataKey="value" radius={[0, 6, 6, 0]} maxBarSize={40}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );

  const renderPieChart = () => (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={pieData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={2}
          dataKey="value"
        >
          {pieData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip 
          content={({ payload }) => {
            if (payload && payload[0]) {
              const data = payload[0].payload;
              return (
                <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
                  <p className="font-medium">{data.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {data.percentage}% of total calories
                  </p>
                </div>
              );
            }
            return null;
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );

  const renderComparisonChart = () => (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={comparisonData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis 
          dataKey="name" 
          axisLine={true} 
          tickLine={true}
          tick={{ fontSize: 12, fill: 'hsl(var(--foreground))' }}
        />
        <YAxis 
          axisLine={true} 
          tickLine={true}
          tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
          label={{ value: '% of Calories', angle: -90, position: 'insideLeft' }}
        />
        <Tooltip 
          content={({ payload, label }) => {
            if (payload && payload[0]) {
              const data = payload[0].payload;
              return (
                <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
                  <p className="font-medium">{label}</p>
                  <p className="text-sm">Current: {data.current}%</p>
                  <p className="text-sm">Recommended: {data.min}-{data.max}%</p>
                </div>
              );
            }
            return null;
          }}
        />
        <Bar dataKey="current" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
        <Bar dataKey="recommended" fill="hsl(var(--muted))" radius={[4, 4, 0, 0]} opacity={0.6} />
      </BarChart>
    </ResponsiveContainer>
  );

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="font-fredoka text-lg flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <span>Weekly Nutrition Breakdown</span>
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Total calories and macronutrients consumed this week
            </p>
          </div>
          <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSettings(true)}
              className="flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              Adjust Targets
            </Button>
          <div className="flex space-x-1">
            <button
              onClick={() => setActiveChart('bar')}
              className={`px-3 py-1 text-xs rounded-full transition-colors ${
                activeChart === 'bar' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              Totals
            </button>
            <button
              onClick={() => setActiveChart('pie')}
              className={`px-3 py-1 text-xs rounded-full transition-colors ${
                activeChart === 'pie' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              Distribution
            </button>
            <button
              onClick={() => setActiveChart('comparison')}
              className={`px-3 py-1 text-xs rounded-full transition-colors ${
                activeChart === 'comparison' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              Goals
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          {activeChart === 'bar' && renderBarChart()}
          {activeChart === 'pie' && renderPieChart()}
          {activeChart === 'comparison' && renderComparisonChart()}
        </div>
        
        {activeChart === 'bar' && (
          <div className="grid grid-cols-2 gap-4 mt-4">
            {data.map((item) => (
              <div key={item.name} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm font-medium">
                  {item.name}: {item.value.toLocaleString()} {item.unit}
                </span>
              </div>
            ))}
          </div>
        )}

        {activeChart === 'pie' && (
          <div className="mt-4">
            <div className="text-center mb-3">
              <p className="text-sm font-medium text-foreground">Calorie Distribution</p>
              <p className="text-xs text-muted-foreground">How your calories break down by macronutrient</p>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {pieData.map((item) => (
                <div key={item.name} className="text-center p-2 bg-muted/30 rounded-lg">
                  <div 
                    className="w-4 h-4 rounded-full mx-auto mb-1" 
                    style={{ backgroundColor: item.color }}
                  />
                  <p className="text-xs font-medium">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.percentage}%</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeChart === 'comparison' && (
          <div className="mt-4 space-y-3">
            <div className="flex items-center space-x-2 mb-3">
              <Info className="h-4 w-4 text-primary" />
              <p className="text-sm font-medium">Macronutrient Recommendations</p>
            </div>
            {Object.entries(recommendations).map(([key, rec]) => {
              const status = getRecommendationStatus(rec.current, rec.min, rec.max);
              return (
                <div key={key} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: comparisonData.find(d => d.name.toLowerCase() === key)?.color }}
                    />
                    <span className="text-sm font-medium capitalize">{key}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">{rec.current}%</span>
                    <Badge 
                      variant={status === 'optimal' ? 'default' : 'destructive'}
                      className="text-xs"
                    >
                      {status === 'optimal' ? '✓ Good' : 
                       status === 'low' ? '↓ Low' : '↑ High'}
                    </Badge>
                  </div>
                </div>
              );
            })}
            <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
              <div className="flex items-center space-x-2 mb-2">
                <Target className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">Recommendations</span>
              </div>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>• <strong>Protein:</strong> 15-25% helps maintain muscle and satiety</p>
                <p>• <strong>Carbs:</strong> 45-65% provides energy for daily activities</p>
                <p>• <strong>Fat:</strong> 20-35% supports hormone production and nutrient absorption</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      <MacroSettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        dailyCaloriesTarget={totalCalories} // or use a prop
      />
    </Card>
  );
}