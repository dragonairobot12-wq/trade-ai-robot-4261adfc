import { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  History as HistoryIcon,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  Download,
  Calendar,
  TrendingUp,
  Clock,
  Zap,
  Timer,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTransactions } from "@/hooks/useTransactions";
import { useInvestments, UserInvestment } from "@/hooks/useInvestments";
import { format, differenceInDays } from "date-fns";

type TransactionType = "all" | "profit" | "deposit" | "withdrawal" | "investment";

const typeConfig = {
  profit: {
    icon: ArrowUpRight,
    color: "text-success",
    bgColor: "bg-success/10",
    prefix: "+",
  },
  deposit: {
    icon: ArrowDownRight,
    color: "text-primary",
    bgColor: "bg-primary/10",
    prefix: "+",
  },
  withdrawal: {
    icon: ArrowUpRight,
    color: "text-warning",
    bgColor: "bg-warning/10",
    prefix: "-",
  },
  investment: {
    icon: TrendingUp,
    color: "text-accent",
    bgColor: "bg-accent/10",
    prefix: "-",
  },
};

const calculateProgress = (startDate: string, endDate: string): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const now = new Date();
  const totalDuration = end.getTime() - start.getTime();
  const elapsed = now.getTime() - start.getTime();
  if (elapsed >= totalDuration) return 100;
  if (elapsed <= 0) return 0;
  return (elapsed / totalDuration) * 100;
};

interface InvestmentCardProps {
  investment: UserInvestment;
}

