import { useState, useRef, MouseEvent } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Check, Star, TrendingUp, Shield, Clock, Zap, Loader2, 
  Brain, BarChart3, Coins, Gem, Target, Sparkles 
} from "lucide-react";
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

interface Premium3DPackageCardProps {
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
  tierIndex: number;
  onInvest?: (packageId: string, amount: number) => void;
  isInvesting?: boolean;
}

const riskColors = {
  Low: "bg-success/20 text-success border-success/30",
  Medium: "bg-warning/20 text-warning border-warning/30",
  "Medium-High": "bg-chart-3/20 text-chart-3 border-chart-3/30",
  High: "bg-destructive/20 text-destructive border-destructive/30",
};

const tierIcons = [
  BarChart3, // $100
  TrendingUp, // $300
  Target, // $600
  Brain, // $1,000
  Coins, // $1,800
  Sparkles, // $2,500
  Gem, // $3,500
  Star, // $5,000
];

const tierGradients = [
  "from-chart-1/20 to-chart-1/5", // Starter
  "from-success/20 to-success/5",
  "from-chart-3/20 to-chart-3/5",
  "from-primary/20 to-primary/5",
  "from-chart-4/20 to-chart-4/5",
  "from-accent/20 to-accent/5",
  "from-chart-3/20 to-primary/5",
  "from-primary/30 to-chart-3/20", // VIP
];

const tierAccentColors = [
  "text-chart-1",
  "text-success",
  "text-chart-3",
  "text-primary",
  "text-chart-4",
  "text-accent",
  "text-chart-3",
  "text-primary",
];

