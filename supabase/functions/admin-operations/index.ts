import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    // Create admin client with service role
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // Get user token and verify admin status
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create user client to verify the token
    const supabaseUser = createClient(supabaseUrl, Deno.env.get('SUPABASE_PUBLISHABLE_KEY')!, {
      global: { headers: { Authorization: authHeader } }
    });

    const { data: { user }, error: userError } = await supabaseUser.auth.getUser();
    if (userError || !user) {
      console.error('Auth error:', userError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify admin role using service role client
    const { data: roleData, error: roleError } = await supabaseAdmin
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .maybeSingle();

    if (roleError || !roleData) {
      console.error('Role check error:', roleError);
      return new Response(
        JSON.stringify({ error: 'Access denied: Admins only' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse request body
    const { action, ...params } = await req.json();
    console.log('Admin action:', action, 'Params:', params);

    let result;

    switch (action) {
      case 'check-admin':
        result = { isAdmin: true };
        break;

      case 'get-stats':
        const [usersResult, depositsResult, withdrawalsResult] = await Promise.all([
          supabaseAdmin.from('profiles').select('id', { count: 'exact' }),
          supabaseAdmin.from('deposits').select('amount').eq('status', 'approved'),
          supabaseAdmin.from('withdrawals').select('id').eq('status', 'pending'),
        ]);
        
        const totalDeposits = depositsResult.data?.reduce((sum, d) => sum + Number(d.amount), 0) || 0;
        
        result = {
          totalUsers: usersResult.count || 0,
          totalDeposits,
          pendingWithdrawals: withdrawalsResult.data?.length || 0,
        };
        break;

      case 'get-users':
        const { data: users, error: usersError } = await supabaseAdmin
          .from('profiles')
          .select(`
            id,
            email,
            full_name,
            phone,
            created_at
          `)
          .order('created_at', { ascending: false });

        if (usersError) throw usersError;

        // Get wallets for all users
        const { data: wallets } = await supabaseAdmin
          .from('wallets')
          .select('user_id, balance, deposit_balance, profit_balance, total_invested, total_withdrawn');

        const usersWithWallets = users?.map(u => ({
          ...u,
          wallet: wallets?.find(w => w.user_id === u.id) || null
        }));

        result = { users: usersWithWallets };
        break;

      case 'update-user-balance':
        const { userId, depositBalance, profitBalance } = params;
        
        const { error: updateError } = await supabaseAdmin
          .from('wallets')
          .update({
            deposit_balance: depositBalance,
            profit_balance: profitBalance,
            balance: Number(depositBalance) + Number(profitBalance),
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId);

        if (updateError) throw updateError;
        result = { success: true };
        break;

      case 'get-pending-deposits':
        const { data: deposits, error: depositsError } = await supabaseAdmin
          .from('deposits')
          .select(`
            id,
            user_id,
            amount,
            currency,
            network,
            transaction_hash,
            screenshot_url,
            status,
            created_at
          `)
          .eq('status', 'pending')
          .order('created_at', { ascending: false });

        if (depositsError) throw depositsError;

        // Get user info for deposits
        const depositUserIds = [...new Set(deposits?.map(d => d.user_id) || [])];
        const { data: depositProfiles } = await supabaseAdmin
          .from('profiles')
          .select('id, email, full_name')
          .in('id', depositUserIds);

        const depositsWithUsers = deposits?.map(d => ({
          ...d,
          user: depositProfiles?.find(p => p.id === d.user_id) || null
        }));

        result = { deposits: depositsWithUsers };
        break;

      case 'approve-deposit':
        const { depositId } = params;
        
        // Get the deposit
        const { data: deposit, error: getDepositError } = await supabaseAdmin
          .from('deposits')
          .select('*')
          .eq('id', depositId)
          .single();

        if (getDepositError || !deposit) throw new Error('Deposit not found');

        // Update deposit status
        const { error: depositUpdateError } = await supabaseAdmin
          .from('deposits')
          .update({ status: 'approved', updated_at: new Date().toISOString() })
          .eq('id', depositId);

        if (depositUpdateError) throw depositUpdateError;

        // Add to user's deposit_balance
        const { data: userWallet } = await supabaseAdmin
          .from('wallets')
          .select('*')
          .eq('user_id', deposit.user_id)
          .single();

        if (userWallet) {
          const newDepositBalance = Number(userWallet.deposit_balance) + Number(deposit.amount);
          await supabaseAdmin
            .from('wallets')
            .update({
              deposit_balance: newDepositBalance,
              balance: newDepositBalance + Number(userWallet.profit_balance),
              updated_at: new Date().toISOString()
            })
            .eq('user_id', deposit.user_id);
        }

        // Create transaction record
        await supabaseAdmin.from('transactions').insert({
          user_id: deposit.user_id,
          type: 'deposit',
          amount: deposit.amount,
          status: 'completed',
          description: `Deposit approved - ${deposit.amount} ${deposit.currency}`,
          reference_id: depositId
        });

        result = { success: true };
        break;

      case 'reject-deposit':
        const { depositId: rejectDepositId, reason } = params;
        
        const { error: rejectDepositError } = await supabaseAdmin
          .from('deposits')
          .update({ 
            status: 'rejected', 
            admin_notes: reason,
            updated_at: new Date().toISOString() 
          })
          .eq('id', rejectDepositId);

        if (rejectDepositError) throw rejectDepositError;
        result = { success: true };
        break;

      case 'get-pending-withdrawals':
        const { data: withdrawals, error: withdrawalsError } = await supabaseAdmin
          .from('withdrawals')
          .select(`
            id,
            user_id,
            amount_requested,
            fee_amount,
            amount_sent,
            currency,
            network,
            wallet_address,
            status,
            created_at
          `)
          .eq('status', 'pending')
          .order('created_at', { ascending: false });

        if (withdrawalsError) throw withdrawalsError;

        // Get user info for withdrawals
        const withdrawalUserIds = [...new Set(withdrawals?.map(w => w.user_id) || [])];
        const { data: withdrawalProfiles } = await supabaseAdmin
          .from('profiles')
          .select('id, email, full_name')
          .in('id', withdrawalUserIds);

        const withdrawalsWithUsers = withdrawals?.map(w => ({
          ...w,
          user: withdrawalProfiles?.find(p => p.id === w.user_id) || null
        }));

        result = { withdrawals: withdrawalsWithUsers };
        break;

      case 'approve-withdrawal':
        const { withdrawalId } = params;
        
        // Get the withdrawal
        const { data: withdrawal, error: getWithdrawalError } = await supabaseAdmin
          .from('withdrawals')
          .select('*')
          .eq('id', withdrawalId)
          .single();

        if (getWithdrawalError || !withdrawal) throw new Error('Withdrawal not found');

        // Update withdrawal status
        const { error: withdrawalUpdateError } = await supabaseAdmin
          .from('withdrawals')
          .update({ status: 'approved', updated_at: new Date().toISOString() })
          .eq('id', withdrawalId);

        if (withdrawalUpdateError) throw withdrawalUpdateError;

        // Subtract from user's profit_balance (already validated on creation)
        const { data: wWallet } = await supabaseAdmin
          .from('wallets')
          .select('*')
          .eq('user_id', withdrawal.user_id)
          .single();

        if (wWallet) {
          const newProfitBalance = Math.max(0, Number(wWallet.profit_balance) - Number(withdrawal.amount_requested));
          const newTotalWithdrawn = Number(wWallet.total_withdrawn) + Number(withdrawal.amount_sent);
          await supabaseAdmin
            .from('wallets')
            .update({
              profit_balance: newProfitBalance,
              balance: Number(wWallet.deposit_balance) + newProfitBalance,
              total_withdrawn: newTotalWithdrawn,
              updated_at: new Date().toISOString()
            })
            .eq('user_id', withdrawal.user_id);
        }

        // Create transaction record
        await supabaseAdmin.from('transactions').insert({
          user_id: withdrawal.user_id,
          type: 'withdrawal',
          amount: withdrawal.amount_sent,
          status: 'completed',
          description: `Withdrawal approved - ${withdrawal.amount_sent} ${withdrawal.currency}`,
          reference_id: withdrawalId
        });

        result = { success: true };
        break;

      case 'reject-withdrawal':
        const { withdrawalId: rejectWithdrawalId, reason: withdrawalReason } = params;
        
        const { error: rejectWithdrawalError } = await supabaseAdmin
          .from('withdrawals')
          .update({ 
            status: 'rejected', 
            admin_notes: withdrawalReason,
            updated_at: new Date().toISOString() 
          })
          .eq('id', rejectWithdrawalId);

        if (rejectWithdrawalError) throw rejectWithdrawalError;
        result = { success: true };
        break;

      case 'distribute-daily-profit':
        const { percentage } = params;
        
        if (!percentage || percentage <= 0 || percentage > 100) {
          throw new Error('Invalid percentage');
        }

        // Get all users with active investments
        const { data: activeInvestments } = await supabaseAdmin
          .from('user_investments')
          .select('user_id, amount')
          .eq('status', 'active');

        if (!activeInvestments || activeInvestments.length === 0) {
          result = { success: true, message: 'No active investments found', usersUpdated: 0 };
          break;
        }

        // Calculate and distribute profit for each user
        const userProfits: { [key: string]: number } = {};
        for (const inv of activeInvestments) {
          const profit = (Number(inv.amount) * percentage) / 100;
          userProfits[inv.user_id] = (userProfits[inv.user_id] || 0) + profit;
        }

        let usersUpdated = 0;
        for (const [userId, profit] of Object.entries(userProfits)) {
          const { data: wallet } = await supabaseAdmin
            .from('wallets')
            .select('*')
            .eq('user_id', userId)
            .single();

          if (wallet) {
            const newProfitBalance = Number(wallet.profit_balance) + profit;
            const newTotalProfit = Number(wallet.total_profit) + profit;
            
            await supabaseAdmin
              .from('wallets')
              .update({
                profit_balance: newProfitBalance,
                total_profit: newTotalProfit,
                balance: Number(wallet.deposit_balance) + newProfitBalance,
                updated_at: new Date().toISOString()
              })
              .eq('user_id', userId);

            // Update the investment's current_profit
            await supabaseAdmin
              .from('user_investments')
              .update({
                current_profit: profit,
                updated_at: new Date().toISOString()
              })
              .eq('user_id', userId)
              .eq('status', 'active');

            // Create transaction record
            await supabaseAdmin.from('transactions').insert({
              user_id: userId,
              type: 'profit',
              amount: profit,
              status: 'completed',
              description: `Daily profit - ${percentage}% ROI`
            });

            usersUpdated++;
          }
        }

        result = { success: true, usersUpdated, totalDistributed: Object.values(userProfits).reduce((a, b) => a + b, 0) };
        break;

      default:
        throw new Error(`Unknown action: ${action}`);
    }

    return new Response(
      JSON.stringify(result),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Admin operation error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
