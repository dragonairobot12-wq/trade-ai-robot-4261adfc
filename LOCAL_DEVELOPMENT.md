# Dragon AI - Local Development Guide

This guide helps you set up the project for local development using Cursor, VS Code, or any IDE with Vite.

## Prerequisites

- Node.js 18+ or Bun runtime
- Git
- A Supabase project (or use the existing one)

## Quick Start

### 1. Clone and Install

```bash
# Clone the repository
git clone <your-repo-url>
cd dragon-ai

# Install dependencies (choose one)
npm install
# or
bun install
```

### 2. Environment Setup

```bash
# Copy the environment template
cp .env.example .env

# Edit .env with your Supabase credentials
# VITE_SUPABASE_URL=https://your-project.supabase.co
# VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
# VITE_SUPABASE_PROJECT_ID=your-project-id
```

### 3. Start Development Server

```bash
# Start the Vite dev server
npm run dev
# or
bun run dev
```

The app will be available at `http://localhost:8080`

## Project Structure

```
dragon-ai/
├── src/
│   ├── assets/           # Static images and assets
│   ├── components/       # React components
│   │   ├── auth/         # Authentication components
│   │   ├── dashboard/    # Dashboard widgets
│   │   ├── landing/      # Landing page sections
│   │   ├── layout/       # Layout components (Navbar, Footer)
│   │   ├── packages/     # Investment package cards
│   │   ├── ui/           # shadcn/ui components
│   │   └── wallet/       # Wallet-related components
│   ├── contexts/         # React contexts (Auth)
│   ├── hooks/            # Custom React hooks
│   ├── integrations/     # External integrations (Supabase)
│   ├── lib/              # Utility functions
│   └── pages/            # Route pages
├── supabase/
│   ├── functions/        # Edge Functions (if any)
│   └── schema/           # Database schema SQL
├── public/               # Public static files
└── .env.example          # Environment template
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server on port 8080 |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |

## Path Aliases

The project uses `@/` as an alias for the `src/` directory:

```typescript
// Instead of relative imports like:
import { Button } from '../../../components/ui/button';

// Use:
import { Button } from '@/components/ui/button';
```

This is configured in:
- `tsconfig.json` - TypeScript path resolution
- `vite.config.ts` - Vite bundler resolution

## TypeScript Configuration

The project uses TypeScript with relaxed settings for development:

- `noImplicitAny: false` - Allows implicit any types
- `strictNullChecks: false` - Relaxed null checking
- `noUnusedLocals: false` - Unused variables won't cause errors

## Database Schema

The complete database schema is documented in `supabase/schema/full_schema.sql`. Key tables:

- `profiles` - User profile information
- `wallets` - User wallet balances
- `deposits` - Deposit records
- `withdrawals` - Withdrawal records
- `investment_packages` - Available investment plans
- `user_investments` - Active user investments
- `transactions` - Transaction history

## Supabase Integration

The Supabase client is pre-configured at `src/integrations/supabase/client.ts`:

```typescript
import { supabase } from '@/integrations/supabase/client';

// Example: Fetch user profile
const { data, error } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', userId)
  .single();
```

## Troubleshooting

### "Module not found" errors
1. Ensure all dependencies are installed: `npm install`
2. Check that the import path uses `@/` alias correctly
3. Restart the dev server

### Supabase connection issues
1. Verify `.env` file exists with correct values
2. Check that Supabase URL doesn't have trailing slash
3. Ensure the anon key is the public key (not service role)

### TypeScript errors in IDE
1. Restart TypeScript server: Cmd/Ctrl + Shift + P → "TypeScript: Restart TS Server"
2. Ensure `tsconfig.json` is properly loaded

## Building for Production

```bash
# Create production build
npm run build

# The output will be in the dist/ folder
# Preview the build locally:
npm run preview
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Ensure `npm run build` succeeds
4. Submit a pull request
