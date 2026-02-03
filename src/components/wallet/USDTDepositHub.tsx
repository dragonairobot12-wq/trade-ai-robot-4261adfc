import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { Copy, CheckCircle2, Shield, Zap, Scan, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type NetworkType = "BEP20" | "TRC20";

interface NetworkConfig {
  name: string;
  fullName: string;
  address: string;
  color: string;
  bgGradient: string;
  icon: string;
}

const NETWORKS: Record<NetworkType, NetworkConfig> = {
  BEP20: {
    name: "BEP20",
    fullName: "Binance Smart Chain",
    address: "0x8150E98ADB67819dF7491334092649498773eB06",
    color: "from-amber-400 to-yellow-500",
    bgGradient: "from-amber-500/20 to-yellow-500/10",
    icon: "🔶",
  },
  TRC20: {
    name: "TRC20",
    fullName: "Tron Network",
    address: "TNy7rsQ9NfeyGnqJMSHyenR8bhR4vL9HHH",
    color: "from-red-500 to-rose-600",
    bgGradient: "from-red-500/20 to-rose-500/10",
    icon: "🔴",
  },
};

const STEPS = [
  { icon: Zap, title: "Select Network", description: "Choose BEP20 or TRC20" },
  { icon: Copy, title: "Transfer USDT", description: "Send to the address" },
  { icon: Scan, title: "Auto-Verify", description: "System confirms deposit" },
];

const USDTDepositHub = () => {
  const [selectedNetwork, setSelectedNetwork] = useState<NetworkType>("BEP20");
  const [copied, setCopied] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { toast } = useToast();

  const currentNetwork = NETWORKS[selectedNetwork];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentNetwork.address);
      setCopied(true);
      setShowSuccess(true);
      
      toast({
        title: "Address Copied!",
        description: `${currentNetwork.name} wallet address copied to clipboard`,
      });

      setTimeout(() => {
        setCopied(false);
        setShowSuccess(false);
      }, 2500);
    } catch (err) {
      toast({
        title: "Copy Failed",
        description: "Please manually copy the address",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Instructional Steps */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-3 gap-3"
      >
        {STEPS.map((step, index) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex flex-col items-center text-center p-3 rounded-xl bg-card/40 border border-border/50 backdrop-blur-sm"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-2">
              <step.icon className="w-5 h-5 text-primary" />
            </div>
            <span className="text-xs font-semibold text-foreground mb-0.5">{step.title}</span>
            <span className="text-[10px] text-muted-foreground leading-tight">{step.description}</span>
          </motion.div>
        ))}
      </motion.div>

      {/* Network Switcher - Segmented Control */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="relative p-1.5 rounded-2xl bg-card/60 border border-border/50 backdrop-blur-xl"
      >
        <div className="grid grid-cols-2 gap-2 relative">
          {(Object.keys(NETWORKS) as NetworkType[]).map((network) => {
            const isActive = selectedNetwork === network;
            const config = NETWORKS[network];
            
            return (
              <button
                key={network}
                onClick={() => setSelectedNetwork(network)}
                className={cn(
                  "relative z-10 py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-300",
                  "flex items-center justify-center gap-2",
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground/80"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNetwork"
                    className={cn(
                      "absolute inset-0 rounded-xl bg-gradient-to-r",
                      config.color,
                      "opacity-20"
                    )}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                {isActive && (
                  <motion.div
                    layoutId="activeNetworkBorder"
                    className={cn(
                      "absolute inset-0 rounded-xl border-2 border-transparent",
                      "bg-gradient-to-r",
                      config.color,
                      "opacity-60",
                      "[background-clip:padding-box,border-box]",
                      "[background-origin:padding-box,border-box]"
                    )}
                    style={{
                      background: `linear-gradient(hsl(var(--card)), hsl(var(--card))) padding-box, linear-gradient(135deg, ${isActive ? 'hsl(var(--primary))' : 'transparent'}, ${isActive ? 'hsl(var(--accent))' : 'transparent'}) border-box`,
                    }}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">{config.icon}</span>
                <span className="relative z-10">USDT ({network})</span>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* The Vault Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedNetwork}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
          className={cn(
            "relative overflow-hidden rounded-2xl",
            "bg-gradient-to-br",
            currentNetwork.bgGradient,
            "border border-border/50 backdrop-blur-xl"
          )}
        >
          {/* Ambient glow */}
          <div className={cn(
            "absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-30",
            "bg-gradient-to-br",
            currentNetwork.color
          )} />
          
          <div className="relative p-6 space-y-6">
            {/* Network Header */}
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center text-2xl",
                "bg-gradient-to-br",
                currentNetwork.color,
                "shadow-lg"
              )}>
                {currentNetwork.icon}
              </div>
              <div>
                <h3 className="font-bold text-lg">{currentNetwork.name}</h3>
                <p className="text-sm text-muted-foreground">{currentNetwork.fullName}</p>
              </div>
            </div>

            {/* QR Code */}
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="flex justify-center"
            >
              <div className="p-4 bg-foreground rounded-2xl shadow-2xl">
                <QRCodeSVG
                  value={currentNetwork.address}
                  size={180}
                  level="H"
                  includeMargin={false}
                  bgColor="hsl(var(--foreground))"
                  fgColor="hsl(var(--background))"
                  className="w-36 h-36 sm:w-44 sm:h-44"
                />
              </div>
            </motion.div>

            {/* Wallet Address */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Wallet Address
              </label>
              <div className="relative">
                <code className="block w-full p-4 pr-14 rounded-xl bg-background/80 border border-border/50 font-mono text-xs sm:text-sm break-all text-foreground/90 selection:bg-primary/30">
                  {currentNetwork.address}
                </code>
              </div>
            </div>

            {/* Copy Button */}
            <Button
              onClick={handleCopy}
              disabled={copied}
              className={cn(
                "w-full h-14 rounded-xl font-bold text-base transition-all duration-300",
                "bg-gradient-to-r",
                currentNetwork.color,
                "hover:opacity-90 hover:scale-[1.02]",
                "text-foreground shadow-lg",
                copied && "bg-success hover:bg-success"
              )}
            >
              <AnimatePresence mode="wait">
                {copied ? (
                  <motion.div
                    key="copied"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: [0, 1.2, 1] }}
                      transition={{ duration: 0.4 }}
                    >
                      <CheckCircle2 className="w-6 h-6" />
                    </motion.div>
                    <span>Copied Successfully!</span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="copy"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    <Copy className="w-5 h-5" />
                    <span>Copy Address</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Safety Alert */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="relative overflow-hidden rounded-xl p-4 bg-destructive/5 border border-destructive/20"
      >
        {/* Red glow effect */}
        <div className="absolute -top-10 -left-10 w-20 h-20 bg-destructive/20 rounded-full blur-2xl" />
        
        <div className="relative flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-4 h-4 text-destructive" />
          </div>
          <div>
            <p className="font-semibold text-destructive text-sm mb-1">Security Warning</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Only send <span className="font-semibold text-destructive">USDT</span> to this address. 
              Sending any other coin may result in <span className="font-semibold text-destructive">permanent loss</span> of funds.
              Double-check the network ({currentNetwork.name}) before sending.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Trust Badges */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex items-center justify-center gap-4 pt-2"
      >
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Shield className="w-3.5 h-3.5 text-success" />
          <span>Secure Transfer</span>
        </div>
        <div className="w-1 h-1 rounded-full bg-border" />
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Zap className="w-3.5 h-3.5 text-primary" />
          <span>Instant Detection</span>
        </div>
      </motion.div>
    </div>
  );
};

export default USDTDepositHub;
