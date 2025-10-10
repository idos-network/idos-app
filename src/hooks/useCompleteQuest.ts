import { completeUserQuest } from '@/api/user-quests';
import { useToast } from '@/hooks/useToast';
import { getQuestByName } from '@/utils/quests';
import { useCallback } from 'react';
import { useQuests } from './useQuests';
import { useLeaderboard } from './useLeaderboard';
import { useUserId } from './useUserId';

export const useCompleteQuest = () => {
  const { showToast } = useToast();
  const { data: userId } = useUserId();
  const { refetch: refetchUserLeaderboard } = useLeaderboard({ userId });
  const { refetch: refetchQuests } = useQuests();

  const completeQuest = useCallback(
    async (userId: string, questName: string): Promise<void> => {
      try {
        const result = await completeUserQuest(userId, questName);
        const quest = getQuestByName(questName);
        if (questName === 'create_idos_profile') {
          refetchQuests();
          return;
        }

        if (result.success) {
          showToast({
            type: 'quest',
            message: 'You earned',
            points: quest?.pointsReward || 0,
            icon: false,
          });

          refetchUserLeaderboard();
          refetchQuests();
        } else {
          showToast({
            type: 'error',
            message: result.error || 'Failed to complete quest',
          });
        }
      } catch (error) {
        showToast({
          type: 'error',
          message: 'An unexpected error occurred while completing the quest',
        });
      }
    },
    [showToast, refetchUserLeaderboard, refetchQuests],
  );

  return { completeQuest };
};
