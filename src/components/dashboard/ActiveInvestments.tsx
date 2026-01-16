import { useState, useEffect } from "react";
import { TrendingUp, Clock, ArrowRight, Zap, Timer, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useInvestments, UserInvestment } from "@/hooks/useInvestments";
import { differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds, format } from "date-fns";
import AnimatedCounter from "./AnimatedCounter";

interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const calculateTimeLeft = (endDate: string): CountdownTime => {
  const end = new Date(endDate);
  const now = new Date();
  
  if (end <= now) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  const totalSeconds = Math.floor((end.getTime() - now.getTime()) / 1000);
  const days = Math.floor(totalSeconds / (24 * 60 * 60));
  const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
  const seconds = totalSeconds % 60;

  return { days, hours, minutes, seconds };
};

const calculateProgress = (startDate: string, endDate: string): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const now = new Date();

  const totalDuration = end.getTime() - start.getTime();
  const elapsed = now.getTime() - start.getTime();

  if (elapsed >= totalDuration) return 100;
  if (elapsed <= 0) return 0;

  return (elapsed / totalDuration) * 100;
};

const calculateCurrentProfit = (
  amount: number,
  expectedReturn: number,
  startDate: string,
  endDate: string
): number => {
  const progress = calculateProgress(startDate, endDate) / 100;
  const totalProfit = expectedReturn - amount;
  return totalProfit * progress;
};

interface InvestmentCardProps {
  investment: UserInvestment;
}

const InvestmentCard = ({ investment }: InvestmentCardProps) => {
  const [timeLeft, setTimeLeft] = useState<CountdownTime>(
    calculateTimeLeft(investment.end_date)
  );
  const [currentProfit, setCurrentProfit] = useState(
    calculateCurrentProfit(
      investment.amount,
      investment.expected_return,
      investment.start_date,
      investment.end_date
    )
  );
  const [progress, setProgress] = useState(
    calculateProgress(investment.start_date, investment.end_date)
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(investment.end_date));
      setProgress(calculateProgress(investment.start_date, investment.end_date));
      setCurrentProfit(
        calculateCurrentProfit(
          investment.amount,
          investment.expected_return,
          investment.start_date,
          investment.end_date
        )
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [investment]);

  const packageName = investment.investment_packages?.name || "Investment";
  const roi = investment.investment_packages?.roi || 0;
  const totalProfit = investment.expected_return - investment.amount;
  const isCompleted = progress >= 100;

  return (
    <div className="p-4 rounded-xl bg-secondary/30 border border-border hover:bg-secondary/50 transition-all duration-300 group">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <p className="font-medium text-sm">{packageName}</p>
            {isCompleted && (
              <Badge className="bg-success/20 text-success border-success/30 text-xs">
                Completed
              </Badge>
            )}
          </div>
          <p className="text-lg font-bold text-gradient">
            ${investment.amount.toLocaleString()}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">ROI</p>
          <p className="text-sm font-semibold text-success">+{roi}%</p>
        </div>
      </div>

      {/* Countdown Timer */}
      {!isCompleted && (
        <div className="grid grid-cols-4 gap-2 mb-3 p-3 rounded-lg bg-primary/5 border border-primary/10">
          <div className="text-center">
            <p className="text-lg font-bold text-primary">{timeLeft.days}</p>
            <p className="text-[10px] text-muted-foreground uppercase">Days</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-primary">{timeLeft.hours.toString().padStart(2, '0')}</p>
            <p className="text-[10px] text-muted-foreground uppercase">Hours</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-primary">{timeLeft.minutes.toString().padStart(2, '0')}</p>
            <p className="text-[10px] text-muted-foreground uppercase">Mins</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-primary animate-pulse">{timeLeft.seconds.toString().padStart(2, '0')}</p>
            <p className="text-[10px] text-muted-foreground uppercase">Secs</p>
          </div>
        </div>
      )}

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground flex items-center gap-1">
            <Timer className="w-3 h-3" />
            {isCompleted ? "Investment completed" : `${timeLeft.days} days remaining`}
          </span>
          <span className="font-medium text-primary">
            {Math.min(Math.round(progress), 100)}%
          </span>
        </div>
        <Progress
          value={Math.min(progress, 100)}
          className="h-2"
        />
        <div className="flex justify-between text-[10px] text-muted-foreground">
          <span>{format(new Date(investment.start_date), "MMM d, yyyy")}</span>
          <span>{format(new Date(investment.end_date), "MMM d, yyyy")}</span>
        </div>
      </div>

      {/* Profit Tracking */}
      <div className="flex justify-between mt-3 pt-3 border-t border-border">
        <div>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Zap className="w-3 h-3 text-success" />
            Current Profit
          </p>
          <p className="text-sm font-semibold text-success">
            +$<AnimatedCounter value={currentProfit} decimals={2} duration={500} />
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground flex items-center gap-1 justify-end">
            <DollarSign className="w-3 h-3" />
            Expected Total
          </p>
          <p className="text-sm font-medium">${totalProfit.toFixed(2)}</p>
        </div>
      </div>

      {/* Live indicator */}
      {!isCompleted && (
        <div className="flex items-center justify-center gap-2 mt-3 pt-2 border-t border-border/50">
          <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span className="text-[10px] text-muted-foreground">AI Trading Active</span>
        </div>
      )}
    </div>
  );
};

const ActiveInvestments = () => {
  const { activeInvestments, isLoading, totalActiveInvested, totalExpectedReturns } = useInvestments();

  return (
    <Card className="border-border bg-card">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <TrendingUp className="w-5 h-5 text-primary" />
          Active Investments
          {activeInvestments.length > 0 && (
            <Badge variant="secondary" className="ml-2">
              {activeInvestments.length}
            </Badge>
          )}
        </CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link to="/history" className="text-xs">
            View All <ArrowRight className="w-3 h-3 ml-1" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary Stats */}
        {activeInvestments.length > 0 && (
          <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-gradient-to-r from-primary/10 to-success/10 border border-primary/20">
            <div>
              <p className="text-xs text-muted-foreground">Total Invested</p>
              <p className="text-lg font-bold">${totalActiveInvested.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Expected Returns</p>
              <p className="text-lg font-bold text-success">
                +${(totalExpectedReturns - totalActiveInvested).toFixed(2)}
              </p>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-48 w-full rounded-xl" />
            <Skeleton className="h-48 w-full rounded-xl" />
          </div>
        ) : activeInvestments.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <TrendingUp className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">No Active Investments</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Start investing to see your portfolio grow
            </p>
            <Button variant="gradient" asChild>
              <Link to="/packages">
                <TrendingUp className="w-4 h-4 mr-2" />
                Browse Packages
              </Link>
            </Button>
          </div>
        ) : (
          <>
            {activeInvestments.slice(0, 3).map((investment) => (
              <InvestmentCard key={investment.id} investment={investment} />
            ))}

            {activeInvestments.length > 3 && (
              <Button variant="outline" className="w-full" asChild>
                <Link to="/history">
                  View {activeInvestments.length - 3} more investments
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            )}
          </>
        )}

        {activeInvestments.length > 0 && (
          <Button variant="outline" className="w-full" asChild>
            <Link to="/packages">
              <TrendingUp className="w-4 h-4 mr-2" />
              Start New Investment
            </Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default ActiveInvestments;
