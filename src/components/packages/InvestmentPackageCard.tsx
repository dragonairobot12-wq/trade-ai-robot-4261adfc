import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Star, TrendingUp, Shield, Clock, Zap, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { useWallet } from "@/hooks/useWallet";
import { useNavigate } from "react-router-dom";

interface InvestmentPackageProps {
  id: string;
  amount: number;
  name: string;
  roi: string;
  duration: string;
  riskLevel: "Low" | "Medium" | "Medium-High" | "High";
  strategy: string;
  features: string[];
  popular?: boolean;
  vip?: boolean;
  onInvest?: (packageId: string, amount: number) => void;
  isInvesting?: boolean;
}

const riskColors = {
  Low: "bg-success/10 text-success",
  Medium: "bg-warning/10 text-warning",
  "Medium-High": "bg-chart-3/10 text-chart-3",
  High: "bg-destructive/10 text-destructive",
};

const InvestmentPackageCard = ({
  id,
  amount,
  name,
  roi,
  duration,
  riskLevel,
  strategy,
  features,
  popular,
  vip,
  onInvest,
  isInvesting,
}: InvestmentPackageProps) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const { user } = useAuth();
  const { wallet } = useWallet();
  const navigate = useNavigate();

  const hasInsufficientBalance = wallet ? wallet.balance < amount : true;
  const expectedReturn = amount + (amount * parseFloat(roi) / 100);

  const handleInvestClick = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    setShowConfirm(true);
  };

  const handleConfirmInvest = () => {
    if (onInvest) {
      onInvest(id, amount);
    }
    setShowConfirm(false);
  };

  return (
    <>
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
        <Button
          variant={vip ? "hero" : popular ? "gradient" : "default"}
          className="w-full"
          size="lg"
          onClick={handleInvestClick}
          disabled={isInvesting}
        >
          {isInvesting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            "Invest Now"
          )}
        </Button>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Investment</DialogTitle>
            <DialogDescription>
              You are about to invest in the {name} package
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="flex justify-between items-center p-3 bg-secondary/50 rounded-lg">
              <span className="text-muted-foreground">Investment Amount</span>
              <span className="font-semibold">${amount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-secondary/50 rounded-lg">
              <span className="text-muted-foreground">ROI</span>
              <span className="font-semibold text-success">{roi}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-secondary/50 rounded-lg">
              <span className="text-muted-foreground">Duration</span>
              <span className="font-semibold">{duration}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-primary/10 rounded-lg border border-primary/20">
              <span className="text-muted-foreground">Expected Return</span>
              <span className="font-bold text-primary">${expectedReturn.toLocaleString()}</span>
            </div>

            {hasInsufficientBalance && (
              <div className="p-3 bg-destructive/10 rounded-lg border border-destructive/20">
                <p className="text-sm text-destructive">
                  Insufficient balance. Your current balance is ${wallet?.balance.toLocaleString() || 0}.
                  Please deposit funds first.
                </p>
              </div>
            )}

            {wallet && !hasInsufficientBalance && (
              <div className="p-3 bg-success/10 rounded-lg border border-success/20">
                <p className="text-sm text-success">
                  Available balance: ${wallet.balance.toLocaleString()}
                </p>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowConfirm(false)}>
              Cancel
            </Button>
            {hasInsufficientBalance ? (
              <Button variant="gradient" onClick={() => { setShowConfirm(false); navigate("/wallet"); }}>
                Go to Wallet
              </Button>
            ) : (
              <Button variant="gradient" onClick={handleConfirmInvest} disabled={isInvesting}>
                {isInvesting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Confirm Investment"
                )}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default InvestmentPackageCard;
