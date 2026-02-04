import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";

const TELEGRAM_URL = "https://t.me/dragon_ai_robot";

const FloatingTelegramButton = () => {
  const [isHovered, setIsHovered] = useState(false);
  const location = useLocation();

  // Hide on login/register/auth pages
  const hiddenPaths = ["/login", "/register", "/auth"];
  if (hiddenPaths.includes(location.pathname)) {
    return null;
  }

  return (
    <div className="fixed bottom-24 lg:bottom-8 right-4 z-50">
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, x: 10, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 10, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap"
          >
            <div className="bg-card/95 backdrop-blur-xl border border-border/50 rounded-lg px-4 py-2 shadow-lg">
              <p className="text-sm font-medium text-foreground">Chat with Admin</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.a
        href={TELEGRAM_URL}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="relative flex items-center justify-center w-14 h-14 rounded-full shadow-xl transition-all duration-300"
        style={{
          background: "linear-gradient(135deg, #0088cc 0%, #00aaee 100%)",
        }}
      >
        {/* Pulse animation ring */}
        <span className="absolute inset-0 rounded-full animate-ping opacity-30" style={{ background: "#0088cc" }} />
        <span className="absolute inset-0 rounded-full animate-pulse opacity-20" style={{ background: "#0088cc", animationDuration: "2s" }} />
        
        {/* Glow effect */}
        <span 
          className="absolute inset-0 rounded-full blur-md opacity-50"
          style={{ background: "#0088cc" }}
        />

        {/* Telegram Icon */}
        <svg
          className="relative w-7 h-7 text-white"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
        </svg>
      </motion.a>
    </div>
  );
};

export default FloatingTelegramButton;
