import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const TRADING_PAIRS = [
  { symbol: "BINANCE:BTCUSDT", label: "BTC", name: "Bitcoin" },
  { symbol: "BINANCE:ETHUSDT", label: "ETH", name: "Ethereum" },
  { symbol: "BINANCE:SOLUSDT", label: "SOL", name: "Solana" },
  { symbol: "BINANCE:BNBUSDT", label: "BNB", name: "BNB" },
];

interface TradingViewChartProps {
  className?: string;
}

const TradingViewChart = ({ className }: TradingViewChartProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activePair, setActivePair] = useState(TRADING_PAIRS[0]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Simulate connection status
    const timeout = setTimeout(() => setIsConnected(true), 1500);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear previous widget
    containerRef.current.innerHTML = "";

    // Create TradingView widget script
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: activePair.symbol,
      interval: "15",
      timezone: "Etc/UTC",
      theme: "dark",
      style: "1",
      locale: "en",
      backgroundColor: "rgba(5, 8, 16, 1)",
      gridColor: "rgba(42, 46, 57, 0.3)",
      hide_top_toolbar: false,
      hide_legend: false,
      allow_symbol_change: true,
      save_image: false,
      calendar: false,
      hide_volume: false,
      support_host: "https://www.tradingview.com",
      withdateranges: true,
      details: false,
      hotlist: false,
      studies: ["RSI@tv-basicstudies", "MASimple@tv-basicstudies"],
    });

    containerRef.current.appendChild(script);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [activePair]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={cn(
        "relative overflow-hidden",
        "bg-[#050810]/80 backdrop-blur-xl",
        "border border-border/20",
        "rounded-[32px] lg:rounded-[40px]",
        "shadow-2xl",
        className
      )}
    >
      {/* Header with Live Indicator and Pair Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 lg:p-6 border-b border-border/20">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-foreground">Advanced Market View</h3>
          
          {/* Live Connection Indicator */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/10 border border-success/20">
            <span 
              className={cn(
                "w-2 h-2 rounded-full",
                isConnected 
                  ? "bg-success animate-pulse shadow-[0_0_8px_hsl(var(--success))]" 
                  : "bg-muted-foreground"
              )} 
            />
            <span className="text-xs font-medium text-success">
              {isConnected ? "Live" : "Connecting..."}
            </span>
          </div>
        </div>

        {/* Pair Switcher Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {TRADING_PAIRS.map((pair) => (
            <motion.button
              key={pair.symbol}
              onClick={() => setActivePair(pair)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
                "whitespace-nowrap",
                activePair.symbol === pair.symbol
                  ? "text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground bg-secondary/50 hover:bg-secondary"
              )}
            >
              {/* Active glow background */}
              {activePair.symbol === pair.symbol && (
                <motion.div
                  layoutId="activePairPill"
                  className="absolute inset-0 rounded-full gradient-primary shadow-[0_0_20px_hsl(var(--primary)/0.5)]"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10">{pair.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Chart Container */}
      <div className="relative w-full h-[350px] sm:h-[400px] lg:h-[500px] xl:h-[550px]">
        {/* Loading State */}
        {!isConnected && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#050810] z-10">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
              <p className="text-muted-foreground text-sm">Loading market data...</p>
            </div>
          </div>
        )}

        {/* TradingView Widget Container */}
        <div
          ref={containerRef}
          className="tradingview-widget-container w-full h-full"
          style={{ touchAction: "pan-y" }}
        />
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between px-4 lg:px-6 py-3 border-t border-border/20 bg-secondary/20">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Trading pair:</span>
          <span className="text-sm font-medium text-foreground">{activePair.name}</span>
        </div>
        <span className="text-xs text-muted-foreground">
          Data by TradingView
        </span>
      </div>
    </motion.div>
  );
};

export default TradingViewChart;
