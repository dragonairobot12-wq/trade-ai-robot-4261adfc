import { useState } from "react";
import { useDistributeDailyProfit } from "@/hooks/useAdmin";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
import { Sparkles, Zap } from "lucide-react";
import { motion } from "framer-motion";

const DailyProfitDistributor = () => {
  const distributeProfit = useDistributeDailyProfit();
  const [showDialog, setShowDialog] = useState(false);
  const [percentage, setPercentage] = useState("3");

  const handleDistribute = () => {
    const percentValue = parseFloat(percentage);
    if (isNaN(percentValue) || percentValue <= 0 || percentValue > 100) return;
    
    distributeProfit.mutate(percentValue, {
      onSuccess: () => setShowDialog(false)
    });
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="bg-gradient-to-br from-purple-900/50 to-amber-900/30 border-amber-500/30 overflow-hidden relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent" />
          <CardHeader className="relative">
            <CardTitle className="flex items-center gap-2 text-amber-400">
              <Sparkles className="w-5 h-5" />
              Magic Profit Button
            </CardTitle>
            <CardDescription className="text-slate-400">
              Distribute daily ROI to all users with active investments
            </CardDescription>
          </CardHeader>
          <CardContent className="relative">
            <Button
              size="lg"
              className="w-full bg-gradient-to-r from-amber-500 via-amber-600 to-purple-600 hover:from-amber-600 hover:via-amber-700 hover:to-purple-700 text-white font-bold py-6 text-lg shadow-lg shadow-amber-500/25 transition-all duration-300 hover:shadow-amber-500/40 hover:scale-[1.02]"
              onClick={() => setShowDialog(true)}
            >
              <Zap className="w-5 h-5 mr-2" />
              Distribute Daily Profit
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="bg-slate-900 border-purple-500/20">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              Distribute Daily Profit
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              Enter the ROI percentage to distribute to all users with active investments.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <label className="text-sm text-purple-300 mb-2 block">Daily ROI Percentage (%)</label>
            <Input
              type="number"
              step="0.1"
              min="0.1"
              max="100"
              value={percentage}
              onChange={(e) => setPercentage(e.target.value)}
              className="bg-slate-800 border-purple-500/20 text-white text-xl font-bold text-center"
              placeholder="e.g., 3"
            />
            <p className="text-xs text-slate-500 mt-2">
              This will add {percentage}% of each user's invested amount to their profit balance.
            </p>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowDialog(false)}>Cancel</Button>
            <Button 
              onClick={handleDistribute}
              disabled={distributeProfit.isPending || !percentage}
              className="bg-gradient-to-r from-amber-500 to-purple-600 hover:from-amber-600 hover:to-purple-700"
            >
              {distributeProfit.isPending ? "Distributing..." : "Distribute Profit"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DailyProfitDistributor;
