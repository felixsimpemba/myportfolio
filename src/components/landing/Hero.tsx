'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ArrowRight, Rocket } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative h-screen w-full flex items-center justify-center text-center overflow-hidden bg-background">
      <div className="absolute inset-0 w-full h-full bg-grid-pattern opacity-10 dark:opacity-5"></div>
      <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-transparent to-background"></div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
        className="relative z-10 px-4"
      >
        <motion.h1 
          className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeInOut' }}
        >
          Your Portfolio, Reimagined.
        </motion.h1>
        <motion.p 
          className="text-lg md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: 'easeInOut' }}
        >
          The ultimate platform to showcase your skills, projects, and personality. Create a stunning portfolio that stands out and gets you noticed.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: 'easeInOut' }}
        >
          <Link href="/auth/signup">
            <Button size="lg" className="text-lg px-8 py-4 shadow-lg hover:shadow-primary/50 transform hover:scale-105 transition-all duration-300">
              <Rocket className="h-5 w-5 mr-2" />
              Get Started Now
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
