import { motion } from "framer-motion";
import { Bot, Zap, ArrowRight, RefreshCw, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import { useInvestments, getDaysRemaining, getProgressPercentage, UserInvestment } from "@/hooks/useInvestments";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface RobotCardProps {
  investment: UserInvestment;
  isExpired: boolean;
  index: number;
}

const RobotCard = ({ investment, isExpired, index }: RobotCardProps) => {
  const daysRemaining = getDaysRemaining(investment.end_date);
  const progress = getProgressPercentage(investment.start_date, investment.end_date);

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.8 + index * 0.1 }}
      className={cn(
        "flex flex-col p-3 rounded-lg border transition-colors",
        isExpired
          ? "bg-muted/30 border-border/30 grayscale"
          : "bg-secondary/30 border-border/50 hover:bg-secondary/50"
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center",
              isExpired
                ? "bg-muted/50"
                : "bg-gradient-to-br from-primary/20 to-primary/10"
            )}
          >
            <Zap className={cn("w-5 h-5", isExpired ? "text-muted-foreground" : "text-primary")} />
          </div>
          <div>
            <p className={cn("font-medium text-sm", isExpired && "text-muted-foreground")}>
              {investment.investment_packages?.name || "AI Robot"}
            </p>
            <p className="text-xs text-muted-foreground">
              ${investment.amount.toLocaleString()} invested
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isExpired ? (
            <>
              <span className="w-2 h-2 rounded-full bg-destructive" />
              <span className="text-xs text-destructive font-medium">Expired</span>
            </>
          ) : (
            <>
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <span className="text-xs text-success font-medium">Running</span>
            </>
          )}
        </div>
      </div>

      {/* Progress bar and days remaining */}
      <div className="mt-2 space-y-1">
        <div className="flex justify-between items-center text-xs">
          <span className="flex items-center gap-1 text-muted-foreground">
            <Clock className="w-3 h-3" />
            {isExpired ? "Cycle completed" : `${daysRemaining} days left`}
          </span>
          <span className={cn("font-medium", isExpired ? "text-muted-foreground" : "text-primary")}>
            {Math.round(progress)}%
          </span>
        </div>
        <Progress
          value={progress}
          className={cn("h-1.5", isExpired && "opacity-50")}
        />
      </div>

      {/* Renew button for expired */}
      {isExpired && (
        <Button
          variant="outline"
          size="sm"
          className="mt-3 w-full border-primary/50 text-primary hover:bg-primary/10"
          asChild
        >
          <Link to="/packages">
            <RefreshCw className="w-3 h-3 mr-1" />
            Renew Plan
          </Link>
        </Button>
      )}
    </motion.div>
  );
};

const ActiveRobotsWidget = () => {
  const { activeInvestments, expiredInvestments, isLoading } = useInvestments();

  // Combine active and expired for display, with active first
  const allInvestments = [...activeInvestments, ...expiredInvestments];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.7 }}
    >
      <Card className="border-border bg-card h-full">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Bot className="w-4 h-4 text-primary" />
            </div>
            <span>AI Robots</span>
            <div className="ml-auto flex gap-1">
              {activeInvestments.length > 0 && (
                <Badge variant="secondary" className="bg-success/20 text-success border-success/30">
                  {activeInvestments.length} Active
                </Badge>
              )}
              {expiredInvestments.length > 0 && (
                <Badge variant="secondary" className="bg-destructive/20 text-destructive border-destructive/30">
                  {expiredInvestments.length} Expired
                </Badge>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-20 w-full rounded-lg" />
              <Skeleton className="h-20 w-full rounded-lg" />
            </div>
          ) : allInvestments.length === 0 ? (
            <div className="text-center py-6">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
                <Bot className="w-6 h-6 text-primary opacity-50" />
              </div>
              <p className="text-sm text-muted-foreground mb-3">No robots yet</p>
              <Button variant="outline" size="sm" asChild>
                <Link to="/packages">
                  Start Trading <ArrowRight className="w-3 h-3 ml-1" />
                </Link>
              </Button>
            </div>
          ) : (
            <>
              {allInvestments.slice(0, 4).map((investment, index) => (
                <RobotCard
                  key={investment.id}
                  investment={investment}
                  isExpired={expiredInvestments.some((exp) => exp.id === investment.id)}
                  index={index}
                />
              ))}

              {allInvestments.length > 4 && (
                <Button variant="ghost" size="sm" className="w-full text-xs" asChild>
                  <Link to="/history">
                    View {allInvestments.length - 4} more robots
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </Link>
                </Button>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ActiveRobotsWidget;
