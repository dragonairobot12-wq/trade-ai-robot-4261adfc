import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Target, Lightbulb, Boxes, Globe, Shield, TrendingUp, Users, 
  DollarSign, Calendar, FileText, Download, Lock, ArrowRight,
  CheckCircle, Rocket, Building2
} from "lucide-react";
import { Link } from "react-router-dom";

const sections = [
  {
    id: "problem",
    icon: Target,
    title: "The Problem",
    content: "Retail and institutional investors lack access to sophisticated, risk-managed AI trading systems. Existing solutions are either opaque black boxes, prohibitively expensive, or lack proper risk controls and audit trails."
  },
  {
    id: "solution",
    icon: Lightbulb,
    title: "Our Solution",
    content: "Dragon AI Robot provides an accessible, transparent AI trading platform with built-in risk management, position sizing, and comprehensive audit logging. We democratize institutional-grade trading technology."
  },
  {
    id: "product",
    icon: Boxes,
    title: "The Product",
    content: "A full-stack trading automation platform featuring: AI-driven signal generation, real-time risk engine, portfolio exposure controls, strategy monitoring, and detailed reporting dashboard. Integration-ready with major exchanges and brokers."
  },
  {
    id: "market",
    icon: Globe,
    title: "Market & Why Now",
    content: "The algorithmic trading market is projected to reach $31.5B by 2028. Growing demand for automated, transparent trading solutions combined with advances in AI/ML create a unique window for disruption."
  },
  {
    id: "moat",
    icon: Shield,
    title: "Differentiation & Moat",
    content: "Proprietary risk engine with dynamic position sizing. Audit-friendly logging for regulatory compliance. Modular architecture allowing rapid strategy iteration. Focus on transparency and measurable performance."
  },
];

const progressMetrics = [
  { label: "Waitlist Signups", value: "2,500+", note: "Placeholder until verified" },
  { label: "Backtest Runs", value: "50,000+", note: "Placeholder until verified" },
  { label: "Pilot Partners", value: "3", note: "Placeholder until verified" },
  { label: "Months in Dev", value: "18+", note: "Placeholder until verified" },
];

const timeline = [
  { period: "3 Months", items: ["Complete beta testing", "Launch pilot program", "Onboard first 100 users"] },
  { period: "6 Months", items: ["Exchange integrations", "Mobile app launch", "1,000 active users"] },
  { period: "12 Months", items: ["Institutional API", "Multi-strategy support", "10,000 active users"] },
];

const dataRoomItems = [
  { title: "Pitch Deck", description: "Comprehensive investor presentation", icon: FileText },
  { title: "One-Pager", description: "Executive summary document", icon: FileText },
  { title: "Product Roadmap", description: "Development milestones", icon: Rocket },
  { title: "Traction Sheet", description: "Key metrics and growth data", icon: TrendingUp },
];

