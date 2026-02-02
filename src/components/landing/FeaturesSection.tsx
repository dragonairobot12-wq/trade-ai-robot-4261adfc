import { Shield, FileText, PieChart, Bell, BarChart3, Lock } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Risk Engine & Position Sizing",
    description: "Dynamic position sizing based on volatility, correlation, and portfolio-level exposure limits.",
  },
  {
    icon: FileText,
    title: "Transparent Logs & Audit Trail",
    description: "Every trade decision is logged with full context for compliance and post-trade analysis.",
  },
  {
    icon: PieChart,
    title: "Portfolio Exposure Controls",
    description: "Set sector limits, asset concentration caps, and drawdown thresholds to manage risk.",
  },
  {
    icon: Bell,
    title: "Strategy Monitoring & Alerts",
    description: "Real-time alerts for position changes, risk breaches, and performance anomalies.",
  },
  {
    icon: BarChart3,
    title: "Reporting & Analytics",
    description: "Comprehensive dashboards with Sharpe ratio, drawdown analysis, and attribution reports.",
  },
  {
    icon: Lock,
    title: "Secure Auth + Data Layer",
    description: "Enterprise-grade security with encrypted data storage and role-based access controls.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-20 md:py-32 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Built for <span className="text-gradient">Institutional Standards</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Our platform is designed with the risk management and transparency requirements that sophisticated investors demand.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-6 md:p-8 bg-card rounded-2xl border border-border shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-14 h-14 gradient-primary rounded-xl flex items-center justify-center mb-6 group-hover:shadow-glow transition-shadow">
                <feature.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
