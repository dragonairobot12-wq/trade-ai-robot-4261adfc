import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Wallet, TrendingUp, History, Settings, LogOut, ChevronRight, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import dragonLogo from "@/assets/dragon-logo.png";
interface AppSidebarProps {
  collapsed?: boolean;
  onCollapse?: () => void;
}
const navigation = [{
  name: "Dashboard",
  href: "/dashboard",
  icon: LayoutDashboard
}, {
  name: "Invest",
  href: "/packages",
  icon: TrendingUp
}, {
  name: "Wallet",
  href: "/wallet",
  icon: Wallet
}, {
  name: "History",
  href: "/history",
  icon: History
}, {
  name: "Settings",
  href: "/settings",
  icon: Settings
}];
const AppSidebar = ({
  collapsed = false,
  onCollapse
}: AppSidebarProps) => {
  const location = useLocation();
  return <aside className={cn("fixed left-0 top-0 z-40 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 hidden lg:flex flex-col", collapsed ? "w-20" : "w-64")}>
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
        <Link to="/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl overflow-hidden shadow-glow">
            <img src={dragonLogo} alt="Dragon AI" className="w-full h-full object-cover" />
          </div>
          {!collapsed && <span className="font-bold text-lg text-sidebar-foreground">
              Dragon<span className="text-gradient">AI</span>
            </span>}
        </Link>
        <Button variant="ghost" size="icon" className="text-sidebar-foreground hover:bg-sidebar-accent" onClick={onCollapse}>
          <ChevronRight className={cn("w-4 h-4 transition-transform", collapsed ? "" : "rotate-180")} />
        </Button>
      </div>

      {/* AI Status Card */}
      {!collapsed && <div className="p-4">
          <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg overflow-hidden">
                <img src={dragonLogo} alt="Dragon AI" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Dragon AI</p>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                  <span className="text-sm font-medium text-sidebar-foreground">Active</span>
                </div>
              </div>
            </div>
            <div className="h-1 bg-sidebar-accent rounded-full overflow-hidden">
              <div className="h-full w-3/4 gradient-primary rounded-full animate-pulse" />
            </div>
          </div>
        </div>}

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navigation.map(item => {
        const isActive = location.pathname === item.href;
        return <Link key={item.name} to={item.href} className={cn("flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group", isActive ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-glow" : "text-sidebar-foreground hover:bg-sidebar-accent")}>
              <item.icon className={cn("w-5 h-5 transition-transform group-hover:scale-110", isActive ? "text-sidebar-primary-foreground" : "text-muted-foreground")} />
              {!collapsed && <span className={cn("text-sm font-medium", isActive ? "" : "")}>
                  {item.name}
                </span>}
              {item.name === "Wallet" && !collapsed && <Badge className="ml-auto bg-success/10 text-success text-xs px-2">
                  $12.4k
                </Badge>}
            </Link>;
      })}
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-sidebar-border">
        {!collapsed}
        <Button variant="ghost" className={cn("w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10", collapsed && "justify-center")}>
          <LogOut className="w-5 h-5" />
          {!collapsed && <span className="ml-3">Logout</span>}
        </Button>
      </div>
    </aside>;
};
export default AppSidebar;