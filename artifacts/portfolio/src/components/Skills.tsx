import { motion } from "framer-motion";
import portfolioData from "@/data/portfolio.json";
import { Code2, Layout, Database, Wrench, Cpu } from "lucide-react";

const skillCategories = [
  { id: "languages", title: "Languages", icon: <Code2 className="w-5 h-5" />, color: "text-blue-400" },
  { id: "frontend", title: "Frontend", icon: <Layout className="w-5 h-5" />, color: "text-teal-400" },
  { id: "backend", title: "Backend", icon: <Database className="w-5 h-5" />, color: "text-indigo-400" },
  { id: "tools", title: "Tools", icon: <Wrench className="w-5 h-5" />, color: "text-orange-400" },
  { id: "core", title: "Core CS", icon: <Cpu className="w-5 h-5" />, color: "text-purple-400" },
];

export function Skills() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section id="skills" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold inline-block relative mb-4">
            Technical Arsenal
            <div className="absolute -bottom-2 left-1/4 right-1/4 h-1 bg-primary rounded-full" />
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mt-4">
            Tools and technologies I use to build robust and scalable applications.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {skillCategories.map((category) => (
            <motion.div
              key={category.id}
              variants={itemVariants}
              className="bg-card border border-card-border rounded-xl p-6 shadow-sm hover:shadow-xl hover:border-primary/50 transition-all duration-300 group"
            >
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/50">
                <div className={`p-2 rounded-lg bg-muted ${category.color} group-hover:scale-110 group-hover:bg-background transition-all`}>
                  {category.icon}
                </div>
                <h3 className="text-xl font-semibold">{category.title}</h3>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {(portfolioData.skills as any)[category.id].map((skill: string) => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 text-sm font-medium rounded-md bg-muted text-foreground border border-border hover:border-primary/50 hover:text-primary hover:bg-primary/5 cursor-default transition-colors"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
