import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Is my capital safe?",
    answer: "Your funds are secured through multi-signature wallets and cold storage. We use enterprise-grade security protocols and regular third-party audits to ensure maximum protection. All investments are backed by smart contract escrows."
  },
  {
    question: "What is the minimum withdrawal?",
    answer: "The minimum withdrawal amount is 10 USDT. Withdrawals are processed within 24-48 hours and sent directly to your connected wallet. There's a small network fee that varies based on blockchain congestion."
  },
  {
    question: "How does the AI work?",
    answer: "Our Dragon AI uses advanced machine learning algorithms trained on millions of historical trades. It analyzes market patterns, sentiment data, and technical indicators in real-time to execute optimal trades 24/7. The AI continuously learns and adapts to market conditions."
  },
  {
    question: "Can I withdraw at any time?",
    answer: "Yes, you can request a withdrawal at any time. However, for optimal returns, we recommend keeping your investment active for the full package duration. Early withdrawals may have reduced returns."
  },
  {
    question: "What currencies are supported?",
    answer: "We currently support USDT (TRC-20 and ERC-20) for deposits and withdrawals. We're working on adding support for additional cryptocurrencies including BTC, ETH, and BNB in the near future."
  },
  {
    question: "How do I contact support?",
    answer: "You can reach our 24/7 support team via Telegram, email at support@dragonairobot.com, or through the contact form on our website. Our average response time is under 2 hours."
  }
];

const FAQSection = () => {
  return (
    <section className="py-20 md:py-32 relative overflow-hidden bg-secondary/30" id="faq">
      {/* Background Effects */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[150px]" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 font-display">
            Frequently Asked{" "}
            <span className="text-gradient">Questions</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Got questions? We've got answers.
          </p>
        </motion.div>

        <motion.div 
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="glass-card-glow rounded-xl px-6 border-0 overflow-hidden"
              >
                <AccordionTrigger className="text-left text-lg font-semibold hover:text-primary transition-colors py-6 hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>

        {/* Disclaimer */}
        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <p className="text-xs text-muted-foreground/60 max-w-2xl mx-auto">
            *All performance data shown is simulated/backtested unless verified. This platform does not provide financial advice. 
            Past performance does not guarantee future results. Trading involves risk.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;
