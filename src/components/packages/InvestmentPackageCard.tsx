import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Star, TrendingUp, Shield, Clock, Zap } from "lucide-react";

interface InvestmentPackageProps {
  amount: number;
  name: string;
  roi: string;
  duration: string;
  riskLevel: "Low" | "Medium" | "Medium-High" | "High";
  strategy: string;
  features: string[];
  popular?: boolean;
  vip?: boolean;
}

const riskColors = {
  Low: "bg-success/10 text-success",
  Medium: "bg-warning/10 text-warning",
  "Medium-High": "bg-chart-3/10 text-chart-3",
  High: "bg-destructive/10 text-destructive",
};

const InvestmentPackageCard = ({
  amount,
  name,
  roi,
  duration,
  riskLevel,
  strategy,
  features,
  popular,
  vip,
}: InvestmentPackageProps) => {
  return (
    <div
      className={`relative group p-6 md:p-8 bg-card rounded-2xl border transition-all duration-500 hover:-translate-y-2 ${
        vip
          ? "border-primary shadow-xl shadow-primary/10"
          : popular
          ? "border-primary/50 shadow-lg"
          : "border-border shadow-sm hover:shadow-lg"
      }`}
    >
      {/* Badges */}
      {(popular || vip) && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge className={`${vip ? "gradient-primary" : "bg-primary"} text-primary-foreground px-4 py-1`}>
            {vip ? (
              <>
                <Star className="w-3 h-3 mr-1" /> VIP
              </>
            ) : (
              "Most Popular"
            )}
          </Badge>
        </div>
      )}

      {/* Header */}
      <div className="text-center mb-6">
        <p className="text-sm text-muted-foreground mb-2">{name}</p>
        <div className="flex items-center justify-center gap-1">
          <span className="text-3xl md:text-4xl font-bold text-gradient">${amount.toLocaleString()}</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="text-center p-3 bg-secondary/50 rounded-xl">
          <TrendingUp className="w-4 h-4 mx-auto mb-1 text-primary" />
          <div className="text-sm font-semibold">{roi}</div>
          <div className="text-xs text-muted-foreground">ROI</div>
        </div>
        <div className="text-center p-3 bg-secondary/50 rounded-xl">
          <Clock className="w-4 h-4 mx-auto mb-1 text-primary" />
          <div className="text-sm font-semibold">{duration}</div>
          <div className="text-xs text-muted-foreground">Duration</div>
        </div>
        <div className="text-center p-3 bg-secondary/50 rounded-xl">
          <Shield className="w-4 h-4 mx-auto mb-1 text-primary" />
          <div className={`text-xs font-semibold px-2 py-0.5 rounded-full ${riskColors[riskLevel]}`}>
            {riskLevel}
          </div>
          <div className="text-xs text-muted-foreground mt-1">Risk</div>
        </div>
      </div>

      {/* AI Strategy */}
      <div className="p-4 bg-primary/5 rounded-xl mb-6 border border-primary/10">
        <div className="flex items-center gap-2 mb-2">
          <Zap className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold">AI Strategy</span>
        </div>
        <p className="text-sm text-muted-foreground">{strategy}</p>
      </div>

      {/* Features */}
      <ul className="space-y-3 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-3 text-sm">
            <div className="w-5 h-5 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
              <Check className="w-3 h-3 text-success" />
            </div>
            {feature}
          </li>
        ))}
      </ul>

      {/* CTA */}
      <Link to="/register" className="block">
        <Button
          variant={vip ? "hero" : popular ? "gradient" : "default"}
          className="w-full"
          size="lg"
        >
          Invest Now
        </Button>
      </Link>
    </div>
  );
};

export default InvestmentPackageCard;
