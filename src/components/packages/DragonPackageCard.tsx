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
  layout?: "desktop" | "tablet" | "mobile" | "carousel";
  isActive?: boolean;
  scrollProgress?: number;
}

const riskColors = {
  Low: "bg-success/20 text-success border-success/30",
  Medium: "bg-warning/20 text-warning border-warning/30",
  "Medium-High": "bg-chart-3/20 text-chart-3 border-chart-3/30",
  High: "bg-destructive/20 text-destructive border-destructive/30",
};

// Dragon-themed tier glow colors (gold/cyan dragon fire)
const tierGlowColors = [
  "from-emerald-500/40 to-emerald-600/20",
  "from-blue-500/40 to-blue-600/20",
  "from-amber-500/40 to-amber-600/20",
  "from-slate-300/40 to-slate-400/20",
  "from-yellow-400/40 to-yellow-500/20",
  "from-cyan-300/40 to-cyan-400/20",
  "from-red-500/40 to-red-600/20",
  "from-purple-600/40 to-purple-700/20",
  "from-pink-400/40 to-violet-500/20",
  "from-amber-400/40 via-cyan-400/30 to-amber-500/20",
];

const tierBorderColors = [
  "border-emerald-500/30 hover:border-emerald-400/60",
  "border-blue-500/30 hover:border-blue-400/60",
  "border-amber-500/30 hover:border-amber-400/60",
  "border-slate-300/30 hover:border-slate-200/60",
  "border-yellow-400/30 hover:border-yellow-300/60",
  "border-cyan-300/30 hover:border-cyan-200/60",
  "border-red-500/30 hover:border-red-400/60",
  "border-purple-500/30 hover:border-purple-400/60",
  "border-pink-400/30 hover:border-pink-300/60",
  "border-amber-400/30 hover:border-amber-300/60",
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
  layout = "desktop",
  isActive = false,
  scrollProgress = 0,
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

  // Calculate parallax offset based on scroll progress for carousel
  const parallaxOffset = layout === "carousel" 
    ? (scrollProgress - (tierIndex / 10)) * 30 
    : 0;

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || layout === "mobile" || layout === "carousel") return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 30;
    const rotateY = (centerX - x) / 30;
    
    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`;
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

  // Mobile Carousel Card Layout
  if (layout === "carousel") {
    return (
      <>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ 
            opacity: 1, 
            scale: isActive ? 1 : 0.95,
          }}
          transition={{ 
            duration: 0.4, 
            type: "spring",
            stiffness: 100,
            damping: 20
          }}
          className="h-full"
        >
          <div
            className={`
              relative h-full p-4 rounded-2xl border backdrop-blur-xl bg-card/70
              transition-all duration-300 ${tierBorder}
              ${vip ? 'shadow-xl shadow-primary/15' : 'shadow-lg'}
              ${isActive ? 'border-opacity-100' : 'border-opacity-50'}
            `}
          >
            {/* Glow effect */}
            <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${tierGlow} opacity-40 pointer-events-none transition-opacity duration-300 ${isActive ? 'opacity-50' : 'opacity-30'}`} />
            
            {/* VIP/Popular badge */}
            {(popular || vip) && (
              <Badge 
                className={`
                  absolute -top-2 left-4 z-10
                  ${vip 
                    ? "gradient-primary text-primary-foreground shadow-lg shadow-primary/30" 
                    : "bg-chart-3 text-primary-foreground"
                  } 
                  px-2 py-0.5 text-[10px] font-semibold
                `}
              >
                {vip ? <><Star className="w-3 h-3 mr-1" />DRAGON MASTER</> : "Popular"}
              </Badge>
            )}

            {/* Wait Period Badge */}
            <Badge 
              variant="outline"
              className="absolute top-3 left-3 bg-background/70 backdrop-blur-sm text-[10px] py-0.5 px-2 border-primary/20"
            >
              <Timer className="w-3 h-3 mr-1" />
              {waitPeriod}d Lock
            </Badge>

            {/* Dragon Icon with Parallax Effect */}
            <motion.div 
              className="absolute -top-6 right-4 w-20 h-20"
              animate={{
                x: parallaxOffset,
                rotate: parallaxOffset * 0.5,
              }}
              transition={{ type: "spring", stiffness: 150, damping: 20 }}
            >
              <img 
                src={dragonIcon} 
                alt={name}
                className="w-full h-full object-contain drop-shadow-2xl"
              />
            </motion.div>

            <div className="relative z-10 pt-12">
              {/* Header */}
              <div className="text-center mb-3">
                <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-widest mb-1">
                  {name}
                </p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-sm text-muted-foreground">$</span>
                  <span className={`text-4xl font-bold ${vip ? 'text-gradient' : 'text-foreground'}`}>
                    {amount.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="text-center p-2.5 rounded-xl border border-border/30 bg-secondary/40 backdrop-blur-sm">
                  <TrendingUp className="w-4 h-4 mx-auto mb-1 text-success" />
                  <div className="text-sm font-bold text-success">{roi}</div>
                  <div className="text-[9px] text-muted-foreground uppercase">ROI</div>
                </div>
                <div className="text-center p-2.5 rounded-xl border border-border/30 bg-secondary/40 backdrop-blur-sm">
                  <Clock className="w-4 h-4 mx-auto mb-1 text-primary" />
                  <div className="text-sm font-bold">{durationDays}d</div>
                  <div className="text-[9px] text-muted-foreground uppercase">Active</div>
                </div>
                <div className="text-center p-2.5 rounded-xl border border-border/30 bg-secondary/40 backdrop-blur-sm">
                  <Shield className="w-4 h-4 mx-auto mb-1 text-chart-3" />
                  <div className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full border ${riskColors[riskLevel]}`}>
                    {riskLevel}
                  </div>
                </div>
              </div>

              {/* AI Strategy */}
              <div className="p-3 rounded-xl mb-3 border bg-gradient-to-br from-secondary/50 to-secondary/20 border-border/20">
                <div className="flex items-center gap-1.5 mb-1">
                  <Zap className="w-3.5 h-3.5 text-primary" />
                  <span className="text-[10px] font-semibold">AI Strategy</span>
                </div>
                <p className="text-[10px] text-muted-foreground line-clamp-2">{strategy}</p>
              </div>

              {/* Features */}
              <ul className="space-y-1.5 mb-4">
                {features.slice(0, 4).map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-[10px]">
                    <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 bg-success/15">
                      <Check className="w-2.5 h-2.5 text-success" />
                    </div>
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button - Wide and thumb-friendly */}
              <Button
                className={`
                  w-full h-12 text-sm font-semibold relative overflow-hidden
                  ${vip 
                    ? 'gradient-primary text-primary-foreground shadow-lg shadow-primary/30' 
                    : 'bg-gradient-to-r from-primary to-chart-3 text-primary-foreground'
                  }
                `}
                onClick={handleInvestClick}
                disabled={isInvesting}
              >
                {isInvesting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Activate Dragon Node
                  </>
                )}
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Confirmation Dialog */}
        <ConfirmDialog 
          open={showConfirm}
          onOpenChange={setShowConfirm}
          dragonIcon={dragonIcon}
          name={name}
          amount={amount}
          waitPeriod={waitPeriod}
          roi={roi}
          durationDays={durationDays}
          expectedReturn={expectedReturn}
          hasInsufficientBalance={hasInsufficientBalance}
          wallet={wallet}
          isInvesting={isInvesting}
          onConfirm={handleConfirmInvest}
          onGoToWallet={() => { setShowConfirm(false); navigate("/wallet"); }}
        />
      </>
    );
  }

  // Mobile compact layout (kept for backwards compatibility)
  if (layout === "mobile") {
    return (
      <>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.4, 
            delay: tierIndex * 0.05,
            type: "spring",
            stiffness: 100
          }}
        >
          <div
            className={`
              relative p-3 rounded-2xl border backdrop-blur-xl bg-card/60
              transition-all duration-300 ${tierBorder}
              ${vip ? 'shadow-lg shadow-primary/10' : ''}
            `}
          >
            {/* Glow effect */}
            <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${tierGlow} opacity-30 pointer-events-none`} />
            
            {/* VIP/Popular badge */}
            {(popular || vip) && (
              <Badge 
                className={`
                  absolute -top-2 right-3 z-10
                  ${vip 
                    ? "gradient-primary text-primary-foreground shadow-lg shadow-primary/30" 
                    : "bg-chart-3 text-primary-foreground"
                  } 
                  px-2 py-0.5 text-[9px] font-semibold
                `}
              >
                {vip ? <><Star className="w-2.5 h-2.5 mr-1" />MASTER</> : "Popular"}
              </Badge>
            )}

            <div className="relative z-10 flex items-center gap-3">
              {/* Dragon Icon - Smaller on mobile */}
              <div className="w-12 h-12 flex-shrink-0">
                <img 
                  src={dragonIcon} 
                  alt={name}
                  className="w-full h-full object-contain drop-shadow-lg"
                />
              </div>

              {/* Title + Price side by side */}
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider truncate">{name}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-[10px] text-muted-foreground">$</span>
                  <span className={`text-xl font-bold ${vip ? 'text-gradient' : 'text-foreground'}`}>
                    {amount.toLocaleString()}
                  </span>
                </div>
                {/* Quick stats */}
                <div className="flex gap-2 mt-1">
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-success/15 text-success font-medium">
                    {roi} ROI
                  </span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-primary/15 text-primary font-medium">
                    {durationDays}d
                  </span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full border ${riskColors[riskLevel]}`}>
                    {riskLevel}
                  </span>
                </div>
              </div>

              {/* CTA Button - Wide and thumb-friendly */}
              <Button
                className={`
                  flex-shrink-0 h-10 px-4 text-xs font-semibold
                  ${vip 
                    ? 'gradient-primary text-primary-foreground' 
                    : 'bg-gradient-to-r from-primary to-chart-3 text-primary-foreground'
                  }
                `}
                onClick={handleInvestClick}
                disabled={isInvesting}
              >
                {isInvesting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Zap className="w-3.5 h-3.5 mr-1" />
                    Activate
                  </>
                )}
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Confirmation Dialog */}
        <ConfirmDialog 
          open={showConfirm}
          onOpenChange={setShowConfirm}
          dragonIcon={dragonIcon}
          name={name}
          amount={amount}
          waitPeriod={waitPeriod}
          roi={roi}
          durationDays={durationDays}
          expectedReturn={expectedReturn}
          hasInsufficientBalance={hasInsufficientBalance}
          wallet={wallet}
          isInvesting={isInvesting}
          onConfirm={handleConfirmInvest}
          onGoToWallet={() => { setShowConfirm(false); navigate("/wallet"); }}
        />
      </>
    );
  }

  // Desktop/Tablet layout
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.5, 
          delay: tierIndex * 0.06,
          type: "spring",
          stiffness: 80
        }}
        className="h-full"
      >
        <div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={handleMouseLeave}
          className="relative h-full transition-all duration-300 ease-out group"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Hover Glow Border */}
          <div 
            className={`
              absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-100
              transition-opacity duration-500 blur-sm
              bg-gradient-to-br ${tierGlow}
            `}
          />

          {/* Main Card */}
          <div
            className={`
              relative h-full p-4 rounded-2xl border
              backdrop-blur-xl bg-card/60
              transition-all duration-300
              ${tierBorder}
              ${vip ? 'shadow-xl shadow-primary/15' : 'shadow-lg shadow-background/50'}
            `}
          >
            {/* Background Decorations */}
            <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
              {/* Gradient orb */}
              <div 
                className={`
                  absolute -top-12 -right-12 w-28 h-28 rounded-full blur-3xl
                  bg-gradient-to-br ${tierGlow} opacity-50
                  transition-all duration-500
                  ${isHovered ? 'scale-150 opacity-70' : ''}
                `}
              />
              <div 
                className={`
                  absolute -bottom-6 -left-6 w-20 h-20 rounded-full blur-2xl
                  bg-gradient-to-tr ${tierGlow} opacity-30
                  transition-all duration-500
                  ${isHovered ? 'scale-125 opacity-50' : ''}
                `}
              />
              
              {/* Scale Pattern Overlay */}
              <div 
                className="absolute inset-0 opacity-[0.015]"
                style={{
                  backgroundImage: `radial-gradient(circle at 50% 50%, hsl(var(--primary)) 1px, transparent 1px)`,
                  backgroundSize: '14px 14px',
                }}
              />
            </div>

            {/* Dragon Icon */}
            <div 
              className={`
                absolute -top-5 right-2 w-14 h-14
                transition-all duration-500 transform
                ${isHovered ? '-translate-y-1' : ''}
              `}
              style={{ 
                transformStyle: 'preserve-3d', 
                transform: isHovered ? 'translateZ(30px) translateY(-4px)' : 'translateZ(15px)' 
              }}
            >
              <img 
                src={dragonIcon} 
                alt={name}
                className="w-full h-full object-contain drop-shadow-xl"
              />
            </div>

            {/* Badges */}
            <div className="absolute -top-2.5 left-3 flex gap-1.5 z-10">
              {(popular || vip) && (
                <Badge 
                  className={`
                    ${vip 
                      ? "gradient-primary text-primary-foreground shadow-lg shadow-primary/30" 
                      : "bg-chart-3 text-primary-foreground"
                    } 
                    px-1.5 py-0.5 text-[9px] font-semibold
                  `}
                >
                  {vip ? (
                    <span className="flex items-center gap-0.5">
                      <Star className="w-2.5 h-2.5" /> MASTER
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
              className="absolute top-2.5 left-2.5 bg-background/70 backdrop-blur-sm text-[9px] py-0.5 px-1.5 border-primary/20"
            >
              <Timer className="w-2.5 h-2.5 mr-0.5" />
              {waitPeriod}d Lock
            </Badge>

            {/* Content */}
            <div className="relative z-10 pt-9">
              {/* Header */}
              <div className="text-center mb-2.5">
                <p className="text-[9px] font-medium text-muted-foreground uppercase tracking-widest mb-0.5">
                  {name}
                </p>
                <div className="flex items-baseline justify-center gap-0.5">
                  <span className="text-[10px] text-muted-foreground">$</span>
                  <span className={`text-2xl font-bold ${vip ? 'text-gradient' : 'text-foreground'}`}>
                    {amount.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-1 mb-2.5">
                <div 
                  className={`
                    text-center p-1.5 rounded-lg border border-border/30
                    bg-secondary/40 backdrop-blur-sm transition-all duration-300
                    ${isHovered ? 'scale-[1.03] bg-secondary/60' : ''}
                  `}
                >
                  <TrendingUp className="w-3 h-3 mx-auto mb-0.5 text-success" />
                  <div className="text-[10px] font-bold text-success">{roi}</div>
                  <div className="text-[7px] text-muted-foreground uppercase">ROI</div>
                </div>
                <div 
                  className={`
                    text-center p-1.5 rounded-lg border border-border/30
                    bg-secondary/40 backdrop-blur-sm transition-all duration-300
                    ${isHovered ? 'scale-[1.03] bg-secondary/60' : ''}
                  `}
                >
                  <Clock className="w-3 h-3 mx-auto mb-0.5 text-primary" />
                  <div className="text-[10px] font-bold">{durationDays}d</div>
                  <div className="text-[7px] text-muted-foreground uppercase">Active</div>
                </div>
                <div 
                  className={`
                    text-center p-1.5 rounded-lg border border-border/30
                    bg-secondary/40 backdrop-blur-sm transition-all duration-300
                    ${isHovered ? 'scale-[1.03] bg-secondary/60' : ''}
                  `}
                >
                  <Shield className="w-3 h-3 mx-auto mb-0.5 text-chart-3" />
                  <div className={`text-[8px] font-semibold px-1 py-0.5 rounded-full border ${riskColors[riskLevel]}`}>
                    {riskLevel}
                  </div>
                </div>
              </div>

              {/* AI Strategy */}
              <div 
                className={`
                  p-2 rounded-lg mb-2.5 border transition-all duration-300
                  bg-gradient-to-br from-secondary/50 to-secondary/20 border-border/20
                `}
              >
                <div className="flex items-center justify-between mb-0.5">
                  <div className="flex items-center gap-1">
                    <Zap className="w-2.5 h-2.5 text-primary" />
                    <span className="text-[9px] font-semibold">AI Strategy</span>
                  </div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="p-0.5 hover:bg-secondary rounded">
                        <Info className="w-2.5 h-2.5 text-muted-foreground" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-[180px] text-[10px]">
                      <p className="font-semibold mb-0.5">Investment Terms</p>
                      <ul className="space-y-0.5 text-muted-foreground">
                        <li>• {waitPeriod}-day lock period</li>
                        <li>• Active for {durationDays} days</li>
                        <li>• Daily ROI after lock</li>
                      </ul>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <p className="text-[9px] text-muted-foreground line-clamp-2">{strategy}</p>
              </div>

              {/* Features */}
              <ul className="space-y-1 mb-3">
                {features.slice(0, 3).map((feature, index) => (
                  <li 
                    key={index} 
                    className={`
                      flex items-center gap-1 text-[9px] transition-all duration-300
                      ${isHovered ? 'translate-x-0.5' : ''}
                    `}
                    style={{ transitionDelay: `${index * 40}ms` }}
                  >
                    <div className="w-3 h-3 rounded-full flex items-center justify-center flex-shrink-0 bg-success/15">
                      <Check className="w-2 h-2 text-success" />
                    </div>
                    <span className="text-muted-foreground truncate">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <Button
                className={`
                  w-full relative overflow-hidden h-8 text-[11px] font-semibold
                  transition-all duration-300
                  ${vip 
                    ? 'gradient-primary hover:shadow-lg hover:shadow-primary/30 text-primary-foreground' 
                    : 'bg-gradient-to-r from-primary to-chart-3 hover:opacity-90 text-primary-foreground'
                  }
                `}
                onClick={handleInvestClick}
                disabled={isInvesting}
              >
                <span className="relative z-10 flex items-center justify-center gap-1">
                  {isInvesting ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Zap className="w-3 h-3" />
                      Activate Node
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
      <ConfirmDialog 
        open={showConfirm}
        onOpenChange={setShowConfirm}
        dragonIcon={dragonIcon}
        name={name}
        amount={amount}
        waitPeriod={waitPeriod}
        roi={roi}
        durationDays={durationDays}
        expectedReturn={expectedReturn}
        hasInsufficientBalance={hasInsufficientBalance}
        wallet={wallet}
        isInvesting={isInvesting}
        onConfirm={handleConfirmInvest}
        onGoToWallet={() => { setShowConfirm(false); navigate("/wallet"); }}
      />
    </>
  );
};

// Extracted Confirm Dialog component
interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dragonIcon: string;
  name: string;
  amount: number;
  waitPeriod: number;
  roi: string;
  durationDays: number;
  expectedReturn: number;
  hasInsufficientBalance: boolean;
  wallet: { balance: number } | null;
  isInvesting?: boolean;
  onConfirm: () => void;
  onGoToWallet: () => void;
}

const ConfirmDialog = ({
  open,
  onOpenChange,
  dragonIcon,
  name,
  amount,
  waitPeriod,
  roi,
  durationDays,
  expectedReturn,
  hasInsufficientBalance,
  wallet,
  isInvesting,
  onConfirm,
  onGoToWallet,
}: ConfirmDialogProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
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
        <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
          Cancel
        </Button>
        {hasInsufficientBalance ? (
          <Button variant="default" className="flex-1 gradient-primary text-primary-foreground" onClick={onGoToWallet}>
            Go to Wallet
          </Button>
        ) : (
          <Button 
            variant="default" 
            className="flex-1 gradient-primary text-primary-foreground" 
            onClick={onConfirm} 
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
);

export default DragonPackageCard;
