import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

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

  // Get active investments
  const activeInvestments = userInvestments.filter((inv) => inv.status === "active");
  const completedInvestments = userInvestments.filter((inv) => inv.status === "completed");

  // Calculate total invested and expected returns
  const totalActiveInvested = activeInvestments.reduce((sum, inv) => sum + inv.amount, 0);
  const totalExpectedReturns = activeInvestments.reduce((sum, inv) => sum + inv.expected_return, 0);

  return {
    packages,
    userInvestments,
    activeInvestments,
    completedInvestments,
    totalActiveInvested,
    totalExpectedReturns,
    isLoading: packagesLoading || investmentsLoading,
    createInvestment,
  };
};
