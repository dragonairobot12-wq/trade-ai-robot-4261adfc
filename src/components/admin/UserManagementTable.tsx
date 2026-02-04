import { useState } from "react";
import { useAdminUsers, useUpdateUserBalance } from "@/hooks/useAdmin";
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
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, Edit2 } from "lucide-react";
import { format } from "date-fns";

const UserManagementTable = () => {
  const { data: users, isLoading } = useAdminUsers();
  const updateBalance = useUpdateUserBalance();
  
  const [editingUser, setEditingUser] = useState<{
    id: string;
    email: string;
    depositBalance: number;
    profitBalance: number;
  } | null>(null);

  const handleSaveBalance = () => {
    if (!editingUser) return;
    
    updateBalance.mutate({
      userId: editingUser.id,
      depositBalance: editingUser.depositBalance,
      profitBalance: editingUser.profitBalance,
    }, {
      onSuccess: () => setEditingUser(null)
    });
  };

  if (isLoading) {
    return (
      <Card className="bg-slate-900/50 border-purple-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Users className="w-5 h-5 text-purple-400" />
            User Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
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
            <Users className="w-5 h-5 text-purple-400" />
            User Management ({users?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-purple-500/20 hover:bg-transparent">
                  <TableHead className="text-purple-300">User</TableHead>
                  <TableHead className="text-purple-300">Deposit Balance</TableHead>
                  <TableHead className="text-purple-300">Profit Balance</TableHead>
                  <TableHead className="text-purple-300">Total Invested</TableHead>
                  <TableHead className="text-purple-300">Joined</TableHead>
                  <TableHead className="text-purple-300 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users?.map((user) => (
                  <TableRow key={user.id} className="border-purple-500/10 hover:bg-purple-500/5">
                    <TableCell>
                      <div>
                        <div className="font-medium text-white">{user.full_name || 'N/A'}</div>
                        <div className="text-sm text-slate-400">{user.email}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-amber-400 font-medium">
                      ${(user.wallet?.deposit_balance || 0).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-emerald-400 font-medium">
                      ${(user.wallet?.profit_balance || 0).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-slate-300">
                      ${(user.wallet?.total_invested || 0).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-slate-400">
                      {format(new Date(user.created_at), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/10"
                        onClick={() => setEditingUser({
                          id: user.id,
                          email: user.email,
                          depositBalance: user.wallet?.deposit_balance || 0,
                          profitBalance: user.wallet?.profit_balance || 0,
                        })}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
        <DialogContent className="bg-slate-900 border-purple-500/20">
          <DialogHeader>
            <DialogTitle className="text-white">Edit User Balance</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="text-sm text-slate-400 mb-4">
              Editing: {editingUser?.email}
            </div>
            <div>
              <label className="text-sm text-purple-300 mb-2 block">Deposit Balance ($)</label>
              <Input
                type="number"
                value={editingUser?.depositBalance || 0}
                onChange={(e) => setEditingUser(prev => prev ? {...prev, depositBalance: Number(e.target.value)} : null)}
                className="bg-slate-800 border-purple-500/20 text-white"
              />
            </div>
            <div>
              <label className="text-sm text-purple-300 mb-2 block">Profit Balance ($)</label>
              <Input
                type="number"
                value={editingUser?.profitBalance || 0}
                onChange={(e) => setEditingUser(prev => prev ? {...prev, profitBalance: Number(e.target.value)} : null)}
                className="bg-slate-800 border-purple-500/20 text-white"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setEditingUser(null)}>Cancel</Button>
            <Button 
              onClick={handleSaveBalance}
              disabled={updateBalance.isPending}
              className="bg-gradient-to-r from-purple-600 to-amber-600 hover:from-purple-700 hover:to-amber-700"
            >
              {updateBalance.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UserManagementTable;
