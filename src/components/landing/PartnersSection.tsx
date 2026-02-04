import { motion } from "framer-motion";

const partners = [
  { name: "Binance", logo: "◆" },
  { name: "Tron", logo: "◈" },
  { name: "Coinbase", logo: "◎" },
  { name: "Tether", logo: "₮" },
  { name: "MetaMask", logo: "🦊" },
  { name: "Trust Wallet", logo: "🛡️" },
  { name: "Ethereum", logo: "⟠" },
  { name: "Bitcoin", logo: "₿" },
];

const PartnersSection = () => {
  // Duplicate for seamless loop
  const duplicatedPartners = [...partners, ...partners];

  return (
    <section className="py-16 md:py-24 relative overflow-hidden border-y border-border/50">
      {/* Subtle Background */}
      <div className="absolute inset-0 bg-secondary/30" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl md:text-3xl font-bold font-display mb-2">
            Trusted by{" "}
            <span className="text-gradient">Global Giants</span>
          </h2>
          <p className="text-muted-foreground">
            Integrated with leading blockchain platforms
          </p>
        </motion.div>

        {/* Marquee Container */}
        <div className="relative">
          {/* Fade Edges */}
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
          
          {/* Scrolling Marquee */}
          <div className="overflow-hidden">
            <motion.div 
              className="flex gap-16 items-center"
              animate={{ x: [0, -1200] }}
              transition={{ 
                duration: 30, 
                repeat: Infinity, 
                ease: "linear" 
              }}
            >
              {duplicatedPartners.map((partner, index) => (
                <div 
                  key={`${partner.name}-${index}`}
                  className="flex items-center gap-3 opacity-50 hover:opacity-100 transition-opacity cursor-pointer whitespace-nowrap"
                >
                  <span className="text-4xl filter grayscale hover:grayscale-0 transition-all">
                    {partner.logo}
                  </span>
                  <span className="text-xl font-semibold text-muted-foreground">
                    {partner.name}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;
