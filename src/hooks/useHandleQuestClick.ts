import { useCompleteQuest } from '@/hooks/useCompleteQuest';
import { useToast } from '@/hooks/useToast';
import { useUserId } from '@/hooks/useUserId';
import { generateReferralCode, type Quest } from '@/utils/quests';
import { useNavigate } from '@tanstack/react-router';
import { useCallback, useEffect, useMemo, useRef } from 'react';

export function useHandleQuestClick(onModalClose?: () => void) {
  const navigate = useNavigate();
  const { completeQuest } = useCompleteQuest();
  const { userId } = useUserId();
  const { showToast } = useToast();
  const pendingQuestRef = useRef<string | null>(null);

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

  // Handle external quest completion
  // Completes the quest when the user returns to the page
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (!document.hidden && pendingQuestRef.current && userId) {
        await completeQuest(userId, pendingQuestRef.current);
        pendingQuestRef.current = null;

        if (onModalClose) {
          onModalClose();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [completeQuest, userId, onModalClose]);

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
        pendingQuestRef.current = quest.name;
        window.open(quest.link, 'noopener,noreferrer');
      } else {
        await completeQuest(userId!, quest.name);
        if (onModalClose) {
          onModalClose();
        }
      }
    },
    [navigate, handleReferralQuest, onModalClose],
  );

  return handleQuestClick;
}
