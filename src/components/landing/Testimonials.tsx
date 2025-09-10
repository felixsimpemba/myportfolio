'use client';

import { motion } from 'framer-motion';
import { User } from 'lucide-react';

const testimonials = [
  {
    name: "Sarah K.",
    role: "UX Designer",
    quote: "MyPortfolio helped me land my dream job. The templates are stunning and so easy to customize. I had a beautiful portfolio in less than an hour!",
    avatar: null
  },
  {
    name: "David L.",
    role: "Frontend Developer",
    quote: "As a developer, I appreciate how easy it is to showcase my projects with code snippets and live demos. A must-have tool for any tech professional.",
    avatar: null
  },
  {
    name: "Maria G.",
    role: "Data Scientist",
    quote: "I'm not a designer, but with MyPortfolio, I created a professional-looking site that perfectly highlights my skills and research. Highly recommended!",
    avatar: null
  }
];

export function Testimonials() {
  return (
    <section className="py-24 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">What Our Users Say</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Trusted by professionals worldwide.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="p-8 rounded-xl bg-white/50 dark:bg-black/50 backdrop-blur-lg shadow-lg flex flex-col items-start ring-1 ring-black/5 dark:ring-white/10"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mr-4">
                  <User className="h-6 w-6 text-muted-foreground" />
                </div>
                <div>
                  <h4 className="font-bold text-lg">{testimonial.name}</h4>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-muted-foreground italic">"{testimonial.quote}"</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
