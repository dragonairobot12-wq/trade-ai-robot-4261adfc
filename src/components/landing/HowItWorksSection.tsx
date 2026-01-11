import { UserPlus, Wallet, Bot, TrendingUp } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    title: "Create Account",
    description: "Sign up in minutes with our simple and secure registration process.",
  },
  {
    icon: Wallet,
    title: "Make a Deposit",
    description: "Choose an investment package and fund your account securely.",
  },
  {
    icon: Bot,
    title: "AI Starts Trading",
    description: "Our intelligent AI immediately begins trading on your behalf.",
  },
  {
    icon: TrendingUp,
    title: "Earn & Withdraw",
    description: "Watch your profits grow and withdraw anytime you want.",
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
            Start your investment journey in just 4 simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative text-center group">
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-[60%] w-full h-0.5 bg-gradient-to-r from-primary/50 to-transparent" />
              )}
              
              {/* Step Number */}
              <div className="relative inline-flex items-center justify-center mb-6">
                <div className="w-20 h-20 gradient-primary rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-glow transition-all duration-300">
                  <step.icon className="w-9 h-9 text-primary-foreground" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-card border-2 border-primary rounded-full flex items-center justify-center text-sm font-bold text-primary">
                  {index + 1}
                </div>
              </div>
              
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-muted-foreground max-w-xs mx-auto">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
