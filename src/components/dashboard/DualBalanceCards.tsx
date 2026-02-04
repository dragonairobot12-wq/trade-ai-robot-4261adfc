import { motion } from "framer-motion";
import { Shield, Zap, ArrowUpRight, Lock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import AnimatedCounter from "./AnimatedCounter";

interface DualBalanceCardsProps {
  depositBalance: number;
  profitBalance: number;
  minimumWithdrawal: number;
}

const DualBalanceCards = ({ depositBalance, profitBalance, minimumWithdrawal }: DualBalanceCardsProps) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
      {/* Card 1: Active Trading Capital (Locked) */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="relative overflow-hidden border-2 border-slate-600/50 bg-gradient-to-br from-slate-900/80 via-slate-800/60 to-slate-900/80 backdrop-blur-xl h-full">
          {/* Animated background glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-slate-600/10" />
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl" />
          
          <CardContent className="relative p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-600 to-slate-700 border border-slate-500/50 flex items-center justify-center shadow-lg">
                <Shield className="w-7 h-7 text-slate-200" />
              </div>
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 animate-pulse">
                <Lock className="w-3 h-3 mr-1" />
                Locked & Trading
              </Badge>
            </div>

            {/* Title & Value */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">
                Active Trading Capital
              </h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl lg:text-5xl font-bold text-foreground">
                  $<AnimatedCounter value={depositBalance} decimals={2} duration={1500} />
                </span>
                <span className="text-lg text-muted-foreground">USDT</span>
              </div>
            </div>

            {/* Description */}
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              Your active trading funds. Used for generating daily ROI through our AI trading robots.
            </p>

            {/* Silver accent line */}
            <div className="mt-6 h-1 w-full rounded-full bg-gradient-to-r from-slate-600 via-slate-400 to-slate-600 opacity-50" />
          </CardContent>
        </Card>
      </motion.div>

      {/* Card 2: Withdrawable Profit (Green Zone) */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="relative overflow-hidden border-2 border-primary/40 bg-gradient-to-br from-background via-background/95 to-primary/5 backdrop-blur-xl h-full group">
          {/* Animated background glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-success/10" />
          <div className="absolute top-0 right-0 w-40 h-40 bg-primary/20 rounded-full blur-3xl group-hover:bg-primary/30 transition-colors duration-500" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-success/15 rounded-full blur-3xl" />
          
          {/* Glowing border effect */}
          <div className="absolute inset-0 rounded-xl border border-primary/30 shadow-[0_0_30px_rgba(var(--primary-rgb),0.15)]" />
          
          <CardContent className="relative p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/30">
                <Zap className="w-7 h-7 text-primary-foreground" />
              </div>
              <Badge className="bg-success/20 text-success border-success/30">
                <span className="w-2 h-2 rounded-full bg-success animate-pulse mr-1.5" />
                Available
              </Badge>
            </div>

            {/* Title & Value */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-primary/80 uppercase tracking-wider">
                Withdrawable Profit
              </h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary via-primary to-success bg-clip-text text-transparent">
                  $<AnimatedCounter value={profitBalance} decimals={2} duration={1500} />
                </span>
                <span className="text-lg text-muted-foreground">USDT</span>
              </div>
            </div>

            {/* Description */}
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              Available for instant withdrawal (Min. ${minimumWithdrawal}).
            </p>

            {/* Withdraw Button */}
            <Button 
              asChild
              className="mt-6 w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg shadow-primary/25 group/btn"
            >
              <Link to="/wallet" className="flex items-center justify-center gap-2">
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                Withdraw Now
              </Link>
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default DualBalanceCards;
