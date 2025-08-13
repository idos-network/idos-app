import { completeUserQuest } from '@/api/user-quests';
import { useToast } from '@/hooks/useToast';
import { useUserPoints } from '@/hooks/useUserPoints';
import { getQuestByName } from '@/utils/quests';
import { useCallback } from 'react';

export const useCompleteQuest = () => {
  const { showToast } = useToast();
  const { refetch: refetchPoints } = useUserPoints();

  const completeQuest = useCallback(
    async (userId: string, questName: string): Promise<void> => {
      try {
        const result = await completeUserQuest(userId, questName);
        const quest = getQuestByName(questName);
        console.log(quest);
        if (result.success) {
          showToast({
            type: 'quest',
            message: 'You earned',
            points: quest?.pointsReward || 0,
            icon: false,
          });

          refetchPoints();
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
    [showToast, refetchPoints],
  );

  return { completeQuest };
};
