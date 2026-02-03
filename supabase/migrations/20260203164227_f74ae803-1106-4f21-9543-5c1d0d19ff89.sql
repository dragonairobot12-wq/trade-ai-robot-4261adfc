-- =============================================
-- SECURITY HARDENING: Deny UPDATE/DELETE on financial tables
-- Users should NOT be able to modify or delete financial records
-- =============================================

-- 1. DEPOSITS: Deny UPDATE and DELETE (records are immutable)
CREATE POLICY "Users cannot update deposits"
ON public.deposits FOR UPDATE
USING (false);

CREATE POLICY "Users cannot delete deposits"
ON public.deposits FOR DELETE
USING (false);

-- 2. WITHDRAWALS: Deny UPDATE and DELETE (only admins should modify)
CREATE POLICY "Users cannot update withdrawals"
ON public.withdrawals FOR UPDATE
USING (false);

CREATE POLICY "Users cannot delete withdrawals"
ON public.withdrawals FOR DELETE
USING (false);

-- 3. TRANSACTIONS: Deny UPDATE and DELETE (audit trail is immutable)
CREATE POLICY "Users cannot update transactions"
ON public.transactions FOR UPDATE
USING (false);

CREATE POLICY "Users cannot delete transactions"
ON public.transactions FOR DELETE
USING (false);

-- 4. USER_INVESTMENTS: Deny UPDATE and DELETE (investment records are immutable)
CREATE POLICY "Users cannot update investments"
ON public.user_investments FOR UPDATE
USING (false);

CREATE POLICY "Users cannot delete investments"
ON public.user_investments FOR DELETE
USING (false);

-- 5. WALLETS: Deny INSERT and DELETE (wallet created by trigger, never deleted)
CREATE POLICY "Users cannot create wallets"
ON public.wallets FOR INSERT
WITH CHECK (false);

CREATE POLICY "Users cannot delete wallets"
ON public.wallets FOR DELETE
USING (false);

-- 6. PROFILES: Deny DELETE (users cannot delete their profile)
CREATE POLICY "Users cannot delete profiles"
ON public.profiles FOR DELETE
USING (false);

-- 7. INVESTMENT_PACKAGES: Deny INSERT, UPDATE, DELETE (admin-only via service role)
CREATE POLICY "No one can insert packages via client"
ON public.investment_packages FOR INSERT
WITH CHECK (false);

CREATE POLICY "No one can update packages via client"
ON public.investment_packages FOR UPDATE
USING (false);

CREATE POLICY "No one can delete packages via client"
ON public.investment_packages FOR DELETE
USING (false);