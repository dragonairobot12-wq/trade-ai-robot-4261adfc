import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "James Wilson",
    role: "Entrepreneur",
    image: "JW",
    content: "WealthAI has completely changed my approach to investing. The AI consistently delivers impressive returns without me having to do anything.",
    rating: 5,
  },
  {
    name: "Sarah Chen",
    role: "Software Engineer",
    image: "SC",
    content: "I was skeptical at first, but the transparent dashboard and regular profits convinced me. Best investment decision I've made.",
    rating: 5,
  },
  {
    name: "Michael Brown",
    role: "Business Owner",
    image: "MB",
    content: "The VIP package has exceeded my expectations. The AI trading strategies are sophisticated and the support team is excellent.",
    rating: 5,
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-20 md:py-32 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            What Our <span className="text-gradient">Investors</span> Say
          </h2>
          <p className="text-lg text-muted-foreground">
            Join thousands of satisfied investors who trust WealthAI
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="relative p-6 md:p-8 bg-card rounded-2xl border border-border shadow-sm hover:shadow-lg transition-all duration-300"
            >
              <Quote className="absolute top-6 right-6 w-8 h-8 text-primary/20" />
              
              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-warning text-warning" />
                ))}
              </div>

              {/* Content */}
              <p className="text-foreground mb-6">"{testimonial.content}"</p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 gradient-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold">
                  {testimonial.image}
                </div>
                <div>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
