import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip, CartesianGrid } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { TrendingUp, AlertTriangle, Info } from "lucide-react";

interface GlycemicData {
  date: string;
  glycemicLoad: number;
  isHigh: boolean;
}

interface GlycemicChartProps {
  data: GlycemicData[];
}

export function GlycemicChart({ data }: GlycemicChartProps) {
  if (data.length < 3) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <CardTitle className="font-fredoka text-lg">Glycemic Load Trend</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-32">
          <div className="text-center space-y-2">
            <div className="text-4xl">📊</div>
            <p className="text-muted-foreground text-sm">
              Trends will be available after 3 days of entries for the week
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate statistics
  const averageGL = Math.round(data.reduce((sum, item) => sum + item.glycemicLoad, 0) / data.length);
  const highDays = data.filter(item => item.isHigh).length;
  const maxGL = Math.max(...data.map(item => item.glycemicLoad));
  const minGL = Math.min(...data.map(item => item.glycemicLoad));

  // Function to get bar color based on glycemic load
  const getBarColor = (glycemicLoad: number) => {
    if (glycemicLoad <= 40) return 'hsl(var(--success))'; // Low GL - Green
    if (glycemicLoad <= 70) return 'hsl(var(--warning))'; // Medium GL - Yellow
    return 'hsl(var(--destructive))'; // High GL - Red
  };

  // Function to get GL category
  const getGLCategory = (glycemicLoad: number) => {
    if (glycemicLoad <= 40) return 'Low';
    if (glycemicLoad <= 70) return 'Medium';
    return 'High';
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <CardTitle className="font-fredoka text-lg">Glycemic Load Trend</CardTitle>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Daily glycemic load values - lower is better for blood sugar control
            </p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-foreground">{averageGL}</p>
            <p className="text-xs text-muted-foreground">Week Avg</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="date" 
                axisLine={true}
                tickLine={true}
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                tickFormatter={(value) => format(new Date(value), 'EEE')}
              />
              <YAxis 
                axisLine={true}
                tickLine={true}
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                label={{ value: 'Glycemic Load', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                content={({ payload, label }) => {
                  if (payload && payload[0]) {
                    const data = payload[0].payload;
                    const category = getGLCategory(data.glycemicLoad);
                    return (
                      <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
                        <p className="font-medium">{format(new Date(label), 'EEEE, MMM d')}</p>
                        <p className="text-sm">Glycemic Load: {data.glycemicLoad}</p>
                        <p className="text-sm">
                          Category: <span className={`font-medium ${
                            category === 'Low' ? 'text-success' :
                            category === 'Medium' ? 'text-warning' : 'text-destructive'
                          }`}>{category}</span>
                        </p>
                        {data.isHigh && (
                          <p className="text-xs text-destructive mt-1">
                            ⚠️ High glycemic load day
                          </p>
                        )}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="glycemicLoad" radius={[4, 4, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(entry.glycemicLoad)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Statistics and Educational Content */}
        <div className="mt-4 space-y-4">
          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-2 bg-muted/30 rounded-lg">
              <p className="text-xs text-muted-foreground">Highest</p>
              <p className="text-sm font-bold text-foreground">{maxGL}</p>
            </div>
            <div className="text-center p-2 bg-muted/30 rounded-lg">
              <p className="text-xs text-muted-foreground">Lowest</p>
              <p className="text-sm font-bold text-foreground">{minGL}</p>
            </div>
            <div className="text-center p-2 bg-muted/30 rounded-lg">
              <p className="text-xs text-muted-foreground">High Days</p>
              <p className="text-sm font-bold text-foreground">{highDays}/7</p>
            </div>
          </div>

          {/* Color Legend */}
          <div className="flex items-center justify-center space-x-4 text-xs">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded-sm bg-success"></div>
              <span>Low (≤40)</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded-sm bg-warning"></div>
              <span>Medium (41-70)</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded-sm bg-destructive"></div>
              <span>High (&gt;70)</span>
            </div>
          </div>


        </div>
      </CardContent>
    </Card>
  );
}