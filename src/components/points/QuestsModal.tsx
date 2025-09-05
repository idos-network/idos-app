import CloseButton from '@/components/CloseButton';
import { useHandleQuestClick } from '@/hooks/useHandleQuestClick';
import type { QuestWithStatus } from '@/hooks/useQuests';
import { getDailyQuestTimeRemaining } from '@/utils/quests';
import { formatTimeRemaining } from '@/utils/time';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import MediumPrimaryButton from '../MediumPrimaryButton';
import { useUserId } from '../onboarding/OnboardingStepper';

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
  const { handleQuestClick, pendingQuest } = useHandleQuestClick(onClose);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [isCheckingTime, setIsCheckingTime] = useState<boolean>(false);
  const { data: userId } = useUserId();

  const [consentGiven, setConsentGiven] = useState(false);

  const handleCheckboxChange = () => {
    setConsentGiven(!consentGiven);
  };

  const getDailyCheckTimeRemaining = useCallback(async () => {
    if (!userId) return 0;
    return await getDailyQuestTimeRemaining(userId);
  }, [userId]);

  useEffect(() => {
    if (isOpen && quest.name === 'daily_check') {
      setIsCheckingTime(true);
      getDailyCheckTimeRemaining()
        .then(setTimeRemaining)
        .finally(() => setIsCheckingTime(false));
    }
  }, [isOpen, quest.name, getDailyCheckTimeRemaining]);

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

  useEffect(() => {
    const handleIframeMessage = (event: any) => {
      if (event.origin === 'https://embeds.beehiiv.com') {
        const data = event.data;
        if (data && data.type === 'BEEHIIV_SUBSCRIBER_FORM_SUBMITTED') {
          handleQuestClick(quest);
        }
      }
    };

    window.addEventListener('message', handleIframeMessage);

    return () => {
      window.removeEventListener('message', handleIframeMessage);
    };
  }, []);

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
            <div className="flex justify-center gap-5">
              {quest.name === 'subscribe_newsletter' &&
              quest.iframe &&
              quest.status !== 'Completed' ? (
                <div style={{ maxWidth: '500px', margin: '0 auto' }}>
                  <label className="text-xs flex items-center mb-4">
                    <input
                      type="checkbox"
                      checked={consentGiven}
                      onChange={handleCheckboxChange}
                      style={{ marginRight: '0.5rem' }}
                    />
                    I freely give consent to process my personal data for the
                    purposes of sending newsletters and/or other communication.
                  </label>

                  <div className="relative h-13 rounded-lg overflow-hidden bg-neutral-900">
                    <div dangerouslySetInnerHTML={{ __html: quest.iframe }} />

                    <div
                      className="absolute top-0 left-0 w-full h-full bg-white bg-opacity-40 z-[2] rounded-lg transition-all duration-500"
                      style={{
                        backdropFilter: 'blur(4px)',
                        backgroundColor: 'rgba(255, 255, 255, 0.4)',
                        pointerEvents: consentGiven ? 'none' : 'auto',
                        opacity: consentGiven ? 0 : 1,
                      }}
                    />
                  </div>
                </div>
              ) : (
                <MediumPrimaryButton
                  onClick={() => handleQuestClick(quest)}
                  disabled={
                    quest.status === 'Completed' ||
                    (quest.name === 'daily_check' &&
                      (timeRemaining > 0 || isCheckingTime))
                  }
                >
                  {quest.status === 'Completed'
                    ? 'Completed'
                    : quest.name === 'daily_check'
                      ? isCheckingTime
                        ? 'Checking...'
                        : timeRemaining === 0
                          ? quest.buttonText
                          : `Try again in ${formatTimeRemaining(timeRemaining)}`
                      : !quest.internal && pendingQuest === quest.name
                        ? 'Complete quest'
                        : quest.buttonText}
                </MediumPrimaryButton>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
