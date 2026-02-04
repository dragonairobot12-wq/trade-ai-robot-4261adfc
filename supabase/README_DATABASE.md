# Dragon AI Trading Platform - Database Setup Guide

This document explains how to set up the database when migrating to Cursor or a new Supabase project.

## 📁 File Structure

```
supabase/
├── config.toml              # Supabase configuration
├── schema/
│   └── full_schema.sql      # Complete database schema
├── functions/
│   └── admin-operations/    # Admin edge function
│       └── index.ts
├── migrations/              # Auto-generated migrations (do not edit)
└── README_DATABASE.md       # This file
```

## 🚀 Quick Setup (New Supabase Project)

### Step 1: Create a New Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note your:
   - Project URL (`https://your-project.supabase.co`)
   - Anon Key (public)
   - Service Role Key (private, for admin operations)

### Step 2: Run the Schema SQL

1. Open the Supabase Dashboard
2. Go to **SQL Editor**
3. Copy the entire contents of `supabase/schema/full_schema.sql`
4. Paste and run the SQL

**Important:** Run the SQL in sections if you encounter errors:
1. First, run Section 1 (Enums)
2. Then Section 2 (Tables)
3. Then Sections 3-4 (Functions & Triggers)
4. Then Section 5 (RLS Policies)
5. Finally, Sections 6-7 (Storage & Seed Data)

### Step 3: Configure Environment Variables

Create a `.env` file in your project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
VITE_SUPABASE_PROJECT_ID=your-project-id
```

### Step 4: Deploy Edge Functions

Using Supabase CLI:

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref your-project-id

# Deploy edge functions
supabase functions deploy admin-operations
```

### Step 5: Set Up Admin User

After your admin user has signed up, run this SQL:

```sql
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role
FROM auth.users
WHERE email = 'your-admin-email@example.com'
ON CONFLICT (user_id, role) DO NOTHING;
```

## 📊 Database Schema Overview

### Tables

| Table | Purpose |
|-------|---------|
| `profiles` | User profile information (name, email, phone) |
| `user_roles` | Role-based access control (admin, moderator, user) |
| `wallets` | User balances (deposit_balance, profit_balance) |
| `investment_packages` | Available AI robot packages |
| `user_investments` | User's active investments |
| `deposits` | USDT deposit requests |
| `withdrawals` | Withdrawal requests |
| `transactions` | Transaction history for audit |

### Key Relationships

```
auth.users (Supabase Auth)
    ├── profiles (1:1)
    ├── user_roles (1:many)
    ├── wallets (1:1)
    ├── user_investments (1:many)
    │       └── investment_packages (many:1)
    ├── deposits (1:many)
    ├── withdrawals (1:many)
    └── transactions (1:many)
```

### Dual-Balance System

The wallet has two separate balances:

1. **`deposit_balance`** (Locked Capital)
   - Funded when admin approves deposits
   - Used to purchase AI robots
   - **Cannot be withdrawn**

2. **`profit_balance`** (Withdrawable Earnings)
   - Funded by daily ROI from active investments
   - **Can be withdrawn** (10% fee applies)

## 🔒 Security Features

### Row Level Security (RLS)

All tables have RLS enabled with the following patterns:

- **Users can only view/edit their own data**
- **Financial records are immutable** (no UPDATE/DELETE)
- **Admins use service role** for management

### Admin Access Control

Admin verification uses a security definer function to prevent RLS recursion:

```sql
public.has_role(user_id, 'admin') -- Returns boolean
```

**Never** store admin status in localStorage or the profiles table!

## 📝 Column Reference

### profiles
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | Primary key (same as auth.users.id) |
| email | text | User's email |
| full_name | text | Display name |
| phone | text | Optional phone number |

### wallets
| Column | Type | Notes |
|--------|------|-------|
| user_id | uuid | References auth.users |
| balance | numeric | Total balance (deposit + profit) |
| deposit_balance | numeric | Locked trading capital |
| profit_balance | numeric | Withdrawable earnings |
| total_invested | numeric | Lifetime invested amount |
| total_profit | numeric | Lifetime profit earned |
| total_withdrawn | numeric | Lifetime withdrawals |

### deposits
| Column | Type | Notes |
|--------|------|-------|
| user_id | uuid | Who made the deposit |
| amount | numeric | Deposit amount |
| currency | text | Default: 'USDT' |
| network | text | 'TRC20' or 'BEP20' |
| transaction_hash | text | Blockchain TX hash |
| screenshot_url | text | Proof screenshot |
| status | text | 'pending', 'approved', 'rejected' |

### withdrawals
| Column | Type | Notes |
|--------|------|-------|
| user_id | uuid | Who requested withdrawal |
| amount_requested | numeric | Original request amount |
| fee_amount | numeric | 10% fee |
| amount_sent | numeric | After fee deduction |
| wallet_address | text | Destination address |
| status | text | 'pending', 'approved', 'rejected' |

## 🔧 Troubleshooting

### "new row violates row-level security policy"

This usually means:
1. The user is not authenticated
2. The `user_id` column doesn't match `auth.uid()`

### "infinite recursion detected in policy"

The `has_role()` function must be `SECURITY DEFINER` to bypass RLS when checking roles.

### Edge function returns 403

Verify the user has the 'admin' role in `user_roles` table.

## 📚 Related Documentation

- [Supabase Docs](https://supabase.com/docs)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Edge Functions](https://supabase.com/docs/guides/functions)

---

**Last Updated:** February 2026
