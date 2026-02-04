-- ============================================================================
-- DRAGON AI TRADING PLATFORM - COMPLETE DATABASE SCHEMA
-- ============================================================================
-- This file contains the complete database structure for the Dragon AI Trading
-- platform. Use this to recreate the database in a new Supabase project.
-- 
-- Last Updated: 2026-02-04
-- ============================================================================

-- ============================================================================
-- SECTION 1: ENUMS
-- ============================================================================

-- App Role Enum for role-based access control
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');


-- ============================================================================
-- SECTION 2: TABLES
-- ============================================================================

-- ----------------------------------------------------------------------------
-- PROFILES TABLE
-- Stores additional user information beyond auth.users
-- ----------------------------------------------------------------------------
CREATE TABLE public.profiles (
    id uuid NOT NULL PRIMARY KEY,
    email text NOT NULL,
    full_name text,
    phone text,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- USER ROLES TABLE
-- Stores user roles for RBAC (Role-Based Access Control)
-- CRITICAL: Roles must be stored separately to prevent privilege escalation
-- ----------------------------------------------------------------------------
CREATE TABLE public.user_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- ----------------------------------------------------------------------------
-- WALLETS TABLE
-- Stores user wallet information with dual-balance system
-- - deposit_balance: Locked capital used for trading (cannot be withdrawn)
-- - profit_balance: Earnings from AI robots (can be withdrawn)
-- ----------------------------------------------------------------------------
CREATE TABLE public.wallets (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL,
    balance numeric NOT NULL DEFAULT 0.00,
    deposit_balance numeric NOT NULL DEFAULT 0.00,
    profit_balance numeric NOT NULL DEFAULT 0.00,
    total_invested numeric NOT NULL DEFAULT 0.00,
    total_profit numeric NOT NULL DEFAULT 0.00,
    total_withdrawn numeric NOT NULL DEFAULT 0.00,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- INVESTMENT PACKAGES TABLE
-- Stores available AI robot investment packages
-- ----------------------------------------------------------------------------
CREATE TABLE public.investment_packages (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    description text,
    price numeric NOT NULL,
    roi numeric NOT NULL,
    duration_days integer NOT NULL,
    risk_level text NOT NULL,
    ai_strategy text,
    is_active boolean NOT NULL DEFAULT true,
    created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- USER INVESTMENTS TABLE
-- Tracks user investments in AI robot packages
-- ----------------------------------------------------------------------------
CREATE TABLE public.user_investments (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL,
    package_id uuid NOT NULL REFERENCES public.investment_packages(id),
    amount numeric NOT NULL,
    expected_return numeric NOT NULL,
    current_profit numeric NOT NULL DEFAULT 0.00,
    start_date timestamp with time zone NOT NULL DEFAULT now(),
    end_date timestamp with time zone NOT NULL,
    status text NOT NULL DEFAULT 'active'::text,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- DEPOSITS TABLE
-- Tracks USDT deposit requests (pending, approved, rejected)
-- ----------------------------------------------------------------------------
CREATE TABLE public.deposits (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL,
    amount numeric NOT NULL,
    currency text NOT NULL DEFAULT 'USDT'::text,
    network text NOT NULL DEFAULT 'TRC20'::text,
    wallet_address text NOT NULL DEFAULT 'THNp5pr3xzN3HRhfi6PvwjfzPMkAVLaG1X'::text,
    transaction_hash text,
    screenshot_url text,
    status text NOT NULL DEFAULT 'pending'::text,
    admin_notes text,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- WITHDRAWALS TABLE
-- Tracks withdrawal requests with 10% fee structure
-- ----------------------------------------------------------------------------
CREATE TABLE public.withdrawals (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL,
    amount_requested numeric NOT NULL,
    fee_amount numeric NOT NULL,
    amount_sent numeric NOT NULL,
    currency text NOT NULL DEFAULT 'USDT'::text,
    network text NOT NULL DEFAULT 'TRC20'::text,
    wallet_address text NOT NULL,
    status text NOT NULL DEFAULT 'pending'::text,
    admin_notes text,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- TRANSACTIONS TABLE
-- General transaction history for audit trail
-- ----------------------------------------------------------------------------
CREATE TABLE public.transactions (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL,
    type text NOT NULL,
    amount numeric NOT NULL,
    status text NOT NULL DEFAULT 'completed'::text,
    description text,
    reference_id uuid,
    created_at timestamp with time zone NOT NULL DEFAULT now()
);


-- ============================================================================
-- SECTION 3: DATABASE FUNCTIONS
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Function: update_updated_at_column
-- Automatically updates the updated_at timestamp on row update
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

-- ----------------------------------------------------------------------------
-- Function: handle_new_user
-- Creates profile and wallet automatically when a new user signs up
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
$$;

-- ----------------------------------------------------------------------------
-- Function: has_role (Security Definer)
-- Checks if a user has a specific role without triggering RLS recursion
-- CRITICAL: Must be SECURITY DEFINER to bypass RLS
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.user_roles
        WHERE user_id = _user_id
          AND role = _role
    )
$$;


-- ============================================================================
-- SECTION 4: TRIGGERS
-- ============================================================================

-- Trigger: Auto-create profile and wallet on user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Trigger: Auto-update updated_at on profiles
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger: Auto-update updated_at on wallets
CREATE TRIGGER update_wallets_updated_at
    BEFORE UPDATE ON public.wallets
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger: Auto-update updated_at on deposits
CREATE TRIGGER update_deposits_updated_at
    BEFORE UPDATE ON public.deposits
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger: Auto-update updated_at on withdrawals
CREATE TRIGGER update_withdrawals_updated_at
    BEFORE UPDATE ON public.withdrawals
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger: Auto-update updated_at on user_investments
CREATE TRIGGER update_user_investments_updated_at
    BEFORE UPDATE ON public.user_investments
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();


-- ============================================================================
-- SECTION 5: ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investment_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deposits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.withdrawals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- PROFILES RLS POLICIES
-- ----------------------------------------------------------------------------
CREATE POLICY "Users can view their own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Users cannot delete profiles"
    ON public.profiles FOR DELETE
    USING (false);

-- ----------------------------------------------------------------------------
-- USER ROLES RLS POLICIES
-- ----------------------------------------------------------------------------
CREATE POLICY "Users can view their own roles"
    ON public.user_roles FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Only admins can manage roles"
    ON public.user_roles FOR ALL
    USING (public.has_role(auth.uid(), 'admin'));

-- ----------------------------------------------------------------------------
-- WALLETS RLS POLICIES
-- ----------------------------------------------------------------------------
CREATE POLICY "Users can view their own wallet"
    ON public.wallets FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own wallet"
    ON public.wallets FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users cannot create wallets"
    ON public.wallets FOR INSERT
    WITH CHECK (false);

CREATE POLICY "Users cannot delete wallets"
    ON public.wallets FOR DELETE
    USING (false);

-- ----------------------------------------------------------------------------
-- INVESTMENT PACKAGES RLS POLICIES
-- ----------------------------------------------------------------------------
CREATE POLICY "Anyone can view active packages"
    ON public.investment_packages FOR SELECT
    USING (is_active = true);

CREATE POLICY "No one can insert packages via client"
    ON public.investment_packages FOR INSERT
    WITH CHECK (false);

CREATE POLICY "No one can update packages via client"
    ON public.investment_packages FOR UPDATE
    USING (false);

CREATE POLICY "No one can delete packages via client"
    ON public.investment_packages FOR DELETE
    USING (false);

-- ----------------------------------------------------------------------------
-- USER INVESTMENTS RLS POLICIES
-- ----------------------------------------------------------------------------
CREATE POLICY "Users can view their own investments"
    ON public.user_investments FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own investments"
    ON public.user_investments FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users cannot update investments"
    ON public.user_investments FOR UPDATE
    USING (false);

CREATE POLICY "Users cannot delete investments"
    ON public.user_investments FOR DELETE
    USING (false);

-- ----------------------------------------------------------------------------
-- DEPOSITS RLS POLICIES
-- ----------------------------------------------------------------------------
CREATE POLICY "Users can view their own deposits"
    ON public.deposits FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own deposits"
    ON public.deposits FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users cannot update deposits"
    ON public.deposits FOR UPDATE
    USING (false);

CREATE POLICY "Users cannot delete deposits"
    ON public.deposits FOR DELETE
    USING (false);

-- ----------------------------------------------------------------------------
-- WITHDRAWALS RLS POLICIES
-- ----------------------------------------------------------------------------
CREATE POLICY "Users can view their own withdrawals"
    ON public.withdrawals FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own withdrawals"
    ON public.withdrawals FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users cannot update withdrawals"
    ON public.withdrawals FOR UPDATE
    USING (false);

CREATE POLICY "Users cannot delete withdrawals"
    ON public.withdrawals FOR DELETE
    USING (false);

-- ----------------------------------------------------------------------------
-- TRANSACTIONS RLS POLICIES
-- ----------------------------------------------------------------------------
CREATE POLICY "Users can view their own transactions"
    ON public.transactions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own transactions"
    ON public.transactions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users cannot update transactions"
    ON public.transactions FOR UPDATE
    USING (false);

CREATE POLICY "Users cannot delete transactions"
    ON public.transactions FOR DELETE
    USING (false);


-- ============================================================================
-- SECTION 6: STORAGE BUCKETS
-- ============================================================================

-- Create storage bucket for deposit proof screenshots
INSERT INTO storage.buckets (id, name, public)
VALUES ('deposit-proofs', 'deposit-proofs', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for deposit-proofs bucket
CREATE POLICY "Users can upload their own deposit proofs"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'deposit-proofs' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can view their own deposit proofs"
    ON storage.objects FOR SELECT
    USING (
        bucket_id = 'deposit-proofs' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );


-- ============================================================================
-- SECTION 7: SEED DATA (Optional)
-- ============================================================================

-- Insert default investment packages (AI Robots)
INSERT INTO public.investment_packages (name, description, price, roi, duration_days, risk_level, ai_strategy)
VALUES
    ('Dragon P1', 'Entry-level AI trading robot for beginners', 100, 5.0, 30, 'Low', 'Conservative DCA Strategy'),
    ('Dragon P2', 'Intermediate AI robot with balanced returns', 500, 7.5, 60, 'Medium', 'Balanced Momentum Trading'),
    ('Dragon P3', 'Advanced AI robot for experienced traders', 1000, 10.0, 90, 'Medium-High', 'Aggressive Swing Trading'),
    ('Dragon P4', 'Premium AI robot with high ROI potential', 2500, 12.5, 120, 'High', 'Multi-Strategy Arbitrage'),
    ('Dragon P5', 'Elite AI robot for maximum returns', 5000, 15.0, 180, 'Very High', 'AI-Powered Sentiment Analysis')
ON CONFLICT DO NOTHING;


-- ============================================================================
-- SECTION 8: ADMIN SETUP
-- ============================================================================

-- To add an admin user, run this AFTER the user has signed up:
-- 
-- INSERT INTO public.user_roles (user_id, role)
-- SELECT id, 'admin'::app_role
-- FROM auth.users
-- WHERE email = 'your-admin-email@example.com'
-- ON CONFLICT (user_id, role) DO NOTHING;
--
-- Current Admin: putvkamal@gmail.com


-- ============================================================================
-- END OF SCHEMA
-- ============================================================================
