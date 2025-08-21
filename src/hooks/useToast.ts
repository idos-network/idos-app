import { createContext, useContext } from 'react';

export type ToastType =
  | 'success'
  | 'warning'
  | 'error'
  | 'quest'
  | 'onboarding';

export interface ToastLink {
  text: string;
  url: string;
  external?: boolean;
}

export interface ToastOptions {
  type: ToastType;
  message: string;
  points?: number;
  duration?: number;
  icon?: boolean;
  close?: boolean;
  link?: ToastLink;
}

export interface ToastContextType {
  showToast: (options: ToastOptions) => void;
  setPointsFrameRef: (ref: HTMLElement | null) => void;
  hasOnboardingToast: boolean;
}

export const ToastContext = createContext<ToastContextType | undefined>(
  undefined,
);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
