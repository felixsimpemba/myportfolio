'use client';

import { useRouter } from 'next/navigation';
import { useLoading } from '@/lib/LoadingContext';
import { useCallback, useEffect } from 'react';

export const useRouting = () => {
  const router = useRouter();
  const { startRouting, stopRouting } = useLoading();

  const navigate = useCallback((href: string) => {
    startRouting();
    router.push(href);

      stopRouting();

  }, [router, startRouting, stopRouting]);

  // Stop routing loading when component unmounts or route changes
  useEffect(() => {
    return () => {
      stopRouting();
    };
  }, [stopRouting]);

  return { navigate };
};

