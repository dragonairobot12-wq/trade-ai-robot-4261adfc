import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp } from "lucide-react";

interface SplashScreenProps {
  onComplete: () => void;
  minDuration?: number;
}

const loadingMessages = [
  "Initializing AI Nodes...",
  "Securing Connection...",
  "Fetching Market Data...",
  "Preparing Dashboard...",
];

const SplashScreen = ({ onComplete, minDuration = 3000 }: SplashScreenProps) => {
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const startTime = Date.now();
    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / minDuration) * 100, 100);
      setProgress(newProgress);

      if (newProgress >= 100) {
        clearInterval(progressInterval);
        setIsExiting(true);
        setTimeout(onComplete, 600);
      }
    }, 30);

    return () => clearInterval(progressInterval);
  }, [minDuration, onComplete]);

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 800);

    return () => clearInterval(messageInterval);
  }, []);

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0, 
            scale: 1.5,
            filter: "blur(20px)"
          }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
          style={{
            background: "linear-gradient(180deg, #050810 0%, #0a1020 50%, #050810 100%)",
          }}
        >
          {/* Ambient background effects */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Grid pattern */}
            <div 
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(16, 185, 129, 0.3) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(16, 185, 129, 0.3) 1px, transparent 1px)
                `,
                backgroundSize: "60px 60px",
              }}
            />
            
            {/* Radial glow */}
            <motion.div
              animate={{
                opacity: [0.3, 0.5, 0.3],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
              style={{
                background: "radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%)",
              }}
            />
          </div>

          {/* Main content */}
          <div className="relative z-10 flex flex-col items-center">
            {/* Logo container with 3D effect */}
            <motion.div
              initial={{ 
                opacity: 0, 
                scale: 0.5,
                rotateX: -30,
                rotateY: -30,
              }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                rotateX: 0,
                rotateY: 0,
              }}
              transition={{ 
                duration: 1,
                ease: [0.16, 1, 0.3, 1],
              }}
              style={{ perspective: "1000px" }}
              className="relative mb-12"
            >
              {/* Pulsing glow behind logo */}
              <motion.div
                animate={{
                  opacity: [0.4, 0.8, 0.4],
                  scale: [0.8, 1.2, 0.8],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 -m-8 rounded-full blur-3xl"
                style={{
                  background: "radial-gradient(circle, rgba(16, 185, 129, 0.6) 0%, rgba(16, 185, 129, 0.2) 40%, transparent 70%)",
                }}
              />
              
              {/* Secondary glow ring */}
              <motion.div
                animate={{
                  opacity: [0.2, 0.5, 0.2],
                  rotate: [0, 360],
                }}
                transition={{
                  opacity: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                  rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                }}
                className="absolute inset-0 -m-16 rounded-full border border-emerald-500/20"
              />

              {/* Logo icon with 3D animation */}
              <motion.div
                animate={{
                  rotateY: [0, 5, 0, -5, 0],
                  rotateX: [0, -5, 0, 5, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative"
              >
                <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700 flex items-center justify-center shadow-2xl shadow-emerald-500/30">
                  {/* Inner glow */}
                  <div className="absolute inset-[2px] rounded-3xl bg-gradient-to-br from-emerald-400/20 to-transparent" />
                  
                  <TrendingUp className="w-12 h-12 md:w-16 md:h-16 text-white drop-shadow-lg" />
                  
                  {/* Shine effect */}
                  <motion.div
                    animate={{
                      x: ["-100%", "200%"],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      repeatDelay: 2,
                      ease: "easeInOut",
                    }}
                    className="absolute inset-0 rounded-3xl overflow-hidden"
                  >
                    <div className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>

            {/* Brand name */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="mb-16"
            >
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-white via-white to-emerald-200 bg-clip-text text-transparent">
                  Trade
                </span>
                <span className="bg-gradient-to-r from-emerald-400 to-emerald-500 bg-clip-text text-transparent">
                  AI
                </span>
              </h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="text-center text-sm text-muted-foreground mt-2 tracking-widest uppercase"
              >
                Intelligent Trading Platform
              </motion.p>
            </motion.div>

            {/* Progress bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="w-64 md:w-80"
            >
              <div className="relative h-1 bg-white/5 rounded-full overflow-hidden backdrop-blur-sm">
                {/* Progress fill */}
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{
                    width: `${progress}%`,
                    background: "linear-gradient(90deg, rgba(16, 185, 129, 0.5) 0%, rgba(16, 185, 129, 1) 100%)",
                  }}
                  transition={{ duration: 0.1 }}
                />
                
                {/* Glowing tip */}
                <motion.div
                  className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full"
                  style={{
                    left: `${Math.max(0, progress - 1)}%`,
                    background: "rgba(16, 185, 129, 1)",
                    boxShadow: "0 0 20px rgba(16, 185, 129, 0.8), 0 0 40px rgba(16, 185, 129, 0.4)",
                  }}
                />
              </div>

              {/* Progress percentage */}
              <div className="flex justify-between items-center mt-3">
                <span className="text-xs text-muted-foreground font-mono">
                  {Math.round(progress)}%
                </span>
                <span className="text-xs text-emerald-500/80 font-mono">
                  Loading...
                </span>
              </div>
            </motion.div>

            {/* Cycling status message */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="mt-8 h-6 flex items-center justify-center"
            >
              <AnimatePresence mode="wait">
                <motion.p
                  key={messageIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="text-sm text-muted-foreground/80 font-light tracking-wide"
                >
                  {loadingMessages[messageIndex]}
                </motion.p>
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Bottom branding */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="absolute bottom-8 text-center"
          >
            <p className="text-xs text-muted-foreground/40 tracking-widest uppercase">
              Powered by Advanced AI
            </p>
          </motion.div>

          {/* Corner decorations */}
          <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-emerald-500/20 rounded-tl-lg" />
          <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-emerald-500/20 rounded-tr-lg" />
          <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-emerald-500/20 rounded-bl-lg" />
          <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-emerald-500/20 rounded-br-lg" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;
