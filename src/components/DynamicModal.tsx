'use client';

import dynamic from 'next/dynamic';
import { ModalProps } from '@/components/ui/Modal';

// Dynamically import Modal with no SSR to avoid hydration issues
const Modal = dynamic(() => import('@/components/ui/Modal').then(mod => ({ default: mod.Modal })), {
  ssr: false,
  loading: () => null,
});

export const DynamicModal: React.FC<ModalProps> = (props) => {
  return <Modal {...props} />;
};
