import { ArrowUpRight, ArrowDownRight, History, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const transactions = [
  { type: "profit", amount: 45.32, date: "Today, 2:30 PM", status: "Completed" },
  { type: "deposit", amount: 1000, date: "Yesterday, 10:15 AM", status: "Completed" },
  { type: "profit", amount: 38.47, date: "Jan 8, 4:45 PM", status: "Completed" },
  { type: "withdrawal", amount: 500, date: "Jan 7, 11:20 AM", status: "Completed" },
  { type: "profit", amount: 52.18, date: "Jan 6, 3:00 PM", status: "Completed" },
];

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
};

const RecentTransactions = () => {
  return (
    <Card className="border-border bg-card">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <History className="w-5 h-5 text-primary" />
          Recent Transactions
        </CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link to="/history" className="text-xs">
            View All <ArrowRight className="w-3 h-3 ml-1" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-2">
        {transactions.map((tx, index) => {
          const config = typeConfig[tx.type as keyof typeof typeConfig];
          const Icon = config.icon;

          return (
            <div
              key={index}
              className="flex items-center justify-between p-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={cn("w-9 h-9 rounded-full flex items-center justify-center", config.bgColor)}>
                  <Icon className={cn("w-4 h-4", config.color)} />
                </div>
                <div>
                  <p className="text-sm font-medium capitalize">{tx.type}</p>
                  <p className="text-xs text-muted-foreground">{tx.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={cn("text-sm font-semibold", config.color)}>
                  {config.prefix}${tx.amount.toFixed(2)}
                </p>
                <p className="text-xs text-muted-foreground">{tx.status}</p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default RecentTransactions;
