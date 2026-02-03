import { useState } from "react";
import { ArrowUpRight, ArrowDownRight, History, ArrowRight, ChevronLeft, ChevronRight, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useTransactions, TransactionData } from "@/hooks/useTransactions";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

const ITEMS_PER_PAGE = 10;

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
  referral: {
    icon: ArrowUpRight,
    color: "text-success",
    bgColor: "bg-success/10",
    prefix: "+",
  },
};

const PaginatedTransactions = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { transactions, isLoading } = useTransactions();

  const totalPages = Math.ceil(transactions.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentTransactions = transactions.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  if (isLoading) {
    return (
      <Card className="border-border bg-card">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <History className="w-5 h-5 text-primary" />
            Recent Transactions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </CardContent>
      </Card>
    );
  }

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
        {currentTransactions.length === 0 ? (
          <div className="text-center py-8">
            <History className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No transactions yet</p>
          </div>
        ) : (
          <>
            {currentTransactions.map((tx) => {
              const txType = tx.type as keyof typeof typeConfig;
              const config = typeConfig[txType] || typeConfig.deposit;
              const Icon = config.icon;

              return (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={cn("w-9 h-9 rounded-full flex items-center justify-center", config.bgColor)}>
                      <Icon className={cn("w-4 h-4", config.color)} />
                    </div>
                    <div>
                      <p className="text-sm font-medium capitalize">{tx.type}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(tx.created_at), "MMM d, h:mm a")}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={cn("text-sm font-semibold", config.color)}>
                      {tx.amount >= 0 ? "+" : ""}${Math.abs(tx.amount).toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground capitalize">{tx.status}</p>
                  </div>
                </div>
              );
            })}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </p>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  
                  {/* Page numbers */}
                  {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                    let pageNum: number;
                    if (totalPages <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage === 1) {
                      pageNum = i + 1;
                    } else if (currentPage === totalPages) {
                      pageNum = totalPages - 2 + i;
                    } else {
                      pageNum = currentPage - 1 + i;
                    }
                    
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => goToPage(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}

                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default PaginatedTransactions;
