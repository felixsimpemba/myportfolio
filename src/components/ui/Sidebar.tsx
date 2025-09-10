'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';
import {
  User,
  Briefcase,
  GraduationCap,
  Code,
  FolderOpen,
  Palette,
  Eye,
  X,
  Sparkles,
  ArrowRight,
  Home,
} from 'lucide-react';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const navigationItems = [
  { name: 'Dashboard', href: '/dashboard', icon: Home, description: 'Overview & Stats' },
  { name: 'Profile Info', href: '/dashboard/profile', icon: User, description: 'Personal Details' },
  { name: 'Experience', href: '/dashboard/experience', icon: Briefcase, description: 'Work History' },
  { name: 'Education', href: '/dashboard/education', icon: GraduationCap, description: 'Academic Background' },
  { name: 'Skills', href: '/dashboard/skills', icon: Code, description: 'Technical Skills' },
  { name: 'Projects', href: '/dashboard/projects', icon: FolderOpen, description: 'Portfolio Projects' },
  { name: 'Theme Settings', href: '/dashboard/theme', icon: Palette, description: 'Customize Design' },
  { name: 'Preview Portfolio', href: '/portfolio', icon: Eye, description: 'View Live Site' },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen = false, onClose }) => {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={clsx(
          'fixed inset-y-0 left-0 z-50 w-80 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-r border-slate-200/50 dark:border-slate-700/50 shadow-2xl transform transition-all duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200/50 dark:border-slate-700/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/25">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">MyPortfolio</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Dashboard</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-all duration-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  prefetch={true}
                  onClick={() => onClose?.()}
                  className={clsx(
                    'group flex items-center px-4 py-4 text-sm font-medium rounded-xl transition-all duration-300 hover:scale-105 w-full text-left',
                    isActive
                      ? 'bg-gradient-to-r from-emerald-500/10 to-teal-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 shadow-lg shadow-emerald-500/10'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50 hover:text-slate-800 dark:hover:text-slate-200'
                  )}
                >
                  <div className={clsx(
                    'p-2 rounded-lg mr-4 transition-all duration-300 group-hover:scale-110',
                    isActive
                      ? 'bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/50 dark:to-teal-900/50 text-emerald-600 dark:text-emerald-400'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/50 group-hover:text-emerald-600 dark:group-hover:text-emerald-400'
                  )}>
                    <item.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors duration-300">
                      {item.description}
                    </p>
                  </div>
                  {isActive && (
                    <ArrowRight className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-6 border-t border-slate-200/50 dark:border-slate-700/50">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/50 dark:to-teal-900/50 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Sparkles className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200">MyPortfolio v1.0</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Built with ❤️ for creators</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
