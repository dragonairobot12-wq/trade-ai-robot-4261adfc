import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import AppSidebar from "./AppSidebar";
import TopBar from "./TopBar";
import MobileNav from "./MobileNav";

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Set dark mode as default
    document.documentElement.classList.add("dark");
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar
        collapsed={sidebarCollapsed}
        onCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <div
        className={cn(
          "transition-all duration-300",
          sidebarCollapsed ? "lg:ml-20" : "lg:ml-64"
        )}
      >
        <TopBar onMenuClick={() => setSidebarCollapsed(!sidebarCollapsed)} />

        <main
          className={cn(
            "pb-20 lg:pb-6 transition-opacity duration-300",
            mounted ? "opacity-100" : "opacity-0"
          )}
        >
          {children}
        </main>
      </div>

      <MobileNav />
    </div>
  );
};

export default AppLayout;
