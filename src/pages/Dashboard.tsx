import { motion } from "framer-motion";
import { Bot, Sparkles } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import DualBalanceCards from "@/components/dashboard/DualBalanceCards";
import ProfitGrowthChart from "@/components/dashboard/ProfitGrowthChart";
import ActiveRobotsWidget from "@/components/dashboard/ActiveRobotsWidget";
import QuickStatsRow from "@/components/dashboard/QuickStatsRow";
import TradingViewChart from "@/components/dashboard/TradingViewChart";
import PaginatedTransactions from "@/components/dashboard/PaginatedTransactions";
import AnimatedCounter from "@/components/dashboard/AnimatedCounter";
import ExpiredRobotsNotification from "@/components/dashboard/ExpiredRobotsNotification";
import { useAuth } from "@/contexts/AuthContext";
import { useWallet } from "@/hooks/useWallet";
import { useProfile } from "@/hooks/useProfile";
import { useInvestments } from "@/hooks/useInvestments";
import { Skeleton } from "@/components/ui/skeleton";

const Dashboard = () => {
  const { user } = useAuth();
  const { wallet, isLoading: walletLoading, MINIMUM_WITHDRAWAL_AMOUNT, refetchWallet } = useWallet();
  const { profile, isLoading: profileLoading } = useProfile();
  const { expiredInvestments } = useInvestments();

  const isLoading = walletLoading || profileLoading;
  const displayName = profile?.full_name?.split(" ")[0] || user?.email?.split("@")[0] || "User";

  // Calculate total portfolio value
  const totalPortfolio = (wallet?.deposit_balance || 0) + (wallet?.profit_balance || 0);

  // Mock next payout hours (in real app, calculate from investment schedule)
  const nextPayoutHours = 12;

  return (
    <AppLayout>
      <div className="p-4 lg:p-6 space-y-6">
        {/* Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          {/* Background glow */}
          <div className="absolute -top-20 -left-20 w-60 h-60 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            {/* Greeting & Portfolio Value */}
            <div className="space-y-3">
              {isLoading ? (
                <>
                  <Skeleton className="h-7 w-72 mb-2" />
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-16 w-64 mt-4" />
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    <span className="text-sm text-primary font-medium">Dragon AI Trading</span>
                  </div>
                  <h1 className="text-2xl lg:text-3xl font-bold">
                    Welcome back, <span className="text-gradient">{displayName}</span>!
                  </h1>
                  <p className="text-muted-foreground">
                    Your AI Robots are working for you 24/7
                  </p>
                  
                  {/* Total Portfolio Value */}
                  <div className="mt-4 pt-4 border-t border-border/50">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                      Total Portfolio Value
                    </p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary via-primary to-success bg-clip-text text-transparent">
                        $<AnimatedCounter value={totalPortfolio} decimals={2} duration={2000} />
                      </span>
                      <span className="text-lg text-muted-foreground">USDT</span>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* AI Status Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-success/10 border border-success/30 backdrop-blur-sm"
            >
              <div className="relative">
                <Bot className="w-6 h-6 text-success" />
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-success animate-pulse" />
              </div>
              <div>
                <p className="text-sm font-semibold text-success">AI Robots Active</p>
                <p className="text-xs text-muted-foreground">Trading in progress</p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Expired Robots Notification */}
        <ExpiredRobotsNotification expiredInvestments={expiredInvestments} />

        {/* Dual Balance Cards - Main Focus */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
            <Skeleton className="h-64 rounded-xl" />
            <Skeleton className="h-64 rounded-xl" />
          </div>
        ) : (
          <DualBalanceCards
            depositBalance={wallet?.deposit_balance || 0}
            profitBalance={wallet?.profit_balance || 0}
            minimumWithdrawal={MINIMUM_WITHDRAWAL_AMOUNT}
            onRefresh={refetchWallet}
          />
        )}

        {/* Visual Analytics Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          {isLoading ? (
            <>
              <Skeleton className="h-60 rounded-xl" />
              <Skeleton className="h-60 rounded-xl" />
            </>
          ) : (
            <>
              <ProfitGrowthChart totalProfit={wallet?.total_profit || 0} />
              <ActiveRobotsWidget />
            </>
          )}
        </div>

        {/* Quick Stats Row */}
        {isLoading ? (
          <div className="grid grid-cols-3 gap-3 lg:gap-4">
            <Skeleton className="h-24 rounded-xl" />
            <Skeleton className="h-24 rounded-xl" />
            <Skeleton className="h-24 rounded-xl" />
          </div>
        ) : (
          <QuickStatsRow
            totalWithdrawn={wallet?.total_withdrawn || 0}
            referralBonus={0} // TODO: Implement referral system
            nextPayoutHours={nextPayoutHours}
          />
        )}

        {/* TradingView Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.1 }}
        >
          <TradingViewChart className="w-full" />
        </motion.div>

        {/* Recent Transactions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.2 }}
        >
          <PaginatedTransactions />
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
