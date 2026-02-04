import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import {
  User,
  Shield,
  Bell,
  Wallet,
  Key,
  Smartphone,
  Mail,
  Eye,
  EyeOff,
  CheckCircle2,
  LogOut,
  Calendar,
  Loader2,
  Copy,
  Check,
  AlertTriangle,
  BadgeCheck,
  CreditCard,
  Settings as SettingsIcon,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { useWallet } from "@/hooks/useWallet";
import { useInvestments } from "@/hooks/useInvestments";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

type TabValue = "profile" | "security" | "wallet" | "notifications";

interface TabItem {
  value: TabValue;
  label: string;
  icon: React.ReactNode;
}

const Settings = () => {
  const [activeTab, setActiveTab] = useState<TabValue>("profile");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [selectedNetwork, setSelectedNetwork] = useState<"TRC20" | "BEP20">("TRC20");
  const [copied, setCopied] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    trading: true,
    marketing: false,
  });
  
  const { toast } = useToast();
  const { signOut, user } = useAuth();
  const { profile, isLoading, updateProfile } = useProfile();
  const { wallet } = useWallet();
  const { activeInvestments } = useInvestments();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
  });

  // Check if user has active deposits (for verified badge)
  const isVerified = useMemo(() => {
    return activeInvestments && activeInvestments.length > 0;
  }, [activeInvestments]);

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || "",
        email: profile.email || "",
        phone: profile.phone || "",
      });
    }
  }, [profile]);

  const displayName = profile?.full_name || user?.email?.split("@")[0] || "User";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // Password strength calculation
  const passwordStrength = useMemo(() => {
    if (!newPassword) return 0;
    let strength = 0;
    if (newPassword.length >= 8) strength += 25;
    if (/[a-z]/.test(newPassword)) strength += 25;
    if (/[A-Z]/.test(newPassword)) strength += 25;
    if (/[0-9!@#$%^&*]/.test(newPassword)) strength += 25;
    return strength;
  }, [newPassword]);

  const getStrengthLabel = () => {
    if (passwordStrength === 0) return "";
    if (passwordStrength <= 25) return "Weak";
    if (passwordStrength <= 50) return "Fair";
    if (passwordStrength <= 75) return "Good";
    return "Strong";
  };

  const getStrengthColor = () => {
    if (passwordStrength <= 25) return "bg-destructive";
    if (passwordStrength <= 50) return "bg-warning";
    if (passwordStrength <= 75) return "bg-accent";
    return "bg-success";
  };

  const handleSave = () => {
    updateProfile.mutate({
      full_name: formData.full_name,
      phone: formData.phone,
    });
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  const handleCopyAddress = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Wallet address copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSaveWallet = () => {
    if (!walletAddress) {
      toast({
        title: "Error",
        description: "Please enter a valid wallet address",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Wallet Saved",
      description: `Your ${selectedNetwork} wallet address has been saved successfully.`,
    });
  };

  const handlePasswordUpdate = () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }
    if (passwordStrength < 50) {
      toast({
        title: "Weak Password",
        description: "Please choose a stronger password",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Password Updated",
      description: "Your password has been changed successfully.",
    });
    setNewPassword("");
    setConfirmPassword("");
  };

  const tabs: TabItem[] = [
    { value: "profile", label: "Profile Details", icon: <User className="w-5 h-5" /> },
    { value: "security", label: "Security", icon: <Shield className="w-5 h-5" /> },
    { value: "wallet", label: "Withdrawal Wallet", icon: <Wallet className="w-5 h-5" /> },
    { value: "notifications", label: "Notifications", icon: <Bell className="w-5 h-5" /> },
  ];

  return (
    <AppLayout>
      <div className="p-4 lg:p-6 min-h-screen relative">
        {/* Subtle Circuit Lines Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-5">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="circuit" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                <path d="M 0 50 L 30 50 L 35 45 L 45 45 L 50 50 L 100 50" stroke="currentColor" strokeWidth="0.5" fill="none" className="text-primary" />
                <path d="M 50 0 L 50 30 L 55 35 L 55 45 L 50 50 L 50 100" stroke="currentColor" strokeWidth="0.5" fill="none" className="text-primary" />
                <circle cx="50" cy="50" r="3" fill="currentColor" className="text-primary" />
                <circle cx="35" cy="45" r="2" fill="currentColor" className="text-primary" />
                <circle cx="55" cy="35" r="2" fill="currentColor" className="text-primary" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#circuit)" />
          </svg>
        </div>

        {/* Header */}
        <div className="relative mb-6">
          <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Account Settings
          </h1>
          <p className="text-muted-foreground">Manage your profile and preferences</p>
        </div>

        <div className="relative flex flex-col lg:flex-row gap-6">
          {/* Sidebar Tabs - Horizontal on mobile, Vertical on desktop */}
          {isMobile ? (
            <div className="w-full overflow-x-auto pb-2 scrollbar-hide">
              <div className="flex gap-2 min-w-max">
                {tabs.map((tab) => (
                  <button
                    key={tab.value}
                    onClick={() => setActiveTab(tab.value)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 whitespace-nowrap",
                      activeTab === tab.value
                        ? "bg-primary/20 text-primary border border-primary/30"
                        : "bg-card/50 text-muted-foreground hover:bg-card/80 border border-border/50"
                    )}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="w-64 flex-shrink-0 space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setActiveTab(tab.value)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-4 rounded-xl text-left transition-all duration-300",
                    activeTab === tab.value
                      ? "bg-gradient-to-r from-primary/20 to-accent/10 text-primary border border-primary/30 shadow-lg shadow-primary/10"
                      : "bg-card/30 text-muted-foreground hover:bg-card/60 border border-border/30 hover:border-primary/20"
                  )}
                >
                  <div className={cn(
                    "p-2 rounded-lg",
                    activeTab === tab.value ? "bg-primary/20" : "bg-muted/50"
                  )}>
                    {tab.icon}
                  </div>
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}

              {/* Logout Button */}
              <Separator className="my-4" />
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-4 rounded-xl text-left transition-all duration-300 bg-destructive/10 text-destructive hover:bg-destructive/20 border border-destructive/20"
              >
                <div className="p-2 rounded-lg bg-destructive/20">
                  <LogOut className="w-5 h-5" />
                </div>
                <span className="font-medium">Sign Out</span>
              </button>
            </div>
          )}

          {/* Main Content - Glassmorphism Card */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="backdrop-blur-xl bg-card/40 border-border/50 shadow-2xl">
                  {/* Profile Tab */}
                  {activeTab === "profile" && (
                    <>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-xl">
                          <User className="w-5 h-5 text-primary" />
                          Profile Information
                        </CardTitle>
                        <CardDescription>Update your personal details and avatar</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {isLoading ? (
                          <div className="space-y-4">
                            <Skeleton className="h-24 w-24 rounded-full mx-auto" />
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                          </div>
                        ) : (
                          <>
                            {/* Avatar with Glowing Gold Border */}
                            <div className="flex flex-col items-center gap-4">
                              <div className="relative group">
                                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary via-accent to-primary blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
                                <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent p-1">
                                  <div className="w-full h-full rounded-full bg-card flex items-center justify-center">
                                    <span className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                                      {initials}
                                    </span>
                                  </div>
                                </div>
                                <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-xs font-medium shadow-lg hover:scale-110 transition-transform">
                                  Edit
                                </button>
                              </div>
                              <div className="text-center">
                                <div className="flex items-center justify-center gap-2">
                                  <p className="font-bold text-xl">{displayName}</p>
                                  {isVerified && (
                                    <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-success/20 border border-success/30">
                                      <BadgeCheck className="w-4 h-4 text-success" />
                                      <span className="text-xs font-medium text-success">Verified</span>
                                    </div>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground">{profile?.email}</p>
                                {profile?.created_at && (
                                  <p className="text-xs text-muted-foreground flex items-center justify-center gap-1 mt-1">
                                    <Calendar className="w-3 h-3" />
                                    Member since {format(new Date(profile.created_at), "MMMM d, yyyy")}
                                  </p>
                                )}
                              </div>
                            </div>

                            <Separator className="bg-border/50" />

                            {/* Form Fields */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2 md:col-span-2">
                                <Label className="text-muted-foreground">Full Name</Label>
                                <Input 
                                  value={formData.full_name}
                                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                  placeholder="Enter your full name"
                                  className="bg-background/50 border-border/50 focus:border-primary/50"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label className="text-muted-foreground">Email</Label>
                                <Input 
                                  type="email" 
                                  value={formData.email}
                                  disabled
                                  className="bg-muted/30 border-border/30 text-muted-foreground"
                                />
                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Shield className="w-3 h-3" />
                                  Email cannot be changed
                                </p>
                              </div>
                              <div className="space-y-2">
                                <Label className="text-muted-foreground">Phone Number</Label>
                                <Input 
                                  type="tel" 
                                  value={formData.phone}
                                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                  placeholder="+1 (555) 000-0000"
                                  className="bg-background/50 border-border/50 focus:border-primary/50"
                                />
                              </div>
                            </div>

                            <Button 
                              variant="gradient" 
                              size="lg"
                              className="w-full md:w-auto"
                              onClick={handleSave}
                              disabled={updateProfile.isPending}
                            >
                              {updateProfile.isPending ? (
                                <>
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                  Saving...
                                </>
                              ) : (
                                "Save Changes"
                              )}
                            </Button>
                          </>
                        )}
                      </CardContent>
                    </>
                  )}

                  {/* Security Tab */}
                  {activeTab === "security" && (
                    <>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-xl">
                          <Shield className="w-5 h-5 text-primary" />
                          Security Settings
                        </CardTitle>
                        <CardDescription>Manage your password and account security</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* Password Change Section */}
                        <div className="space-y-4 p-4 rounded-xl bg-background/30 border border-border/30">
                          <div className="flex items-center gap-2">
                            <Key className="w-5 h-5 text-primary" />
                            <h3 className="font-semibold">Change Password</h3>
                          </div>
                          
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label className="text-muted-foreground">Current Password</Label>
                              <div className="relative">
                                <Input
                                  type={showPassword ? "text" : "password"}
                                  placeholder="Enter current password"
                                  className="bg-background/50 border-border/50 pr-10"
                                />
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                                  onClick={() => setShowPassword(!showPassword)}
                                >
                                  {showPassword ? (
                                    <EyeOff className="w-4 h-4 text-muted-foreground" />
                                  ) : (
                                    <Eye className="w-4 h-4 text-muted-foreground" />
                                  )}
                                </Button>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label className="text-muted-foreground">New Password</Label>
                              <div className="relative">
                                <Input
                                  type={showNewPassword ? "text" : "password"}
                                  placeholder="Enter new password"
                                  value={newPassword}
                                  onChange={(e) => setNewPassword(e.target.value)}
                                  className="bg-background/50 border-border/50 pr-10"
                                />
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                                  onClick={() => setShowNewPassword(!showNewPassword)}
                                >
                                  {showNewPassword ? (
                                    <EyeOff className="w-4 h-4 text-muted-foreground" />
                                  ) : (
                                    <Eye className="w-4 h-4 text-muted-foreground" />
                                  )}
                                </Button>
                              </div>
                              
                              {/* Password Strength Meter */}
                              {newPassword && (
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between text-xs">
                                    <span className="text-muted-foreground">Password Strength</span>
                                    <span className={cn(
                                      "font-medium",
                                      passwordStrength <= 25 && "text-destructive",
                                      passwordStrength > 25 && passwordStrength <= 50 && "text-warning",
                                      passwordStrength > 50 && passwordStrength <= 75 && "text-accent",
                                      passwordStrength > 75 && "text-success"
                                    )}>
                                      {getStrengthLabel()}
                                    </span>
                                  </div>
                                  <div className="h-2 rounded-full bg-muted/50 overflow-hidden">
                                    <div 
                                      className={cn("h-full transition-all duration-300", getStrengthColor())}
                                      style={{ width: `${passwordStrength}%` }}
                                    />
                                  </div>
                                </div>
                              )}
                            </div>

                            <div className="space-y-2">
                              <Label className="text-muted-foreground">Confirm New Password</Label>
                              <Input
                                type="password"
                                placeholder="Confirm new password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="bg-background/50 border-border/50"
                              />
                            </div>

                            <Button variant="outline" onClick={handlePasswordUpdate} className="border-primary/30 hover:bg-primary/10">
                              Update Password
                            </Button>
                          </div>
                        </div>

                        {/* 2FA Section */}
                        <div className="p-4 rounded-xl bg-success/10 border border-success/20">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-lg bg-success/20">
                                <Smartphone className="w-5 h-5 text-success" />
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className="font-semibold text-success">Two-Factor Authentication</p>
                                  <CheckCircle2 className="w-4 h-4 text-success" />
                                </div>
                                <p className="text-sm text-muted-foreground">Your account is protected with 2FA</p>
                              </div>
                            </div>
                            <Button variant="outline" size="sm" className="border-success/30 text-success hover:bg-success/10">
                              Manage
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </>
                  )}

                  {/* Wallet Tab */}
                  {activeTab === "wallet" && (
                    <>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-xl">
                          <Wallet className="w-5 h-5 text-primary" />
                          Withdrawal Wallet
                        </CardTitle>
                        <CardDescription>Configure your USDT withdrawal address</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* Network Selection */}
                        <div className="space-y-3">
                          <Label className="text-muted-foreground">Select Network</Label>
                          <div className="grid grid-cols-2 gap-3">
                            {(["TRC20", "BEP20"] as const).map((network) => (
                              <button
                                key={network}
                                onClick={() => setSelectedNetwork(network)}
                                className={cn(
                                  "p-4 rounded-xl border transition-all duration-300 text-left",
                                  selectedNetwork === network
                                    ? "bg-primary/20 border-primary/50 shadow-lg shadow-primary/10"
                                    : "bg-card/50 border-border/50 hover:border-primary/30"
                                )}
                              >
                                <p className="font-semibold">{network}</p>
                                <p className="text-xs text-muted-foreground">
                                  {network === "TRC20" ? "TRON Network" : "BNB Smart Chain"}
                                </p>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Wallet Address Input */}
                        <div className="space-y-3 p-4 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/20">
                          <Label className="text-muted-foreground">USDT Wallet Address ({selectedNetwork})</Label>
                          <div className="relative">
                            <Input
                              value={walletAddress}
                              onChange={(e) => setWalletAddress(e.target.value)}
                              placeholder={selectedNetwork === "TRC20" ? "T..." : "0x..."}
                              className="bg-background/50 border-border/50 pr-12 font-mono text-sm"
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                              onClick={handleCopyAddress}
                              disabled={!walletAddress}
                            >
                              {copied ? (
                                <Check className="w-4 h-4 text-success" />
                              ) : (
                                <Copy className="w-4 h-4 text-muted-foreground" />
                              )}
                            </Button>
                          </div>
                          
                          {/* Warning Message */}
                          <div className="flex items-start gap-2 p-3 rounded-lg bg-warning/10 border border-warning/20">
                            <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                            <p className="text-xs text-warning">
                              <strong>Important:</strong> Ensure your address is correct. Dragon AI is not responsible for funds sent to incorrect addresses. Double-check before saving.
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <Button 
                            variant="gradient" 
                            size="lg"
                            onClick={handleSaveWallet}
                            className="flex-1 md:flex-none"
                          >
                            Save Wallet Address
                          </Button>
                          <Button variant="outline" size="lg" className="border-border/50">
                            Cancel
                          </Button>
                        </div>
                      </CardContent>
                    </>
                  )}

                  {/* Notifications Tab */}
                  {activeTab === "notifications" && (
                    <>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-xl">
                          <Bell className="w-5 h-5 text-primary" />
                          Notification Preferences
                        </CardTitle>
                        <CardDescription>Choose how you want to receive updates</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {[
                          {
                            key: "email" as const,
                            icon: <Mail className="w-5 h-5" />,
                            title: "Email Notifications",
                            description: "Receive updates and alerts via email",
                            color: "primary",
                          },
                          {
                            key: "push" as const,
                            icon: <Smartphone className="w-5 h-5" />,
                            title: "Push Notifications",
                            description: "Get instant push alerts on your device",
                            color: "primary",
                          },
                          {
                            key: "trading" as const,
                            icon: <CreditCard className="w-5 h-5" />,
                            title: "Trading Alerts",
                            description: "Be notified about profits and trades",
                            color: "success",
                          },
                          {
                            key: "marketing" as const,
                            icon: <SettingsIcon className="w-5 h-5" />,
                            title: "Marketing & Promotions",
                            description: "Receive news, updates, and offers",
                            color: "muted",
                          },
                        ].map((item, index) => (
                          <div key={item.key}>
                            <div className="flex items-center justify-between p-4 rounded-xl bg-background/30 border border-border/30 hover:border-primary/20 transition-colors">
                              <div className="flex items-center gap-3">
                                <div className={cn(
                                  "p-2 rounded-lg",
                                  item.color === "primary" && "bg-primary/10 text-primary",
                                  item.color === "success" && "bg-success/10 text-success",
                                  item.color === "muted" && "bg-muted text-muted-foreground"
                                )}>
                                  {item.icon}
                                </div>
                                <div>
                                  <p className="font-medium">{item.title}</p>
                                  <p className="text-sm text-muted-foreground">{item.description}</p>
                                </div>
                              </div>
                              <Switch
                                checked={notifications[item.key]}
                                onCheckedChange={(checked) =>
                                  setNotifications({ ...notifications, [item.key]: checked })
                                }
                              />
                            </div>
                            {index < 3 && <div className="h-2" />}
                          </div>
                        ))}

                        <Button 
                          variant="gradient" 
                          size="lg"
                          className="w-full md:w-auto mt-4"
                          onClick={() => toast({
                            title: "Preferences Saved",
                            description: "Your notification preferences have been updated.",
                          })}
                        >
                          Save Preferences
                        </Button>
                      </CardContent>
                    </>
                  )}
                </Card>

                {/* Mobile Logout Button */}
                {isMobile && (
                  <button
                    onClick={handleLogout}
                    className="w-full mt-4 flex items-center justify-center gap-3 px-4 py-4 rounded-xl transition-all duration-300 bg-destructive/10 text-destructive hover:bg-destructive/20 border border-destructive/20"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Sign Out</span>
                  </button>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Settings;
