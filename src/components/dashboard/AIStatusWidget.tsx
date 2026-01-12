import { Bot, Zap, TrendingUp, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface AIStatusWidgetProps {
  status: "Active" | "Optimizing" | "Analyzing" | "Paused";
}

const statusConfig = {
  Active: {
    color: "text-success",
    bgColor: "bg-success/10",
    pulseColor: "bg-success",
    description: "Trading algorithms running at full capacity",
  },
  Optimizing: {
    color: "text-primary",
    bgColor: "bg-primary/10",
    pulseColor: "bg-primary",
    description: "Rebalancing portfolio for optimal returns",
  },
  Analyzing: {
    color: "text-warning",
    bgColor: "bg-warning/10",
    pulseColor: "bg-warning",
    description: "Analyzing market conditions and trends",
  },
  Paused: {
    color: "text-muted-foreground",
    bgColor: "bg-muted",
    pulseColor: "bg-muted-foreground",
    description: "Trading temporarily paused",
  },
};

const AIStatusWidget = ({ status }: AIStatusWidgetProps) => {
  const config = statusConfig[status];

  return (
    <Card className="border-border bg-card overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
            <Bot className="w-4 h-4 text-primary-foreground" />
          </div>
          AI Trading Robot
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status Indicator */}
        <div className={`p-4 rounded-xl ${config.bgColor} border border-border`}>
          <div className="flex items-center gap-3 mb-3">
            <span className={`w-3 h-3 rounded-full ${config.pulseColor} animate-pulse`} />
            <span className={`font-semibold ${config.color}`}>{status}</span>
          </div>
          <p className="text-sm text-muted-foreground">{config.description}</p>
        </div>

        {/* AI Metrics */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-3 bg-secondary/50 rounded-xl">
            <Zap className="w-4 h-4 mx-auto mb-1 text-primary" />
            <p className="text-xs text-muted-foreground">Speed</p>
            <p className="text-sm font-semibold">98%</p>
          </div>
          <div className="text-center p-3 bg-secondary/50 rounded-xl">
            <TrendingUp className="w-4 h-4 mx-auto mb-1 text-success" />
            <p className="text-xs text-muted-foreground">Accuracy</p>
            <p className="text-sm font-semibold">94%</p>
          </div>
          <div className="text-center p-3 bg-secondary/50 rounded-xl">
            <Shield className="w-4 h-4 mx-auto mb-1 text-warning" />
            <p className="text-xs text-muted-foreground">Risk</p>
            <p className="text-sm font-semibold">Low</p>
          </div>
        </div>

        {/* Processing Bar */}
        <div>
          <div className="flex justify-between text-xs mb-2">
            <span className="text-muted-foreground">Processing Power</span>
            <span className="font-medium">87%</span>
          </div>
          <Progress value={87} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
};

export default AIStatusWidget;
