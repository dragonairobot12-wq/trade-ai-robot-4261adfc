import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { 
  Copy, CheckCircle2, Shield, Zap, Scan, AlertTriangle, 
  CloudUpload, FileCheck, Loader2, HelpCircle, X, Sparkles 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
  { icon: Scan, title: "Submit Proof", description: "Upload payment proof" },
];

const USDTDepositHub = () => {
  const [selectedNetwork, setSelectedNetwork] = useState<NetworkType>("BEP20");
  const [copied, setCopied] = useState(false);
  const [showProofForm, setShowProofForm] = useState(false);
  
  // Proof form state
  const [txHash, setTxHash] = useState("");
  const [amount, setAmount] = useState("");
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const currentNetwork = NETWORKS[selectedNetwork];
  
  const isFormValid = txHash.trim().length > 0 && parseFloat(amount) > 0;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentNetwork.address);
      setCopied(true);
      setShowProofForm(true);
      
      toast({
        title: "Address Copied!",
        description: `${currentNetwork.name} wallet address copied to clipboard`,
      });

      setTimeout(() => {
        setCopied(false);
      }, 2500);
    } catch (err) {
      toast({
        title: "Copy Failed",
        description: "Please manually copy the address",
        variant: "destructive",
      });
    }
  };

  const handleFileSelect = useCallback((file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please upload an image smaller than 10MB",
        variant: "destructive",
      });
      return;
    }
    
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid File Type",
        description: "Please upload an image file (PNG, JPG, etc.)",
        variant: "destructive",
      });
      return;
    }

    setScreenshot(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setScreenshotPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  }, [toast]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const removeScreenshot = () => {
    setScreenshot(null);
    setScreenshotPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to submit a deposit",
        variant: "destructive",
      });
      return;
    }

    if (!isFormValid) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      let screenshotUrl: string | null = null;

      // Upload screenshot if provided
      if (screenshot) {
        const fileExt = screenshot.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('deposit-proofs')
          .upload(fileName, screenshot);

        if (uploadError) {
          console.error("Upload error:", uploadError);
          // Continue without screenshot if upload fails
        } else {
          const { data: urlData } = supabase.storage
            .from('deposit-proofs')
            .getPublicUrl(fileName);
          screenshotUrl = urlData.publicUrl;
        }
      }

      // Insert deposit record
      const { error: insertError } = await supabase
        .from('deposits')
        .insert({
          user_id: user.id,
          amount: parseFloat(amount),
          transaction_hash: txHash.trim(),
          network: selectedNetwork,
          wallet_address: currentNetwork.address,
          currency: 'USDT',
          status: 'pending',
          screenshot_url: screenshotUrl,
        });

      if (insertError) {
        throw insertError;
      }

      // Reset form
      setTxHash("");
      setAmount("");
      setScreenshot(null);
      setScreenshotPreview(null);
      setShowProofForm(false);
      setShowSuccessModal(true);

    } catch (error: any) {
      console.error("Deposit submission error:", error);
      toast({
        title: "Submission Failed",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
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

      {/* Proof of Payment Form - Slides up after copy */}
      <AnimatePresence>
        {showProofForm && (
          <motion.div
            initial={{ opacity: 0, y: 40, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: 40, height: 0 }}
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            className="overflow-hidden"
          >
            <div className="relative rounded-2xl bg-card/60 border border-border/50 backdrop-blur-xl p-6 space-y-5">
              {/* Form Header */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <FileCheck className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-base">Submit Payment Proof</h3>
                  <p className="text-xs text-muted-foreground">Complete your deposit request</p>
                </div>
              </div>

              {/* Transaction Hash Input */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="txHash" className="text-sm font-medium">
                    Transaction ID / Hash
                  </Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-[200px]">
                        <p className="text-xs">Paste the unique transaction ID from your wallet here.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Input
                  id="txHash"
                  value={txHash}
                  onChange={(e) => setTxHash(e.target.value)}
                  placeholder="e.g., 0x8f7e3b..."
                  className="h-12 font-mono text-sm bg-background/60 border-border/50"
                />
              </div>

              {/* Amount Input */}
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-sm font-medium">
                  Amount Sent (USDT)
                </Label>
                <div className="relative">
                  <Input
                    id="amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    className="h-12 text-lg font-semibold bg-background/60 border-border/50 pr-16"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                    USDT
                  </span>
                </div>
              </div>

              {/* Screenshot Upload */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Payment Screenshot <span className="text-muted-foreground font-normal">(Optional)</span>
                </Label>
                
                {!screenshotPreview ? (
                  <motion.div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => fileInputRef.current?.click()}
                    className={cn(
                      "relative cursor-pointer rounded-xl border-2 border-dashed transition-all duration-300",
                      "flex flex-col items-center justify-center py-8 px-4",
                      isDragOver 
                        ? "border-primary bg-primary/5" 
                        : "border-border/50 bg-background/40 hover:border-primary/50 hover:bg-background/60"
                    )}
                  >
                    <CloudUpload className={cn(
                      "w-10 h-10 mb-3 transition-colors",
                      isDragOver ? "text-primary" : "text-muted-foreground"
                    )} />
                    <p className="text-sm font-medium text-foreground mb-1">
                      {isDragOver ? "Drop your image here" : "Drag & drop or click to upload"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PNG, JPG up to 10MB
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                      className="hidden"
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative rounded-xl overflow-hidden border border-border/50"
                  >
                    <img 
                      src={screenshotPreview} 
                      alt="Payment proof" 
                      className="w-full h-40 object-cover"
                    />
                    <button
                      onClick={removeScreenshot}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-destructive/90 text-destructive-foreground hover:bg-destructive transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <div className="absolute bottom-0 inset-x-0 p-2 bg-gradient-to-t from-background/90 to-transparent">
                      <p className="text-xs text-foreground truncate">{screenshot?.name}</p>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Network Confirmation Badge */}
              <div className="flex items-center gap-2 p-3 rounded-xl bg-background/40 border border-border/30">
                <span className="text-lg">{currentNetwork.icon}</span>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Selected Network</p>
                  <p className="text-sm font-semibold">{currentNetwork.name} - {currentNetwork.fullName}</p>
                </div>
                <CheckCircle2 className="w-5 h-5 text-success" />
              </div>

              {/* Submit Button */}
              <Button
                onClick={handleSubmit}
                disabled={!isFormValid || isSubmitting}
                className={cn(
                  "w-full h-14 rounded-xl font-bold text-base transition-all duration-300",
                  "bg-gradient-to-r from-primary via-primary to-accent",
                  "hover:opacity-90 hover:scale-[1.02] hover:shadow-lg",
                  "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                )}
              >
                {isSubmitting ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-2"
                  >
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Processing Transaction...</span>
                  </motion.div>
                ) : (
                  <motion.div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    <span>Confirm Deposit</span>
                  </motion.div>
                )}
              </Button>
            </div>
          </motion.div>
        )}
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

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", bounce: 0.5, duration: 0.6 }}
              className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-success/20 to-success/5 flex items-center justify-center mb-4"
            >
              <CheckCircle2 className="w-8 h-8 text-success" />
            </motion.div>
            <DialogTitle className="text-xl font-bold">Deposit Request Submitted!</DialogTitle>
            <DialogDescription className="text-muted-foreground pt-2">
              Our team will verify your deposit within <span className="font-semibold text-foreground">10-30 minutes</span>. 
              You'll be notified once confirmed.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center pt-4">
            <Button 
              onClick={() => setShowSuccessModal(false)}
              className="px-8"
            >
              Got it
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default USDTDepositHub;
