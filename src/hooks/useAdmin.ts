import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AdminStats {
  totalUsers: number;
  totalDeposits: number;
  pendingWithdrawals: number;
}

interface UserWithWallet {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  created_at: string;
  wallet: {
    user_id: string;
    balance: number;
    deposit_balance: number;
    profit_balance: number;
    total_invested: number;
    total_withdrawn: number;
  } | null;
}

interface PendingDeposit {
  id: string;
  user_id: string;
  amount: number;
  currency: string;
  network: string;
  transaction_hash: string | null;
  screenshot_url: string | null;
  status: string;
  created_at: string;
  user: {
    id: string;
    email: string;
    full_name: string | null;
  } | null;
}

interface PendingWithdrawal {
  id: string;
  user_id: string;
  amount_requested: number;
  fee_amount: number;
  amount_sent: number;
  currency: string;
  network: string;
  wallet_address: string;
  status: string;
  created_at: string;
  user: {
    id: string;
    email: string;
    full_name: string | null;
  } | null;
}

async function callAdminFunction(action: string, params: Record<string, unknown> = {}) {
  const { data, error } = await supabase.functions.invoke('admin-operations', {
    body: { action, ...params }
  });
  
  if (error) throw error;
  if (data?.error) throw new Error(data.error);
  return data;
}

export function useAdminCheck() {
  return useQuery({
    queryKey: ['admin-check'],
    queryFn: async () => {
      const data = await callAdminFunction('check-admin');
      return data.isAdmin as boolean;
    },
    retry: false,
    staleTime: 60 * 1000, // 1 minute
  });
}

export function useAdminStats() {
  return useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const data = await callAdminFunction('get-stats');
      return data as AdminStats;
    },
    staleTime: 30 * 1000, // 30 seconds
  });
}

export function useAdminUsers() {
  return useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const data = await callAdminFunction('get-users');
      return data.users as UserWithWallet[];
    },
  });
}

export function useUpdateUserBalance() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ userId, depositBalance, profitBalance }: { 
      userId: string; 
      depositBalance: number; 
      profitBalance: number;
    }) => {
      return callAdminFunction('update-user-balance', { userId, depositBalance, profitBalance });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast({
        title: "Balance Updated",
        description: "User balance has been updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function usePendingDeposits() {
  return useQuery({
    queryKey: ['admin-pending-deposits'],
    queryFn: async () => {
      const data = await callAdminFunction('get-pending-deposits');
      return data.deposits as PendingDeposit[];
    },
  });
}

export function useApproveDeposit() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (depositId: string) => {
      return callAdminFunction('approve-deposit', { depositId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-pending-deposits'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast({
        title: "Deposit Approved",
        description: "The deposit has been approved and added to user's balance.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useRejectDeposit() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ depositId, reason }: { depositId: string; reason: string }) => {
      return callAdminFunction('reject-deposit', { depositId, reason });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-pending-deposits'] });
      toast({
        title: "Deposit Rejected",
        description: "The deposit has been rejected.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function usePendingWithdrawals() {
  return useQuery({
    queryKey: ['admin-pending-withdrawals'],
    queryFn: async () => {
      const data = await callAdminFunction('get-pending-withdrawals');
      return data.withdrawals as PendingWithdrawal[];
    },
  });
}

export function useApproveWithdrawal() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (withdrawalId: string) => {
      return callAdminFunction('approve-withdrawal', { withdrawalId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-pending-withdrawals'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast({
        title: "Withdrawal Approved",
        description: "The withdrawal has been approved and processed.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useRejectWithdrawal() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ withdrawalId, reason }: { withdrawalId: string; reason: string }) => {
      return callAdminFunction('reject-withdrawal', { withdrawalId, reason });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-pending-withdrawals'] });
      toast({
        title: "Withdrawal Rejected",
        description: "The withdrawal has been rejected.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useDistributeDailyProfit() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (percentage: number) => {
      return callAdminFunction('distribute-daily-profit', { percentage });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      toast({
        title: "Daily Profit Distributed",
        description: `${data.usersUpdated} users received profit. Total: $${data.totalDistributed?.toFixed(2)}`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
