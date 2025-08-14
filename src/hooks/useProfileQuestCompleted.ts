import { useQuests } from './useQuests';

export function useProfileQuestCompleted() {
  const { quests, isLoading, error } = useQuests();

  const profileQuest = quests.find(
    (quest) => quest.name === 'create_idos_profile',
  );
  const isCompleted = profileQuest?.status === 'Completed' || false;

  return {
    isCompleted,
    isLoading,
    error,
    profileQuest,
  };
}
