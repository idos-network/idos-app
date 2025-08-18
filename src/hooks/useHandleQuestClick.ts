import { useCompleteQuest } from '@/hooks/useCompleteQuest';
import { useToast } from '@/hooks/useToast';
import { useUserId } from '@/hooks/useUserId';
import { generateReferralCode, type Quest } from '@/utils/quests';
import { useNavigate } from '@tanstack/react-router';
import { useCallback, useMemo, useState } from 'react';

export function useHandleQuestClick(onModalClose?: () => void) {
  const navigate = useNavigate();
  const { completeQuest } = useCompleteQuest();
  const { userId } = useUserId();
  const { showToast } = useToast();
  const [pendingQuests, setPendingQuests] = useState<Set<string>>(new Set());

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
        if (pendingQuests.has(quest.name)) {
          await completeQuest(userId!, quest.name);
          setPendingQuests((prev) => {
            const newSet = new Set(prev);
            newSet.delete(quest.name);
            return newSet;
          });
          if (onModalClose) {
            onModalClose();
          }
        } else {
          setPendingQuests((prev) => new Set(prev).add(quest.name));
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
      pendingQuests,
    ],
  );

  return { handleQuestClick, pendingQuests };
}
