import { useAdminStats } from "@/hooks/useAdmin";
import { Card, CardContent } from "@/components/ui/card";
import { Users, DollarSign, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

const AdminStatsCards = () => {
  const { data: stats, isLoading } = useAdminStats();

  const statsConfig = [
    {
      label: "Total Users",
      value: stats?.totalUsers || 0,
      icon: Users,
      gradient: "from-purple-500 to-purple-700",
      iconBg: "bg-purple-500/20",
    },
    {
      label: "Total Deposits",
      value: `$${(stats?.totalDeposits || 0).toLocaleString()}`,
      icon: DollarSign,
      gradient: "from-amber-500 to-amber-700",
      iconBg: "bg-amber-500/20",
    },
    {
      label: "Pending Withdrawals",
      value: stats?.pendingWithdrawals || 0,
      icon: Clock,
      gradient: "from-rose-500 to-rose-700",
      iconBg: "bg-rose-500/20",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="bg-slate-900/50 border-purple-500/20">
            <CardContent className="p-6">
              <Skeleton className="h-12 w-12 rounded-lg mb-4" />
              <Skeleton className="h-8 w-24 mb-2" />
              <Skeleton className="h-4 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {statsConfig.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="bg-slate-900/50 backdrop-blur-xl border-purple-500/20 overflow-hidden relative">
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-5`} />
            <CardContent className="p-6 relative">
              <div className={`w-12 h-12 rounded-lg ${stat.iconBg} flex items-center justify-center mb-4`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-slate-400">{stat.label}</div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default AdminStatsCards;
