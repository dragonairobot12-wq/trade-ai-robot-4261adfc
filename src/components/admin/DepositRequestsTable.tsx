import { useState } from "react";
import { usePendingDeposits, useApproveDeposit, useRejectDeposit } from "@/hooks/useAdmin";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowDownCircle, Check, X, ExternalLink } from "lucide-react";
import { format } from "date-fns";

const DepositRequestsTable = () => {
  const { data: deposits, isLoading } = usePendingDeposits();
  const approveDeposit = useApproveDeposit();
  const rejectDeposit = useRejectDeposit();
  
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const handleApprove = (depositId: string) => {
    approveDeposit.mutate(depositId);
  };

  const handleReject = () => {
    if (!rejectingId) return;
    rejectDeposit.mutate({ depositId: rejectingId, reason: rejectReason }, {
      onSuccess: () => {
        setRejectingId(null);
        setRejectReason("");
      }
    });
  };

  if (isLoading) {
    return (
      <Card className="bg-slate-900/50 border-purple-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <ArrowDownCircle className="w-5 h-5 text-emerald-400" />
            Pending Deposits
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="bg-slate-900/50 border-purple-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <ArrowDownCircle className="w-5 h-5 text-emerald-400" />
            Pending Deposits ({deposits?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {deposits?.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              No pending deposit requests
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-purple-500/20 hover:bg-transparent">
                    <TableHead className="text-purple-300">User</TableHead>
                    <TableHead className="text-purple-300">Amount</TableHead>
                    <TableHead className="text-purple-300">Network</TableHead>
                    <TableHead className="text-purple-300">TX Hash</TableHead>
                    <TableHead className="text-purple-300">Screenshot</TableHead>
                    <TableHead className="text-purple-300">Date</TableHead>
                    <TableHead className="text-purple-300 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {deposits?.map((deposit) => (
                    <TableRow key={deposit.id} className="border-purple-500/10 hover:bg-purple-500/5">
                      <TableCell>
                        <div>
                          <div className="font-medium text-white">{deposit.user?.full_name || 'N/A'}</div>
                          <div className="text-sm text-slate-400">{deposit.user?.email}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-emerald-400 font-bold">
                        ${Number(deposit.amount).toLocaleString()} {deposit.currency}
                      </TableCell>
                      <TableCell className="text-slate-300">{deposit.network}</TableCell>
                      <TableCell className="text-slate-400 max-w-[120px] truncate">
                        {deposit.transaction_hash || 'N/A'}
                      </TableCell>
                      <TableCell>
                        {deposit.screenshot_url ? (
                          <a 
                            href={deposit.screenshot_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-purple-400 hover:text-purple-300 flex items-center gap-1"
                          >
                            View <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <span className="text-slate-500">None</span>
                        )}
                      </TableCell>
                      <TableCell className="text-slate-400">
                        {format(new Date(deposit.created_at), 'MMM d, HH:mm')}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            className="bg-emerald-600 hover:bg-emerald-700 text-white"
                            onClick={() => handleApprove(deposit.id)}
                            disabled={approveDeposit.isPending}
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => setRejectingId(deposit.id)}
                            disabled={rejectDeposit.isPending}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!rejectingId} onOpenChange={() => setRejectingId(null)}>
        <DialogContent className="bg-slate-900 border-purple-500/20">
          <DialogHeader>
            <DialogTitle className="text-white">Reject Deposit</DialogTitle>
            <DialogDescription className="text-slate-400">
              Please provide a reason for rejecting this deposit.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Reason for rejection..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="bg-slate-800 border-purple-500/20 text-white"
            />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setRejectingId(null)}>Cancel</Button>
            <Button 
              variant="destructive"
              onClick={handleReject}
              disabled={rejectDeposit.isPending}
            >
              {rejectDeposit.isPending ? "Rejecting..." : "Reject Deposit"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DepositRequestsTable;
