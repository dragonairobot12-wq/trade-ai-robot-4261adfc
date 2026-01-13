-- ================================================
-- AI WEALTH INVESTMENT PLATFORM DATABASE SCHEMA
-- ================================================

-- 1. PROFILES TABLE (User profile data)
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- 2. WALLETS TABLE (User balance tracking)
CREATE TABLE public.wallets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  balance DECIMAL(18, 2) NOT NULL DEFAULT 0.00,
  total_invested DECIMAL(18, 2) NOT NULL DEFAULT 0.00,
  total_withdrawn DECIMAL(18, 2) NOT NULL DEFAULT 0.00,
  total_profit DECIMAL(18, 2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT balance_non_negative CHECK (balance >= 0)
);

-- Enable RLS on wallets
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;

-- Wallets policies
CREATE POLICY "Users can view their own wallet"
  ON public.wallets FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own wallet"
  ON public.wallets FOR UPDATE
  USING (auth.uid() = user_id);

-- 3. DEPOSITS TABLE (Crypto deposit records)
CREATE TABLE public.deposits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount DECIMAL(18, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USDT',
  network TEXT NOT NULL DEFAULT 'TRC20',
  wallet_address TEXT NOT NULL DEFAULT 'THNp5pr3xzN3HRhfi6PvwjfzPMkAVLaG1X',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  transaction_hash TEXT,
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on deposits
ALTER TABLE public.deposits ENABLE ROW LEVEL SECURITY;

-- Deposits policies
CREATE POLICY "Users can view their own deposits"
  ON public.deposits FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own deposits"
  ON public.deposits FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 4. WITHDRAWALS TABLE (Withdrawal records with 10% fee)
CREATE TABLE public.withdrawals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount_requested DECIMAL(18, 2) NOT NULL,
  fee_amount DECIMAL(18, 2) NOT NULL,
  amount_sent DECIMAL(18, 2) NOT NULL,
  wallet_address TEXT NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USDT',
  network TEXT NOT NULL DEFAULT 'TRC20',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on withdrawals
ALTER TABLE public.withdrawals ENABLE ROW LEVEL SECURITY;

-- Withdrawals policies
CREATE POLICY "Users can view their own withdrawals"
  ON public.withdrawals FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own withdrawals"
  ON public.withdrawals FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 5. INVESTMENT PACKAGES TABLE
CREATE TABLE public.investment_packages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price DECIMAL(18, 2) NOT NULL,
  roi DECIMAL(5, 2) NOT NULL,
  duration_days INTEGER NOT NULL,
  risk_level TEXT NOT NULL CHECK (risk_level IN ('Low', 'Medium', 'High')),
  description TEXT,
  ai_strategy TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on investment_packages (public read)
ALTER TABLE public.investment_packages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active packages"
  ON public.investment_packages FOR SELECT
  USING (is_active = true);

-- 6. USER INVESTMENTS TABLE (Active investments)
CREATE TABLE public.user_investments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  package_id UUID NOT NULL REFERENCES public.investment_packages(id),
  amount DECIMAL(18, 2) NOT NULL,
  expected_return DECIMAL(18, 2) NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  current_profit DECIMAL(18, 2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on user_investments
ALTER TABLE public.user_investments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own investments"
  ON public.user_investments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own investments"
  ON public.user_investments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 7. TRANSACTIONS TABLE (Transaction history)
CREATE TABLE public.transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('deposit', 'withdrawal', 'investment', 'profit', 'referral')),
  amount DECIMAL(18, 2) NOT NULL,
  description TEXT,
  reference_id UUID,
  status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on transactions
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own transactions"
  ON public.transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own transactions"
  ON public.transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ================================================
-- TRIGGERS & FUNCTIONS
-- ================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Apply updated_at triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_wallets_updated_at
  BEFORE UPDATE ON public.wallets
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_deposits_updated_at
  BEFORE UPDATE ON public.deposits
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_withdrawals_updated_at
  BEFORE UPDATE ON public.withdrawals
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_investments_updated_at
  BEFORE UPDATE ON public.user_investments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to create profile and wallet for new users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Create profile
  INSERT INTO public.profiles (id, email, full_name, phone)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data ->> 'full_name',
    NEW.raw_user_meta_data ->> 'phone'
  );
  
  -- Create wallet
  INSERT INTO public.wallets (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger to create profile and wallet on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ================================================
-- SEED DATA: Investment Packages
-- ================================================

INSERT INTO public.investment_packages (name, price, roi, duration_days, risk_level, description, ai_strategy) VALUES
  ('Starter Package', 100.00, 15.00, 30, 'Low', 'Perfect for beginners. Low risk with stable returns.', 'Conservative AI trading with diversified low-cap assets'),
  ('Bronze Package', 300.00, 22.00, 30, 'Low', 'Enhanced returns with proven strategies.', 'Balanced portfolio with blue-chip crypto focus'),
  ('Silver Package', 600.00, 35.00, 45, 'Medium', 'Accelerated growth for serious investors.', 'Dynamic rebalancing with trend-following algorithms'),
  ('Gold Package', 1000.00, 48.00, 45, 'Medium', 'Premium returns with smart risk management.', 'Multi-strategy AI with sentiment analysis'),
  ('Platinum Package', 1800.00, 65.00, 60, 'Medium', 'High-performance trading for maximized gains.', 'Advanced arbitrage and momentum trading'),
  ('Diamond Package', 2500.00, 85.00, 60, 'High', 'Elite returns for experienced investors.', 'Aggressive growth with leverage optimization'),
  ('Elite Package', 3500.00, 110.00, 90, 'High', 'Maximum potential with expert AI strategies.', 'Quantitative models with market-making strategies'),
  ('VIP Package', 5000.00, 150.00, 90, 'High', 'Exclusive tier with highest returns and priority support.', 'Full-spectrum AI trading with exclusive alpha signals');