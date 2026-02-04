import { motion } from "framer-motion";

interface ProductCardProps {
  name: string;
  price: string;
  dailyProfit: string;
  image: string;
  tier: string;
  index: number;
}

const ProductCard = ({ name, price, dailyProfit, image, tier, index }: ProductCardProps) => {
  return (
    <motion.div
      className="group relative glass-card-glow rounded-2xl p-6 hover:-translate-y-2 transition-all duration-300 cursor-pointer min-w-[280px] md:min-w-[320px]"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      whileHover={{ 
        boxShadow: "0 0 40px hsl(38 95% 55% / 0.3), 0 0 80px hsl(25 100% 55% / 0.2)" 
      }}
    >
      {/* Tier Badge */}
      <div className="absolute top-4 right-4 gradient-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
        {tier}
      </div>

      {/* Robot/Dragon Image */}
      <div className="relative mb-6">
        <div className="w-24 h-24 mx-auto rounded-2xl gradient-glow flex items-center justify-center text-5xl">
          {image}
        </div>
        {/* Glow Effect */}
        <div className="absolute inset-0 rounded-2xl bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Card Content */}
      <div className="text-center space-y-3">
        <h3 className="text-xl font-bold font-display">{name}</h3>
        
        <div className="space-y-1">
          <p className="text-3xl font-bold text-gradient">{price}</p>
          <p className="text-sm text-muted-foreground">USDT</p>
        </div>

        <div className="glass-card rounded-lg px-4 py-2 inline-block">
          <p className="text-sm text-muted-foreground">Daily Profit</p>
          <p className="text-xl font-bold text-primary">{dailyProfit}</p>
        </div>
      </div>

      {/* Hover Border Glow */}
      <div className="absolute inset-0 rounded-2xl border border-transparent group-hover:border-primary/50 transition-colors pointer-events-none" />
    </motion.div>
  );
};

const products = [
  { name: "Emerald Egg", price: "100", dailyProfit: "3%", image: "🥚", tier: "P1" },
  { name: "Fire Hatchling", price: "250", dailyProfit: "3.5%", image: "🐣", tier: "P2" },
  { name: "Storm Drake", price: "500", dailyProfit: "4%", image: "🐲", tier: "P3" },
  { name: "Ancient Dragon", price: "1000", dailyProfit: "4.5%", image: "🐉", tier: "P4" },
  { name: "Elder Master", price: "5000", dailyProfit: "5%", image: "👑", tier: "P5" },
];

const ProductsSection = () => {
  return (
    <section className="py-20 md:py-32 relative overflow-hidden" id="products">
      {/* Background Effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[150px]" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 font-display">
            Choose Your{" "}
            <span className="text-gradient">Guardian Dragon</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Select your AI trading robot tier and start earning passive income today.
          </p>
        </motion.div>

        {/* Products Horizontal Scroll */}
        <div className="relative">
          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
            {products.map((product, index) => (
              <div key={product.name} className="snap-center flex-shrink-0">
                <ProductCard {...product} index={index} />
              </div>
            ))}
          </div>
          
          {/* Scroll Fade Indicators */}
          <div className="absolute left-0 top-0 bottom-4 w-12 bg-gradient-to-r from-background to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-background to-transparent pointer-events-none" />
        </div>

        {/* View All Button */}
        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <a 
            href="/packages" 
            className="inline-flex items-center gap-2 text-primary hover:text-accent transition-colors font-medium"
          >
            View All 10 Packages
            <span className="text-xl">→</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default ProductsSection;
