import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Users, 
  ArrowDownCircle, 
  ArrowUpCircle, 
  Sparkles,
  LogOut,
  Shield
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

interface AdminLayoutProps {
  children: ReactNode;
}

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/deposits", label: "Deposits", icon: ArrowDownCircle },
  { href: "/admin/withdrawals", label: "Withdrawals", icon: ArrowUpCircle },
];

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const location = useLocation();
  const { signOut } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-slate-900/80 backdrop-blur-xl border-r border-purple-500/20 z-50">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-amber-500">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Admin Panel</h1>
              <p className="text-xs text-purple-300/60">Dragon AI Trading</p>
            </div>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                    isActive
                      ? "bg-gradient-to-r from-purple-600/30 to-amber-600/20 text-amber-400 border border-purple-500/30"
                      : "text-slate-300 hover:bg-slate-800/50 hover:text-white"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-purple-500/20">
          <Link to="/dashboard">
            <Button variant="outline" className="w-full mb-2 border-purple-500/30 text-purple-300 hover:bg-purple-500/10">
              <LayoutDashboard className="w-4 h-4 mr-2" />
              User Dashboard
            </Button>
          </Link>
          <Button 
            variant="ghost" 
            className="w-full text-slate-400 hover:text-red-400 hover:bg-red-500/10"
            onClick={() => signOut()}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 min-h-screen p-8">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