const InvestmentHistoryCard = ({ investment }: InvestmentCardProps) => {
  const packageName = investment.investment_packages?.name || "Investment";
  const roi = investment.investment_packages?.roi || 0;
  const progress = calculateProgress(investment.start_date, investment.end_date);
  const isCompleted = investment.status === "completed" || progress >= 100;
  const daysLeft = Math.max(0, differenceInDays(new Date(investment.end_date), new Date()));
  const totalProfit = investment.expected_return - investment.amount;
  const currentProfit = totalProfit * (progress / 100);

  return (
    <div className="p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-accent" />
          </div>
          <div>
            <p className="font-medium text-sm">{packageName}</p>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {format(new Date(investment.start_date), "MMM d, yyyy")}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-bold">${investment.amount.toLocaleString()}</p>
          <Badge 
            className={cn(
              "text-xs",
              isCompleted 
                ? "bg-success/20 text-success border-success/30" 
                : "bg-primary/20 text-primary border-primary/30"
            )}
          >
            {isCompleted ? "Completed" : "Active"}
          </Badge>
        </div>
      </div>

      <div className="space-y-2 mb-3">
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground flex items-center gap-1">
            <Timer className="w-3 h-3" />
            {isCompleted ? "Investment completed" : `${daysLeft} days left`}
          </span>
          <span className="font-medium text-primary">{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-1.5" />
      </div>

      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-border text-center">
        <div>
          <p className="text-[10px] text-muted-foreground">ROI</p>
          <p className="text-sm font-semibold text-success">+{roi}%</p>
        </div>
        <div>
          <p className="text-[10px] text-muted-foreground">Current Profit</p>
          <p className="text-sm font-semibold text-success">+${currentProfit.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-[10px] text-muted-foreground">Expected</p>
          <p className="text-sm font-semibold">${totalProfit.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

const History = () => {
  const [filter, setFilter] = useState<TransactionType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("transactions");
  
  const { transactions, isLoading: txLoading } = useTransactions();
  const { userInvestments, activeInvestments, completedInvestments, isLoading: invLoading } = useInvestments();

  const filteredTransactions = transactions.filter((tx) => {
    const matchesFilter = filter === "all" || tx.type === filter;
    const matchesSearch =
      (tx.description || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.amount.toString().includes(searchQuery);
    return matchesFilter && matchesSearch;
  });

  const totalProfit = transactions
    .filter((tx) => tx.type === "profit")
    .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

  const totalDeposits = transactions
    .filter((tx) => tx.type === "deposit")
    .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

  const totalWithdrawals = transactions
    .filter((tx) => tx.type === "withdrawal")
    .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

  const totalInvested = userInvestments.reduce((sum, inv) => sum + inv.amount, 0);

  return (
    <AppLayout>
      <div className="p-4 lg:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">History</h1>
            <p className="text-muted-foreground">View all your transactions and investments</p>
          </div>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-border">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                <Zap className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Profit</p>
                <p className="text-xl font-bold text-success">+${totalProfit.toFixed(2)}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <ArrowDownRight className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Deposits</p>
                <p className="text-xl font-bold">+${totalDeposits.toFixed(2)}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                <ArrowUpRight className="w-6 h-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Withdrawals</p>
                <p className="text-xl font-bold text-warning">-${totalWithdrawals.toFixed(2)}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Invested</p>
                <p className="text-xl font-bold">${totalInvested.toFixed(2)}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="transactions" className="gap-2">
              <HistoryIcon className="w-4 h-4" />
              Transactions
            </TabsTrigger>
            <TabsTrigger value="investments" className="gap-2">
              <TrendingUp className="w-4 h-4" />
              Investments ({userInvestments.length})
            </TabsTrigger>
          </TabsList>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="space-y-4 mt-4">
            {/* Filters */}
            <Card className="border-border">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search transactions..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>

                  <Tabs value={filter} onValueChange={(v) => setFilter(v as TransactionType)}>
                    <TabsList className="grid grid-cols-5">
                      <TabsTrigger value="all">All</TabsTrigger>
                      <TabsTrigger value="profit" className="data-[state=active]:bg-success data-[state=active]:text-success-foreground">
                        Profit
                      </TabsTrigger>
                      <TabsTrigger value="deposit" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                        Deposit
                      </TabsTrigger>
                      <TabsTrigger value="withdrawal" className="data-[state=active]:bg-warning data-[state=active]:text-warning-foreground">
                        Withdraw
                      </TabsTrigger>
                      <TabsTrigger value="investment" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
                        Invest
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </CardContent>
            </Card>

            {/* Transactions List */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <HistoryIcon className="w-5 h-5 text-primary" />
                  Transactions ({filteredTransactions.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {txLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-20 w-full rounded-xl" />
                    ))}
                  </div>
                ) : filteredTransactions.length === 0 ? (
                  <div className="text-center py-12">
                    <HistoryIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No transactions found</p>
                  </div>
                ) : (
                  filteredTransactions.map((tx) => {
                    const txType = tx.type as keyof typeof typeConfig;
                    const config = typeConfig[txType] || typeConfig.deposit;
                    const Icon = config.icon;

                    return (
                      <div
                        key={tx.id}
                        className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", config.bgColor)}>
                            <Icon className={cn("w-5 h-5", config.color)} />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{tx.description || `${tx.type} transaction`}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Calendar className="w-3 h-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">
                                {format(new Date(tx.created_at), "MMM d, yyyy HH:mm")}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right flex items-center gap-4">
                          <div>
                            <p className={cn("font-semibold", config.color)}>
                              {tx.amount >= 0 ? "+" : ""}{tx.amount < 0 ? "-" : ""}${Math.abs(tx.amount).toFixed(2)}
                            </p>
                            <Badge
                              variant="outline"
                              className={cn(
                                "text-xs",
                                tx.status === "completed"
                                  ? "border-success/50 text-success"
                                  : "border-warning/50 text-warning"
                              )}
                            >
                              {tx.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Investments Tab */}
          <TabsContent value="investments" className="space-y-4 mt-4">
            {/* Active Investments */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Zap className="w-5 h-5 text-success" />
                  Active Investments ({activeInvestments.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {invLoading ? (
                  <div className="space-y-3">
                    {[1, 2].map((i) => (
                      <Skeleton key={i} className="h-32 w-full rounded-xl" />
                    ))}
                  </div>
                ) : activeInvestments.length === 0 ? (
                  <div className="text-center py-8">
                    <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No active investments</p>
                  </div>
                ) : (
                  activeInvestments.map((investment) => (
                    <InvestmentHistoryCard key={investment.id} investment={investment} />
                  ))
                )}
              </CardContent>
            </Card>

            {/* Completed Investments */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Clock className="w-5 h-5 text-muted-foreground" />
                  Completed Investments ({completedInvestments.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {invLoading ? (
                  <Skeleton className="h-32 w-full rounded-xl" />
                ) : completedInvestments.length === 0 ? (
                  <div className="text-center py-8">
                    <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No completed investments yet</p>
                  </div>
                ) : (
                  completedInvestments.map((investment) => (
                    <InvestmentHistoryCard key={investment.id} investment={investment} />
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default History;
