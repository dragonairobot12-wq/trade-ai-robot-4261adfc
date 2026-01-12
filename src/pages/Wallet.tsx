import { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Wallet as WalletIcon,
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  Building,
  Bitcoin,
  Copy,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import AnimatedCounter from "@/components/dashboard/AnimatedCounter";

const paymentMethods = [
  { id: "crypto", name: "Cryptocurrency", icon: Bitcoin, fee: "0%" },
  { id: "bank", name: "Bank Transfer", icon: Building, fee: "1%" },
  { id: "card", name: "Credit Card", icon: CreditCard, fee: "2.5%" },
];

const Wallet = () => {
  const [amount, setAmount] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("crypto");
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const walletAddress = "0x1a2B3c4D5e6F7890AbCdEf...";

  const handleCopy = () => {
    navigator.clipboard.writeText("0x1a2B3c4D5e6F7890AbCdEf1234567890AbCdEf12");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "Address Copied",
      description: "Wallet address copied to clipboard",
    });
  };

  const handleDeposit = () => {
    toast({
      title: "Deposit Initiated",
      description: `$${amount} deposit request submitted successfully`,
    });
    setAmount("");
  };

  const handleWithdraw = () => {
    toast({
      title: "Withdrawal Initiated",
      description: `$${amount} withdrawal request is being processed`,
    });
    setAmount("");
  };

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
                <span className="text-sm font-medium text-success flex items-center gap-1">
                  <ArrowUpRight className="w-4 h-4" />
                  +12.5%
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-1">Available Balance</p>
              <p className="text-3xl font-bold">
                $<AnimatedCounter value={12458.32} />
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
              <p className="text-sm text-muted-foreground mb-1">Invested</p>
              <p className="text-3xl font-bold text-success">
                $<AnimatedCounter value={8500} decimals={0} />
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
              <p className="text-sm text-muted-foreground mb-1">Pending</p>
              <p className="text-3xl font-bold text-warning">
                $<AnimatedCounter value={350} decimals={0} />
              </p>
            </CardContent>
          </Card>
        </div>

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
                {/* Payment Method Selection */}
                <div className="space-y-3">
                  <Label>Select Payment Method</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {paymentMethods.map((method) => {
                      const Icon = method.icon;
                      return (
                        <button
                          key={method.id}
                          onClick={() => setSelectedMethod(method.id)}
                          className={cn(
                            "p-4 rounded-xl border-2 transition-all text-left",
                            selectedMethod === method.id
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50"
                          )}
                        >
                          <Icon className={cn(
                            "w-6 h-6 mb-2",
                            selectedMethod === method.id ? "text-primary" : "text-muted-foreground"
                          )} />
                          <p className="font-medium text-sm">{method.name}</p>
                          <p className="text-xs text-muted-foreground">Fee: {method.fee}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Wallet Address for Crypto */}
                {selectedMethod === "crypto" && (
                  <div className="p-4 rounded-xl bg-secondary/50 border border-border">
                    <Label className="text-xs text-muted-foreground">Deposit Address (BTC/ETH/USDT)</Label>
                    <div className="flex items-center gap-2 mt-2">
                      <code className="flex-1 text-sm font-mono bg-background px-3 py-2 rounded-lg truncate">
                        {walletAddress}
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
                )}

                {/* Amount Input */}
                <div className="space-y-2">
                  <Label>Amount (USD)</Label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="pl-8 text-lg h-12"
                    />
                  </div>
                  <div className="flex gap-2">
                    {[100, 500, 1000, 5000].map((value) => (
                      <Button
                        key={value}
                        variant="outline"
                        size="sm"
                        onClick={() => setAmount(value.toString())}
                        className="flex-1"
                      >
                        ${value}
                      </Button>
                    ))}
                  </div>
                </div>

                <Button
                  variant="gradient"
                  size="lg"
                  className="w-full"
                  onClick={handleDeposit}
                  disabled={!amount || parseFloat(amount) <= 0}
                >
                  <ArrowDownRight className="w-5 h-5 mr-2" />
                  Deposit Funds
                </Button>
              </TabsContent>

              <TabsContent value="withdraw" className="space-y-6">
                {/* Available for Withdrawal */}
                <div className="p-4 rounded-xl bg-success/10 border border-success/20">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-success" />
                    <div>
                      <p className="text-sm text-muted-foreground">Available for Withdrawal</p>
                      <p className="text-xl font-bold text-success">$3,958.32</p>
                    </div>
                  </div>
                </div>

                {/* Withdrawal Method */}
                <div className="space-y-3">
                  <Label>Withdrawal Method</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {paymentMethods.map((method) => {
                      const Icon = method.icon;
                      return (
                        <button
                          key={method.id}
                          onClick={() => setSelectedMethod(method.id)}
                          className={cn(
                            "p-4 rounded-xl border-2 transition-all text-left",
                            selectedMethod === method.id
                              ? "border-warning bg-warning/5"
                              : "border-border hover:border-warning/50"
                          )}
                        >
                          <Icon className={cn(
                            "w-6 h-6 mb-2",
                            selectedMethod === method.id ? "text-warning" : "text-muted-foreground"
                          )} />
                          <p className="font-medium text-sm">{method.name}</p>
                          <p className="text-xs text-muted-foreground">Fee: {method.fee}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Amount Input */}
                <div className="space-y-2">
                  <Label>Amount (USD)</Label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="pl-8 text-lg h-12"
                    />
                  </div>
                  <div className="flex gap-2">
                    {[100, 500, 1000, 3958].map((value) => (
                      <Button
                        key={value}
                        variant="outline"
                        size="sm"
                        onClick={() => setAmount(value.toString())}
                        className="flex-1"
                      >
                        {value === 3958 ? "Max" : `$${value}`}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Warning */}
                <div className="flex items-start gap-3 p-4 rounded-xl bg-warning/10 border border-warning/20">
                  <AlertCircle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-warning">Processing Time</p>
                    <p className="text-muted-foreground">Withdrawals are processed within 24-48 hours</p>
                  </div>
                </div>

                <Button
                  variant="default"
                  size="lg"
                  className="w-full bg-warning hover:bg-warning/90 text-warning-foreground"
                  onClick={handleWithdraw}
                  disabled={!amount || parseFloat(amount) <= 0 || parseFloat(amount) > 3958.32}
                >
                  <ArrowUpRight className="w-5 h-5 mr-2" />
                  Withdraw Funds
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Wallet;
