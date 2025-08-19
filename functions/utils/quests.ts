import type { UserQuest } from '@/interfaces/user-quests';
import { getUtcDayStart } from '@/utils/time';

export function handleDailyQuest(userQuests: UserQuest[]): boolean {
  const lastCompleted = userQuests.find(
    (quest) => quest.questName === 'daily_check',
  );

  if (!lastCompleted?.updatedAt) {
    return true;
  }

  const today = getUtcDayStart(new Date());

  const lastCompletedUTC = getUtcDayStart(lastCompleted.updatedAt);

  return !(lastCompletedUTC.getTime() >= today.getTime());
}
