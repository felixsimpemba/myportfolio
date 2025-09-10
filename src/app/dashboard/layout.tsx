'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/ui/Sidebar';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useLoading } from '@/lib/LoadingContext';
import { useAuth } from '@/lib/AuthContext';
import { logout } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { Menu, Sparkles, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { PrefetchLinks } from '@/components/PrefetchLinks';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { startLoading, stopLoading } = useLoading();
  const { user } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  useEffect(() => {
    // Show loading briefly when navigating to dashboard
    startLoading();
    
    // Stop loading quickly for better UX
    const timer = setTimeout(() => {
      stopLoading();
    }, 200);

    return () => clearTimeout(timer);
  }, [startLoading, stopLoading]);

  return (
    <ProtectedRoute>
      <PrefetchLinks />
      <div className="min-h-screen bg-background text-foreground dark:bg-slate-900 relative overflow-hidden">
        {/* Animated background elements matching landing page */}
        <div className="absolute inset-0 w-full h-full">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/20 via-transparent to-teal-100/20 dark:from-emerald-900/10 dark:to-teal-900/10 animate-gradient-xy"></div>
          <div className="absolute top-1/4 left-1/4 w-32 h-32 sm:w-64 sm:h-64 bg-gradient-radial from-emerald-400/10 to-transparent animate-float"></div>
          <div className="absolute bottom-1/4 right-1/4 w-24 h-24 sm:w-48 sm:h-48 bg-gradient-to-br from-teal-400/10 to-amber-400/5 rounded-full animate-float" style={{animationDelay: '2s'}}></div>
        </div>
        
        {/* Top Navigation Bar */}
        <div className="relative z-20 bg-white/60 dark:bg-slate-800/60 backdrop-blur-lg border-b border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center justify-between px-4 sm:px-6 py-4">
            {/* Left side - Menu button and Logo */}
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(true)}
                className="p-2 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
              >
                <Menu className="h-5 w-5 text-slate-600 dark:text-slate-400" />
              </Button>
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/25">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">MyPortfolio</span>
              </div>
            </div>

            {/* Right side - User info and actions */}
            <div className="flex items-center gap-4">
              <ThemeSwitcher />
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/50 dark:to-teal-900/50 rounded-lg flex items-center justify-center">
                  <User className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{user?.displayName || 'User'}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{user?.email || ''}</p>
                </div>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="border-slate-200 dark:border-slate-700 hover:border-red-300 dark:hover:border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-all duration-300"
              >
                <LogOut className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
        
        <div className="relative z-10">
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          
          <main className="p-4 sm:p-6">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
