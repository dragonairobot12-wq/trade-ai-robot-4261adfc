import { motion } from "framer-motion";
import { UserPlus, Shield, Bot, Sparkles, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const steps = [
  {
    icon: UserPlus,
    title: "Create Your Account",
    description: "Register in seconds and secure your personal trading dashboard.",
    accent: "from-emerald-500 to-cyan-500",
    glow: "shadow-emerald-500/30",
  },
  {
    icon: Shield,
    title: "Secure Deposit",
    description: "Go to Deposit, choose your network (TRC20/BEP20), and upload your payment receipt.",
    accent: "from-amber-500 to-orange-500",
    glow: "shadow-amber-500/30",
  },
  {
    icon: Bot,
    title: "Activate Your Dragon AI Robot",
    description: "Choose an investment plan that suits your goals. Our AI starts trading immediately.",
    accent: "from-primary to-orange-500",
    glow: "shadow-primary/30",
  },
  {
    icon: Sparkles,
    title: "Withdraw Profits",
    description: "Watch your profits grow daily and withdraw directly to your wallet once you reach $50.",
    accent: "from-cyan-500 to-primary",
    glow: "shadow-cyan-500/30",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const stepVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut" as const,
    },
  },
};

const HowItWorksSection = () => {
  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            How It <span className="text-gradient">Works</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Start your wealth-building journey in four simple steps
          </p>
        </motion.div>

        {/* Timeline Steps */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-4xl mx-auto"
        >
          {steps.map((step, index) => (
            <motion.div
              key={index}
              variants={stepVariants}
              className="relative flex gap-6 md:gap-10 mb-12 last:mb-0"
            >
              {/* Timeline Line */}
              <div className="flex flex-col items-center">
                {/* Step Number Circle */}
                <div
                  className={`relative w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br ${step.accent} flex items-center justify-center shadow-lg ${step.glow} group-hover:scale-110 transition-transform duration-300`}
                >
                  <step.icon className="w-8 h-8 md:w-10 md:h-10 text-primary-foreground" />
                  {/* Step Number Badge */}
                  <div className="absolute -top-2 -right-2 w-7 h-7 bg-card border-2 border-primary rounded-full flex items-center justify-center text-sm font-bold text-primary shadow-lg">
                    {index + 1}
                  </div>
                </div>
                {/* Connecting Line */}
                {index < steps.length - 1 && (
                  <div className="w-0.5 h-full min-h-[60px] bg-gradient-to-b from-primary/50 to-transparent mt-4" />
                )}
              </div>

              {/* Content Card */}
              <div className="flex-1 pb-8">
                <motion.div
                  whileHover={{ scale: 1.02, y: -2 }}
                  className="glass-card p-6 md:p-8 rounded-2xl border border-primary/10 hover:border-primary/30 transition-all duration-300 group"
                >
                  <h3 className="text-xl md:text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
                    {step.description}
                  </p>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Video Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="max-w-3xl mx-auto mt-20"
        >
          <div className="text-center mb-6">
            <h3 className="text-xl md:text-2xl font-semibold">
              <span className="text-gradient">Watch the Quick Start Guide</span>
            </h3>
          </div>
          <div className="relative aspect-video rounded-2xl overflow-hidden border-2 border-primary/30 bg-card/50 backdrop-blur-sm group cursor-pointer hover:border-primary/50 transition-all duration-300">
            {/* Video Placeholder Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-amber-500/10" />
            
            {/* Play Button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-primary to-amber-500 flex items-center justify-center shadow-2xl shadow-primary/30 group-hover:shadow-primary/50 transition-all duration-300"
              >
                <Play className="w-8 h-8 md:w-10 md:h-10 text-primary-foreground ml-1" fill="currentColor" />
              </motion.div>
            </div>

            {/* Coming Soon Label */}
            <div className="absolute bottom-4 left-4 px-3 py-1.5 bg-card/80 backdrop-blur-sm rounded-lg border border-primary/20">
              <span className="text-sm text-muted-foreground">Video coming soon</span>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-4 right-4 flex gap-2">
              <div className="w-3 h-3 rounded-full bg-primary/50 animate-pulse" />
              <div className="w-3 h-3 rounded-full bg-amber-500/50 animate-pulse delay-100" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/50 animate-pulse delay-200" />
            </div>
          </div>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-16"
        >
          <Link to="/register">
            <Button
              size="lg"
              className="gradient-primary text-primary-foreground px-10 py-6 text-lg font-semibold rounded-xl shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:scale-105 transition-all duration-300"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Start Now
            </Button>
          </Link>
          <p className="mt-4 text-sm text-muted-foreground">
            Join thousands of investors already growing their wealth
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
