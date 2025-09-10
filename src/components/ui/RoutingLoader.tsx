'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';

interface RoutingLoaderProps {
  isLoading: boolean;
}

export const RoutingLoader: React.FC<RoutingLoaderProps> = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        {/* Animated Logo */}
        <div className="relative">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/25 animate-pulse-glow">
            <Sparkles className="h-8 w-8 text-white animate-spin" />
          </div>
          {/* Rotating ring */}
          <div className="absolute -inset-2 rounded-2xl border-2 border-emerald-200 dark:border-emerald-800 animate-spin"></div>
        </div>
        
        {/* Loading Text */}
        <p className="text-slate-600 dark:text-slate-300 font-medium animate-pulse">
          Loading...
        </p>
      </div>
    </div>
  );
};

