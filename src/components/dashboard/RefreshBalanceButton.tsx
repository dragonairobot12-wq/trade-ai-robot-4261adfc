import { useState, useRef, useCallback } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface RefreshBalanceButtonProps {
  onRefresh: () => Promise<unknown>;
  currentBalance?: number;
  className?: string;
  variant?: "icon" | "button";
}

const RefreshBalanceButton = ({
  onRefresh,
  currentBalance = 0,
  className,
  variant = "icon",
}: RefreshBalanceButtonProps) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const previousBalanceRef = useRef(currentBalance);
  const { toast } = useToast();

  const handleRefresh = useCallback(async () => {
    if (isRefreshing) return;

    setIsRefreshing(true);
    previousBalanceRef.current = currentBalance;

    try {
      await onRefresh();
      
      // Small delay to allow state to update
      setTimeout(() => {
        setIsRefreshing(false);
      }, 600);
    } catch (error) {
      console.error("Failed to refresh balance:", error);
      toast({
        title: "Refresh Failed",
        description: "Unable to refresh balance. Please try again.",
        variant: "destructive",
      });
      setIsRefreshing(false);
    }
  }, [isRefreshing, currentBalance, onRefresh, toast]);

  // Check if balance increased after refresh completes
  const checkBalanceChange = useCallback(() => {
    if (!isRefreshing && currentBalance > previousBalanceRef.current) {
      const difference = currentBalance - previousBalanceRef.current;
      toast({
        title: "✅ Balance Updated!",
        description: `+$${difference.toFixed(2)} added to your account`,
        className: "bg-success/10 border-success/30 text-success",
      });
      previousBalanceRef.current = currentBalance;
    }
  }, [isRefreshing, currentBalance, toast]);

  // Effect to check balance after refresh
  useState(() => {
    if (!isRefreshing) {
      checkBalanceChange();
    }
  });

  if (variant === "button") {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={handleRefresh}
        disabled={isRefreshing}
        className={cn(
          "gap-2 text-xs",
          className
        )}
      >
        <RefreshCw
          className={cn(
            "w-3.5 h-3.5 transition-transform duration-500",
            isRefreshing && "animate-spin"
          )}
        />
        {isRefreshing ? "Refreshing..." : "Refresh"}
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleRefresh}
      disabled={isRefreshing}
      className={cn(
        "h-8 w-8 rounded-full hover:bg-primary/10 transition-colors",
        className
      )}
      title="Refresh balance"
    >
      <RefreshCw
        className={cn(
          "w-4 h-4 text-muted-foreground transition-all duration-500",
          isRefreshing && "animate-spin text-primary"
        )}
      />
    </Button>
  );
};

export default RefreshBalanceButton;
