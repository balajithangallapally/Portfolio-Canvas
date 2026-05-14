import { useState } from "react";
import { motion } from "framer-motion";
import portfolioData from "@/data/portfolio.json";
import { Mail, Github, Linkedin, Copy, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export function Contact() {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText(portfolioData.links.email);
    setCopied(true);
    toast({
      title: "Email copied!",
      description: "Ready to paste in your email client.",
      duration: 3000,
    });
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <section id="contact" className="py-32 relative border-t border-white/10">
      <div className="container mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center"
        >
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-6">
            <Mail className="w-6 h-6 text-primary" />
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Let's Build Something</h2>
          
          <p className="text-lg text-muted-foreground mb-12">
            I'm currently looking for new opportunities. Whether you have a question or just want to say hi, I'll try my best to get back to you!
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Button
              size="lg"
              className="w-full sm:w-auto text-base font-semibold px-8 py-6 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_20px_rgba(0,240,255,0.2)] hover:shadow-[0_0_30px_rgba(0,240,255,0.4)] transition-all"
              asChild
            >
              <a href={`mailto:${portfolioData.links.email}`}>Say Hello</a>
            </Button>
            
            <div className="flex items-center bg-card border border-border rounded-full px-4 py-2 w-full sm:w-auto shadow-sm">
              <span className="text-sm font-mono text-muted-foreground mr-4 pl-2">
                {portfolioData.links.email}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={copyEmail}
                className="h-8 w-8 rounded-full hover:bg-primary/10 hover:text-primary transition-colors"
                aria-label="Copy email"
              >
                {copied ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-center gap-6">
            <a
              href={portfolioData.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center gap-2"
            >
              <div className="w-14 h-14 rounded-2xl bg-card border border-border flex items-center justify-center text-foreground group-hover:text-primary group-hover:border-primary group-hover:-translate-y-1 transition-all shadow-sm group-hover:shadow-[0_5px_20px_rgba(0,240,255,0.2)]">
                <Github size={24} />
              </div>
              <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">GitHub</span>
            </a>
            
            <a
              href={portfolioData.links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center gap-2"
            >
              <div className="w-14 h-14 rounded-2xl bg-card border border-border flex items-center justify-center text-foreground group-hover:text-secondary group-hover:border-secondary group-hover:-translate-y-1 transition-all shadow-sm group-hover:shadow-[0_5px_20px_rgba(124,58,237,0.2)]">
                <Linkedin size={24} />
              </div>
              <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">LinkedIn</span>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
