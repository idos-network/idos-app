import { createContext, useContext } from 'react';

export type ToastType =
  | 'success'
  | 'warning'
  | 'error'
  | 'quest'
  | 'onboarding';

export interface ToastOptions {
  type: ToastType;
  message: string;
  points?: number;
  duration?: number; // ms
  icon?: boolean;
  close?: boolean;
}

export interface ToastContextType {
  showToast: (options: ToastOptions) => void;
  setPointsFrameRef: (ref: HTMLElement | null) => void;
}

export const ToastContext = createContext<ToastContextType | undefined>(
  undefined,
);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
