import { Wallet, TrendingUp, DollarSign, Bot, Lock, Coins } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import StatCard from "@/components/dashboard/StatCard";
import AIStatusWidget from "@/components/dashboard/AIStatusWidget";
import PerformanceChart from "@/components/dashboard/PerformanceChart";
import ActiveInvestments from "@/components/dashboard/ActiveInvestments";
import PaginatedTransactions from "@/components/dashboard/PaginatedTransactions";
import TradingViewChart from "@/components/dashboard/TradingViewChart";
import { useAuth } from "@/contexts/AuthContext";
import { useWallet } from "@/hooks/useWallet";
import { useProfile } from "@/hooks/useProfile";
import { Skeleton } from "@/components/ui/skeleton";

const Dashboard = () => {
  const { user } = useAuth();
  const { wallet, isLoading: walletLoading } = useWallet();
  const { profile, isLoading: profileLoading } = useProfile();

  const isLoading = walletLoading || profileLoading;
  const displayName = profile?.full_name?.split(" ")[0] || user?.email?.split("@")[0] || "User";

  return (
    <AppLayout>
      <div className="p-4 lg:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            {isLoading ? (
              <>
                <Skeleton className="h-8 w-48 mb-2" />
                <Skeleton className="h-5 w-64" />
              </>
            ) : (
              <>
                <h1 className="text-2xl font-bold">Welcome back, {displayName}</h1>
                <p className="text-muted-foreground">Here's your portfolio overview</p>
              </>
            )}
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-success/10 border border-success/20">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-sm font-medium text-success">AI Robot Active</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {isLoading ? (
            <>
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-32 rounded-xl" />
              ))}
            </>
          ) : (
            <>
              <StatCard
                title="Active Investment"
                value={wallet?.deposit_balance || 0}
                prefix="$"
                changeLabel="Locked"
                icon={Lock}
                iconColor="primary"
              />
              <StatCard
                title="Available Profit"
                value={wallet?.profit_balance || 0}
                prefix="$"
                changeLabel="Withdrawable"
                icon={Coins}
                iconColor="success"
              />
              <StatCard
                title="Daily Profit"
                value={(wallet?.total_profit || 0) / 30}
                prefix="$"
                changeLabel="Today"
                icon={DollarSign}
                iconColor="warning"
              />
              <StatCard
                title="Total ROI"
                value={wallet?.total_invested && wallet.total_invested > 0 
                  ? ((wallet.total_profit || 0) / wallet.total_invested) * 100 
                  : 0}
                suffix="%"
                decimals={1}
                changeLabel="Lifetime"
                icon={TrendingUp}
                iconColor="primary"
              />
            </>
          )}
        </div>

        {/* TradingView Chart - Hero Section */}
        <TradingViewChart className="w-full" />

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart - Spans 2 columns */}
          <div className="lg:col-span-2">
            <PerformanceChart />
          </div>

          {/* AI Status Widget */}
          <div>
            <AIStatusWidget status="Active" />
          </div>
        </div>

        {/* Secondary Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ActiveInvestments />
          <PaginatedTransactions />
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
