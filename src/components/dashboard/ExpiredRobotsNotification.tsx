import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, RefreshCw, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState } from "react";
import { UserInvestment } from "@/hooks/useInvestments";

interface ExpiredRobotsNotificationProps {
  expiredInvestments: UserInvestment[];
}

const ExpiredRobotsNotification = ({ expiredInvestments }: ExpiredRobotsNotificationProps) => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || expiredInvestments.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="border-warning/50 bg-warning/5 relative overflow-hidden">
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-warning/10 via-transparent to-warning/10 animate-pulse" />
          
          <CardContent className="p-4 relative">
            <button
              onClick={() => setDismissed(true)}
              className="absolute top-2 right-2 p-1 rounded-full hover:bg-warning/20 transition-colors"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-warning/20 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-warning" />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground mb-1">
                  {expiredInvestments.length === 1
                    ? "Your Dragon AI Robot Has Completed Its Cycle"
                    : `${expiredInvestments.length} Dragon AI Robots Have Completed Their Cycles`}
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {expiredInvestments.length === 1 ? (
                    <>
                      Your <span className="font-medium text-foreground">{expiredInvestments[0].investment_packages?.name || "Dragon AI Robot"}</span> has finished generating profits. Renew your plan to continue earning.
                    </>
                  ) : (
                    "Your robots have finished generating profits. Renew your plans to continue earning."
                  )}
                </p>

                {expiredInvestments.length > 1 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {expiredInvestments.slice(0, 3).map((inv) => (
                      <span
                        key={inv.id}
                        className="inline-flex items-center px-2 py-1 rounded-md bg-secondary/50 text-xs font-medium"
                      >
                        {inv.investment_packages?.name || "Dragon AI"}
                      </span>
                    ))}
                    {expiredInvestments.length > 3 && (
                      <span className="inline-flex items-center px-2 py-1 rounded-md bg-secondary/50 text-xs font-medium text-muted-foreground">
                        +{expiredInvestments.length - 3} more
                      </span>
                    )}
                  </div>
                )}

                <Button variant="gradient" size="sm" asChild>
                  <Link to="/packages">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Renew Investment
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};

export default ExpiredRobotsNotification;
