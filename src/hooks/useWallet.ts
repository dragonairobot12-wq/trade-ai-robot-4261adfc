import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const WITHDRAWAL_FEE_PERCENTAGE = 0.10; // 10% fee
const MINIMUM_WITHDRAWAL_AMOUNT = 50; // $50 minimum

export interface WalletData {
  id: string;
  user_id: string;
  balance: number;
  total_invested: number;
  total_withdrawn: number;
  total_profit: number;
  created_at: string;
  updated_at: string;
}

export interface DepositData {
  id: string;
  user_id: string;
  amount: number;
  currency: string;
  network: string;
  wallet_address: string;
  status: string;
  transaction_hash: string | null;
  created_at: string;
}

export interface WithdrawalData {
  id: string;
  user_id: string;
  amount_requested: number;
  fee_amount: number;
  amount_sent: number;
  wallet_address: string;
  currency: string;
  network: string;
  status: string;
  created_at: string;
}

export const useWallet = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch wallet data with 5-minute cache
  const { data: wallet, isLoading: walletLoading } = useQuery({
    queryKey: ["wallet", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from("wallets")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error) throw error;
      return data as WalletData;
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });

  // Fetch deposits with 5-minute cache
  const { data: deposits = [], isLoading: depositsLoading } = useQuery({
    queryKey: ["deposits", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from("deposits")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as DepositData[];
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  // Fetch withdrawals with 5-minute cache
  const { data: withdrawals = [], isLoading: withdrawalsLoading } = useQuery({
    queryKey: ["withdrawals", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from("withdrawals")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as WithdrawalData[];
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  // Create deposit request
  const createDeposit = useMutation({
    mutationFn: async ({ amount, transactionHash }: { amount: number; transactionHash?: string }) => {
      if (!user?.id) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("deposits")
        .insert({
          user_id: user.id,
          amount,
          currency: "USDT",
          network: "TRC20",
          wallet_address: "THNp5pr3xzN3HRhfi6PvwjfzPMkAVLaG1X",
          status: "pending",
          transaction_hash: transactionHash || null,
        })
        .select()
        .single();

      if (error) throw error;

      // Create transaction record
      await supabase.from("transactions").insert({
        user_id: user.id,
        type: "deposit",
        amount,
        description: `USDT deposit via TRC20`,
        reference_id: data.id,
        status: "pending",
      });

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deposits"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      toast({
        title: "Deposit Submitted",
        description: "Your deposit request is being processed. Please wait for admin approval.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Deposit Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Create withdrawal request
  const createWithdrawal = useMutation({
    mutationFn: async ({ amount, walletAddress }: { amount: number; walletAddress: string }) => {
      if (!user?.id) throw new Error("User not authenticated");
      if (!wallet) throw new Error("Wallet not found");
      if (amount < MINIMUM_WITHDRAWAL_AMOUNT) throw new Error(`Minimum withdrawal amount is $${MINIMUM_WITHDRAWAL_AMOUNT}`);
      if (wallet.balance < amount) throw new Error("Insufficient balance");

      const feeAmount = amount * WITHDRAWAL_FEE_PERCENTAGE;
      const amountSent = amount - feeAmount;

      const { data, error } = await supabase
        .from("withdrawals")
        .insert({
          user_id: user.id,
          amount_requested: amount,
          fee_amount: feeAmount,
          amount_sent: amountSent,
          wallet_address: walletAddress,
          currency: "USDT",
          network: "TRC20",
          status: "pending",
        })
        .select()
        .single();

      if (error) throw error;

      // Create transaction record
      await supabase.from("transactions").insert({
        user_id: user.id,
        type: "withdrawal",
        amount: -amount,
        description: `USDT withdrawal to ${walletAddress.slice(0, 8)}...`,
        reference_id: data.id,
        status: "pending",
      });

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["withdrawals"] });
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      toast({
        title: "Withdrawal Submitted",
        description: "Your withdrawal request is being processed.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Withdrawal Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Calculate withdrawal fee
  const calculateWithdrawalFee = (amount: number) => {
    const fee = amount * WITHDRAWAL_FEE_PERCENTAGE;
    return {
      requested: amount,
      fee,
      received: amount - fee,
    };
  };

  // Get pending deposits/withdrawals
  const pendingDeposits = deposits.filter((d) => d.status === "pending");
  const pendingWithdrawals = withdrawals.filter((w) => w.status === "pending");

  return {
    wallet,
    deposits,
    withdrawals,
    pendingDeposits,
    pendingWithdrawals,
    isLoading: walletLoading || depositsLoading || withdrawalsLoading,
    createDeposit,
    createWithdrawal,
    calculateWithdrawalFee,
    WITHDRAWAL_FEE_PERCENTAGE,
    MINIMUM_WITHDRAWAL_AMOUNT,
  };
};
