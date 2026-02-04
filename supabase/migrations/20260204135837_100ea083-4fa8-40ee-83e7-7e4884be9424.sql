-- Enable realtime for wallets table
ALTER PUBLICATION supabase_realtime ADD TABLE public.wallets;

-- Enable realtime for deposits table
ALTER PUBLICATION supabase_realtime ADD TABLE public.deposits;

-- Enable realtime for withdrawals table
ALTER PUBLICATION supabase_realtime ADD TABLE public.withdrawals;