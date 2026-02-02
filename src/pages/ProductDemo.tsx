import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AlertTriangle, TrendingUp, Activity, Wallet, ArrowRight, Info, BarChart3, Shield, Target } from "lucide-react";
import { Link } from "react-router-dom";

// Mock data for demo
const mockStats = [
  { label: "Portfolio Value", value: "$125,430", change: "+12.5%", positive: true },
  { label: "Total Profit", value: "$25,430", change: "+8.2%", positive: true },
  { label: "Active Positions", value: "12", change: "3 new", positive: true },
  { label: "Win Rate", value: "68%", change: "+2.1%", positive: true },
];

const mockPerformanceData = [
  { month: "Jan", value: 100000 },
  { month: "Feb", value: 108500 },
  { month: "Mar", value: 105200 },
  { month: "Apr", value: 112800 },
  { month: "May", value: 118400 },
  { month: "Jun", value: 125430 },
];

const mockTransactions = [
  { id: 1, type: "BUY", asset: "BTC/USD", amount: "$5,000", time: "2 hours ago", status: "Completed" },
  { id: 2, type: "SELL", asset: "ETH/USD", amount: "$2,300", time: "5 hours ago", status: "Completed" },
  { id: 3, type: "BUY", asset: "SOL/USD", amount: "$1,500", time: "8 hours ago", status: "Completed" },
];

const metricsExplained = [
  {
    title: "Max Drawdown",
    description: "The maximum observed loss from a peak to a trough of a portfolio, before a new peak is attained. This metric helps assess risk tolerance and strategy resilience.",
  },
  {
    title: "Portfolio Exposure",
    description: "The percentage of total capital currently allocated to active positions. Lower exposure means more capital is held in reserve for new opportunities.",
  },
  {
    title: "Win Rate",
    description: "The percentage of trades that result in a profit. A higher win rate combined with proper risk management leads to consistent growth.",
  },
  {
    title: "Sharpe Ratio",
    description: "A measure of risk-adjusted return. It indicates how much excess return you receive for the extra volatility you endure. Higher is better.",
  },
  {
    title: "Sortino Ratio",
    description: "Similar to Sharpe but only considers downside volatility. A more relevant metric for traders concerned primarily with downside risk.",
  },
];

const ProductDemo = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-24 md:pt-28 pb-20">
        <div className="container mx-auto px-4">
          {/* Disclaimer Banner */}
          <div className="mb-8">
            <Card className="border-warning/50 bg-warning/10">
              <CardContent className="flex items-center gap-4 py-4">
                <AlertTriangle className="w-6 h-6 text-warning shrink-0" />
                <div>
                  <p className="font-semibold text-foreground">Demo: Simulated / Backtested Data</p>
                  <p className="text-sm text-muted-foreground">
                    This demo uses simulated data for illustration purposes only. Not financial advice. Past performance does not guarantee future results.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Product <span className="text-gradient">Demo</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Experience our AI trading platform interface with simulated data. See how the dashboard provides real-time insights and performance tracking.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {mockStats.map((stat, index) => (
              <Card key={index} className="bg-card border-border hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className={`text-sm ${stat.positive ? 'text-success' : 'text-destructive'}`}>
                    {stat.change}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Main Dashboard Preview */}
          <div className="grid lg:grid-cols-3 gap-6 mb-12">
            {/* Performance Chart */}
            <Card className="lg:col-span-2 bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  Portfolio Performance (Simulated)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-end justify-between gap-2 px-4">
                  {mockPerformanceData.map((data, index) => (
                    <div key={index} className="flex flex-col items-center gap-2 flex-1">
                      <div 
                        className="w-full bg-gradient-to-t from-primary to-primary/60 rounded-t-lg transition-all hover:opacity-80"
                        style={{ height: `${((data.value - 95000) / 35000) * 200}px` }}
                      />
                      <span className="text-xs text-muted-foreground">{data.month}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground text-center mt-4">
                  *Simulated 6-month performance data for illustration only
                </p>
              </CardContent>
            </Card>

            {/* AI Status */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-success" />
                  AI Trading Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
                    Active
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Strategy</span>
                  <span>Balanced Growth</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Risk Level</span>
                  <span className="text-warning">Medium</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Exposure</span>
                  <span>72%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Daily Trades</span>
                  <span>24</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Transactions */}
          <Card className="mb-12 bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Recent AI Trades (Simulated)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockTransactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        tx.type === 'BUY' ? 'bg-success/20 text-success' : 'bg-destructive/20 text-destructive'
                      }`}>
                        {tx.type}
                      </span>
                      <span className="font-medium">{tx.asset}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{tx.amount}</p>
                      <p className="text-xs text-muted-foreground">{tx.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Metrics Explained */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Info className="w-6 h-6 text-primary" />
              Metrics Explained
            </h2>
            <Accordion type="single" collapsible className="space-y-3">
              {metricsExplained.map((metric, index) => (
                <AccordionItem
                  key={index}
                  value={`metric-${index}`}
                  className="bg-card border border-border rounded-xl px-6 data-[state=open]:shadow-md transition-shadow"
                >
                  <AccordionTrigger className="text-left hover:no-underline py-4">
                    <span className="font-semibold">{metric.title}</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-4">
                    {metric.description}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* CTA Section */}
          <div className="text-center bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-2xl p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to See the Full Dashboard?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Create an account to access the complete trading dashboard with real-time data, advanced analytics, and AI-powered trading.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/login">
                <Button size="lg" variant="gradient" className="group">
                  View Full Dashboard
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/investors">
                <Button size="lg" variant="outline">
                  Request Investor Deck
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDemo;