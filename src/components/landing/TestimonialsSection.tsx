import { Users, Activity, Handshake, Calendar, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const progressMetrics = [
  {
    icon: Users,
    value: "2,500+",
    label: "Waitlist Signups",
    note: "Placeholder until verified",
  },
  {
    icon: Activity,
    value: "50,000+",
    label: "Backtest Runs",
    note: "Placeholder until verified",
  },
  {
    icon: Handshake,
    value: "3",
    label: "Pilot Partners",
    note: "Placeholder until verified",
  },
  {
    icon: Calendar,
    value: "18+",
    label: "Months in Development",
    note: "Placeholder until verified",
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-20 md:py-32 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Progress & <span className="text-gradient">Proof</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Key milestones and traction metrics demonstrating our momentum
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {progressMetrics.map((metric, index) => (
            <div
              key={index}
              className="group p-6 md:p-8 bg-card rounded-2xl border border-border shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-center"
            >
              <div className="w-14 h-14 gradient-primary rounded-xl flex items-center justify-center mb-6 mx-auto group-hover:shadow-glow transition-shadow">
                <metric.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              <p className="text-3xl md:text-4xl font-bold text-primary mb-2">{metric.value}</p>
              <p className="text-lg font-medium mb-2">{metric.label}</p>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="inline-flex items-center gap-1 text-xs text-muted-foreground cursor-help">
                    <Info className="w-3 h-3" />
                    <span>{metric.note}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>This metric will be updated with verified data</p>
                </TooltipContent>
              </Tooltip>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
