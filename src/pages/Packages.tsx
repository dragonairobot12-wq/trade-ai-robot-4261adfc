import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import InvestmentPackageCard from "@/components/packages/InvestmentPackageCard";

const packages = [
  {
    amount: 100,
    name: "Starter Package",
    roi: "15%",
    duration: "30 days",
    riskLevel: "Low" as const,
    strategy: "Conservative algorithm focusing on stable crypto and forex pairs with minimal volatility exposure.",
    features: [
      "AI-powered trading",
      "Daily profit updates",
      "24/7 support",
      "Withdrawal anytime",
    ],
  },
  {
    amount: 300,
    name: "Basic Package",
    roi: "20%",
    duration: "30 days",
    riskLevel: "Low" as const,
    strategy: "Balanced approach combining low-risk forex trading with select cryptocurrency opportunities.",
    features: [
      "Enhanced AI algorithms",
      "Daily profit updates",
      "Priority support",
      "Compound interest option",
    ],
  },
  {
    amount: 600,
    name: "Standard Package",
    roi: "25%",
    duration: "30 days",
    riskLevel: "Medium" as const,
    strategy: "Multi-market strategy across forex, crypto, and commodities with dynamic risk management.",
    features: [
      "Advanced AI trading",
      "Real-time analytics",
      "Dedicated support",
      "Auto-reinvestment",
    ],
    popular: true,
  },
  {
    amount: 1000,
    name: "Professional Package",
    roi: "30%",
    duration: "30 days",
    riskLevel: "Medium" as const,
    strategy: "Aggressive growth algorithm leveraging market volatility with sophisticated hedging techniques.",
    features: [
      "Premium AI engine",
      "Portfolio diversification",
      "VIP support line",
      "Weekly reports",
    ],
  },
  {
    amount: 1800,
    name: "Advanced Package",
    roi: "35%",
    duration: "30 days",
    riskLevel: "Medium-High" as const,
    strategy: "High-frequency trading algorithm with real-time market sentiment analysis and arbitrage detection.",
    features: [
      "Elite AI trading",
      "Personal account manager",
      "Custom strategies",
      "Insurance protection",
    ],
  },
  {
    amount: 2500,
    name: "Premium Package",
    roi: "38%",
    duration: "30 days",
    riskLevel: "Medium-High" as const,
    strategy: "Multi-layered neural network analyzing global markets with predictive modeling capabilities.",
    features: [
      "Institutional-grade AI",
      "24/7 personal manager",
      "Early access features",
      "Bonus rewards",
    ],
  },
  {
    amount: 3500,
    name: "Elite Package",
    roi: "42%",
    duration: "30 days",
    riskLevel: "High" as const,
    strategy: "Maximum growth potential using advanced machine learning with quantum-inspired optimization.",
    features: [
      "Cutting-edge AI",
      "Private trading room",
      "Exclusive insights",
      "Priority withdrawals",
    ],
  },
  {
    amount: 5000,
    name: "VIP Package",
    roi: "45%",
    duration: "30 days",
    riskLevel: "High" as const,
    strategy: "Ultimate AI suite combining all strategies with personalized risk management and maximum return potential.",
    features: [
      "All premium features",
      "1-on-1 consultations",
      "Highest priority",
      "Exclusive VIP events",
    ],
    vip: true,
  },
];

const Packages = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-24 md:pt-28 pb-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Investment <span className="text-gradient">Packages</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Choose the perfect plan for your investment goals. All packages include our cutting-edge AI trading technology.
            </p>
          </div>

          {/* Packages Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {packages.map((pkg, index) => (
              <InvestmentPackageCard key={index} {...pkg} />
            ))}
          </div>

          {/* Disclaimer */}
          <div className="mt-12 p-6 bg-secondary/50 rounded-2xl text-center">
            <p className="text-sm text-muted-foreground">
              <strong>Risk Disclosure:</strong> All investments involve risk. Past performance is not indicative of future results. 
              Please invest responsibly and only with funds you can afford to lose.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Packages;
