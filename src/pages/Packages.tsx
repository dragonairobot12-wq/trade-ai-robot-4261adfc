import { useRef, useState, useEffect } from "react";
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

const LoadingSkeleton = ({ isMobile = false }: { isMobile?: boolean }) => (
  <div className={`relative ${isMobile ? 'p-4 min-w-[80vw]' : 'p-4'} bg-card/50 backdrop-blur-xl rounded-2xl border border-border/30 overflow-hidden ${isMobile ? 'h-[420px]' : 'h-[340px]'}`}>
    <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-secondary/30 to-transparent" />
    <div className="pt-10 space-y-3">
      <div className="absolute -top-4 right-3">
        <Skeleton className="w-16 h-16 rounded-full" />
      </div>
      <div className="text-center">
        <Skeleton className="h-3 w-20 mx-auto mb-2" />
        <Skeleton className="h-8 w-24 mx-auto" />
      </div>
      <div className="grid grid-cols-3 gap-1.5">
        <Skeleton className="h-16 rounded-lg" />
        <Skeleton className="h-16 rounded-lg" />
        <Skeleton className="h-16 rounded-lg" />
      </div>
      <Skeleton className="h-16 rounded-lg" />
      <div className="space-y-1.5">
        <Skeleton className="h-2.5 w-full" />
        <Skeleton className="h-2.5 w-5/6" />
        <Skeleton className="h-2.5 w-4/5" />
      </div>
      <Skeleton className="h-10 w-full rounded-lg" />
    </div>
  </div>
);