const Premium3DPackageCard = ({
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
  tierIndex,
  onInvest,
  isInvesting,
}: Premium3DPackageCardProps) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { wallet } = useWallet();
  const navigate = useNavigate();

  const hasInsufficientBalance = wallet ? wallet.balance < amount : true;
  const expectedReturn = amount + (amount * parseFloat(roi) / 100);

  const TierIcon = tierIcons[tierIndex] || BarChart3;
  const tierGradient = tierGradients[tierIndex] || tierGradients[0];
  const tierAccent = tierAccentColors[tierIndex] || tierAccentColors[0];

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;
    
    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  };

  const handleMouseLeave = () => {
    if (cardRef.current) {
      cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    }
    setIsHovered(false);
  };

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
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        className={`
          relative group h-full
          transition-all duration-300 ease-out
          animate-fade-in
        `}
        style={{ 
          transformStyle: 'preserve-3d',
          animationDelay: `${tierIndex * 100}ms`,
        }}
      >
        {/* Glow Effect */}
        <div 
          className={`
            absolute -inset-0.5 rounded-2xl opacity-0 group-hover:opacity-100
            transition-opacity duration-500 blur-xl
            ${vip ? 'bg-gradient-to-r from-primary via-chart-3 to-primary' : 'bg-primary/30'}
          `}
        />

        {/* Main Card */}
        <div
          className={`
            relative h-full p-5 md:p-6 rounded-2xl border backdrop-blur-sm
            transition-all duration-300
            ${vip
              ? "bg-gradient-to-br from-card via-card to-primary/10 border-primary/50 shadow-xl"
              : popular
              ? "bg-gradient-to-br from-card via-card to-chart-3/5 border-primary/30 shadow-lg"
              : "bg-card border-border/50 shadow-md"
            }
            ${isHovered ? 'shadow-2xl' : ''}
          `}
        >
          {/* 3D Background Decoration */}
          <div 
            className={`
              absolute inset-0 rounded-2xl overflow-hidden pointer-events-none
            `}
          >
            {/* Gradient Orbs */}
            <div 
              className={`
                absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl
                bg-gradient-to-br ${tierGradient} opacity-60
                transition-all duration-500
                ${isHovered ? 'scale-150 opacity-80' : ''}
              `}
            />
            <div 
              className={`
                absolute -bottom-10 -left-10 w-32 h-32 rounded-full blur-2xl
                bg-gradient-to-tr ${tierGradient} opacity-40
                transition-all duration-500
                ${isHovered ? 'scale-125 opacity-60' : ''}
              `}
            />
            
            {/* Grid Pattern */}
            <div 
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px), 
                                  linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`,
                backgroundSize: '20px 20px',
              }}
            />
          </div>

          {/* Floating 3D Icon */}
          <div 
            className={`
              absolute -top-4 right-4 w-14 h-14 rounded-xl
              flex items-center justify-center
              transition-all duration-500 transform
              ${vip 
                ? 'gradient-primary shadow-lg shadow-primary/30' 
                : `bg-gradient-to-br ${tierGradient} border border-border/50`
              }
              ${isHovered ? '-translate-y-2 rotate-6' : ''}
            `}
            style={{ transformStyle: 'preserve-3d', transform: isHovered ? 'translateZ(30px) translateY(-8px) rotate(6deg)' : 'translateZ(20px)' }}
          >
            <TierIcon className={`w-7 h-7 ${vip ? 'text-primary-foreground' : tierAccent}`} />
          </div>

          {/* Badges */}
          {(popular || vip) && (
            <div className="absolute -top-3 left-4 z-10">
              <Badge 
                className={`
                  ${vip 
                    ? "gradient-primary text-primary-foreground shadow-lg shadow-primary/30" 
                    : "bg-chart-3 text-primary-foreground"
                  } 
                  px-3 py-1 text-xs font-semibold
                  animate-pulse-slow
                `}
              >
                {vip ? (
                  <span className="flex items-center gap-1">
                    <Star className="w-3 h-3" /> VIP
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Popular
                  </span>
                )}
              </Badge>
            </div>
          )}

          {/* Content */}
          <div className="relative z-10 pt-6">
            {/* Header */}
            <div className="text-center mb-4">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                {name}
              </p>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-sm text-muted-foreground">$</span>
                <span className={`text-3xl md:text-4xl font-bold ${vip ? 'text-gradient' : ''}`}>
                  {amount.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div 
                className={`
                  text-center p-2.5 rounded-xl border border-border/50
                  bg-gradient-to-br from-secondary/80 to-secondary/40
                  backdrop-blur-sm transition-all duration-300
                  ${isHovered ? 'scale-105 shadow-sm' : ''}
                `}
                style={{ transitionDelay: '0ms' }}
              >
                <TrendingUp className={`w-4 h-4 mx-auto mb-1 ${tierAccent}`} />
                <div className="text-sm font-bold text-foreground">{roi}</div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wide">ROI</div>
              </div>
              <div 
                className={`
                  text-center p-2.5 rounded-xl border border-border/50
                  bg-gradient-to-br from-secondary/80 to-secondary/40
                  backdrop-blur-sm transition-all duration-300
                  ${isHovered ? 'scale-105 shadow-sm' : ''}
                `}
                style={{ transitionDelay: '50ms' }}
              >
                <Clock className={`w-4 h-4 mx-auto mb-1 ${tierAccent}`} />
                <div className="text-sm font-bold text-foreground">{duration}</div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Duration</div>
              </div>
              <div 
                className={`
                  text-center p-2.5 rounded-xl border border-border/50
                  bg-gradient-to-br from-secondary/80 to-secondary/40
                  backdrop-blur-sm transition-all duration-300
                  ${isHovered ? 'scale-105 shadow-sm' : ''}
                `}
                style={{ transitionDelay: '100ms' }}
              >
                <Shield className={`w-4 h-4 mx-auto mb-1 ${tierAccent}`} />
                <div className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full border ${riskColors[riskLevel]}`}>
                  {riskLevel}
                </div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wide mt-0.5">Risk</div>
              </div>
            </div>

            {/* AI Strategy */}
            <div 
              className={`
                p-3 rounded-xl mb-4 border transition-all duration-300
                ${vip 
                  ? 'bg-primary/10 border-primary/20' 
                  : 'bg-gradient-to-br from-secondary/60 to-secondary/30 border-border/30'
                }
                ${isHovered ? 'shadow-inner' : ''}
              `}
            >
              <div className="flex items-center gap-2 mb-1">
                <div className={`p-1 rounded-md ${vip ? 'bg-primary/20' : 'bg-secondary'}`}>
                  <Zap className={`w-3 h-3 ${tierAccent}`} />
                </div>
                <span className="text-xs font-semibold text-foreground">AI Strategy</span>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2">{strategy}</p>
            </div>

            {/* Features */}
            <ul className="space-y-2 mb-5">
              {features.slice(0, 4).map((feature, index) => (
                <li 
                  key={index} 
                  className={`
                    flex items-center gap-2 text-xs transition-all duration-300
                    ${isHovered ? 'translate-x-1' : ''}
                  `}
                  style={{ transitionDelay: `${index * 50}ms` }}
                >
                  <div className={`
                    w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0
                    ${vip ? 'bg-primary/20' : 'bg-success/15'}
                  `}>
                    <Check className={`w-2.5 h-2.5 ${vip ? 'text-primary' : 'text-success'}`} />
                  </div>
                  <span className="text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>

            {/* CTA Button */}
            <Button
              variant={vip ? "default" : popular ? "default" : "outline"}
              className={`
                w-full relative overflow-hidden group/btn
                transition-all duration-300
                ${vip 
                  ? 'gradient-primary hover:shadow-lg hover:shadow-primary/30 text-primary-foreground' 
                  : popular 
                  ? 'bg-primary hover:bg-primary/90 text-primary-foreground' 
                  : 'hover:bg-primary hover:text-primary-foreground hover:border-primary'
                }
              `}
              size="lg"
              onClick={handleInvestClick}
              disabled={isInvesting}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isInvesting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    Invest Now
                  </>
                )}
              </span>
              {/* Button Shine Effect */}
              <div 
                className={`
                  absolute inset-0 -translate-x-full group-hover/btn:translate-x-full
                  transition-transform duration-700 ease-out
                  bg-gradient-to-r from-transparent via-primary-foreground/20 to-transparent
                `}
              />
            </Button>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="p-2 rounded-lg gradient-primary">
                <TierIcon className="w-5 h-5 text-primary-foreground" />
              </div>
              Confirm Investment
            </DialogTitle>
            <DialogDescription>
              You are about to invest in the <span className="font-semibold text-foreground">{name}</span>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-4">
            <div className="flex justify-between items-center p-3 bg-secondary/50 rounded-xl border border-border/50">
              <span className="text-sm text-muted-foreground">Investment Amount</span>
              <span className="font-bold text-lg">${amount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-secondary/50 rounded-xl border border-border/50">
              <span className="text-sm text-muted-foreground">Expected ROI</span>
              <span className="font-semibold text-success">{roi}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-secondary/50 rounded-xl border border-border/50">
              <span className="text-sm text-muted-foreground">Duration</span>
              <span className="font-semibold">{duration}</span>
            </div>
            <div className="flex justify-between items-center p-4 gradient-primary rounded-xl">
              <span className="text-sm text-primary-foreground/80">Expected Return</span>
              <span className="font-bold text-xl text-primary-foreground">${expectedReturn.toLocaleString()}</span>
            </div>

            {hasInsufficientBalance && (
              <div className="p-3 bg-destructive/10 rounded-xl border border-destructive/20">
                <p className="text-sm text-destructive">
                  Insufficient balance. Your current balance is ${wallet?.balance.toLocaleString() || 0}.
                  Please deposit funds first.
                </p>
              </div>
            )}

            {wallet && !hasInsufficientBalance && (
              <div className="p-3 bg-success/10 rounded-xl border border-success/20">
                <p className="text-sm text-success">
                  ✓ Available balance: ${wallet.balance.toLocaleString()}
                </p>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowConfirm(false)} className="flex-1">
              Cancel
            </Button>
            {hasInsufficientBalance ? (
              <Button variant="default" className="flex-1 gradient-primary text-primary-foreground" onClick={() => { setShowConfirm(false); navigate("/wallet"); }}>
                Go to Wallet
              </Button>
            ) : (
              <Button 
                variant="default" 
                className="flex-1 gradient-primary text-primary-foreground" 
                onClick={handleConfirmInvest} 
                disabled={isInvesting}
              >
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

export default Premium3DPackageCard;
