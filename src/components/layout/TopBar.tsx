import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bell, Search, Menu, Moon, Sun, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import dragonLogo from "@/assets/dragon-logo.png";
import { useProfile } from "@/hooks/useProfile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TopBarProps {
  onMenuClick?: () => void;
}

const TopBar = ({ onMenuClick }: TopBarProps) => {
  const [isDark, setIsDark] = useState(true);
  const { signOut, user } = useAuth();
  const { profile } = useProfile();
  const navigate = useNavigate();

  const displayName = profile?.full_name || user?.email?.split("@")[0] || "User";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-card/80 backdrop-blur-xl border-b border-border">
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        {/* Left side - Mobile menu & Logo */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onMenuClick}
          >
            <Menu className="w-5 h-5" />
          </Button>

          <Link to="/dashboard" className="flex items-center gap-2 lg:hidden">
            <div className="w-8 h-8 rounded-lg overflow-hidden">
              <img src={dragonLogo} alt="Dragon AI" className="w-full h-full object-cover" />
            </div>
            <span className="font-bold text-gradient">Dragon AI</span>
          </Link>

          {/* Search - Desktop */}
          <div className="hidden md:flex items-center relative">
            <Search className="absolute left-3 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="w-64 pl-9 bg-secondary/50 border-transparent focus:border-primary"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="text-muted-foreground hover:text-foreground"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5 text-muted-foreground" />
                <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-destructive text-[10px]">
                  3
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
                <span className="text-sm font-medium">Daily profit received</span>
                <span className="text-xs text-muted-foreground">
                  You earned $45.32 today from your investments
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
                <span className="text-sm font-medium">AI Strategy Updated</span>
                <span className="text-xs text-muted-foreground">
                  Market conditions changed, portfolio rebalanced
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
                <span className="text-sm font-medium">Deposit Confirmed</span>
                <span className="text-xs text-muted-foreground">
                  $1,000 has been added to your wallet
                </span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 px-2">
                <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-semibold text-sm">{initials}</span>
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium">{displayName}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/settings">Profile Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/wallet">My Wallet</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/history">Transaction History</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-destructive cursor-pointer"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
