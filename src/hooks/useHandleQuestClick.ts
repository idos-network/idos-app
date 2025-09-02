import { useUserId } from '@/components/onboarding/OnboardingStepper';
import { useCompleteQuest } from '@/hooks/useCompleteQuest';
import { useToast } from '@/hooks/useToast';
import { generateReferralCode, type Quest } from '@/utils/quests';
import { useNavigate } from '@tanstack/react-router';
import { useCallback, useMemo, useState } from 'react';

export function useHandleQuestClick(onModalClose?: () => void) {
  const navigate = useNavigate();
  const { completeQuest } = useCompleteQuest();
  const { data: userId } = useUserId();
  const { showToast } = useToast();
  const [pendingQuest, setPendingQuest] = useState<string | null>(null);

  const referralCode = useMemo(
    () => (userId ? generateReferralCode(userId) : ''),
    [userId],
  );

  const referralUrl = useMemo(
    () => (referralCode ? `${window.location.origin}?ref=${referralCode}` : ''),
    [referralCode],
  );

  const handleReferralQuest = useCallback(() => {
    navigator.clipboard.writeText(referralUrl);
    showToast({
      type: 'success',
      message: 'Referral link copied to clipboard',
    });
  }, [referralUrl, showToast]);

  const handleQuestClick = useCallback(
    async (quest: Quest) => {
      if (quest.internal && quest.link) {
        navigate({ to: quest.link });
      } else if (quest.name === 'referral_program') {
        handleReferralQuest();
        if (onModalClose) {
          onModalClose();
        }
      } else if (!quest.internal) {
        if (pendingQuest === quest.name) {
          await completeQuest(userId!, quest.name);
          setPendingQuest(null);
          if (onModalClose) {
            onModalClose();
          }
        } else {
          setPendingQuest(quest.name);
          window.open(quest.link, '_blank', 'noopener,noreferrer');
        }
      } else {
        await completeQuest(userId!, quest.name);
        if (onModalClose) {
          onModalClose();
        }
      }
    },
    [
      navigate,
      handleReferralQuest,
      onModalClose,
      userId,
      completeQuest,
      pendingQuest,
    ],
  );

  return { handleQuestClick, pendingQuest };
}
