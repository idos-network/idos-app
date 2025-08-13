import type { ToastType } from '@/hooks/useToast';
import CheckIcon from '@/icons/check';
import CloseToastIcon from '@/icons/close-toast';
import ExclamationIcon from '@/icons/exclamation';
import React from 'react';

const typeStyles: Record<ToastType, string> = {
  success: 'bg-[#00624999] text-aquamarine-400',
  warning: 'bg-[#533E16] text-[#FFBB33]',
  error: 'bg-[#4A1717] text-[#CD272C]',
  quest:
    'bg-gradient-to-r from-[#1D083E] to-[#5A23A7]  text-[#C99BFF] border border-[#923CF7] drop-shadow-[0_35px_37px_rgba(116, 45, 208, 1)]',
};

const icons: Record<ToastType, React.ReactNode> = {
  success: <CheckIcon className="text-neutral-950 w-4 h-4" />,
  warning: <ExclamationIcon className="text-neutral-950 w-3 h-3" />,
  error: <CloseToastIcon className="text-neutral-950 w-3 h-3" />,
  quest: <></>,
};

const iconBgColors: Record<ToastType, string> = {
  success: 'bg-aquamarine-400',
  warning: 'bg-[#FFBB33]',
  error: 'bg-[#CD272C]',
  quest: 'bg-aquamarine-400',
};

interface ToastProps {
  type: ToastType;
  message: string;
  points?: number;
  icon?: boolean;
  close?: boolean;
  onClose: () => void;
}

export default function Toast({
  type,
  message,
  points,
  icon = true,
  close = false,
  onClose,
}: ToastProps) {
  return type === 'quest' ? (
    <div className="relative">
      {/* Invisible background div for drop-shadow */}
      <div className="absolute inset-0 drop-shadow-[0px_4px_10px_rgba(116,45,208,1)]">
        <svg
          className="w-full h-full"
          viewBox="0 0 200 68"
          preserveAspectRatio="none"
        >
          <path
            d="M 100 0 L 108 8 L 180 8 Q 192 8 192 20 L 192 48 Q 192 60 180 60 L 20 60 Q 8 60 8 48 L 8 20 Q 8 8 20 8 L 92 8 Z"
            fill="rgba(116, 45, 208, 0.4)"
          />
        </svg>
      </div>

      {/* Main toast shape */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 200 68"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="questGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1D083E" />
            <stop offset="100%" stopColor="#5A23A7" />
          </linearGradient>
        </defs>
        <path
          d="M 100 0 L 108 8 L 180 8 Q 192 8 192 20 L 192 48 Q 192 60 180 60 L 20 60 Q 8 60 8 48 L 8 20 Q 8 8 20 8 L 92 8 Z"
          fill="url(#questGradient)"
          stroke="#441983"
          strokeWidth="1px"
        />
      </svg>

      <div className="relative flex items-center px-4 py-3 h-15 w-fit z-10">
        <span className="flex-1 text-sm font-['Inter'] font-light pr-4 text-[#C99BFF]">
          {message}
        </span>
        <img src="/idos-points-logo.png" alt="Quest" className="w-5 h-5 mr-2" />
        <span className="text-xl font-normal text-neutral-50">{points}</span>
      </div>
    </div>
  ) : (
    <div
      className={`flex items-center font-['Inter'] rounded-lg px-3 py-3 h-10 w-fit ${typeStyles[type]}`}
    >
      {icon && (
        <span
          className={`mr-2 flex items-center justify-center w-5 h-5 rounded-full ${iconBgColors[type]}`}
        >
          {icons[type]}
        </span>
      )}
      <span className="flex-1 text-sm font-normal pr-6">{message}</span>
      {close && (
        <button
          onClick={onClose}
          className="text-lg font-normal focus:outline-none"
        >
          <CloseToastIcon className="text-neutral-200 w-3 h-3" />
        </button>
      )}
    </div>
  );
}
