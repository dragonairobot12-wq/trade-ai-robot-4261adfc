import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, X, ExternalLink, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ForgotPasswordModal = ({ isOpen, onClose }: ForgotPasswordModalProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    
    // Calculate rotation (max 8 degrees)
    const maxRotation = 8;
    const rotateYValue = (mouseX / (rect.width / 2)) * maxRotation;
    const rotateXValue = -(mouseY / (rect.height / 2)) * maxRotation;
    
    setRotateX(rotateXValue);
    setRotateY(rotateYValue);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  const handleContactSupport = () => {
    window.open("https://t.me/dragon_ai_robot", "_blank");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
          />

          {/* Modal Container */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* 3D Glassmorphic Card */}
            <motion.div
              ref={cardRef}
              className="relative w-full max-w-md pointer-events-auto perspective-1000"
              initial={{ scale: 0.8, opacity: 0, rotateX: -15, rotateY: 0 }}
              animate={{ 
                scale: 1, 
                opacity: 1, 
                rotateX: rotateX,
                rotateY: rotateY,
              }}
              exit={{ scale: 0.8, opacity: 0, rotateX: 15, rotateY: 0 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 25,
                mass: 0.8,
              }}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{
                transformStyle: "preserve-3d",
              }}
            >
              {/* Glow Effect Behind Card */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/30 via-blue-500/20 to-cyan-500/30 rounded-[32px] blur-2xl opacity-50 -z-10 scale-105" />
              
              {/* Card Content */}
              <div className="relative backdrop-blur-2xl bg-white/5 border border-white/10 rounded-[32px] p-8 shadow-2xl overflow-hidden">
                {/* Animated Background Gradient */}
                <div className="absolute inset-0 opacity-30">
                  <motion.div 
                    className="absolute -top-20 -left-20 w-40 h-40 bg-emerald-500 rounded-full blur-3xl"
                    animate={{ 
                      x: [0, 30, 0], 
                      y: [0, 20, 0],
                      scale: [1, 1.2, 1]
                    }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <motion.div 
                    className="absolute -bottom-20 -right-20 w-40 h-40 bg-blue-500 rounded-full blur-3xl"
                    animate={{ 
                      x: [0, -30, 0], 
                      y: [0, -20, 0],
                      scale: [1, 1.3, 1]
                    }}
                    transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                  />
                </div>

                {/* Close Button */}
                <motion.button
                  className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-white transition-all duration-200 border border-white/10"
                  onClick={onClose}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <X className="w-5 h-5" />
                </motion.button>

                {/* Content */}
                <div className="relative z-10 flex flex-col items-center text-center space-y-6">
                  {/* Glowing Lock Icon */}
                  <motion.div 
                    className="relative"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 200, 
                      damping: 15, 
                      delay: 0.2 
                    }}
                  >
                    <div className="absolute inset-0 bg-emerald-400 rounded-full blur-2xl opacity-50 scale-150" />
                    <div className="relative w-20 h-20 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-3xl flex items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.5)]">
                      <Lock className="w-10 h-10 text-white" />
                    </div>
                    {/* Pulsing Ring */}
                    <motion.div 
                      className="absolute inset-0 border-2 border-emerald-400/50 rounded-3xl"
                      animate={{ 
                        scale: [1, 1.3, 1],
                        opacity: [0.5, 0, 0.5]
                      }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    />
                  </motion.div>

                  {/* Heading */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <h2 className="text-2xl font-bold text-white mb-2">Password Recovery</h2>
                  </motion.div>

                  {/* Description */}
                  <motion.p
                    className="text-muted-foreground text-sm leading-relaxed max-w-sm"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    For security reasons, password resets are handled manually by the Dragon AI Support Team. 
                    Please contact our official support on Telegram to verify your identity and restore access.
                  </motion.p>

                  {/* Security Notice */}
                  <motion.div
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-400/20 rounded-xl text-xs text-emerald-400"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Lock className="w-3 h-3" />
                    <span>Manual verification ensures maximum account security</span>
                  </motion.div>

                  {/* Telegram Support Button */}
                  <motion.div
                    className="w-full pt-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        onClick={handleContactSupport}
                        className="w-full h-14 text-base font-semibold rounded-2xl bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-400 hover:from-blue-400 hover:via-cyan-400 hover:to-blue-300 text-white shadow-[0_0_30px_rgba(59,130,246,0.4)] hover:shadow-[0_0_40px_rgba(59,130,246,0.6)] transition-all duration-300"
                      >
                        <MessageCircle className="w-5 h-5 mr-2" />
                        CONTACT SUPPORT TEAM
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </Button>
                    </motion.div>
                  </motion.div>

                  {/* Close Link */}
                  <motion.button
                    className="text-muted-foreground hover:text-white text-sm transition-colors duration-200 mt-2"
                    onClick={onClose}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Return to Login
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ForgotPasswordModal;
