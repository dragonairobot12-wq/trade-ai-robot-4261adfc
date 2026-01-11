import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "How does WealthAI's trading algorithm work?",
    answer: "Our AI trading system uses advanced machine learning algorithms that analyze market data, price patterns, and global economic indicators in real-time. The system makes thousands of micro-decisions per second to optimize your returns while managing risk according to your chosen investment package.",
  },
  {
    question: "What is the minimum investment amount?",
    answer: "The minimum investment starts at $100 with our Starter Package. We offer 8 different investment tiers ranging from $100 to $5,000, each with increasing ROI potential and advanced AI trading strategies.",
  },
  {
    question: "How and when can I withdraw my profits?",
    answer: "You can request a withdrawal at any time through your dashboard. Withdrawals are typically processed within 24-48 hours on business days. There are no hidden fees, and you can withdraw your initial investment plus profits after the investment period ends.",
  },
  {
    question: "Is my investment secure?",
    answer: "Absolutely. We use bank-grade 256-bit SSL encryption to protect all transactions and personal data. Your funds are held in segregated accounts, and our platform undergoes regular security audits. We also offer insurance protection on higher-tier packages.",
  },
  {
    question: "What returns can I expect?",
    answer: "Returns vary based on your chosen package, ranging from 15% to 45% monthly ROI. However, please note that all trading involves risk, and past performance is not a guarantee of future results. Our AI optimizes for consistent returns while managing risk exposure.",
  },
  {
    question: "How do I track my investment performance?",
    answer: "Your personal dashboard provides real-time updates on your investment performance, including daily profits, total returns, AI trading activity, and transaction history. You'll also receive email notifications for significant events.",
  },
  {
    question: "Can I have multiple active investments?",
    answer: "Yes! You can invest in multiple packages simultaneously to diversify your portfolio. Each investment operates independently with its own AI trading strategy optimized for that tier's parameters.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept major cryptocurrencies (Bitcoin, Ethereum, USDT) as well as bank transfers and credit/debit cards. All payment methods are secure and processed through trusted payment gateways.",
  },
  {
    question: "Is there a referral program?",
    answer: "Yes! Our referral program rewards you with bonuses when friends you refer make their first investment. You'll receive a percentage of their initial deposit as a bonus added to your account.",
  },
  {
    question: "What happens if I have issues with my account?",
    answer: "Our support team is available 24/7 to assist you. You can reach us through live chat, email, or phone. VIP package holders receive priority support with dedicated account managers.",
  },
];

const FAQ = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-24 md:pt-28 pb-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <HelpCircle className="w-4 h-4" />
              Got Questions?
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Frequently Asked <span className="text-gradient">Questions</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Find answers to common questions about our AI trading platform and investment packages.
            </p>
          </div>

          {/* FAQ Accordion */}
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="bg-card border border-border rounded-xl px-6 data-[state=open]:shadow-md transition-shadow"
                >
                  <AccordionTrigger className="text-left hover:no-underline py-5">
                    <span className="font-semibold">{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-5">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* Still Have Questions */}
          <div className="mt-16 text-center">
            <p className="text-muted-foreground mb-4">
              Still have questions? We're here to help!
            </p>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
            >
              Contact our support team
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FAQ;
