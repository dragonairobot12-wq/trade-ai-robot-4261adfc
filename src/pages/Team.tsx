import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Linkedin, Twitter, Github, Users, Shield, Target, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";

const teamMembers = [
  {
    name: "Alex Chen",
    role: "CEO & Co-Founder",
    bio: "10+ years in quantitative trading and fintech. Previously led algorithmic trading at a major hedge fund.",
    avatar: null,
    social: { linkedin: "#", twitter: "#" }
  },
  {
    name: "Sarah Mitchell",
    role: "CTO & Co-Founder",
    bio: "Ex-Google ML engineer. PhD in Machine Learning. Built AI systems processing billions of transactions.",
    avatar: null,
    social: { linkedin: "#", github: "#" }
  },
  {
    name: "David Park",
    role: "Head of Product",
    bio: "Former product lead at Robinhood. Expert in building intuitive fintech user experiences.",
    avatar: null,
    social: { linkedin: "#", twitter: "#" }
  },
  {
    name: "Emma Rodriguez",
    role: "Head of Risk",
    bio: "15 years in risk management at top investment banks. CFA charterholder.",
    avatar: null,
    social: { linkedin: "#" }
  },
];

const advisors = [
  {
    name: "Michael Thompson",
    role: "Strategic Advisor",
    bio: "Former CEO of a publicly traded fintech. Angel investor in 30+ startups.",
    avatar: null
  },
  {
    name: "Dr. Lisa Wang",
    role: "AI/ML Advisor",
    bio: "Stanford professor specializing in financial machine learning. Published 50+ papers.",
    avatar: null
  },
];

const values = [
  { icon: Shield, title: "Transparency", description: "Open about our methods, performance, and limitations" },
  { icon: Target, title: "Risk-First", description: "Every decision starts with risk management" },
  { icon: BarChart3, title: "Measurable", description: "If we can't measure it, we don't claim it" },
];

const Team = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-24 md:pt-28 pb-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Users className="w-4 h-4" />
              Our Team
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Built by <span className="text-gradient">Experts</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              A team of experienced professionals from quantitative finance, AI/ML, and fintech product development.
            </p>
          </div>

          {/* Core Team */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-8 text-center">Leadership Team</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {teamMembers.map((member, index) => (
                <Card key={index} className="bg-card border-border hover:shadow-lg transition-shadow group">
                  <CardContent className="pt-6 text-center">
                    {/* Avatar Placeholder */}
                    <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center text-3xl font-bold text-primary">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <h3 className="font-bold text-lg mb-1">{member.name}</h3>
                    <p className="text-primary text-sm mb-3">{member.role}</p>
                    <p className="text-muted-foreground text-sm mb-4">{member.bio}</p>
                    <p className="text-xs text-muted-foreground italic mb-4">Placeholder profile</p>
                    <div className="flex justify-center gap-2">
                      {member.social.linkedin && (
                        <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                          <a href={member.social.linkedin} target="_blank" rel="noopener noreferrer">
                            <Linkedin className="w-4 h-4" />
                          </a>
                        </Button>
                      )}
                      {member.social.twitter && (
                        <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                          <a href={member.social.twitter} target="_blank" rel="noopener noreferrer">
                            <Twitter className="w-4 h-4" />
                          </a>
                        </Button>
                      )}
                      {member.social.github && (
                        <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                          <a href={member.social.github} target="_blank" rel="noopener noreferrer">
                            <Github className="w-4 h-4" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Advisors */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-8 text-center">Advisors</h2>
            <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              {advisors.map((advisor, index) => (
                <Card key={index} className="bg-card border-border">
                  <CardContent className="pt-6 text-center">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-secondary to-secondary/60 flex items-center justify-center text-2xl font-bold text-muted-foreground">
                      {advisor.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <h3 className="font-bold text-lg mb-1">{advisor.name}</h3>
                    <p className="text-primary text-sm mb-3">{advisor.role}</p>
                    <p className="text-muted-foreground text-sm mb-2">{advisor.bio}</p>
                    <p className="text-xs text-muted-foreground italic">Placeholder profile</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Values Strip */}
          <div className="bg-gradient-to-r from-primary/10 via-transparent to-primary/10 rounded-2xl p-8 md:p-12 mb-16">
            <h2 className="text-2xl font-bold text-center mb-8">Our Core Values</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {values.map((value, index) => (
                <div key={index} className="text-center">
                  <div className="w-14 h-14 mx-auto mb-4 gradient-primary rounded-xl flex items-center justify-center">
                    <value.icon className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{value.title}</h3>
                  <p className="text-muted-foreground text-sm">{value.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Interested in joining us?</h2>
            <p className="text-muted-foreground mb-6">
              We're always looking for talented individuals passionate about AI and finance.
            </p>
            <Link to="/contact">
              <Button variant="gradient" size="lg">
                Get in Touch
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Team;