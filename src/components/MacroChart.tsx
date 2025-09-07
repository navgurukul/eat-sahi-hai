import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="font-fredoka text-lg">Weekly Nutrition Breakdown</CardTitle>
        <p className="text-sm text-muted-foreground">
          Total calories and macronutrients consumed this week
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="horizontal"
              margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
            >
              <XAxis 
                type="number" 
                axisLine={false} 
                tickLine={false}
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis 
                type="category" 
                dataKey="name" 
                axisLine={false} 
                tickLine={false}
                tick={{ fontSize: 12, fill: 'hsl(var(--foreground))' }}
                width={50}
              />
              <Bar dataKey="value" radius={[0, 6, 6, 0]} maxBarSize={40}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        
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
      </CardContent>
    </Card>
  );
}