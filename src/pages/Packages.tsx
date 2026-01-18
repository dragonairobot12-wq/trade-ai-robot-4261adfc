import AppLayout from "@/components/layout/AppLayout";
import Premium3DPackageCard from "@/components/packages/Premium3DPackageCard";
import PackageCarousel from "@/components/packages/PackageCarousel";
import { useInvestments } from "@/hooks/useInvestments";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, Shield, Sparkles } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

// Default features for each package tier
const getPackageFeatures = (price: number): string[] => {
  if (price <= 200) {
    return [
      "AI-powered trading",
      "Daily profit updates",
      "24/7 support",
      "Withdrawal anytime",
    ];
  } else if (price <= 500) {
    return [
      "Enhanced AI algorithms",
      "Daily profit updates",
      "Priority support",
      "Compound interest option",
    ];
  } else if (price <= 1000) {
    return [
      "Advanced AI trading",
      "Real-time analytics",
      "Dedicated support",
      "Auto-reinvestment",
    ];
  } else if (price <= 2000) {
    return [
      "Premium AI engine",
      "Portfolio diversification",
      "VIP support line",
      "Weekly reports",
    ];
  } else if (price <= 3000) {
    return [
      "Elite AI trading",
      "Personal account manager",
      "Custom strategies",
      "Insurance protection",
    ];
  } else if (price <= 4000) {
    return [
      "Institutional-grade AI",
      "24/7 personal manager",
      "Early access features",
      "Bonus rewards",
    ];
  } else if (price <= 5000) {
    return [
      "Cutting-edge AI",
      "Private trading room",
      "Exclusive insights",
      "Priority withdrawals",
    ];
  } else {
    return [
      "All premium features",
      "1-on-1 consultations",
      "Highest priority",
      "Exclusive VIP events",
    ];
  }
};

// Map risk level from DB to display format
const mapRiskLevel = (risk: string): "Low" | "Medium" | "Medium-High" | "High" => {
  const riskMap: Record<string, "Low" | "Medium" | "Medium-High" | "High"> = {
    low: "Low",
    medium: "Medium",
    "medium-high": "Medium-High",
    high: "High",
  };
  return riskMap[risk.toLowerCase()] || "Medium";
};

const LoadingSkeletonMobile = () => (
  <div className="relative p-4 bg-card rounded-2xl border border-border/50 overflow-hidden h-[400px]">
    <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-secondary/50 to-transparent" />
    <div className="absolute -top-2 right-4">
      <Skeleton className="w-12 h-12 rounded-xl" />
    </div>
    <div className="pt-6">
      <div className="text-center mb-4">
        <Skeleton className="h-3 w-20 mx-auto mb-2" />
        <Skeleton className="h-10 w-28 mx-auto" />
      </div>
      <div className="grid grid-cols-3 gap-2 mb-4">
        <Skeleton className="h-16 rounded-xl" />
        <Skeleton className="h-16 rounded-xl" />
        <Skeleton className="h-16 rounded-xl" />
      </div>
      <Skeleton className="h-16 rounded-xl mb-4" />
      <div className="space-y-2 mb-4">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
        <Skeleton className="h-3 w-4/5" />
      </div>
      <Skeleton className="h-10 w-full rounded-lg" />
    </div>
  </div>
);

const LoadingSkeleton = () => (
  <div className="relative p-5 md:p-6 bg-card rounded-2xl border border-border/50 overflow-hidden">
    <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-secondary/50 to-transparent" />
    <div className="absolute -top-2 right-4">
      <Skeleton className="w-14 h-14 rounded-xl" />
    </div>
    <div className="pt-6">
      <div className="text-center mb-4">
        <Skeleton className="h-3 w-20 mx-auto mb-2" />
        <Skeleton className="h-10 w-28 mx-auto" />
      </div>
      <div className="grid grid-cols-3 gap-2 mb-4">
        <Skeleton className="h-20 rounded-xl" />
        <Skeleton className="h-20 rounded-xl" />
        <Skeleton className="h-20 rounded-xl" />
      </div>
      <Skeleton className="h-20 rounded-xl mb-4" />
      <div className="space-y-2 mb-5">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-4 w-full" />
      </div>
      <Skeleton className="h-11 w-full rounded-lg" />
    </div>
  </div>
);

