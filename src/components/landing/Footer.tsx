'use client';

import Link from 'next/link';
import { Sparkles, Twitter, Github, Linkedin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="py-16 px-4 border-t border-border/10 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold">MyPortfolio</h3>
            </div>
            <p className="text-muted-foreground text-lg max-w-md">
              The ultimate tool for modern professionals.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-6">Product</h4>
            <ul className="space-y-3">
              <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Features</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Templates</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Pricing</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-6">Connect</h4>
            <ul className="space-y-3">
              <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Contact</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Blog</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm">
            © 2024 MyPortfolio. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="#"><Twitter className="h-5 w-5 text-muted-foreground hover:text-primary" /></Link>
            <Link href="#"><Github className="h-5 w-5 text-muted-foreground hover:text-primary" /></Link>
            <Link href="#"><Linkedin className="h-5 w-5 text-muted-foreground hover:text-primary" /></Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
