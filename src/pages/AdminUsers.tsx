import AdminLayout from "@/components/admin/AdminLayout";
import UserManagementTable from "@/components/admin/UserManagementTable";
import { motion } from "framer-motion";

const AdminUsers = () => {
  return (
    <AdminLayout>
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-white mb-2">User Management</h1>
          <p className="text-slate-400">View and edit user balances</p>
        </motion.div>

        <UserManagementTable />
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;
