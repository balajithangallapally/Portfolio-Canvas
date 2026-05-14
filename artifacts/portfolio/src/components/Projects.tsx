import { useState } from "react";
import { motion } from "framer-motion";
import portfolioData from "@/data/portfolio.json";
import { Github, ExternalLink, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProjectModal } from "./ProjectModal";

export function Projects() {
  const [selectedProject, setSelectedProject] = useState<any>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <section id="projects" className="py-24 relative">
      <div className="container mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold inline-block relative mb-4">
            Featured Projects
            <div className="absolute -bottom-2 left-0 w-1/2 h-1 bg-primary rounded-full" />
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl">
            A selection of my recent work focusing on scalable backend systems and intelligent processing.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {portfolioData.projects.map((project, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group relative flex flex-col justify-between p-6 bg-card border border-card-border rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_10px_40px_-15px_rgba(0,240,255,0.2)] hover:border-primary/40 cursor-pointer"
              onClick={() => setSelectedProject(project)}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-10 -mt-10 transition-opacity group-hover:bg-primary/20" />
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{project.name}</h3>
                  <ArrowRight className="w-5 h-5 text-muted-foreground opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                </div>
                
                <p className="text-muted-foreground text-sm mb-6 line-clamp-3">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-8">
                  {project.tech.slice(0, 3).map((tech) => (
                    <Badge key={tech} variant="outline" className="bg-background/50 border-border">
                      {tech}
                    </Badge>
                  ))}
                  {project.tech.length > 3 && (
                    <Badge variant="outline" className="bg-background/50 border-border text-muted-foreground">
                      +{project.tech.length - 3}
                    </Badge>
                  )}
                </div>
              </div>

              <div className="relative z-10 flex items-center gap-3 mt-auto pt-4 border-t border-border/50">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="p-0 h-auto hover:bg-transparent hover:text-primary z-20"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (project.github) window.open(project.github, "_blank");
                  }}
                  disabled={!project.github}
                >
                  <Github className="w-4 h-4 mr-2" />
                  Code
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="p-0 h-auto hover:bg-transparent hover:text-primary z-20"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (project.live) window.open(project.live, "_blank");
                  }}
                  disabled={!project.live}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Live
                </Button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <ProjectModal 
        project={selectedProject} 
        isOpen={!!selectedProject} 
        onClose={() => setSelectedProject(null)} 
      />
    </section>
  );
}
