import { completeUserQuest } from '@/api/user-quests';
import { useToast } from '@/hooks/useToast';
import { useUserPoints } from '@/hooks/useUserPoints';
import { getQuestByName } from '@/utils/quests';
import { useCallback } from 'react';
import { useQuests } from './useQuests';

export const useCompleteQuest = () => {
  const { showToast } = useToast();
  const { refetch: refetchPoints } = useUserPoints();
  const { refetch: refetchQuests } = useQuests();

  const completeQuest = useCallback(
    async (userId: string, questName: string): Promise<void> => {
      try {
        const result = await completeUserQuest(userId, questName);
        const quest = getQuestByName(questName);

        if (result.success) {
          showToast({
            type: 'quest',
            message: 'You earned',
            points: quest?.pointsReward || 0,
            icon: false,
          });

          refetchPoints();
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
    [showToast, refetchPoints, refetchQuests],
  );

  return { completeQuest };
};
