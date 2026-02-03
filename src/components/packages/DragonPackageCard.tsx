import { useState, useRef, MouseEvent } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Check, Star, TrendingUp, Shield, Clock, Zap, Loader2, 
  Info, Timer
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuth } from "@/contexts/AuthContext";
import { useWallet } from "@/hooks/useWallet";
import { useNavigate } from "react-router-dom";

// Import dragon icons
import p1 from "@/assets/p1.png";
import p2 from "@/assets/p2.png";
import p3 from "@/assets/p3.png";
import p4 from "@/assets/p4.png";
import p5 from "@/assets/p5.png";
import p6 from "@/assets/p6.png";
import p7 from "@/assets/p7.png";
import p8 from "@/assets/p8.png";
import p9 from "@/assets/p9.png";
import p10 from "@/assets/p10.png";

const dragonIcons = [p1, p2, p3, p4, p5, p6, p7, p8, p9, p10];

interface DragonPackageCardProps {
  id: string;
  amount: number;
  name: string;
  roi: string;
  duration: string;
  durationDays: number;
  waitPeriod: number;
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

// Dragon-themed tier glow colors
const tierGlowColors = [
  "from-emerald-500/50 to-emerald-600/30", // Green Egg
  "from-blue-500/50 to-blue-600/30",       // Blue Egg
  "from-amber-500/50 to-amber-600/30",     // Bronze Egg
  "from-slate-300/50 to-slate-400/30",     // Silver Drake
  "from-yellow-400/50 to-yellow-500/30",   // Gold Drake
  "from-cyan-300/50 to-cyan-400/30",       // Platinum Drake
  "from-red-500/50 to-red-600/30",         // Ruby Dragon
  "from-purple-600/50 to-purple-700/30",   // Obsidian Dragon
  "from-pink-400/50 to-violet-500/30",     // Diamond Dragon
  "from-emerald-400/50 via-yellow-400/40 to-emerald-500/30", // Elder Dragon
];

const tierBorderColors = [
  "border-emerald-500/40",
  "border-blue-500/40",
  "border-amber-500/40",
  "border-slate-300/40",
  "border-yellow-400/40",
  "border-cyan-300/40",
  "border-red-500/40",
  "border-purple-500/40",
  "border-pink-400/40",
  "border-emerald-400/40",
];

const DragonPackageCard = ({
  id,
  amount,
  name,
  roi,
  duration,
  durationDays,
  waitPeriod,
  riskLevel,
  strategy,
  features,
  popular,
  vip,
  tierIndex,
  onInvest,
  isInvesting,
}: DragonPackageCardProps) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { wallet } = useWallet();
  const navigate = useNavigate();

  const hasInsufficientBalance = wallet ? wallet.balance < amount : true;
  const expectedReturn = amount + (amount * parseFloat(roi) / 100);