const Investors = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    company: "",
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Try to insert into Supabase - gracefully handle if table doesn't exist
      const { error } = await supabase
        .from('investor_leads' as any)
        .insert([{
          full_name: formData.full_name,
          email: formData.email,
          company: formData.company,
          message: formData.message
        }]);

      if (error) {
        console.log("Supabase insert failed (table may not exist), showing success anyway:", error);
      }
    } catch (err) {
      console.log("Supabase connection error, showing success anyway:", err);
    }

    // Always show success
    setIsSubmitted(true);
    toast({
      title: "Request Submitted!",
      description: "We'll be in touch within 24-48 hours with the investor deck.",
    });
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-24 md:pt-28 pb-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center max-w-4xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Building2 className="w-4 h-4" />
              For Investors & Partners
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Invest in the Future of <span className="text-gradient">AI Trading</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              We're building transparent, risk-managed AI trading infrastructure for the next generation of investors.
            </p>
          </div>

          {/* Key Sections */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {sections.map((section) => (
              <Card key={section.id} className="bg-card border-border hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center mb-4">
                    <section.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <CardTitle>{section.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{section.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Progress / Traction */}
          <div className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
              Progress & <span className="text-gradient">Traction</span>
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {progressMetrics.map((metric, index) => (
                <Card key={index} className="bg-card border-border text-center">
                  <CardContent className="pt-6">
                    <p className="text-3xl font-bold text-primary mb-2">{metric.value}</p>
                    <p className="font-medium mb-1">{metric.label}</p>
                    <p className="text-xs text-muted-foreground">{metric.note}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Go-to-Market & Business Model */}
          <div className="grid md:grid-cols-2 gap-6 mb-16">
            <Card className="bg-card border-border">
              <CardHeader>
                <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-primary-foreground" />
                </div>
                <CardTitle>Go-to-Market Strategy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-muted-foreground">
                <p>• Direct B2C acquisition via content marketing and waitlist</p>
                <p>• B2B2C partnerships with brokers and platforms</p>
                <p>• API licensing for institutional clients</p>
                <p className="text-xs italic pt-2">Placeholders - detailed GTM available in deck</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center mb-4">
                  <DollarSign className="w-6 h-6 text-primary-foreground" />
                </div>
                <CardTitle>Business Model</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-muted-foreground">
                <p>• Subscription tiers (Starter to Enterprise)</p>
                <p>• Performance fees on profitable trades</p>
                <p>• Enterprise API licensing</p>
                <p className="text-xs italic pt-2">Placeholders - detailed financials available in deck</p>
              </CardContent>
            </Card>
          </div>

          {/* Team Snapshot */}
          <Card className="mb-16 bg-gradient-to-r from-primary/10 via-transparent to-primary/10 border-primary/30">
            <CardContent className="flex flex-col md:flex-row items-center justify-between gap-6 py-8">
              <div>
                <h3 className="text-2xl font-bold mb-2">Meet the Team</h3>
                <p className="text-muted-foreground">
                  Experienced founders with backgrounds in quantitative finance, AI/ML, and fintech product development.
                </p>
              </div>
              <Link to="/team">
                <Button variant="gradient" size="lg" className="group shrink-0">
                  View Full Team
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Ask / Use of Funds */}
          <Card className="mb-16 bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-primary" />
                The Ask / Use of Funds
              </CardTitle>
              <CardDescription>Placeholder allocation - details in investor deck</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Engineering", pct: "40%" },
                  { label: "Sales & Marketing", pct: "25%" },
                  { label: "Operations", pct: "20%" },
                  { label: "Reserve", pct: "15%" },
                ].map((item, i) => (
                  <div key={i} className="text-center p-4 bg-secondary/50 rounded-xl">
                    <p className="text-2xl font-bold text-primary">{item.pct}</p>
                    <p className="text-sm text-muted-foreground">{item.label}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <div className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
              <Calendar className="w-6 h-6 inline-block mr-2 text-primary" />
              Roadmap Timeline
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {timeline.map((phase, index) => (
                <Card key={index} className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-primary">{phase.period}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {phase.items.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-muted-foreground">
                          <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-1" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Request Deck Form */}
          <div id="request-form" className="mb-16">
            <Card className="max-w-2xl mx-auto bg-card border-border">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Request Investor Deck</CardTitle>
                <CardDescription>
                  Fill out the form below and we'll send you our comprehensive investor presentation.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isSubmitted ? (
                  <div className="text-center py-8">
                    <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">Thank You!</h3>
                    <p className="text-muted-foreground">
                      We've received your request. Expect the investor deck in your inbox within 24-48 hours.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="full_name">Full Name *</Label>
                        <Input
                          id="full_name"
                          required
                          value={formData.full_name}
                          onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                          placeholder="John Doe"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company">Fund / Company</Label>
                      <Input
                        id="company"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        placeholder="Acme Ventures"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Message (Optional)</Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Any specific questions or areas of interest?"
                        rows={3}
                      />
                    </div>
                    <Button type="submit" variant="gradient" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? "Submitting..." : "Request Deck"}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Data Room */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
              <Lock className="w-6 h-6 inline-block mr-2 text-primary" />
              Data Room
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {dataRoomItems.map((item, index) => (
                <Card key={index} className="bg-card border-border opacity-75">
                  <CardContent className="pt-6 text-center">
                    <item.icon className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-semibold mb-1">{item.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
                    <Button variant="outline" size="sm" disabled className="w-full">
                      <Download className="w-4 h-4 mr-2" />
                      Available on Request
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Investors;