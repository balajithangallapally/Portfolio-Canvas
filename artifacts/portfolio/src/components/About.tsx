import { motion } from "framer-motion";
import portfolioData from "@/data/portfolio.json";
import { Terminal, Database, Server } from "lucide-react";

export function About() {
  return (
    <section id="about" className="py-24 lg:py-32 relative">
      <div className="container mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold inline-block relative mb-4 heading-gradient">
            About Me
            <div className="absolute -bottom-2 left-0 w-1/2 h-1 bg-primary rounded-full" />
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="p-8 rounded-2xl bg-card/50 backdrop-blur-sm border border-card-border shadow-lg">
              <p className="text-lg text-muted-foreground leading-relaxed">
                {portfolioData.about}
              </p>
              
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="flex flex-col gap-2">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Server size={24} />
                  </div>
                  <h3 className="font-semibold">Backend Focus</h3>
                  <p className="text-sm text-muted-foreground">Building efficient & scalable architectures</p>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                    <Database size={24} />
                  </div>
                  <h3 className="font-semibold">Data Science</h3>
                  <p className="text-sm text-muted-foreground">Extracting insights & processing data</p>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                    <Terminal size={24} />
                  </div>
                  <h3 className="font-semibold">REST APIs</h3>
                  <p className="text-sm text-muted-foreground">Designing robust communication layers</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="relative aspect-square max-w-md mx-auto w-full"
          >
            {/* Abstract Geometric Visual */}
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-full blur-3xl" />
            <div className="absolute inset-4 rounded-full border border-primary/30 animate-[spin_20s_linear_infinite]" />
            <div className="absolute inset-12 rounded-full border border-secondary/30 animate-[spin_15s_linear_infinite_reverse]" />
            <div className="absolute inset-20 bg-card/80 backdrop-blur-md rounded-2xl border border-card-border shadow-2xl flex flex-col items-center justify-center p-8 rotate-3 hover:rotate-0 transition-transform duration-500 cursor-pointer">
              <Terminal className="w-16 h-16 text-primary mb-4" />
              <div className="font-mono text-sm text-muted-foreground text-center">
                <span className="text-primary">const</span> <span className="text-secondary">developer</span> = {"{"}
                <br />
                &nbsp;&nbsp;focus: <span className="text-accent">"Backend"</span>,
                <br />
                &nbsp;&nbsp;passion: <span className="text-accent">"Data"</span>,
                <br />
                &nbsp;&nbsp;drive: <span className="text-accent">"Scale"</span>
                <br />
                {"}"};
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
