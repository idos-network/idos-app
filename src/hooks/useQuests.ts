import { getUserQuestsSummary } from '@/api/user-quests';
import { useUserId } from '@/hooks/useUserId';
import type { UserQuestSummary } from '@/interfaces/user-quests';
import { getActiveQuests, type Quest } from '@/utils/quests';
import { useQuery } from '@tanstack/react-query';

export interface QuestWithStatus extends Quest {
  status: 'Completed' | 'Available';
  completionCount: number;
  lastCompletedAt?: Date;
}

export const useQuests = () => {
  const { userId, isLoading: userIdLoading } = useUserId();

  const {
    data: activeQuests,
    isLoading: questsLoading,
    error: questsError,
    refetch: refetchQuests,
  } = useQuery({
    queryKey: ['activeQuests'],
    queryFn: getActiveQuests,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const {
    data: userQuests,
    isLoading: userQuestsLoading,
    error: userQuestsError,
    refetch: refetchUserQuests,
  } = useQuery({
    queryKey: ['userQuestsSummary', userId],
    queryFn: () => getUserQuestsSummary(userId!),
    enabled: !!userId && !userIdLoading,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  const questsWithStatus: QuestWithStatus[] = (activeQuests || []).map(
    (quest: Quest) => {
      const userQuest = userQuests?.find(
        (uq: UserQuestSummary) => uq.questName === quest.name,
      );

      let status: 'Completed' | 'Available' = 'Available';
      let completionCount = 0;
      let lastCompletedAt: Date | undefined;

      if (userQuest) {
        completionCount = userQuest.completionCount;
        lastCompletedAt = userQuest.lastCompletedAt;

        if (completionCount > 0) {
          status = quest.isRepeatable ? 'Available' : 'Completed';
        }
      }

      return {
        ...quest,
        status,
        completionCount,
        lastCompletedAt,
      };
    },
  );

  const refetch = () => {
    refetchQuests();
    refetchUserQuests();
  };

  return {
    quests: questsWithStatus,
    isLoading: questsLoading || userQuestsLoading || userIdLoading,
    error: questsError || userQuestsError,
    refetch,
  };
};
