import { motion } from "framer-motion";
import portfolioData from "@/data/portfolio.json";
import { GraduationCap, Calendar, Building } from "lucide-react";

export function Education() {
  return (
    <section className="py-12 relative">
      <div className="container mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <div className="p-8 rounded-2xl bg-card border border-card-border shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <GraduationCap className="w-32 h-32" />
            </div>
            
            <h3 className="text-sm font-semibold uppercase tracking-widest text-primary mb-6 flex items-center gap-2">
              <GraduationCap className="w-4 h-4" />
              Education
            </h3>
            
            <div className="relative z-10 border-l-2 border-primary/30 pl-6 pb-2">
              <div className="absolute w-3 h-3 rounded-full bg-primary -left-[7px] top-1.5 shadow-[0_0_10px_rgba(0,240,255,0.8)]" />
              
              <h4 className="text-xl md:text-2xl font-bold mb-2 text-foreground">
                {portfolioData.education.degree}
              </h4>
              
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-muted-foreground mb-4">
                <span className="flex items-center gap-2">
                  <Building className="w-4 h-4" />
                  {portfolioData.education.institute}
                </span>
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Expected {portfolioData.education.year}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
