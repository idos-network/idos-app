import { getUserQuests } from '@/api/user-quests';
import { getUtcDayEnd, getUtcDayStart } from '@/utils/time';

export async function getDailyQuestTimeRemaining(
  userId: string,
): Promise<number> {
  if (!userId) return 0;

  const quests = await getUserQuests(userId);
  const lastCompleted = quests
    .filter((quest) => quest.questName === 'daily_check')
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())[0];

  if (!lastCompleted) {
    return 0;
  }

  const now = new Date();
  const today = getUtcDayStart(now);
  const lastCompletedUTC = getUtcDayStart(lastCompleted.updatedAt);

  if (lastCompletedUTC.getTime() < today.getTime()) {
    return 0;
  }

  const endOfDayUTC = getUtcDayEnd(now);
  const timeRemaining = endOfDayUTC.getTime() - now.getTime();

  return timeRemaining > 0 ? timeRemaining : 0;
}
