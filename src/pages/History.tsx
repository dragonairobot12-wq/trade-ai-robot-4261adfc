import { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  History as HistoryIcon,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  Filter,
  Download,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";

type TransactionType = "all" | "profit" | "deposit" | "withdrawal";

const transactions = [
  { id: 1, type: "profit", amount: 45.32, date: "2024-01-10 14:30", status: "Completed", description: "Daily AI Trading Profit" },
  { id: 2, type: "deposit", amount: 1000, date: "2024-01-09 10:15", status: "Completed", description: "Crypto Deposit (BTC)" },
  { id: 3, type: "profit", amount: 38.47, date: "2024-01-08 16:45", status: "Completed", description: "Daily AI Trading Profit" },
  { id: 4, type: "withdrawal", amount: 500, date: "2024-01-07 11:20", status: "Completed", description: "Bank Transfer Withdrawal" },
  { id: 5, type: "profit", amount: 52.18, date: "2024-01-06 15:00", status: "Completed", description: "Daily AI Trading Profit" },
  { id: 6, type: "deposit", amount: 2500, date: "2024-01-05 09:30", status: "Completed", description: "Credit Card Deposit" },
  { id: 7, type: "profit", amount: 67.89, date: "2024-01-04 14:15", status: "Completed", description: "Daily AI Trading Profit" },
  { id: 8, type: "withdrawal", amount: 200, date: "2024-01-03 16:00", status: "Pending", description: "Crypto Withdrawal (ETH)" },
  { id: 9, type: "profit", amount: 41.23, date: "2024-01-02 13:45", status: "Completed", description: "Daily AI Trading Profit" },
  { id: 10, type: "deposit", amount: 600, date: "2024-01-01 08:00", status: "Completed", description: "Bank Transfer Deposit" },
];

const typeConfig = {
  profit: {
    icon: ArrowUpRight,
    color: "text-success",
    bgColor: "bg-success/10",
    prefix: "+",
    badge: "bg-success/10 text-success",
  },
  deposit: {
    icon: ArrowDownRight,
    color: "text-primary",
    bgColor: "bg-primary/10",
    prefix: "+",
    badge: "bg-primary/10 text-primary",
  },
  withdrawal: {
    icon: ArrowUpRight,
    color: "text-warning",
    bgColor: "bg-warning/10",
    prefix: "-",
    badge: "bg-warning/10 text-warning",
  },
};

const History = () => {
  const [filter, setFilter] = useState<TransactionType>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTransactions = transactions.filter((tx) => {
    const matchesFilter = filter === "all" || tx.type === filter;
    const matchesSearch =
      tx.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.amount.toString().includes(searchQuery);
    return matchesFilter && matchesSearch;
  });

  const totalProfit = transactions
    .filter((tx) => tx.type === "profit")
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalDeposits = transactions
    .filter((tx) => tx.type === "deposit")
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalWithdrawals = transactions
    .filter((tx) => tx.type === "withdrawal")
    .reduce((sum, tx) => sum + tx.amount, 0);

  return (
    <AppLayout>
      <div className="p-4 lg:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Transaction History</h1>
            <p className="text-muted-foreground">View all your transactions and activities</p>
          </div>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="border-border">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                <ArrowUpRight className="w-6 h-6 text-success" />
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
        </div>

        {/* Filters */}
        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search transactions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>

              {/* Type Filter */}
              <Tabs value={filter} onValueChange={(v) => setFilter(v as TransactionType)}>
                <TabsList className="grid grid-cols-4">
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
            {filteredTransactions.length === 0 ? (
              <div className="text-center py-12">
                <HistoryIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No transactions found</p>
              </div>
            ) : (
              filteredTransactions.map((tx) => {
                const config = typeConfig[tx.type as keyof typeof typeConfig];
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
                        <p className="font-medium text-sm">{tx.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Calendar className="w-3 h-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{tx.date}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right flex items-center gap-4">
                      <div>
                        <p className={cn("font-semibold", config.color)}>
                          {config.prefix}${tx.amount.toFixed(2)}
                        </p>
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-xs",
                            tx.status === "Completed"
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
      </div>
    </AppLayout>
  );
};

export default History;
