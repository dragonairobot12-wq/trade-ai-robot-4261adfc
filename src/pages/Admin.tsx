import AdminLayout from "@/components/admin/AdminLayout";
import AdminStatsCards from "@/components/admin/AdminStatsCards";
import UserManagementTable from "@/components/admin/UserManagementTable";
import DepositRequestsTable from "@/components/admin/DepositRequestsTable";
import WithdrawalRequestsTable from "@/components/admin/WithdrawalRequestsTable";
import DailyProfitDistributor from "@/components/admin/DailyProfitDistributor";
import { motion } from "framer-motion";

const Admin = () => {
  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-slate-400">Manage users, deposits, and withdrawals</p>
        </motion.div>

        {/* Stats */}
        <AdminStatsCards />

        {/* Daily Profit Distributor */}
        <DailyProfitDistributor />

        {/* Management Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DepositRequestsTable />
          <WithdrawalRequestsTable />
        </div>

        {/* User Management */}
        <UserManagementTable />
      </div>
    </AdminLayout>
  );
};

export default Admin;
