import { motion } from "framer-motion";
import { ArrowDownLeft, Users, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import AnimatedCounter from "./AnimatedCounter";

interface QuickStatsRowProps {
  totalWithdrawn: number;
  referralBonus: number;
  nextPayoutHours: number;
}

const QuickStatsRow = ({ totalWithdrawn, referralBonus, nextPayoutHours }: QuickStatsRowProps) => {
  const stats = [
    {
      title: "Total Withdrawn",
      value: totalWithdrawn,
      prefix: "$",
      icon: ArrowDownLeft,
      iconBg: "bg-warning/10",
      iconColor: "text-warning",
      delay: 0.8,
    },
    {
      title: "Referral Bonus",
      value: referralBonus,
      prefix: "$",
      icon: Users,
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
      delay: 0.9,
    },
    {
      title: "Next Payout",
      value: nextPayoutHours,
      suffix: "h",
      icon: Clock,
      iconBg: "bg-success/10",
      iconColor: "text-success",
      delay: 1.0,
      isCountdown: true,
    },
  ];

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 }
  };

  return (
    <div className="grid grid-cols-3 gap-3 lg:gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.4, delay: stat.delay }}
        >
          <Card className="border-border bg-card hover:bg-secondary/30 transition-all duration-300 group">
            <CardContent className="p-3 lg:p-4">
              <div className={`w-8 h-8 lg:w-10 lg:h-10 rounded-xl ${stat.iconBg} flex items-center justify-center mb-3 transition-transform group-hover:scale-110`}>
                <stat.icon className={`w-4 h-4 lg:w-5 lg:h-5 ${stat.iconColor}`} />
              </div>
              <p className="text-[10px] lg:text-xs text-muted-foreground mb-0.5 truncate">
                {stat.title}
              </p>
              <p className="text-base lg:text-xl font-bold">
                {stat.prefix}
                <AnimatedCounter 
                  value={stat.value} 
                  decimals={stat.isCountdown ? 0 : 2} 
                  duration={1200} 
                />
                {stat.suffix}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default QuickStatsRow;
