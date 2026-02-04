import AdminLayout from "@/components/admin/AdminLayout";
import DepositRequestsTable from "@/components/admin/DepositRequestsTable";
import { motion } from "framer-motion";

const AdminDeposits = () => {
  return (
    <AdminLayout>
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-white mb-2">Deposit Requests</h1>
          <p className="text-slate-400">Approve or reject pending deposit requests</p>
        </motion.div>

        <DepositRequestsTable />
      </div>
    </AdminLayout>
  );
};

export default AdminDeposits;
