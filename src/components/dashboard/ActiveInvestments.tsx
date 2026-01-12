import { TrendingUp, Clock, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";

const investments = [
  {
    name: "Professional Package",
    amount: 1000,
    roi: "30%",
    daysLeft: 12,
    totalDays: 30,
    currentProfit: 180.45,
    expectedProfit: 300,
  },
  {
    name: "Standard Package",
    amount: 600,
    roi: "25%",
    daysLeft: 22,
    totalDays: 30,
    currentProfit: 40.2,
    expectedProfit: 150,
  },
];

const ActiveInvestments = () => {
  return (
    <Card className="border-border bg-card">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <TrendingUp className="w-5 h-5 text-primary" />
          Active Investments
        </CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link to="/packages" className="text-xs">
            View All <ArrowRight className="w-3 h-3 ml-1" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {investments.map((investment, index) => (
          <div
            key={index}
            className="p-4 rounded-xl bg-secondary/30 border border-border hover:bg-secondary/50 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-medium text-sm">{investment.name}</p>
                <p className="text-lg font-bold text-gradient">
                  ${investment.amount.toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">ROI</p>
                <p className="text-sm font-semibold text-success">{investment.roi}</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {investment.daysLeft} days left
                </span>
                <span className="font-medium">
                  {Math.round(
                    ((investment.totalDays - investment.daysLeft) / investment.totalDays) * 100
                  )}
                  %
                </span>
              </div>
              <Progress
                value={
                  ((investment.totalDays - investment.daysLeft) / investment.totalDays) * 100
                }
                className="h-1.5"
              />
            </div>

            <div className="flex justify-between mt-3 pt-3 border-t border-border">
              <div>
                <p className="text-xs text-muted-foreground">Current Profit</p>
                <p className="text-sm font-semibold text-success">
                  +${investment.currentProfit.toFixed(2)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Expected</p>
                <p className="text-sm font-medium">${investment.expectedProfit.toFixed(2)}</p>
              </div>
            </div>
          </div>
        ))}

        <Button variant="outline" className="w-full" asChild>
          <Link to="/packages">
            <TrendingUp className="w-4 h-4 mr-2" />
            Start New Investment
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default ActiveInvestments;
