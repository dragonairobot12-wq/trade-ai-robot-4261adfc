import { Wallet, TrendingUp, DollarSign, Bot } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import StatCard from "@/components/dashboard/StatCard";
import AIStatusWidget from "@/components/dashboard/AIStatusWidget";
import PerformanceChart from "@/components/dashboard/PerformanceChart";
import ActiveInvestments from "@/components/dashboard/ActiveInvestments";
import RecentTransactions from "@/components/dashboard/RecentTransactions";

const Dashboard = () => {
  return (
    <AppLayout>
      <div className="p-4 lg:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Welcome back, John</h1>
            <p className="text-muted-foreground">Here's your portfolio overview</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-success/10 border border-success/20">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-sm font-medium text-success">AI Robot Active</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Balance"
            value={12458.32}
            prefix="$"
            change={12.5}
            icon={Wallet}
            iconColor="primary"
          />
          <StatCard
            title="Total Profit"
            value={2458.32}
            prefix="$"
            change={8.3}
            icon={TrendingUp}
            iconColor="success"
          />
          <StatCard
            title="Daily Profit"
            value={82.45}
            prefix="$"
            changeLabel="Today"
            icon={DollarSign}
            iconColor="warning"
          />
          <StatCard
            title="Active Investments"
            value={2}
            decimals={0}
            changeLabel="Running"
            icon={Bot}
            iconColor="primary"
          />
        </div>

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
          <RecentTransactions />
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
