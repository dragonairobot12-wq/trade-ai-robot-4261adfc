import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useMemo, useEffect } from "react";

export interface InvestmentPackage {
  id: string;
  name: string;
  price: number;
  roi: number;
  duration_days: number;
  risk_level: string;
  ai_strategy: string | null;
  description: string | null;
  is_active: boolean;
  created_at: string;
}

export interface UserInvestment {
  id: string;
  user_id: string;
  package_id: string;
  amount: number;
  expected_return: number;
  current_profit: number;
  start_date: string;
  end_date: string;
  status: string;
  created_at: string;
  updated_at: string;
  investment_packages?: InvestmentPackage;
}

// Helper to check if investment is expired based on end_date
const isInvestmentExpired = (endDate: string): boolean => {
  return new Date() > new Date(endDate);
};

// Calculate days remaining until expiry
export const getDaysRemaining = (endDate: string): number => {
  const end = new Date(endDate);
  const now = new Date();
  const diffTime = end.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
};

// Calculate progress percentage
export const getProgressPercentage = (startDate: string, endDate: string): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const now = new Date();

  const totalDuration = end.getTime() - start.getTime();
  const elapsed = now.getTime() - start.getTime();

  if (elapsed >= totalDuration) return 100;
  if (elapsed <= 0) return 0;

  return Math.min(100, (elapsed / totalDuration) * 100);
};

export const useInvestments = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all active investment packages
  const { data: packages = [], isLoading: packagesLoading } = useQuery({
    queryKey: ["investment_packages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("investment_packages")
        .select("*")
        .eq("is_active", true)
        .order("price", { ascending: true });

      if (error) throw error;
      return data as InvestmentPackage[];
    },
  });

  // Fetch user's investments
  const { data: userInvestments = [], isLoading: investmentsLoading } = useQuery({
    queryKey: ["user_investments", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from("user_investments")
        .select("*, investment_packages(*)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as UserInvestment[];
    },
    enabled: !!user?.id,
  });

  // Separate investments by actual expiry status (checking end_date, not just status field)
  const { activeInvestments, expiredInvestments, completedInvestments, newlyExpiredInvestments } = useMemo(() => {
    const active: UserInvestment[] = [];
    const expired: UserInvestment[] = [];
    const completed: UserInvestment[] = [];
    const newlyExpired: UserInvestment[] = [];

    userInvestments.forEach((inv) => {
      const isExpired = isInvestmentExpired(inv.end_date);
      
      if (inv.status === "completed") {
        completed.push(inv);
      } else if (isExpired || inv.status === "expired") {
        expired.push(inv);
        // Track newly expired (status still 'active' but time has passed)
        if (inv.status === "active" && isExpired) {
          newlyExpired.push(inv);
        }
      } else {
        active.push(inv);
      }
    });

    return { 
      activeInvestments: active, 
      expiredInvestments: expired, 
      completedInvestments: completed,
      newlyExpiredInvestments: newlyExpired
    };
  }, [userInvestments]);

  // Show toast for newly expired investments
  useEffect(() => {
    if (newlyExpiredInvestments.length > 0) {
      newlyExpiredInvestments.forEach((inv) => {
        const packageName = inv.investment_packages?.name || "Dragon AI Robot";
        toast({
          title: "Investment Cycle Completed",
          description: `Your ${packageName} has completed its cycle. Please renew your plan to continue earning.`,
          variant: "default",
        });
      });
    }
  }, [newlyExpiredInvestments, toast]);

  // Create investment
  const createInvestment = useMutation({
    mutationFn: async ({ packageId, amount }: { packageId: string; amount: number }) => {
      if (!user?.id) throw new Error("User not authenticated");

      // Get wallet to check balance
      const { data: wallet, error: walletError } = await supabase
        .from("wallets")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (walletError) throw new Error("Could not fetch wallet");
      if (!wallet || wallet.balance < amount) {
        throw new Error("Insufficient balance. Please deposit funds first.");
      }

      // Get package details
      const { data: pkg, error: pkgError } = await supabase
        .from("investment_packages")
        .select("*")
        .eq("id", packageId)
        .single();

      if (pkgError || !pkg) throw new Error("Package not found");

      // Calculate expected return and end date
      const expectedReturn = amount + (amount * pkg.roi / 100);
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + pkg.duration_days);

      // Create investment record
      const { data: investment, error: investError } = await supabase
        .from("user_investments")
        .insert({
          user_id: user.id,
          package_id: packageId,
          amount,
          expected_return: expectedReturn,
          current_profit: 0,
          start_date: new Date().toISOString(),
          end_date: endDate.toISOString(),
          status: "active",
        })
        .select()
        .single();

      if (investError) throw investError;

      // Deduct from wallet balance and update total_invested
      const { error: updateWalletError } = await supabase
        .from("wallets")
        .update({
          balance: wallet.balance - amount,
          total_invested: wallet.total_invested + amount,
        })
        .eq("user_id", user.id);

      if (updateWalletError) throw updateWalletError;

      // Create transaction record
      await supabase.from("transactions").insert({
        user_id: user.id,
        type: "investment",
        amount: -amount,
        description: `Investment in ${pkg.name}`,
        reference_id: investment.id,
        status: "completed",
      });

      return investment;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["user_investments"] });
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      toast({
        title: "Investment Successful!",
        description: `You have successfully invested $${variables.amount.toLocaleString()}`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Investment Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Calculate total invested and expected returns (only from active investments)
  const totalActiveInvested = activeInvestments.reduce((sum, inv) => sum + inv.amount, 0);
  const totalExpectedReturns = activeInvestments.reduce((sum, inv) => sum + inv.expected_return, 0);

  return {
    packages,
    userInvestments,
    activeInvestments,
    expiredInvestments,
    completedInvestments,
    totalActiveInvested,
    totalExpectedReturns,
    isLoading: packagesLoading || investmentsLoading,
    createInvestment,
    getDaysRemaining,
    getProgressPercentage,
  };
};
