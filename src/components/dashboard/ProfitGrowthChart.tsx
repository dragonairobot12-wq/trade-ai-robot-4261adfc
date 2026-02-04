import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

interface ProfitGrowthChartProps {
  totalProfit: number;
}

const ProfitGrowthChart = ({ totalProfit }: ProfitGrowthChartProps) => {
  // Generate mock 7-day profit data based on total profit
  const generateProfitData = () => {
    const dailyAvg = totalProfit / 7;
    const data = [];
    let cumulative = 0;
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      
      // Add some variance to make it look natural
      const variance = 0.5 + Math.random();
      const dayProfit = dailyAvg * variance;
      cumulative += dayProfit;
      
      data.push({
        day: dayNames[date.getDay()],
        profit: Math.max(0, cumulative),
        daily: Math.max(0, dayProfit),
      });
    }
    
    return data;
  };

  const data = generateProfitData();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
    >
      <Card className="border-border bg-card overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-success" />
            </div>
            <span>Profit Growth</span>
            <span className="text-xs text-muted-foreground font-normal ml-auto">Last 7 days</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 pb-4">
          <div className="h-[180px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data}
                margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--success))" stopOpacity={0.4} />
                    <stop offset="50%" stopColor="hsl(var(--success))" stopOpacity={0.15} />
                    <stop offset="100%" stopColor="hsl(var(--success))" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="profitStroke" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="hsl(var(--success))" stopOpacity={0.8} />
                    <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity={1} />
                    <stop offset="100%" stopColor="hsl(var(--success))" stopOpacity={0.8} />
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                  dy={10}
                />
                <YAxis 
                  hide 
                  domain={[0, 'dataMax + 10']}
                />
                <Tooltip
                  contentStyle={{
                    background: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '12px',
                    boxShadow: '0 10px 40px -10px rgba(0,0,0,0.5)',
                  }}
                  labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 600 }}
                  formatter={(value: number) => [`$${value.toFixed(2)}`, 'Profit']}
                />
                <Area
                  type="monotone"
                  dataKey="profit"
                  stroke="url(#profitStroke)"
                  strokeWidth={3}
                  fill="url(#profitGradient)"
                  dot={false}
                  activeDot={{
                    r: 6,
                    fill: 'hsl(var(--success))',
                    stroke: 'hsl(var(--background))',
                    strokeWidth: 2,
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProfitGrowthChart;
