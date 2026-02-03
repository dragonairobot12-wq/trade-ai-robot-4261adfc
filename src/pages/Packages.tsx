import AppLayout from "@/components/layout/AppLayout";
import DragonPackageCard from "@/components/packages/DragonPackageCard";
import { useInvestments } from "@/hooks/useInvestments";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, Shield, Sparkles, Flame } from "lucide-react";
import { motion } from "framer-motion";

// Get package features based on price tier
const getPackageFeatures = (price: number): string[] => {
  if (price <= 150) {
    return ["AI-powered trading", "Daily profit updates", "24/7 support", "Withdrawal anytime"];
  } else if (price <= 300) {
    return ["Smart entry detection", "Multi-market analysis", "Priority support", "Risk optimization"];
  } else if (price <= 500) {
    return ["Advanced AI algorithms", "Portfolio insights", "VIP support", "Compound interest"];
  } else if (price <= 1000) {
    return ["Premium AI engine", "Real-time analytics", "Personal advisor", "Weekly reports"];
  } else if (price <= 2000) {
    return ["Institutional AI", "24/7 manager", "Custom strategies", "Insurance protection"];
  } else if (price <= 3000) {
    return ["Elite AI trading", "Personal manager", "Early access", "Bonus rewards"];
  } else if (price <= 4000) {
    return ["Dark pool access", "Stealth trading", "Exclusive insights", "Priority withdrawals"];
  } else {
    return ["Legendary AI tier", "Private trading room", "Highest priority", "Exclusive VIP perks"];
  }
};

// Get wait period based on package (all packages use 25-day wait period)
const getWaitPeriod = () => 25;

// Map risk level from DB to display format
const mapRiskLevel = (risk: string): "Low" | "Medium" | "Medium-High" | "High" => {
  const riskMap: Record<string, "Low" | "Medium" | "Medium-High" | "High"> = {
    "low": "Low",
    "medium": "Medium",
    "medium-high": "Medium-High",
    "high": "High",
    "Low": "Low",
    "Medium": "Medium",
    "Medium-High": "Medium-High",
    "High": "High",
  };
  return riskMap[risk] || "Medium";
};

const LoadingSkeletonMobile = () => (
  <div className="relative p-4 bg-card rounded-2xl border border-border/50 overflow-hidden h-[380px]">
    <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-secondary/50 to-transparent" />
    <div className="absolute -top-2 right-4">
      <Skeleton className="w-14 h-14 rounded-full" />
    </div>
    <div className="pt-8">
      <div className="text-center mb-3">
        <Skeleton className="h-2 w-16 mx-auto mb-2" />
        <Skeleton className="h-8 w-24 mx-auto" />
      </div>
      <div className="grid grid-cols-3 gap-1.5 mb-3">
        <Skeleton className="h-14 rounded-lg" />
        <Skeleton className="h-14 rounded-lg" />
        <Skeleton className="h-14 rounded-lg" />
      </div>
      <Skeleton className="h-14 rounded-lg mb-3" />
      <div className="space-y-1.5 mb-4">
        <Skeleton className="h-2 w-full" />
        <Skeleton className="h-2 w-5/6" />
        <Skeleton className="h-2 w-4/5" />
      </div>
      <Skeleton className="h-9 w-full rounded-lg" />
    </div>
  </div>
);

const LoadingSkeleton = () => (
  <div className="relative p-4 md:p-5 bg-card rounded-2xl border border-border/50 overflow-hidden">
    <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-secondary/50 to-transparent" />
    <div className="absolute -top-4 right-3">
      <Skeleton className="w-16 h-16 rounded-full" />
    </div>
    <div className="pt-10">
      <div className="text-center mb-3">
        <Skeleton className="h-2.5 w-20 mx-auto mb-1" />
        <Skeleton className="h-7 w-20 mx-auto" />
      </div>
      <div className="grid grid-cols-3 gap-1.5 mb-3">
        <Skeleton className="h-16 rounded-lg" />
        <Skeleton className="h-16 rounded-lg" />
        <Skeleton className="h-16 rounded-lg" />
      </div>
      <Skeleton className="h-16 rounded-lg mb-3" />
      <div className="space-y-1.5 mb-4">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
        <Skeleton className="h-3 w-4/5" />
      </div>
      <Skeleton className="h-9 w-full rounded-lg" />
    </div>
  </div>
);

