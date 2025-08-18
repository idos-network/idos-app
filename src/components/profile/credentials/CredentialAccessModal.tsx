import Spinner from '@//components/Spinner';
import CloseButton from '@/components/CloseButton';
import StepperButton from '@/components/onboarding/components/StepperButton';
import { useEffect, useRef } from 'react';

interface CredentialAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  loading?: boolean;
}

export default function CredentialAccessModal({
  isOpen,
  onClose,
  title,
  subtitle,
  loading = true,
}: CredentialAccessModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-60">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-neutral-900/50 backdrop-blur-sm p-6"
        onClick={onClose}
      />
      {/* Modal */}
      <div
        ref={modalRef}
        className="relative max-w-lg w-[430px] bg-neutral-950 gap-8 rounded-2xl border border-neutral-800 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-end px-6 pt-6 bg-neutral-800/60 border-neutral-700 rounded-t-2xl">
          <CloseButton onClose={onClose} />
        </div>
        {/* Body */}
        <div className="px-6 pb-6 bg-neutral-800/60">
          {loading && (
            <div className="flex justify-center py-14">
              <Spinner />
            </div>
          )}
          <h2 className="text-xl leading-7 font-normal text-neutral-50 text-center mb-4">
            {title}
          </h2>
          <p className="text-neutral-400 text-sm text-center font-normal">
            {subtitle}
          </p>
        </div>
        {/* Footer */}
        <div className="flex justify-center bg-neutral-800/60 pb-6">
          <StepperButton className="bg-none"></StepperButton>
        </div>
      </div>
    </div>
  );
}
