import CloseButton from '@/components/CloseButton';
import { useHandleQuestClick } from '@/handlers/quests';
import type { QuestWithStatus } from '@/hooks/useQuests';
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import MediumPrimaryButton from '../MediumPrimaryButton';

interface QuestsModalProps {
  isOpen: boolean;
  quest: QuestWithStatus;
  onClose: () => void;
}

export default function QuestsModal({
  isOpen,
  quest,
  onClose,
}: QuestsModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const handleQuestClick = useHandleQuestClick(onClose);

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

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-neutral-900/50 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Modal */}
      <div
        ref={modalRef}
        className="relative w-[400px] bg-neutral-950 rounded-2xl border border-neutral-800 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-end px-6 pt-6 bg-neutral-800/60 border-neutral-700 rounded-t-2xl">
          <CloseButton onClose={onClose} />
        </div>
        {/* Body */}
        <div className="px-6 pb-6 bg-neutral-800/60">
          <div className="flex flex-col items-center gap-4">
            <div className="flex flex-col items-center gap-4">
              <span className="text-[28px] font-normal text-neutral-50">
                {quest.title}
              </span>
              <div className="flex items-center justify-center bg-[#1D083E] rounded-lg border border-[#441983] gap-2 px-2 py-1 h-7 mr-2">
                <img
                  src="/idos-points-logo.png"
                  alt="Points"
                  className="w-4 h-4"
                />
                <div className="text-sm font-medium text-neutral-50">
                  {quest.pointsReward} Points
                </div>
              </div>
              <span className="text-base font-light text-neutral-400 font-['Inter'] text-center whitespace-pre-line">
                {quest.description}
              </span>
            </div>
            {/* Action Buttons */}
            <div className="flex justify-center gap-5">
              <MediumPrimaryButton
                onClick={() => handleQuestClick(quest)}
                disabled={quest.status === 'Completed'}
              >
                {quest.buttonText}
              </MediumPrimaryButton>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
