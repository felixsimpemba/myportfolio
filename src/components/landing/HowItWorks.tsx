'use client';

import { motion } from 'framer-motion';
import { PenTool, Eye, Rocket } from 'lucide-react';

const steps = [
  {
    icon: PenTool,
    title: "1. Create & Customize",
    description: "Sign up and start building your portfolio. Choose a template, add your content, and customize the design to match your personal brand.",
  },
  {
    icon: Eye,
    title: "2. Preview & Refine",
    description: "Use the live preview to see your changes in real-time. Tweak the layout, colors, and fonts until you're perfectly happy with the result.",
  },
  {
    icon: Rocket,
    title: "3. Launch & Share",
    description: "Publish your portfolio to get a shareable link. Showcase your work to the world and track who is viewing your profile.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-24 px-4 bg-muted dark:bg-muted/20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Get Started in 3 Simple Steps</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From zero to a stunning portfolio in minutes.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="p-8"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <div className="w-24 h-24 bg-background rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-primary/20">
                <step.icon className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
