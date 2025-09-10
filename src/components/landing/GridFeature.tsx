'use client';

import { motion } from 'framer-motion';
import { User, Briefcase, Code, Palette, Eye, Share2 } from 'lucide-react';

const features = [
  {
    icon: User,
    title: "AI-Powered Builder",
    description: "Let our AI assist you in crafting the perfect narrative for your profile.",
  },
  {
    icon: Palette,
    title: "Stunning Templates",
    description: "Choose from a variety of modern, fully customizable templates.",
  },
  {
    icon: Briefcase,
    title: "Experience Timeline",
    description: "Showcase your career journey with an interactive and dynamic timeline.",
  },
  {
    icon: Code,
    title: "Project Showcase",
    description: "Display your projects with rich media, code snippets, and live demos.",
  },
  {
    icon: Eye,
    title: "Live Preview",
    description: "See your changes in real-time as you build and customize your portfolio.",
  },
  {
    icon: Share2,
    title: "Easy Sharing",
    description: "Share your portfolio with a single click and track its performance.",
  },
];

export function GridFeature() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  };

  return (
    <section className="py-24 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Everything You Need, and More</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            A comprehensive suite of tools to build a portfolio that truly shines.
          </p>
        </div>
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((feature, index) => (
            <motion.div 
              key={index} 
              className="p-8 rounded-xl bg-white/50 dark:bg-black/50 backdrop-blur-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 ring-1 ring-black/5 dark:ring-white/10 hover:ring-primary/50"
              variants={itemVariants}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl flex items-center justify-center mb-6">
                <feature.icon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
