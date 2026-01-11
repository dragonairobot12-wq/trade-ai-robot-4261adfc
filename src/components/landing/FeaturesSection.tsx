import { Brain, Shield, Clock, LineChart, Wallet, Headphones } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Trading",
    description: "Our advanced neural networks analyze market data 24/7 to make profitable trading decisions.",
  },
  {
    icon: Shield,
    title: "Bank-Grade Security",
    description: "256-bit encryption and multi-layer security protocols protect your investments at all times.",
  },
  {
    icon: Clock,
    title: "24/7 Automated Trading",
    description: "Our AI never sleeps. It continuously monitors and trades across global markets.",
  },
  {
    icon: LineChart,
    title: "Consistent Returns",
    description: "Our algorithms are optimized for steady growth with managed risk parameters.",
  },
  {
    icon: Wallet,
    title: "Easy Withdrawals",
    description: "Withdraw your profits anytime with our fast and seamless payout system.",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Our dedicated support team is always available to assist you with any questions.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-20 md:py-32 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Why Choose <span className="text-gradient">WealthAI</span>?
          </h2>
          <p className="text-lg text-muted-foreground">
            Experience the future of investing with our cutting-edge AI technology and industry-leading features.
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
