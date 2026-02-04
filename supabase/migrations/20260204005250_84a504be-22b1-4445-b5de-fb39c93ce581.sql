-- Add deposit_balance and profit_balance columns to wallets table
ALTER TABLE public.wallets 
ADD COLUMN IF NOT EXISTS deposit_balance numeric NOT NULL DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS profit_balance numeric NOT NULL DEFAULT 0.00;

-- Update existing wallets to set initial values
-- deposit_balance = total_invested (locked capital)
-- profit_balance = total_profit (withdrawable)
UPDATE public.wallets 
SET deposit_balance = total_invested,
    profit_balance = total_profit
WHERE deposit_balance = 0 AND profit_balance = 0;