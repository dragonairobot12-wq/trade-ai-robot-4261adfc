-- First, drop the existing check constraint
ALTER TABLE investment_packages DROP CONSTRAINT IF EXISTS investment_packages_risk_level_check;

-- Add new constraint with Medium-High option
ALTER TABLE investment_packages ADD CONSTRAINT investment_packages_risk_level_check 
CHECK (risk_level IN ('Low', 'Medium', 'Medium-High', 'High'));

-- Deactivate all existing packages
UPDATE investment_packages SET is_active = false;

-- Insert the 10 Dragon AI Investment Tiers
INSERT INTO investment_packages (name, price, roi, duration_days, risk_level, ai_strategy, description, is_active)
VALUES 
  ('Emerald Egg', 100.00, 12.00, 60, 'Low', 'Entry-level Dragon AI trading with conservative risk management and steady growth patterns.', 'Starter tier with 25-day activation period. Low risk, steady returns.', true),
  ('Sapphire Egg', 150.00, 14.00, 60, 'Low', 'Enhanced Dragon algorithms with improved market analysis and optimized entry points.', 'Enhanced tier with smart entry detection and auto-compound options.', true),
  ('Bronze Egg', 200.00, 16.00, 60, 'Low', 'Balanced Dragon AI with multi-market scanning and dynamic position sizing.', 'Balanced tier with multi-market analysis and risk optimization.', true),
  ('Silver Drake Node', 300.00, 18.00, 60, 'Medium', 'Young Drake AI unlocked for intermediate traders with enhanced pattern recognition.', 'Intermediate tier with advanced AI algorithms and portfolio insights.', true),
  ('Golden Fire Protocol', 500.00, 20.00, 60, 'Medium', 'Gold Drake engine with aggressive growth strategies and smart hedging mechanisms.', 'Premium tier with real-time analytics and personal advisor.', true),
  ('Platinum Flame', 1000.00, 22.00, 90, 'Medium', 'Platinum-tier Dragon AI with institutional-grade analysis and maximized efficiency.', 'Advanced tier with institutional AI and custom strategies.', true),
  ('Ruby Dragon Core', 2000.00, 25.00, 90, 'Medium-High', 'Ancient Ruby Dragon awakened for high-yield trading with advanced risk controls.', 'Elite tier with personal manager and bonus rewards.', true),
  ('Obsidian Shadow', 3000.00, 28.00, 90, 'Medium-High', 'Obsidian Dragon protocol with dark pool access and stealth trading capabilities.', 'Professional tier with exclusive insights and priority withdrawals.', true),
  ('Diamond Wyrm', 4000.00, 32.00, 90, 'High', 'Diamond Dragon engine with maximum AI power and multi-asset optimization.', 'Expert tier with 1-on-1 consultations and VIP events.', true),
  ('Elder Dragon Master', 5000.00, 35.00, 90, 'High', 'The legendary Elder Dragon - ultimate AI power with exclusive access to premium markets.', 'Ultimate tier with legendary AI and exclusive VIP perks.', true);