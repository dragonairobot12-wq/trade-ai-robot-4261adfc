import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export interface WalletAddressData {
  id: string;
  user_id: string;
  label: string;
  address: string;
  network: "TRC20" | "BEP20";
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export const useWalletAddresses = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch user's saved wallet addresses
  const { data: walletAddresses = [], isLoading } = useQuery({
    queryKey: ["wallet_addresses", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from("user_wallet_addresses")
        .select("*")
        .eq("user_id", user.id)
        .order("is_default", { ascending: false })
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as WalletAddressData[];
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  // Save a new wallet address
  const saveWalletAddress = useMutation({
    mutationFn: async ({
      address,
      network,
      label = "My Wallet",
      isDefault = false,
    }: {
      address: string;
      network: "TRC20" | "BEP20";
      label?: string;
      isDefault?: boolean;
    }) => {
      if (!user?.id) throw new Error("User not authenticated");

      // Validate address format
      if (network === "TRC20" && !address.startsWith("T")) {
        throw new Error("Invalid TRC20 address. Must start with 'T'");
      }
      if (network === "BEP20" && !address.startsWith("0x")) {
        throw new Error("Invalid BEP20 address. Must start with '0x'");
      }
      if (address.length < 30) {
        throw new Error("Invalid wallet address length");
      }

      // If setting as default, unset other defaults for this network
      if (isDefault) {
        await supabase
          .from("user_wallet_addresses")
          .update({ is_default: false })
          .eq("user_id", user.id)
          .eq("network", network);
      }

      // Check if address already exists for this user and network
      const { data: existing } = await supabase
        .from("user_wallet_addresses")
        .select("id")
        .eq("user_id", user.id)
        .eq("address", address)
        .eq("network", network)
        .maybeSingle();

      if (existing) {
        // Update existing
        const { data, error } = await supabase
          .from("user_wallet_addresses")
          .update({ label, is_default: isDefault })
          .eq("id", existing.id)
          .select()
          .single();

        if (error) throw error;
        return data;
      }

      // Insert new
      const { data, error } = await supabase
        .from("user_wallet_addresses")
        .insert({
          user_id: user.id,
          address,
          network,
          label,
          is_default: isDefault,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["wallet_addresses"] });
      toast({
        title: "Wallet Saved",
        description: `Your ${variables.network} wallet address has been saved successfully.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Save Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update an existing wallet address
  const updateWalletAddress = useMutation({
    mutationFn: async ({
      id,
      address,
      label,
      isDefault,
    }: {
      id: string;
      address?: string;
      label?: string;
      isDefault?: boolean;
    }) => {
      if (!user?.id) throw new Error("User not authenticated");

      const updates: Record<string, unknown> = {};
      if (address !== undefined) updates.address = address;
      if (label !== undefined) updates.label = label;
      if (isDefault !== undefined) {
        updates.is_default = isDefault;
        
        // If setting as default, get the network first
        if (isDefault) {
          const { data: current } = await supabase
            .from("user_wallet_addresses")
            .select("network")
            .eq("id", id)
            .single();
          
          if (current) {
            await supabase
              .from("user_wallet_addresses")
              .update({ is_default: false })
              .eq("user_id", user.id)
              .eq("network", current.network)
              .neq("id", id);
          }
        }
      }

      const { data, error } = await supabase
        .from("user_wallet_addresses")
        .update(updates)
        .eq("id", id)
        .eq("user_id", user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallet_addresses"] });
      toast({
        title: "Wallet Updated",
        description: "Your wallet address has been updated.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete a wallet address
  const deleteWalletAddress = useMutation({
    mutationFn: async (id: string) => {
      if (!user?.id) throw new Error("User not authenticated");

      const { error } = await supabase
        .from("user_wallet_addresses")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallet_addresses"] });
      toast({
        title: "Wallet Removed",
        description: "The wallet address has been removed.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Delete Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Get default wallet for a network
  const getDefaultWallet = (network: "TRC20" | "BEP20") => {
    return walletAddresses.find((w) => w.network === network && w.is_default);
  };

  // Get all wallets for a network
  const getWalletsByNetwork = (network: "TRC20" | "BEP20") => {
    return walletAddresses.filter((w) => w.network === network);
  };

  return {
    walletAddresses,
    isLoading,
    saveWalletAddress,
    updateWalletAddress,
    deleteWalletAddress,
    getDefaultWallet,
    getWalletsByNetwork,
  };
};
