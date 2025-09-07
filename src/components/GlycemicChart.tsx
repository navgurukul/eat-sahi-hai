import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Dot } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";

interface GlycemicData {
  date: string;
  glycemicLoad: number;
  isHigh: boolean;
}

interface GlycemicChartProps {
  data: GlycemicData[];
}

const CustomDot = (props: any) => {
  const { cx, cy, payload } = props;
  if (payload.isHigh) {
    return <Dot cx={cx} cy={cy} r={4} fill="hsl(var(--destructive))" stroke="hsl(var(--destructive))" strokeWidth={2} />;
  }
  return null;
};

export function GlycemicChart({ data }: GlycemicChartProps) {
  if (data.length < 3) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="font-fredoka text-lg">Glycemic Load Trend</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-32">
          <p className="text-muted-foreground text-center">
            Trends will be available after 3 days of entries for the week
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="font-fredoka text-lg">Glycemic Load Trend</CardTitle>
        <p className="text-sm text-muted-foreground">
          Red dots indicate high glycemic load days (&gt;100)
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis 
                dataKey="date" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                tickFormatter={(value) => format(new Date(value), 'EEE')}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
              />
              <Line
                type="monotone"
                dataKey="glycemicLoad"
                stroke="hsl(207 100% 38%)"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="glycemicLoad"
                stroke="transparent"
                dot={<CustomDot />}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}