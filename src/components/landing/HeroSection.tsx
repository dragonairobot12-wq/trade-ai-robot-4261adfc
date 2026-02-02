import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, BarChart3, FileText, AlertTriangle } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 gradient-dark" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="container mx-auto px-4 relative z-10 pt-20 md:pt-28">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-primary/20 text-primary px-4 py-2 rounded-full text-sm font-medium animate-fade-in">
            <Shield className="w-4 h-4" />
            For Investors & Partners
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight animate-fade-in">
            AI-Driven Trading Automation with{" "}
            <span className="text-gradient">Risk-First Controls</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto animate-fade-in delay-200">
            Built for investors and partners seeking transparent performance reporting. Featuring our proprietary risk engine, audit-friendly logs, and comprehensive analytics dashboard.
          </p>

          {/* Value Props */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-8 text-sm animate-fade-in delay-300">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Shield className="w-5 h-5 text-primary" />
              <span>Risk Engine</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <FileText className="w-5 h-5 text-primary" />
              <span>Audit Trail</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <BarChart3 className="w-5 h-5 text-primary" />
              <span>Analytics</span>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-fade-in delay-400">
            <Link to="/investors#request-form">
              <Button size="xl" variant="gradient" className="group">
                Request Investor Deck
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/demo">
              <Button size="xl" variant="outline">
                View Demo
              </Button>
            </Link>
          </div>

          {/* Disclosure */}
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground/70 animate-fade-in delay-500">
            <AlertTriangle className="w-3 h-3" />
            <span>Simulated / backtested performance unless stated otherwise. Not financial advice.</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;