const Packages = () => {
  const { packages, createInvestment, isLoading } = useInvestments();

  const handleInvest = (packageId: string, amount: number) => {
    createInvestment.mutate({ packageId, amount });
  };

  // Sort packages by price
  const sortedPackages = [...(packages || [])].sort((a, b) => a.price - b.price);

  return (
    <AppLayout>
      <div className="p-4 lg:p-6 space-y-6">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto space-y-3"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium">
            <Flame className="w-3 h-3" />
            Dragon AI Investment Tiers
          </div>
          
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold">
            Activate Your <span className="text-gradient">Dragon Node</span>
          </h1>
          
          <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto hidden md:block">
            Choose from 10 premium Dragon AI investment tiers. Each tier unlocks unique trading power with 25-day activation period.
          </p>
          
          {/* Stats - Only on Desktop */}
          <div className="hidden md:flex flex-wrap justify-center gap-6 pt-2">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-success" />
              </div>
              <span className="text-muted-foreground">Up to <span className="font-semibold text-foreground">35% ROI</span></span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Shield className="w-4 h-4 text-primary" />
              </div>
              <span className="text-muted-foreground"><span className="font-semibold text-foreground">25 Day</span> Lock Period</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-8 h-8 rounded-lg bg-chart-3/10 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-chart-3" />
              </div>
              <span className="text-muted-foreground"><span className="font-semibold text-foreground">{sortedPackages.length}</span> Dragon Tiers</span>
            </div>
          </div>
        </motion.div>

        {/* Desktop: 2x5 Grid Layout */}
        <div className="hidden md:grid grid-cols-5 gap-4 lg:gap-5">
          {isLoading ? (
            Array.from({ length: 10 }).map((_, index) => (
              <LoadingSkeleton key={index} />
            ))
          ) : (
            sortedPackages.map((pkg, index) => (
              <DragonPackageCard
                key={pkg.id}
                id={pkg.id}
                amount={pkg.price}
                name={pkg.name}
                roi={`${pkg.roi}%`}
                duration={`${pkg.duration_days} days`}
                durationDays={pkg.duration_days}
                waitPeriod={getWaitPeriod()}
                riskLevel={mapRiskLevel(pkg.risk_level)}
                strategy={pkg.ai_strategy || pkg.description || "AI-powered trading strategy"}
                features={getPackageFeatures(pkg.price)}
                popular={index === 4}
                vip={index === sortedPackages.length - 1}
                tierIndex={index}
                onInvest={handleInvest}
                isInvesting={createInvestment.isPending}
              />
            ))
          )}
        </div>

        {/* Mobile: Vertical Scroll */}
        <div className="md:hidden space-y-4 pb-4">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <LoadingSkeletonMobile key={index} />
            ))
          ) : (
            sortedPackages.map((pkg, index) => (
              <DragonPackageCard
                key={pkg.id}
                id={pkg.id}
                amount={pkg.price}
                name={pkg.name}
                roi={`${pkg.roi}%`}
                duration={`${pkg.duration_days} days`}
                durationDays={pkg.duration_days}
                waitPeriod={getWaitPeriod()}
                riskLevel={mapRiskLevel(pkg.risk_level)}
                strategy={pkg.ai_strategy || pkg.description || "AI-powered trading strategy"}
                features={getPackageFeatures(pkg.price)}
                popular={index === 4}
                vip={index === sortedPackages.length - 1}
                tierIndex={index}
                onInvest={handleInvest}
                isInvesting={createInvestment.isPending}
              />
            ))
          )}
        </div>

        {/* Trust Indicators */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="grid grid-cols-4 gap-2 md:gap-4"
        >
          <div className="p-2 md:p-4 bg-card rounded-xl border border-border/50 text-center">
            <div className="text-lg md:text-2xl font-bold text-gradient">$50M+</div>
            <div className="text-[10px] md:text-xs text-muted-foreground">Invested</div>
          </div>
          <div className="p-2 md:p-4 bg-card rounded-xl border border-border/50 text-center">
            <div className="text-lg md:text-2xl font-bold text-gradient">25K+</div>
            <div className="text-[10px] md:text-xs text-muted-foreground">Dragon Nodes</div>
          </div>
          <div className="p-2 md:p-4 bg-card rounded-xl border border-border/50 text-center">
            <div className="text-lg md:text-2xl font-bold text-gradient">99.9%</div>
            <div className="text-[10px] md:text-xs text-muted-foreground">Uptime</div>
          </div>
          <div className="p-2 md:p-4 bg-card rounded-xl border border-border/50 text-center">
            <div className="text-lg md:text-2xl font-bold text-gradient">24/7</div>
            <div className="text-[10px] md:text-xs text-muted-foreground">AI Active</div>
          </div>
        </motion.div>

        {/* Disclaimer */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="p-3 md:p-4 bg-secondary/30 rounded-xl border border-border/30 text-center"
        >
          <p className="text-[10px] md:text-xs text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Risk Disclosure:</strong> All investments involve risk. ROI begins after the 25-day activation period. 
            Past performance is simulated/backtested and not indicative of future results. Please invest responsibly.
          </p>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default Packages;
