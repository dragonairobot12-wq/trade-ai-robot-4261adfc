import AppLayout from "@/components/layout/AppLayout";
import InvestmentPackageCard from "@/components/packages/InvestmentPackageCard";
import { useInvestments } from "@/hooks/useInvestments";
import { Skeleton } from "@/components/ui/skeleton";

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

const Packages = () => {
  const { packages, isLoading, createInvestment } = useInvestments();

  const handleInvest = (packageId: string, amount: number) => {
    createInvestment.mutate({ packageId, amount });
  };

  return (
    <AppLayout>
      <div className="p-4 lg:p-6 space-y-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            Investment <span className="text-gradient">Packages</span>
          </h1>
          <p className="text-muted-foreground">
            Choose the perfect plan for your investment goals. All packages include our cutting-edge AI trading technology.
          </p>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {isLoading ? (
            // Loading skeletons
            Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="p-6 bg-card rounded-2xl border border-border">
                <div className="text-center mb-6">
                  <Skeleton className="h-4 w-24 mx-auto mb-2" />
                  <Skeleton className="h-10 w-32 mx-auto" />
                </div>
                <div className="grid grid-cols-3 gap-3 mb-6">
                  <Skeleton className="h-20 rounded-xl" />
                  <Skeleton className="h-20 rounded-xl" />
                  <Skeleton className="h-20 rounded-xl" />
                </div>
                <Skeleton className="h-24 rounded-xl mb-6" />
                <div className="space-y-3 mb-8">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
                <Skeleton className="h-12 w-full rounded-lg" />
              </div>
            ))
          ) : (
            packages.map((pkg, index) => (
              <InvestmentPackageCard
                key={pkg.id}
                id={pkg.id}
                amount={pkg.price}
                name={pkg.name}
                roi={`${pkg.roi}%`}
                duration={`${pkg.duration_days} days`}
                riskLevel={mapRiskLevel(pkg.risk_level)}
                strategy={pkg.ai_strategy || pkg.description || "AI-powered trading strategy"}
                features={getPackageFeatures(pkg.price)}
                popular={index === 2} // 3rd package is popular
                vip={index === packages.length - 1} // Last package is VIP
                onInvest={handleInvest}
                isInvesting={createInvestment.isPending}
              />
            ))
          )}
        </div>

        {/* Disclaimer */}
        <div className="p-4 bg-secondary/50 rounded-xl text-center">
          <p className="text-xs text-muted-foreground">
            <strong>Risk Disclosure:</strong> All investments involve risk. Past performance is not indicative of future results.
            Please invest responsibly and only with funds you can afford to lose.
          </p>
        </div>
      </div>
    </AppLayout>
  );
};

export default Packages;
