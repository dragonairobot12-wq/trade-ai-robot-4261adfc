import AdminLayout from "@/components/admin/AdminLayout";
import WithdrawalRequestsTable from "@/components/admin/WithdrawalRequestsTable";
import { motion } from "framer-motion";

const AdminWithdrawals = () => {
  return (
    <AdminLayout>
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-white mb-2">Withdrawal Requests</h1>
          <p className="text-slate-400">Approve or reject pending withdrawal requests</p>
        </motion.div>

        <WithdrawalRequestsTable />
      </div>
    </AdminLayout>
  );
};

export default AdminWithdrawals;
