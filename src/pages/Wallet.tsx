import { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Wallet as WalletIcon,
  ArrowUpRight,
  ArrowDownRight,
  Bitcoin,
  Copy,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Clock,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useWallet } from "@/hooks/useWallet";
import AnimatedCounter from "@/components/dashboard/AnimatedCounter";

const DEPOSIT_WALLET_ADDRESS = "THNp5pr3xzN3HRhfi6PvwjfzPMkAVLaG1X";

const Wallet = () => {
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawAddress, setWithdrawAddress] = useState("");
  const [transactionHash, setTransactionHash] = useState("");
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  
  const { 
    wallet, 
    deposits, 
    withdrawals, 
    pendingDeposits,
    pendingWithdrawals,
    isLoading, 
    createDeposit, 
    createWithdrawal,
    calculateWithdrawalFee,
    WITHDRAWAL_FEE_PERCENTAGE,
  } = useWallet();

  const handleCopy = () => {
    navigator.clipboard.writeText(DEPOSIT_WALLET_ADDRESS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "Address Copied",
      description: "USDT-TRC20 wallet address copied to clipboard",
    });
  };

  const handleDeposit = () => {
    const amount = parseFloat(depositAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid deposit amount",
        variant: "destructive",
      });
      return;
    }

    createDeposit.mutate({ 
      amount, 
      transactionHash: transactionHash || undefined 
    });
    setDepositAmount("");
    setTransactionHash("");
  };

  const handleWithdraw = () => {
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid withdrawal amount",
        variant: "destructive",
      });
      return;
    }

    if (!withdrawAddress || withdrawAddress.length < 30) {
      toast({
        title: "Invalid Address",
        description: "Please enter a valid USDT-TRC20 wallet address",
        variant: "destructive",
      });
      return;
    }

    if (wallet && amount > wallet.balance) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough balance for this withdrawal",
        variant: "destructive",
      });
      return;
    }

    createWithdrawal.mutate({ amount, walletAddress: withdrawAddress });
    setWithdrawAmount("");
    setWithdrawAddress("");
  };

  const withdrawalBreakdown = withdrawAmount 
    ? calculateWithdrawalFee(parseFloat(withdrawAmount) || 0)
    : null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-success/10 text-success border-success/20">Approved</Badge>;
      case "rejected":
        return <Badge className="bg-destructive/10 text-destructive border-destructive/20">Rejected</Badge>;
      default:
        return <Badge className="bg-warning/10 text-warning border-warning/20">Pending</Badge>;
    }
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-4 lg:p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">Wallet</h1>
          <p className="text-muted-foreground">Manage your funds and transactions</p>
        </div>

        {/* Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-border bg-gradient-to-br from-primary/10 to-primary/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center">
                  <WalletIcon className="w-6 h-6 text-primary-foreground" />
                </div>
                <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                  Active
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-1">Available Balance</p>
              <p className="text-3xl font-bold">
                $<AnimatedCounter value={wallet?.balance || 0} />
              </p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center">
                  <ArrowDownRight className="w-6 h-6 text-success" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-1">Total Invested</p>
              <p className="text-3xl font-bold text-success">
                $<AnimatedCounter value={wallet?.total_invested || 0} decimals={0} />
              </p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-warning/10 rounded-xl flex items-center justify-center">
                  <ArrowUpRight className="w-6 h-6 text-warning" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-1">Total Withdrawn</p>
              <p className="text-3xl font-bold text-warning">
                $<AnimatedCounter value={wallet?.total_withdrawn || 0} decimals={0} />
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Pending Transactions Alert */}
        {(pendingDeposits.length > 0 || pendingWithdrawals.length > 0) && (
          <Card className="border-warning/30 bg-warning/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-warning" />
                <div>
                  <p className="font-medium text-warning">Pending Transactions</p>
                  <p className="text-sm text-muted-foreground">
                    {pendingDeposits.length > 0 && `${pendingDeposits.length} deposit(s) awaiting approval`}
                    {pendingDeposits.length > 0 && pendingWithdrawals.length > 0 && " • "}
                    {pendingWithdrawals.length > 0 && `${pendingWithdrawals.length} withdrawal(s) processing`}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Deposit / Withdraw Tabs */}
        <Card className="border-border">
          <CardContent className="p-6">
            <Tabs defaultValue="deposit">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="deposit" className="data-[state=active]:bg-success data-[state=active]:text-success-foreground">
                  <ArrowDownRight className="w-4 h-4 mr-2" />
                  Deposit
                </TabsTrigger>
                <TabsTrigger value="withdraw" className="data-[state=active]:bg-warning data-[state=active]:text-warning-foreground">
                  <ArrowUpRight className="w-4 h-4 mr-2" />
                  Withdraw
                </TabsTrigger>
              </TabsList>

              <TabsContent value="deposit" className="space-y-6">
                {/* Crypto Only Info */}
                <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                  <div className="flex items-center gap-3 mb-3">
                    <Bitcoin className="w-6 h-6 text-primary" />
                    <div>
                      <p className="font-semibold">Crypto Deposits Only</p>
                      <p className="text-sm text-muted-foreground">We accept USDT (TRC20) deposits</p>
                    </div>
                  </div>
                </div>

                {/* Wallet Address */}
                <div className="p-4 rounded-xl bg-secondary/50 border border-border">
                  <Label className="text-xs text-muted-foreground">USDT-TRC20 Deposit Address</Label>
                  <div className="flex items-center gap-2 mt-2">
                    <code className="flex-1 text-sm font-mono bg-background px-3 py-2 rounded-lg break-all">
                      {DEPOSIT_WALLET_ADDRESS}
                    </code>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleCopy}
                      className="shrink-0"
                    >
                      {copied ? (
                        <CheckCircle2 className="w-4 h-4 text-success" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Amount Input */}
                <div className="space-y-2">
                  <Label>Deposit Amount (USD)</Label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      className="pl-8 text-lg h-12"
                      min="0"
                    />
                  </div>
                  <div className="flex gap-2">
                    {[100, 500, 1000, 5000].map((value) => (
                      <Button
                        key={value}
                        variant="outline"
                        size="sm"
                        onClick={() => setDepositAmount(value.toString())}
                        className="flex-1"
                      >
                        ${value}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Transaction Hash (Optional) */}
                <div className="space-y-2">
                  <Label>Transaction Hash (Optional)</Label>
                  <Input
                    type="text"
                    placeholder="Enter your TRC20 transaction hash"
                    value={transactionHash}
                    onChange={(e) => setTransactionHash(e.target.value)}
                    className="h-12 font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Info className="w-3 h-3" />
                    Providing the transaction hash speeds up verification
                  </p>
                </div>

                {/* Important Notice */}
                <div className="flex items-start gap-3 p-4 rounded-xl bg-warning/10 border border-warning/20">
                  <AlertCircle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-warning">Important</p>
                    <p className="text-muted-foreground">
                      Send only USDT on the TRC20 network. Deposits require admin approval and usually process within 1-24 hours.
                    </p>
                  </div>
                </div>

                <Button
                  variant="gradient"
                  size="lg"
                  className="w-full"
                  onClick={handleDeposit}
                  disabled={!depositAmount || parseFloat(depositAmount) <= 0 || createDeposit.isPending}
                >
                  {createDeposit.isPending ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <ArrowDownRight className="w-5 h-5 mr-2" />
                      Submit Deposit Request
                    </>
                  )}
                </Button>
              </TabsContent>

              <TabsContent value="withdraw" className="space-y-6">
                {/* Available for Withdrawal */}
                <div className="p-4 rounded-xl bg-success/10 border border-success/20">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-success" />
                    <div>
                      <p className="text-sm text-muted-foreground">Available for Withdrawal</p>
                      <p className="text-xl font-bold text-success">${wallet?.balance?.toFixed(2) || "0.00"}</p>
                    </div>
                  </div>
                </div>

                {/* Crypto Only Info */}
                <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                  <div className="flex items-center gap-3">
                    <Bitcoin className="w-6 h-6 text-primary" />
                    <div>
                      <p className="font-semibold">Crypto Withdrawals Only</p>
                      <p className="text-sm text-muted-foreground">Withdrawals are processed via USDT (TRC20)</p>
                    </div>
                  </div>
                </div>

                {/* Wallet Address Input */}
                <div className="space-y-2">
                  <Label>Your USDT-TRC20 Wallet Address</Label>
                  <Input
                    type="text"
                    placeholder="Enter your TRC20 wallet address"
                    value={withdrawAddress}
                    onChange={(e) => setWithdrawAddress(e.target.value)}
                    className="h-12 font-mono text-sm"
                  />
                </div>

                {/* Amount Input */}
                <div className="space-y-2">
                  <Label>Withdrawal Amount (USD)</Label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      className="pl-8 text-lg h-12"
                      max={wallet?.balance || 0}
                      min="0"
                    />
                  </div>
                  <div className="flex gap-2">
                    {[100, 500, 1000].map((value) => (
                      <Button
                        key={value}
                        variant="outline"
                        size="sm"
                        onClick={() => setWithdrawAmount(Math.min(value, wallet?.balance || 0).toString())}
                        className="flex-1"
                        disabled={!wallet || wallet.balance < value}
                      >
                        ${value}
                      </Button>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setWithdrawAmount((wallet?.balance || 0).toString())}
                      className="flex-1"
                      disabled={!wallet || wallet.balance <= 0}
                    >
                      Max
                    </Button>
                  </div>
                </div>

                {/* Fee Breakdown */}
                {withdrawalBreakdown && parseFloat(withdrawAmount) > 0 && (
                  <div className="p-4 rounded-xl bg-secondary/50 border border-border space-y-2">
                    <p className="font-medium text-sm">Withdrawal Breakdown</p>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Requested Amount</span>
                        <span>${withdrawalBreakdown.requested.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-destructive">
                        <span>Processing Fee ({(WITHDRAWAL_FEE_PERCENTAGE * 100).toFixed(0)}%)</span>
                        <span>-${withdrawalBreakdown.fee.toFixed(2)}</span>
                      </div>
                      <div className="border-t border-border pt-2 flex justify-between font-semibold">
                        <span>You Receive</span>
                        <span className="text-success">${withdrawalBreakdown.received.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Warning */}
                <div className="flex items-start gap-3 p-4 rounded-xl bg-warning/10 border border-warning/20">
                  <AlertCircle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-warning">Processing Time</p>
                    <p className="text-muted-foreground">
                      Withdrawals are processed within 24-48 hours. A 10% processing fee applies to all withdrawals.
                    </p>
                  </div>
                </div>

                <Button
                  variant="default"
                  size="lg"
                  className="w-full bg-warning hover:bg-warning/90 text-warning-foreground"
                  onClick={handleWithdraw}
                  disabled={
                    !withdrawAmount || 
                    !withdrawAddress ||
                    parseFloat(withdrawAmount) <= 0 || 
                    parseFloat(withdrawAmount) > (wallet?.balance || 0) ||
                    createWithdrawal.isPending
                  }
                >
                  {createWithdrawal.isPending ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <ArrowUpRight className="w-5 h-5 mr-2" />
                      Request Withdrawal
                    </>
                  )}
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Recent Deposits */}
        {deposits.length > 0 && (
          <Card className="border-border">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">Recent Deposits</h3>
              <div className="space-y-3">
                {deposits.slice(0, 5).map((deposit) => (
                  <div
                    key={deposit.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-secondary/30"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
                        <ArrowDownRight className="w-5 h-5 text-success" />
                      </div>
                      <div>
                        <p className="font-medium">${deposit.amount.toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground">
                          {deposit.currency} ({deposit.network})
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      {getStatusBadge(deposit.status)}
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(deposit.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Withdrawals */}
        {withdrawals.length > 0 && (
          <Card className="border-border">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">Recent Withdrawals</h3>
              <div className="space-y-3">
                {withdrawals.slice(0, 5).map((withdrawal) => (
                  <div
                    key={withdrawal.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-secondary/30"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-warning/10 flex items-center justify-center">
                        <ArrowUpRight className="w-5 h-5 text-warning" />
                      </div>
                      <div>
                        <p className="font-medium">${withdrawal.amount_sent.toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground">
                          Fee: ${withdrawal.fee_amount.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      {getStatusBadge(withdrawal.status)}
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(withdrawal.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
};

export default Wallet;