// Scroll Progress Indicator Component
const ScrollProgressIndicator = ({ 
  total, 
  current 
}: { 
  total: number; 
  current: number;
}) => (
  <div className="flex items-center justify-center gap-1.5 py-4">
    {Array.from({ length: total }).map((_, index) => (
      <motion.div
        key={index}
        className={`rounded-full transition-all duration-300 ${
          index === current 
            ? 'bg-primary w-6 h-2' 
            : 'bg-muted-foreground/30 w-2 h-2'
        }`}
        initial={false}
        animate={{
          scale: index === current ? 1 : 0.8,
          opacity: index === current ? 1 : 0.5,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      />
    ))}
  </div>
);

const Packages = () => {
  const { packages, createInvestment, isLoading } = useInvestments();
  const carouselRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  const handleInvest = (packageId: string, amount: number) => {
    createInvestment.mutate({ packageId, amount });
  };

  // Sort packages by price
  const sortedPackages = [...(packages || [])].sort((a, b) => a.price - b.price);

  // Handle scroll to update current index
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const handleScroll = () => {
      const scrollLeft = carousel.scrollLeft;
      const cardWidth = carousel.offsetWidth * 0.8 + 16; // 80vw + gap
      const index = Math.round(scrollLeft / cardWidth);
      setCurrentIndex(Math.min(index, sortedPackages.length - 1));
      
      // Calculate scroll progress (0-1)
      const maxScroll = carousel.scrollWidth - carousel.offsetWidth;
      setScrollProgress(maxScroll > 0 ? scrollLeft / maxScroll : 0);
    };

    carousel.addEventListener('scroll', handleScroll, { passive: true });
    return () => carousel.removeEventListener('scroll', handleScroll);
  }, [sortedPackages.length]);

  return (
    <AppLayout>
      <div className="relative min-h-screen">
        {/* Ambient Light Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-primary/10 via-chart-3/5 to-transparent blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/3 left-1/4 w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-chart-3/10 via-primary/5 to-transparent blur-[100px]" />
          <div className="absolute top-1/2 right-1/4 w-[300px] h-[300px] rounded-full bg-gradient-to-bl from-success/8 to-transparent blur-[80px]" />
        </div>

        <div className="relative z-10 p-4 lg:p-6 space-y-4 lg:space-y-6 max-w-[1400px] mx-auto">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto space-y-3"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium backdrop-blur-sm">
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
                <div className="w-8 h-8 rounded-lg bg-success/10 backdrop-blur-sm flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-success" />
                </div>
                <span className="text-muted-foreground">Up to <span className="font-semibold text-foreground">35% ROI</span></span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-8 h-8 rounded-lg bg-primary/10 backdrop-blur-sm flex items-center justify-center">
                  <Shield className="w-4 h-4 text-primary" />
                </div>
                <span className="text-muted-foreground"><span className="font-semibold text-foreground">25 Day</span> Lock Period</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-8 h-8 rounded-lg bg-chart-3/10 backdrop-blur-sm flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-chart-3" />
                </div>
                <span className="text-muted-foreground"><span className="font-semibold text-foreground">{sortedPackages.length}</span> Dragon Tiers</span>
              </div>
            </div>
          </motion.div>

          {/* Desktop: 5-column Grid (2 rows) */}
          <div className="hidden lg:grid grid-cols-5 gap-6">
            {isLoading ? (
              Array.from({ length: 10 }).map((_, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <LoadingSkeleton />
                </motion.div>
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
                  layout="desktop"
                />
              ))
            )}
          </div>

          {/* Tablet: 2-column Grid */}
          <div className="hidden md:grid lg:hidden grid-cols-2 gap-6">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <LoadingSkeleton />
                </motion.div>
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
                  layout="tablet"
                />
              ))
            )}
          </div>

          {/* Mobile: Horizontal Swipeable Carousel */}
          <div className="md:hidden -mx-4">
            {/* Scroll Progress Bar */}
            <div className="px-4 mb-2">
              <div className="h-1 bg-muted/30 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-primary to-chart-3 rounded-full"
                  style={{ width: `${10 + scrollProgress * 90}%` }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              </div>
            </div>

            {/* Carousel Container */}
            <div 
              ref={carouselRef}
              className="flex gap-4 overflow-x-auto px-4 pb-2 carousel-scroll-snap"
              style={{
                scrollSnapType: 'x mandatory',
                scrollBehavior: 'smooth',
                WebkitOverflowScrolling: 'touch',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
            >
              {isLoading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <div 
                    key={index} 
                    className="flex-shrink-0"
                    style={{ 
                      width: '80vw',
                      scrollSnapAlign: 'center',
                    }}
                  >
                    <LoadingSkeleton isMobile />
                  </div>
                ))
              ) : (
                sortedPackages.map((pkg, index) => (
                  <div 
                    key={pkg.id}
                    className="flex-shrink-0"
                    style={{ 
                      width: '80vw',
                      scrollSnapAlign: 'center',
                    }}
                  >
                    <DragonPackageCard
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
                      layout="carousel"
                      isActive={index === currentIndex}
                      scrollProgress={scrollProgress}
                    />
                  </div>
                ))
              )}
            </div>

            {/* Dot Indicators */}
            <ScrollProgressIndicator 
              total={sortedPackages.length} 
              current={currentIndex} 
            />
          </div>

          {/* Trust Indicators */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="grid grid-cols-4 gap-2 md:gap-4"
          >
            {[
              { value: "$50M+", label: "Invested" },
              { value: "25K+", label: "Dragon Nodes" },
              { value: "99.9%", label: "Uptime" },
              { value: "24/7", label: "AI Active" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.4 + index * 0.05 }}
                className="p-2 md:p-4 bg-card/50 backdrop-blur-xl rounded-xl border border-border/30 text-center hover:border-primary/30 transition-colors duration-300"
              >
                <div className="text-lg md:text-2xl font-bold text-gradient">{stat.value}</div>
                <div className="text-[10px] md:text-xs text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Disclaimer */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="p-3 md:p-4 bg-secondary/20 backdrop-blur-xl rounded-xl border border-border/20 text-center"
          >
            <p className="text-[10px] md:text-xs text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Risk Disclosure:</strong> All investments involve risk. ROI begins after the 25-day activation period. 
              Past performance is simulated/backtested and not indicative of future results. Please invest responsibly.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Hide scrollbar CSS */}
      <style>{`
        .carousel-scroll-snap::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </AppLayout>
  );
};

export default Packages;
