import { Database, Cpu, Shield, Zap, FileText, AlertTriangle } from "lucide-react";

const steps = [
  {
    icon: Database,
    title: "Data Ingestion",
    description: "Real-time market data feeds from multiple sources, normalized and validated.",
  },
  {
    icon: Cpu,
    title: "Signal Generation",
    description: "ML models analyze patterns and generate trade signals with confidence scores.",
  },
  {
    icon: Shield,
    title: "Risk Engine",
    description: "Position sizing, exposure checks, and risk limits applied before execution.",
  },
  {
    icon: Zap,
    title: "Execution",
    description: "Smart order routing optimizes for best execution with slippage controls.",
  },
  {
    icon: FileText,
    title: "Reporting",
    description: "Full audit trail, P&L attribution, and performance analytics in real-time.",
  },
];

const HowItWorksSection = () => {
  return (
    <section className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            How It <span className="text-gradient">Works</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            From data to insights to execution — a transparent, auditable process
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 md:gap-4">
          {steps.map((step, index) => (
            <div key={index} className="relative text-center group">
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-[60%] w-full h-0.5 bg-gradient-to-r from-primary/50 to-transparent" />
              )}
              
              {/* Step Icon */}
              <div className="relative inline-flex items-center justify-center mb-6">
                <div className="w-20 h-20 gradient-primary rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-glow transition-all duration-300">
                  <step.icon className="w-9 h-9 text-primary-foreground" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-card border-2 border-primary rounded-full flex items-center justify-center text-sm font-bold text-primary">
                  {index + 1}
                </div>
              </div>
              
              <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
              <p className="text-muted-foreground text-sm max-w-xs mx-auto">{step.description}</p>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 bg-secondary/50 px-4 py-2 rounded-lg text-sm text-muted-foreground">
            <AlertTriangle className="w-4 h-4" />
            <span>Execution layer can be integrated with exchanges/brokers; demo uses simulated execution.</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
