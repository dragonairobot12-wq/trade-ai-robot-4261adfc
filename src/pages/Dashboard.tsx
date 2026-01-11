import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Wallet,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  History,
  BarChart3,
  DollarSign,
  Clock,
  Bot,
  RefreshCw,
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const chartData = [
  { name: "Mon", profit: 45 },
  { name: "Tue", profit: 72 },
  { name: "Wed", profit: 58 },
  { name: "Thu", profit: 89 },
  { name: "Fri", profit: 67 },
  { name: "Sat", profit: 95 },
  { name: "Sun", profit: 82 },
];

const transactions = [
  { type: "profit", amount: 45.32, date: "Today, 2:30 PM", status: "Completed" },
  { type: "deposit", amount: 1000, date: "Yesterday, 10:15 AM", status: "Completed" },
  { type: "profit", amount: 38.47, date: "Jan 8, 4:45 PM", status: "Completed" },
  { type: "withdrawal", amount: 500, date: "Jan 7, 11:20 AM", status: "Completed" },
  { type: "profit", amount: 52.18, date: "Jan 6, 3:00 PM", status: "Completed" },
];

const Dashboard = () => {
  const [aiStatus] = useState("Active");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 md:pt-24 pb-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Welcome back, Investor</h1>
              <p className="text-muted-foreground">Here's your portfolio overview</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button variant="gradient" size="sm">
                <DollarSign className="w-4 h-4 mr-2" />
                Deposit
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
            <Card className="border-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center">
                    <Wallet className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <span className="flex items-center text-sm text-success">
                    <ArrowUpRight className="w-4 h-4" />
                    +12.5%
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-1">Total Balance</p>
                <p className="text-2xl md:text-3xl font-bold">$12,458.32</p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 gradient-accent rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-accent-foreground" />
                  </div>
                  <span className="flex items-center text-sm text-success">
                    <ArrowUpRight className="w-4 h-4" />
                    +8.3%
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-1">Total Profit</p>
                <p className="text-2xl md:text-3xl font-bold text-success">$2,458.32</p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-warning/10 rounded-xl flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-warning" />
                  </div>
                  <span className="text-sm text-muted-foreground">Today</span>
                </div>
                <p className="text-sm text-muted-foreground mb-1">Daily Profit</p>
                <p className="text-2xl md:text-3xl font-bold">$82.45</p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Bot className="w-6 h-6 text-primary" />
                  </div>
                  <span className={`text-sm font-medium ${aiStatus === "Active" ? "text-success" : "text-muted-foreground"}`}>
                    ● {aiStatus}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-1">AI Status</p>
                <p className="text-2xl md:text-3xl font-bold">Trading</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Chart */}
            <Card className="lg:col-span-2 border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  Profit Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="profit"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorProfit)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Active Package */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Active Investment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 gradient-primary rounded-xl text-primary-foreground">
                  <p className="text-sm opacity-80">Professional Package</p>
                  <p className="text-2xl font-bold">$1,000</p>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">18/30 days</span>
                  </div>
                  <Progress value={60} className="h-2" />

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Expected ROI</span>
                    <span className="font-medium text-success">30%</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Expected Profit</span>
                    <span className="font-medium">$300.00</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Current Profit</span>
                    <span className="font-medium text-success">$180.45</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Transactions */}
          <Card className="mt-6 md:mt-8 border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="w-5 h-5 text-primary" />
                Recent Transactions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.map((tx, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-secondary/30 rounded-xl"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          tx.type === "profit"
                            ? "bg-success/10"
                            : tx.type === "deposit"
                            ? "bg-primary/10"
                            : "bg-warning/10"
                        }`}
                      >
                        {tx.type === "profit" ? (
                          <ArrowUpRight className="w-5 h-5 text-success" />
                        ) : tx.type === "deposit" ? (
                          <ArrowDownRight className="w-5 h-5 text-primary" />
                        ) : (
                          <ArrowUpRight className="w-5 h-5 text-warning" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium capitalize">{tx.type}</p>
                        <p className="text-sm text-muted-foreground">{tx.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-semibold ${
                          tx.type === "profit" ? "text-success" : tx.type === "withdrawal" ? "text-warning" : ""
                        }`}
                      >
                        {tx.type === "withdrawal" ? "-" : "+"}${tx.amount.toFixed(2)}
                      </p>
                      <p className="text-sm text-muted-foreground">{tx.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
