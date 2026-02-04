import { motion } from "framer-motion";
import { Linkedin, Twitter } from "lucide-react";
import alexChenImg from "@/assets/team/alex-chen.jpg";
import sarahMitchellImg from "@/assets/team/sarah-mitchell.jpg";
import davidParkImg from "@/assets/team/david-park.jpg";
import elenaRodriguezImg from "@/assets/team/emma-rodriguez.jpg";
const teamMembers = [{
  name: "Alex Chen",
  role: "CEO & Founder",
  image: alexChenImg,
  bio: "Former Goldman Sachs quant with 15+ years in algorithmic trading.",
  linkedin: "#",
  twitter: "#"
}, {
  name: "Sarah Mitchell",
  role: "CTO",
  image: sarahMitchellImg,
  bio: "Ex-Google AI researcher, PhD in Machine Learning from MIT.",
  linkedin: "#",
  twitter: "#"
}, {
  name: "Marcus Johnson",
  role: "Lead Blockchain Dev",
  image: davidParkImg,
  bio: "Core contributor to Ethereum. 10+ years in DeFi development.",
  linkedin: "#",
  twitter: "#"
}, {
  name: "Elena Rodriguez",
  role: "Head of Risk",
  image: elenaRodriguezImg,
  bio: "Former JP Morgan risk manager. CFA charterholder.",
  linkedin: "#",
  twitter: "#"
}];
const TeamSection = () => {
  return <section className="py-20 md:py-32 relative overflow-hidden" id="team">
      {/* Background Effects */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary/5 rounded-full blur-[150px] -translate-y-1/2" />
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-accent/5 rounded-full blur-[150px] -translate-y-1/2" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div className="text-center max-w-3xl mx-auto mb-16" initial={{
        opacity: 0,
        y: 30
      }} whileInView={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.6
      }} viewport={{
        once: true
      }}>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 font-display">
            The Minds Behind{" "}
            <span className="text-gradient">The Magic</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            World-class experts in AI, blockchain, and quantitative finance.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => <motion.div key={member.name} className="group text-center" initial={{
          opacity: 0,
          y: 50
        }} whileInView={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.5,
          delay: index * 0.1
        }} viewport={{
          once: true
        }}>
              {/* Profile Image */}
              <div className="relative mx-auto mb-6">
                <div className="w-32 h-32 mx-auto rounded-full overflow-hidden glass-card-glow group-hover:shadow-glow transition-shadow duration-300">
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                </div>
                {/* Glow Ring */}
                <div className="absolute inset-0 rounded-full border-2 border-transparent group-hover:border-primary/50 transition-colors" />
              </div>

              {/* Info */}
              <h3 className="text-xl font-bold mb-1">{member.name}</h3>
              <p className="text-primary font-medium mb-3">{member.role}</p>
              <p className="text-sm text-muted-foreground mb-4 max-w-xs mx-auto">
                {member.bio}
              </p>

              {/* Social Links */}
              
            </motion.div>)}
        </div>
      </div>
    </section>;
};
export default TeamSection;