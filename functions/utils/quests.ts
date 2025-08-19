import type { UserQuest } from '@/interfaces/user-quests';

export function handleDailyQuest(userQuests: UserQuest[]): boolean {
  const lastCompleted = userQuests.find(
    (quest) => quest.questName === 'daily_check',
  );

  if (!lastCompleted?.updatedAt) {
    return true;
  }

  const today = new Date();
  const todayUTC = new Date(
    Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()),
  );

  const lastCompletedUTC = new Date(
    Date.UTC(
      lastCompleted.updatedAt.getUTCFullYear(),
      lastCompleted.updatedAt.getUTCMonth(),
      lastCompleted.updatedAt.getUTCDate(),
    ),
  );

  return !(
    lastCompletedUTC.getTime() === todayUTC.getTime() ||
    lastCompletedUTC.getTime() > todayUTC.getTime()
  );
}