const Packages = () => {
  const { packages, isLoading, createInvestment } = useInvestments();
  const isMobile = useIsMobile();

  const handleInvest = (packageId: string, amount: number) => {
    createInvestment.mutate({ packageId, amount });
  };

  // Sort packages by price
  const sortedPackages = [...(packages || [])].sort((a, b) => a.price - b.price);

  const packageCards = sortedPackages.map((pkg, index) => (
    <Premium3DPackageCard
      key={pkg.id}
      id={pkg.id}
      amount={pkg.price}
      name={pkg.name}
      roi={`${pkg.roi}%`}
      duration={`${pkg.duration_days} days`}
      riskLevel={mapRiskLevel(pkg.risk_level)}
      strategy={pkg.ai_strategy || pkg.description || "AI-powered trading strategy"}
      features={getPackageFeatures(pkg.price)}
      popular={index === 2}
      vip={index === sortedPackages.length - 1}
      tierIndex={index}
      onInvest={handleInvest}
      isInvesting={createInvestment.isPending}
    />
  ));

  return (
    <AppLayout>
      <div className="p-4 lg:p-6 space-y-6">
        {/* Compact Header for Mobile */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium">
            <Sparkles className="w-3 h-3" />
            AI Investment Packages
          </div>
          
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold">
            Choose Your <span className="text-gradient">Plan</span>
          </h1>
          
          <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto hidden md:block">
            Unlock the power of AI-driven wealth management. Select a package that matches your goals.
          </p>
          
          {/* Compact Stats - Only on Desktop */}
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
              <span className="text-muted-foreground"><span className="font-semibold text-foreground">Secure</span> & Insured</span>
            </div>
          </div>
        </div>

        {/* Mobile: Horizontal Swipeable Carousel */}
        {isMobile ? (
          <div className="-mx-4">
            {isLoading ? (
              <div className="px-4">
                <LoadingSkeletonMobile />
              </div>
            ) : (
              <div className="px-2">
                <PackageCarousel>
                  {packageCards}
                </PackageCarousel>
              </div>
            )}
          </div>
        ) : (
          /* Desktop: Grid Layout */
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {isLoading ? (
              Array.from({ length: 8 }).map((_, index) => (
                <LoadingSkeleton key={index} />
              ))
            ) : (
              packageCards
            )}
          </div>
        )}

        {/* Trust Indicators - Compact on Mobile */}
        <div className="grid grid-cols-4 gap-2 md:gap-4">
          <div className="p-2 md:p-4 bg-card rounded-xl border border-border/50 text-center">
            <div className="text-lg md:text-2xl font-bold text-gradient">$50M+</div>
            <div className="text-[10px] md:text-xs text-muted-foreground">Invested</div>
          </div>
          <div className="p-2 md:p-4 bg-card rounded-xl border border-border/50 text-center">
            <div className="text-lg md:text-2xl font-bold text-gradient">25K+</div>
            <div className="text-[10px] md:text-xs text-muted-foreground">Investors</div>
          </div>
          <div className="p-2 md:p-4 bg-card rounded-xl border border-border/50 text-center">
            <div className="text-lg md:text-2xl font-bold text-gradient">99.9%</div>
            <div className="text-[10px] md:text-xs text-muted-foreground">Uptime</div>
          </div>
          <div className="p-2 md:p-4 bg-card rounded-xl border border-border/50 text-center">
            <div className="text-lg md:text-2xl font-bold text-gradient">24/7</div>
            <div className="text-[10px] md:text-xs text-muted-foreground">AI Active</div>
          </div>
        </div>

        {/* Disclaimer - Collapsible style on mobile */}
        <div className="p-3 md:p-4 bg-secondary/30 rounded-xl border border-border/30 text-center">
          <p className="text-[10px] md:text-xs text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Risk Disclosure:</strong> All investments involve risk. Past performance is not indicative of future results.
          </p>
        </div>
      </div>
    </AppLayout>
  );
};

export default Packages;
