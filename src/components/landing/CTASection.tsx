import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, FileText, Calendar, FolderOpen } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 gradient-dark" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/30 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/30 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 bg-primary/20 text-primary-foreground px-4 py-2 rounded-full text-sm font-medium">
            <FileText className="w-4 h-4" />
            For Investors & Partners
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground">
            Ready to Learn More?
          </h2>

          <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto">
            Get our comprehensive investor deck or schedule a call to discuss how Dragon AI Robot fits your investment thesis.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link to="/investors#request-form">
              <Button size="xl" className="bg-card text-foreground hover:bg-card/90 group">
                <FileText className="w-5 h-5 mr-2" />
                Get the Deck
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="xl" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                <Calendar className="w-5 h-5 mr-2" />
                Book a 15-min Call
              </Button>
            </Link>
          </div>

          {/* Data Room Teaser */}
          <div className="pt-8">
            <Link 
              to="/investors" 
              className="inline-flex items-center gap-2 text-primary-foreground/70 hover:text-primary-foreground transition-colors text-sm"
            >
              <FolderOpen className="w-4 h-4" />
              <span>Access Data Room →</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
