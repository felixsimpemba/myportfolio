'use client';

import { motion } from 'framer-motion';

export function ScrollingText() {
  const text = ["Design.", "Develop.", "Deploy.", "Impress."];

  return (
    <section className="py-12 bg-muted dark:bg-muted/20 overflow-hidden">
      <div className="flex whitespace-nowrap">
        <motion.div 
          className="flex"
          animate={{
            x: ['0%', '-100%'],
          }}
          transition={{
            ease: 'linear',
            duration: 20,
            repeat: Infinity,
          }}
        >
          {text.map((t, i) => <h2 key={i} className="text-4xl font-bold text-muted-foreground mx-8">{t}</h2>)}
          {text.map((t, i) => <h2 key={i + text.length} className="text-4xl font-bold text-muted-foreground mx-8">{t}</h2>)}
        </motion.div>
      </div>
    </section>
  );
}
