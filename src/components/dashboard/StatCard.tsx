import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import AnimatedCounter from "./AnimatedCounter";

interface StatCardProps {
  title: string;
  value: number;
  prefix?: string;
  suffix?: string;
  change?: number;
  changeLabel?: string;
  icon: LucideIcon;
  iconColor?: "primary" | "success" | "warning" | "destructive";
  decimals?: number;
}

const iconColors = {
  primary: "bg-primary/10 text-primary",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  destructive: "bg-destructive/10 text-destructive",
};

const StatCard = ({
  title,
  value,
  prefix = "",
  suffix = "",
  change,
  changeLabel,
  icon: Icon,
  iconColor = "primary",
  decimals = 2,
}: StatCardProps) => {
  return (
    <Card className="border-border bg-card hover:shadow-lg transition-all duration-300 group">
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div
            className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110",
              iconColors[iconColor]
            )}
          >
            <Icon className="w-6 h-6" />
          </div>
          {change !== undefined && (
            <div
              className={cn(
                "flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-lg",
                change >= 0 ? "text-success bg-success/10" : "text-destructive bg-destructive/10"
              )}
            >
              <span>{change >= 0 ? "+" : ""}{change}%</span>
            </div>
          )}
          {changeLabel && !change && (
            <span className="text-xs text-muted-foreground">{changeLabel}</span>
          )}
        </div>
        <p className="text-sm text-muted-foreground mb-1">{title}</p>
        <p className="text-2xl font-bold">
          {prefix}
          <AnimatedCounter value={value} decimals={decimals} />
          {suffix}
        </p>
      </CardContent>
    </Card>
  );
};

export default StatCard;