  const dragonIcon = dragonIcons[tierIndex] || dragonIcons[0];
  const tierGlow = tierGlowColors[tierIndex] || tierGlowColors[0];
  const tierBorder = tierBorderColors[tierIndex] || tierBorderColors[0];

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 25;
    const rotateY = (centerX - x) / 25;
    
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
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.5, 
          delay: tierIndex * 0.08,
          type: "spring",
          stiffness: 100
        }}
        className="h-full"
      >
        <div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={handleMouseLeave}
          className="relative h-full transition-all duration-300 ease-out"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Dragon Scale Border Glow */}
          <div 
            className={`
              absolute -inset-[2px] rounded-2xl opacity-0 group-hover:opacity-100
              transition-opacity duration-500 blur-sm
              bg-gradient-to-br ${tierGlow}
              ${isHovered ? 'opacity-100' : 'opacity-0'}
            `}
          />

          {/* Main Card with Glassmorphism */}
          <div
            className={`
              relative h-full p-4 md:p-5 rounded-2xl border-2
              backdrop-blur-xl bg-card/80
              transition-all duration-300
              ${tierBorder}
              ${vip ? 'shadow-2xl shadow-primary/20' : 'shadow-lg'}
              ${isHovered ? 'shadow-2xl' : ''}
            `}
          >
            {/* Background Decorations */}
            <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
              {/* Gradient Orbs */}
              <div 
                className={`
                  absolute -top-16 -right-16 w-32 h-32 rounded-full blur-3xl
                  bg-gradient-to-br ${tierGlow} opacity-40
                  transition-all duration-500
                  ${isHovered ? 'scale-150 opacity-60' : ''}
                `}
              />
              <div 
                className={`
                  absolute -bottom-8 -left-8 w-24 h-24 rounded-full blur-2xl
                  bg-gradient-to-tr ${tierGlow} opacity-30
                  transition-all duration-500
                  ${isHovered ? 'scale-125 opacity-50' : ''}
                `}
              />
              
              {/* Scale Pattern Overlay */}
              <div 
                className="absolute inset-0 opacity-[0.02]"
                style={{
                  backgroundImage: `radial-gradient(circle at 50% 50%, hsl(var(--primary)) 1px, transparent 1px)`,
                  backgroundSize: '16px 16px',
                }}
              />
            </div>

            {/* Dragon Icon */}
            <div 
              className={`
                absolute -top-6 right-3 w-16 h-16
                transition-all duration-500 transform
                ${isHovered ? '-translate-y-2 scale-110' : ''}
              `}
              style={{ 
                transformStyle: 'preserve-3d', 
                transform: isHovered ? 'translateZ(40px) translateY(-8px) scale(1.1)' : 'translateZ(20px)' 
              }}
            >
              <img 
                src={dragonIcon} 
                alt={name}
                className="w-full h-full object-contain drop-shadow-2xl"
              />
            </div>

            {/* Badges */}
            <div className="absolute -top-3 left-3 flex gap-2 z-10">
              {(popular || vip) && (
                <Badge 
                  className={`
                    ${vip 
                      ? "gradient-primary text-primary-foreground shadow-lg shadow-primary/30" 
                      : "bg-chart-3 text-primary-foreground"
                    } 
                    px-2 py-0.5 text-[10px] font-semibold
                  `}
                >
                  {vip ? (
                    <span className="flex items-center gap-1">
                      <Star className="w-2.5 h-2.5" /> DRAGON MASTER
                    </span>
                  ) : (
                    "Popular"
                  )}
                </Badge>
              )}
            </div>

            {/* Wait Period Badge */}
            <Badge 
              variant="outline"
              className="absolute top-3 left-3 bg-background/80 backdrop-blur-sm text-[10px] py-0.5 px-2 border-primary/30"
            >
              <Timer className="w-2.5 h-2.5 mr-1" />
              Wait: {waitPeriod} Days
            </Badge>

            {/* Content */}
            <div className="relative z-10 pt-10">
              {/* Header */}
              <div className="text-center mb-3">
                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-0.5">
                  {name}
                </p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-xs text-muted-foreground">$</span>
                  <span className={`text-2xl md:text-3xl font-bold ${vip ? 'text-gradient' : 'text-foreground'}`}>
                    {amount.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-1.5 mb-3">
                <div 
                  className={`
                    text-center p-2 rounded-lg border border-border/50
                    bg-secondary/60 backdrop-blur-sm transition-all duration-300
                    ${isHovered ? 'scale-105' : ''}
                  `}
                >
                  <TrendingUp className="w-3.5 h-3.5 mx-auto mb-0.5 text-success" />
                  <div className="text-xs font-bold text-success">{roi}</div>
                  <div className="text-[8px] text-muted-foreground uppercase">ROI</div>
                </div>
                <div 
                  className={`
                    text-center p-2 rounded-lg border border-border/50
                    bg-secondary/60 backdrop-blur-sm transition-all duration-300
                    ${isHovered ? 'scale-105' : ''}
                  `}
                >
                  <Clock className="w-3.5 h-3.5 mx-auto mb-0.5 text-primary" />
                  <div className="text-xs font-bold">{durationDays}d</div>
                  <div className="text-[8px] text-muted-foreground uppercase">Active</div>
                </div>
                <div 
                  className={`
                    text-center p-2 rounded-lg border border-border/50
                    bg-secondary/60 backdrop-blur-sm transition-all duration-300
                    ${isHovered ? 'scale-105' : ''}
                  `}
                >
                  <Shield className="w-3.5 h-3.5 mx-auto mb-0.5 text-chart-3" />
                  <div className={`text-[9px] font-semibold px-1 py-0.5 rounded-full border ${riskColors[riskLevel]}`}>
                    {riskLevel}
                  </div>
                </div>
              </div>

              {/* AI Strategy with Terms Tooltip */}
              <div 
                className={`
                  p-2.5 rounded-lg mb-3 border transition-all duration-300
                  bg-gradient-to-br from-secondary/60 to-secondary/30 border-border/30
                `}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <Zap className="w-3 h-3 text-primary" />
                    <span className="text-[10px] font-semibold">AI Strategy</span>
                  </div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="p-0.5 hover:bg-secondary rounded">
                        <Info className="w-3 h-3 text-muted-foreground" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-[200px] text-xs">
                      <p className="font-semibold mb-1">Investment Terms</p>
                      <ul className="space-y-1 text-muted-foreground">
                        <li>• {waitPeriod}-day lock period before ROI starts</li>
                        <li>• Package active for {durationDays} days total</li>
                        <li>• ROI paid daily after lock period</li>
                        <li>• Principal returned at maturity</li>
                      </ul>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <p className="text-[10px] text-muted-foreground line-clamp-2">{strategy}</p>
              </div>

              {/* Features */}
              <ul className="space-y-1.5 mb-4">
                {features.slice(0, 3).map((feature, index) => (
                  <li 
                    key={index} 
                    className={`
                      flex items-center gap-1.5 text-[10px] transition-all duration-300
                      ${isHovered ? 'translate-x-1' : ''}
                    `}
                    style={{ transitionDelay: `${index * 50}ms` }}
                  >
                    <div className="w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0 bg-success/15">
                      <Check className="w-2 h-2 text-success" />
                    </div>
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <Button
                className={`
                  w-full relative overflow-hidden
                  transition-all duration-300
                  ${vip 
                    ? 'gradient-primary hover:shadow-lg hover:shadow-primary/30 text-primary-foreground' 
                    : 'bg-gradient-to-r from-primary to-chart-3 hover:opacity-90 text-primary-foreground'
                  }
                `}
                size="sm"
                onClick={handleInvestClick}
                disabled={isInvesting}
              >
                <span className="relative z-10 flex items-center justify-center gap-1.5 text-xs font-semibold">
                  {isInvesting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Zap className="w-3.5 h-3.5" />
                      Activate Dragon Node
                    </>
                  )}
                </span>
                {/* Button Shine Effect */}
                <div 
                  className={`
                    absolute inset-0 -translate-x-full group-hover:translate-x-full
                    transition-transform duration-700 ease-out
                    bg-gradient-to-r from-transparent via-primary-foreground/20 to-transparent
                  `}
                />
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <img src={dragonIcon} alt={name} className="w-10 h-10 object-contain" />
              Confirm Investment
            </DialogTitle>
            <DialogDescription>
              You are about to activate the <span className="font-semibold text-foreground">{name}</span> node
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-4">
            <div className="flex justify-between items-center p-3 bg-secondary/50 rounded-xl border border-border/50">
              <span className="text-sm text-muted-foreground">Investment Amount</span>
              <span className="font-bold text-lg">${amount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-secondary/50 rounded-xl border border-border/50">
              <span className="text-sm text-muted-foreground">Wait Period</span>
              <span className="font-semibold text-warning">{waitPeriod} Days</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-secondary/50 rounded-xl border border-border/50">
              <span className="text-sm text-muted-foreground">Expected ROI</span>
              <span className="font-semibold text-success">{roi}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-secondary/50 rounded-xl border border-border/50">
              <span className="text-sm text-muted-foreground">Active Duration</span>
              <span className="font-semibold">{durationDays} Days</span>
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

export default DragonPackageCard;
