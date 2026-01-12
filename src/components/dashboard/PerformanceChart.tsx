import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3 } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { cn } from "@/lib/utils";

const dailyData = [
  { name: "Mon", profit: 45, invested: 1000 },
  { name: "Tue", profit: 72, invested: 1000 },
  { name: "Wed", profit: 58, invested: 1000 },
  { name: "Thu", profit: 89, invested: 1000 },
  { name: "Fri", profit: 67, invested: 1500 },
  { name: "Sat", profit: 95, invested: 1500 },
  { name: "Sun", profit: 82, invested: 1500 },
];

const weeklyData = [
  { name: "Week 1", profit: 320, invested: 1000 },
  { name: "Week 2", profit: 450, invested: 1500 },
  { name: "Week 3", profit: 380, invested: 2000 },
  { name: "Week 4", profit: 520, invested: 2500 },
];

const monthlyData = [
  { name: "Jan", profit: 1200, invested: 5000 },
  { name: "Feb", profit: 1800, invested: 6000 },
  { name: "Mar", profit: 1500, invested: 7000 },
  { name: "Apr", profit: 2100, invested: 8000 },
  { name: "May", profit: 2400, invested: 9000 },
  { name: "Jun", profit: 2800, invested: 10000 },
];

type TimeRange = "daily" | "weekly" | "monthly";

const PerformanceChart = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>("daily");

  const data = {
    daily: dailyData,
    weekly: weeklyData,
    monthly: monthlyData,
  }[timeRange];

  return (
    <Card className="border-border bg-card">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <BarChart3 className="w-5 h-5 text-primary" />
          Performance Overview
        </CardTitle>
        <div className="flex gap-1 bg-secondary/50 rounded-lg p-1">
          {(["daily", "weekly", "monthly"] as const).map((range) => (
            <Button
              key={range}
              variant="ghost"
              size="sm"
              className={cn(
                "h-7 px-3 text-xs capitalize",
                timeRange === range && "bg-primary text-primary-foreground"
              )}
              onClick={() => setTimeRange(range)}
            >
              {range}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorInvested" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="name"
                stroke="hsl(var(--muted-foreground))"
                tick={{ fontSize: 12 }}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "12px",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
                }}
                labelStyle={{ color: "hsl(var(--foreground))" }}
              />
              <Area
                type="monotone"
                dataKey="invested"
                stroke="hsl(var(--success))"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorInvested)"
                name="Invested"
              />
              <Area
                type="monotone"
                dataKey="profit"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorProfit)"
                name="Profit"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceChart;
