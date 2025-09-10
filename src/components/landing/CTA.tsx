'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Rocket } from 'lucide-react';

export function CTA() {
  return (
    <section className="py-24 px-4 bg-muted dark:bg-muted/20">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Build Your Masterpiece?</h2>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Join thousands of professionals who have taken their careers to the next level with a stunning portfolio.
          </p>
          <Link href="/auth/signup">
            <Button size="lg" className="text-lg px-8 py-4 shadow-lg hover:shadow-primary/50 transform hover:scale-105 transition-all duration-300">
              <Rocket className="h-5 w-5 mr-2" />
              Start for Free
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
