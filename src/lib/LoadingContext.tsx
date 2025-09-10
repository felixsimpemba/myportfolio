'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LoadingContextType {
  isLoading: boolean;
  isRouting: boolean;
  setLoading: (loading: boolean) => void;
  startLoading: () => void;
  stopLoading: () => void;
  startRouting: () => void;
  stopRouting: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};

interface LoadingProviderProps {
  children: ReactNode;
}

export const LoadingProvider: React.FC<LoadingProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRouting, setIsRouting] = useState(false);

  const setLoading = (loading: boolean) => {
    setIsLoading(loading);
  };

  const startLoading = () => {
    setIsLoading(true);
  };

  const stopLoading = () => {
    setIsLoading(false);
  };

  const startRouting = () => {
    setIsRouting(true);
  };

  const stopRouting = () => {
    // Add a small delay to ensure smooth transition
    setTimeout(() => {
      setIsRouting(false);
    }, 50);
  };

  return (
    <LoadingContext.Provider value={{ 
      isLoading, 
      isRouting, 
      setLoading, 
      startLoading, 
      stopLoading, 
      startRouting, 
      stopRouting 
    }}>
      {children}
    </LoadingContext.Provider>
  );
};



