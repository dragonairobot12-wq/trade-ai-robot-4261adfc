import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface TransactionData {
  id: string;
  user_id: string;
  type: "deposit" | "withdrawal" | "investment" | "profit" | "referral";
  amount: number;
  description: string | null;
  reference_id: string | null;
  status: "pending" | "completed" | "failed";
  created_at: string;
}

export const useTransactions = (limit?: number) => {
  const { user } = useAuth();

  // Fetch transactions with 5-minute cache
  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ["transactions", user?.id, limit],
    queryFn: async () => {
      if (!user?.id) return [];
      
      let query = supabase
        .from("transactions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as TransactionData[];
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  return {
    transactions,
    isLoading,
  };
};
