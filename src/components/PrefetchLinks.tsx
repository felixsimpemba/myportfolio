'use client';

import Link from 'next/link';
import { useEffect } from 'react';

const dashboardRoutes = [
  '/dashboard',
  '/dashboard/profile',
  '/dashboard/experience',
  '/dashboard/education',
  '/dashboard/skills',
  '/dashboard/projects',
  '/dashboard/theme',
  '/portfolio',
];

export const PrefetchLinks = () => {
  useEffect(() => {
    // Prefetch all dashboard routes when component mounts
    dashboardRoutes.forEach(route => {
      // Create a hidden link to trigger prefetching
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = route;
      document.head.appendChild(link);
    });
  }, []);

  return null;
};
