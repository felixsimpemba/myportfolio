'use client';

import React from 'react';
import { useLoading } from '@/lib/LoadingContext';
import { RoutingLoader } from '@/components/ui/RoutingLoader';

interface LoadingWrapperProps {
  children: React.ReactNode;
}

export const LoadingWrapper: React.FC<LoadingWrapperProps> = ({ children }) => {
  const { isRouting } = useLoading();

  return (
    <>
      <RoutingLoader isLoading={isRouting} />
      {children}
    </>
  );
};



