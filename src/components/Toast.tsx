import type { ToastType } from '@/hooks/useToast';
import CheckIcon from '@/icons/check';
import CloseToastIcon from '@/icons/close-toast';
import ExclamationIcon from '@/icons/exclamation';
import React from 'react';
import OnboardingPointsToast from './points/OnboardingPointsToast';
import QuestPointsToast from './points/QuestPointsToast';

const typeStyles: Record<ToastType, string> = {
  success: 'bg-[#00624999] text-aquamarine-400',
  warning: 'bg-[#533E16] text-[#FFBB33]',
  error: 'bg-[#4A1717] text-[#CD272C]',
  quest:
    'bg-gradient-to-r from-[#1D083E] to-[#5A23A7]  text-[#C99BFF] border border-[#923CF7] drop-shadow-[0_35px_37px_rgba(116, 45, 208, 1)]',
  onboarding: '',
};

const icons: Record<ToastType, React.ReactNode> = {
  success: <CheckIcon className="text-neutral-950 w-4 h-4" />,
  warning: <ExclamationIcon className="text-neutral-950 w-3 h-3" />,
  error: <CloseToastIcon className="text-neutral-950 w-3 h-3" />,
  quest: <></>,
  onboarding: <></>,
};

const iconBgColors: Record<ToastType, string> = {
  success: 'bg-aquamarine-400',
  warning: 'bg-[#FFBB33]',
  error: 'bg-[#CD272C]',
  quest: 'bg-aquamarine-400',
  onboarding: '',
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
    <QuestPointsToast
      message={message}
      points={points ?? 0}
      close={close}
      onClose={onClose}
    />
  ) : type === 'onboarding' ? (
    <OnboardingPointsToast onClose={onClose} />
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
