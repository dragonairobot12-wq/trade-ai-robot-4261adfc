import { motion } from "framer-motion";
import { Bot, Zap, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useInvestments } from "@/hooks/useInvestments";
import { Skeleton } from "@/components/ui/skeleton";

const ActiveRobotsWidget = () => {
  const { activeInvestments, isLoading } = useInvestments();

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
            <span>Active Robots</span>
            {activeInvestments.length > 0 && (
              <Badge variant="secondary" className="ml-auto">
                {activeInvestments.length}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-14 w-full rounded-lg" />
              <Skeleton className="h-14 w-full rounded-lg" />
            </div>
          ) : activeInvestments.length === 0 ? (
            <div className="text-center py-6">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
                <Bot className="w-6 h-6 text-primary opacity-50" />
              </div>
              <p className="text-sm text-muted-foreground mb-3">No active robots</p>
              <Button variant="outline" size="sm" asChild>
                <Link to="/packages">
                  Start Trading <ArrowRight className="w-3 h-3 ml-1" />
                </Link>
              </Button>
            </div>
          ) : (
            <>
              {activeInvestments.slice(0, 3).map((investment, index) => (
                <motion.div
                  key={investment.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border/50 hover:bg-secondary/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                      <Zap className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">
                        {investment.investment_packages?.name || "AI Robot"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        ${investment.amount.toLocaleString()} invested
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                    <span className="text-xs text-success font-medium">Running</span>
                  </div>
                </motion.div>
              ))}
              
              {activeInvestments.length > 3 && (
                <Button variant="ghost" size="sm" className="w-full text-xs" asChild>
                  <Link to="/history">
                    View {activeInvestments.length - 3} more robots
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
