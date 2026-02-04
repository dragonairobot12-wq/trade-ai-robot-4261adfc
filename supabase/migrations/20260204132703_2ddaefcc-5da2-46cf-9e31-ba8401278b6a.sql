-- Create table for user wallet addresses
CREATE TABLE public.user_wallet_addresses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  label TEXT NOT NULL DEFAULT 'My Wallet',
  address TEXT NOT NULL,
  network TEXT NOT NULL DEFAULT 'TRC20',
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for faster user lookups
CREATE INDEX idx_user_wallet_addresses_user_id ON public.user_wallet_addresses(user_id);

-- Create unique constraint for address per user per network
CREATE UNIQUE INDEX idx_user_wallet_unique ON public.user_wallet_addresses(user_id, address, network);

-- Enable Row Level Security
ALTER TABLE public.user_wallet_addresses ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own wallet addresses"
ON public.user_wallet_addresses
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own wallet addresses"
ON public.user_wallet_addresses
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own wallet addresses"
ON public.user_wallet_addresses
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own wallet addresses"
ON public.user_wallet_addresses
FOR DELETE
USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_user_wallet_addresses_updated_at
BEFORE UPDATE ON public.user_wallet_addresses
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();