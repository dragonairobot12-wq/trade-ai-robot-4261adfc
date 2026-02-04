import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Sparkles, TrendingUp, Shield } from "lucide-react";
import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Deep Black Background with Gradient Orbs */}
      <div className="absolute inset-0 bg-background" />
      
      {/* Animated Gradient Orbs */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-accent/15 rounded-full blur-[150px] animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[180px]" />
      
      {/* Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--primary) / 0.3) 1px, transparent 1px),
                           linear-gradient(90deg, hsl(var(--primary) / 0.3) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Left Content */}
          <motion.div 
            className="space-y-8 text-center lg:text-left"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge */}
            <motion.div 
              className="inline-flex items-center gap-2 glass-card-glow px-4 py-2 rounded-full text-sm font-medium"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-primary">AI-Powered Trading Robot</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight font-display"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Unleash the Power of{" "}
              <span className="text-gradient-glow">AI Trading</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p 
              className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Maximize your wealth with Dragon AI. Automated crypto trading strategies with{" "}
              <span className="text-primary font-semibold">up to 5% daily ROI</span>.
            </motion.p>

            {/* Value Props */}
            <motion.div 
              className="flex flex-wrap justify-center lg:justify-start gap-4 md:gap-6 text-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-primary-foreground" />
                </div>
                <span>Smart Trading</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                  <Shield className="w-4 h-4 text-primary-foreground" />
                </div>
                <span>Risk Protected</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-primary-foreground" />
                </div>
                <span>24/7 Automated</span>
              </div>
            </motion.div>

            {/* CTAs */}
            <motion.div 
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Link to="/register">
                <Button 
                  size="xl" 
                  className="gradient-primary text-primary-foreground shadow-glow hover:shadow-glow-orange transition-all duration-300 animate-glow-pulse group font-semibold"
                >
                  Start Earning Now
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/demo">
                <Button 
                  size="xl" 
                  variant="outline" 
                  className="border-primary/50 text-foreground hover:bg-primary/10 hover:border-primary group"
                >
                  <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                  Watch Demo
                </Button>
              </Link>
            </motion.div>

            {/* Disclaimer */}
            <motion.p 
              className="text-xs text-muted-foreground/60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              *Simulated / backtested performance. Past results don't guarantee future returns.
            </motion.p>
          </motion.div>

          {/* Right Visual - 3D Dragon/Robot Illustration */}
          <motion.div 
            className="relative flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {/* Glow Ring */}
            <div className="absolute w-[400px] h-[400px] md:w-[500px] md:h-[500px] rounded-full border border-primary/30 animate-pulse" />
            <div className="absolute w-[350px] h-[350px] md:w-[450px] md:h-[450px] rounded-full border border-accent/20 animate-pulse delay-500" />
            
            {/* Central Dragon Visual */}
            <motion.div 
              className="relative w-[300px] h-[300px] md:w-[400px] md:h-[400px] rounded-full glass-card-glow flex items-center justify-center animate-float"
              animate={{ 
                y: [0, -20, 0],
              }}
              transition={{ 
                duration: 6, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            >
              {/* Dragon Icon Placeholder - Futuristic Design */}
              <div className="text-center">
                <div className="text-8xl md:text-9xl filter drop-shadow-[0_0_30px_hsl(38_95%_55%_/_0.5)]">
                  🐉
                </div>
                <div className="mt-4 gradient-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-bold shadow-glow">
                  Dragon AI Active
                </div>
              </div>
              
              {/* Floating Stats */}
              <motion.div 
                className="absolute -top-4 -right-4 glass-card-glow px-4 py-2 rounded-xl"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
              >
                <p className="text-xs text-muted-foreground">Daily ROI</p>
                <p className="text-lg font-bold text-primary">+5.2%</p>
              </motion.div>
              
              <motion.div 
                className="absolute -bottom-4 -left-4 glass-card-glow px-4 py-2 rounded-xl"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1 }}
              >
                <p className="text-xs text-muted-foreground">Trades Today</p>
                <p className="text-lg font-bold text-accent">1,247</p>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
