import AppLayout from "@/components/layout/AppLayout";
import DragonPackageCard from "@/components/packages/DragonPackageCard";
import { useInvestments } from "@/hooks/useInvestments";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, Shield, Sparkles, Flame } from "lucide-react";
import { motion } from "framer-motion";

// Dragon AI Package Configuration
const dragonPackages = [
  {
    price: 100,
    name: "Emerald Egg",
    roi: 12,
    waitPeriod: 25,
    durationDays: 60,
    riskLevel: "Low" as const,
    strategy: "Entry-level Dragon AI trading with conservative risk management and steady growth patterns.",
    features: ["AI-powered trading", "Daily profit updates", "24/7 support", "Withdrawal anytime"],
  },
  {
    price: 150,
    name: "Sapphire Egg",
    roi: 14,
    waitPeriod: 25,
    durationDays: 60,
    riskLevel: "Low" as const,
    strategy: "Enhanced Dragon algorithms with improved market analysis and optimized entry points.",
    features: ["Smart entry detection", "Daily profit updates", "Priority support", "Auto-compound option"],
  },
  {
    price: 200,
    name: "Bronze Egg",
    roi: 16,
    waitPeriod: 25,
    durationDays: 60,
    riskLevel: "Low" as const,
    strategy: "Balanced Dragon AI with multi-market scanning and dynamic position sizing.",
    features: ["Multi-market analysis", "Real-time alerts", "Dedicated support", "Risk optimization"],
  },
  {
    price: 300,
    name: "Silver Drake Node",
    roi: 18,
    waitPeriod: 25,
    durationDays: 60,
    riskLevel: "Medium" as const,
    strategy: "Young Drake AI unlocked for intermediate traders with enhanced pattern recognition.",
    features: ["Advanced AI algorithms", "Portfolio insights", "VIP support", "Compound interest"],
  },
  {
    price: 500,
    name: "Golden Fire Protocol",
    roi: 20,
    waitPeriod: 25,
    durationDays: 60,
    riskLevel: "Medium" as const,
    strategy: "Gold Drake engine with aggressive growth strategies and smart hedging mechanisms.",
    features: ["Premium AI engine", "Real-time analytics", "Personal advisor", "Weekly reports"],
  },
  {
    price: 1000,
    name: "Platinum Flame",
    roi: 22,
    waitPeriod: 25,
    durationDays: 90,
    riskLevel: "Medium" as const,
    strategy: "Platinum-tier Dragon AI with institutional-grade analysis and maximized efficiency.",
    features: ["Institutional AI", "24/7 manager", "Custom strategies", "Insurance protection"],
  },
  {
    price: 2000,
    name: "Ruby Dragon Core",
    roi: 25,
    waitPeriod: 25,
    durationDays: 90,
    riskLevel: "Medium-High" as const,
    strategy: "Ancient Ruby Dragon awakened for high-yield trading with advanced risk controls.",
    features: ["Elite AI trading", "Personal manager", "Early access", "Bonus rewards"],
  },
  {
    price: 3000,
    name: "Obsidian Shadow",
    roi: 28,
    waitPeriod: 25,
    durationDays: 90,
    riskLevel: "Medium-High" as const,
    strategy: "Obsidian Dragon protocol with dark pool access and stealth trading capabilities.",
    features: ["Dark pool access", "Stealth trading", "Exclusive insights", "Priority withdrawals"],
  },
  {
    price: 4000,
    name: "Diamond Wyrm",
    roi: 32,
    waitPeriod: 25,
    durationDays: 90,
    riskLevel: "High" as const,
    strategy: "Diamond Dragon engine with maximum AI power and multi-asset optimization.",
    features: ["Maximum AI power", "Multi-asset trading", "1-on-1 consultations", "VIP events"],
  },
  {
    price: 5000,
    name: "Elder Dragon Master",
    roi: 35,
    waitPeriod: 25,
    durationDays: 90,
    riskLevel: "High" as const,
    strategy: "The legendary Elder Dragon - ultimate AI power with exclusive access to premium markets.",
    features: ["Legendary AI tier", "Private trading room", "Highest priority", "Exclusive VIP perks"],
  },
];

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
  const { createInvestment, isLoading } = useInvestments();

  const handleInvest = (packageId: string, amount: number) => {
    createInvestment.mutate({ packageId, amount });
  };

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
              <span className="text-muted-foreground"><span className="font-semibold text-foreground">10</span> Dragon Tiers</span>
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
            dragonPackages.map((pkg, index) => (
              <DragonPackageCard
                key={index}
                id={`dragon-package-${index + 1}`}
                amount={pkg.price}
                name={pkg.name}
                roi={`${pkg.roi}%`}
                duration={`${pkg.durationDays} days`}
                durationDays={pkg.durationDays}
                waitPeriod={pkg.waitPeriod}
                riskLevel={pkg.riskLevel}
                strategy={pkg.strategy}
                features={pkg.features}
                popular={index === 4}
                vip={index === 9}
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
            dragonPackages.map((pkg, index) => (
              <DragonPackageCard
                key={index}
                id={`dragon-package-${index + 1}`}
                amount={pkg.price}
                name={pkg.name}
                roi={`${pkg.roi}%`}
                duration={`${pkg.durationDays} days`}
                durationDays={pkg.durationDays}
                waitPeriod={pkg.waitPeriod}
                riskLevel={pkg.riskLevel}
                strategy={pkg.strategy}
                features={pkg.features}
                popular={index === 4}
                vip={index === 9}
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
