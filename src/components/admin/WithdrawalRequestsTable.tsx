import { useState } from "react";
import { usePendingWithdrawals, useApproveWithdrawal, useRejectWithdrawal } from "@/hooks/useAdmin";
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
import { ArrowUpCircle, Check, X, Copy } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

const WithdrawalRequestsTable = () => {
  const { data: withdrawals, isLoading } = usePendingWithdrawals();
  const approveWithdrawal = useApproveWithdrawal();
  const rejectWithdrawal = useRejectWithdrawal();
  const { toast } = useToast();
  
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const handleApprove = (withdrawalId: string) => {
    approveWithdrawal.mutate(withdrawalId);
  };

  const handleReject = () => {
    if (!rejectingId) return;
    rejectWithdrawal.mutate({ withdrawalId: rejectingId, reason: rejectReason }, {
      onSuccess: () => {
        setRejectingId(null);
        setRejectReason("");
      }
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Wallet address copied to clipboard",
    });
  };

  if (isLoading) {
    return (
      <Card className="bg-slate-900/50 border-purple-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <ArrowUpCircle className="w-5 h-5 text-rose-400" />
            Pending Withdrawals
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
            <ArrowUpCircle className="w-5 h-5 text-rose-400" />
            Pending Withdrawals ({withdrawals?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {withdrawals?.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              No pending withdrawal requests
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-purple-500/20 hover:bg-transparent">
                    <TableHead className="text-purple-300">User</TableHead>
                    <TableHead className="text-purple-300">Requested</TableHead>
                    <TableHead className="text-purple-300">Fee</TableHead>
                    <TableHead className="text-purple-300">To Send</TableHead>
                    <TableHead className="text-purple-300">Wallet</TableHead>
                    <TableHead className="text-purple-300">Network</TableHead>
                    <TableHead className="text-purple-300">Date</TableHead>
                    <TableHead className="text-purple-300 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {withdrawals?.map((withdrawal) => (
                    <TableRow key={withdrawal.id} className="border-purple-500/10 hover:bg-purple-500/5">
                      <TableCell>
                        <div>
                          <div className="font-medium text-white">{withdrawal.user?.full_name || 'N/A'}</div>
                          <div className="text-sm text-slate-400">{withdrawal.user?.email}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-white font-medium">
                        ${Number(withdrawal.amount_requested).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-rose-400">
                        -${Number(withdrawal.fee_amount).toFixed(2)}
                      </TableCell>
                      <TableCell className="text-emerald-400 font-bold">
                        ${Number(withdrawal.amount_sent).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-slate-300 max-w-[100px] truncate font-mono text-xs">
                            {withdrawal.wallet_address}
                          </span>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0 text-slate-400 hover:text-white"
                            onClick={() => copyToClipboard(withdrawal.wallet_address)}
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-300">{withdrawal.network}</TableCell>
                      <TableCell className="text-slate-400">
                        {format(new Date(withdrawal.created_at), 'MMM d, HH:mm')}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            className="bg-emerald-600 hover:bg-emerald-700 text-white"
                            onClick={() => handleApprove(withdrawal.id)}
                            disabled={approveWithdrawal.isPending}
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => setRejectingId(withdrawal.id)}
                            disabled={rejectWithdrawal.isPending}
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
            <DialogTitle className="text-white">Reject Withdrawal</DialogTitle>
            <DialogDescription className="text-slate-400">
              Please provide a reason for rejecting this withdrawal.
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
              disabled={rejectWithdrawal.isPending}
            >
              {rejectWithdrawal.isPending ? "Rejecting..." : "Reject Withdrawal"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default WithdrawalRequestsTable;
