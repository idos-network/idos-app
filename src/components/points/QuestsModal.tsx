import CloseButton from '@/components/CloseButton';
import { useHandleQuestClick } from '@/hooks/useHandleQuestClick';
import type { QuestWithStatus } from '@/hooks/useQuests';
import { getDailyQuestTimeRemaining } from '@/utils/daily-quest';
import { formatTimeRemaining } from '@/utils/time';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import MediumPrimaryButton from '../MediumPrimaryButton';
import { useUserId } from '../onboarding/OnboardingStepper';
import { subscribeNewsletter } from '@/api/subscribe-newsletter';
import SmallPrimaryButton from '../SmallPrimaryButton';

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
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

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
              quest.status !== 'Completed' ? (
                <div
                  style={{ maxWidth: '500px', margin: '0 auto', width: '100%' }}
                >
                  <label className="text-xs flex items-center mb-4">
                    <input
                      type="checkbox"
                      checked={consentGiven}
                      onChange={handleCheckboxChange}
                      style={{ marginRight: '0.5rem' }}
                    />
                    <span>
                      I freely give consent to process my personal data for the
                      purposes of sending newsletters and/or other
                      communication. I have the right to withdraw my consent at
                      any time with effect for the future, by clicking an
                      unsubscribe link. The withdrawal of consent shall not
                      affect the lawfulness of processing based on consent
                      before its withdrawal. I confirm that I have reviewed the{' '}
                      <a
                        className="text-aquamarine-400"
                        href="https://www.idos.network/legal/privacy-policy"
                      >
                        privacy policy
                      </a>{' '}
                      and the{' '}
                      <a
                        className="text-aquamarine-400"
                        href="https://drive.google.com/file/d/1lzrdgD_dwusE4xsKw_oTUcu8Hq3YU60b/view?usp=sharing"
                      >
                        transparency document
                      </a>
                      .
                    </span>
                  </label>

                  <div className="flex flex-col items-center gap-3">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={!consentGiven}
                      placeholder="Enter your email"
                      className="w-full rounded-lg bg-neutral-900 border border-neutral-700 px-3 py-2 text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-aquamarine-400"
                    />

                    {submitError ? (
                      <div className="text-xs text-red-400">{submitError}</div>
                    ) : null}

                    <div className="w-fit">
                      <SmallPrimaryButton
                        onClick={async () => {
                          setSubmitError(null);
                          if (!consentGiven) {
                            setSubmitError(
                              'Please provide consent to continue.',
                            );
                            return;
                          }
                          const emailRegex = /[^@\s]+@[^@\s]+\.[^@\s]+/;
                          if (!emailRegex.test(email)) {
                            setSubmitError(
                              'Please enter a valid email address.',
                            );
                            return;
                          }
                          try {
                            setIsSubmitting(true);
                            await subscribeNewsletter(email);
                            await handleQuestClick(quest);
                          } catch (err: any) {
                            const message =
                              err?.response?.data?.message ||
                              'Subscription failed. Please try again later.';
                            setSubmitError(message);
                          } finally {
                            setIsSubmitting(false);
                          }
                        }}
                        disabled={isSubmitting || !consentGiven}
                      >
                        {isSubmitting ? 'Submitting...' : 'Subscribe'}
                      </SmallPrimaryButton>
                    </div>
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
