import { db, leaderboardView } from './index';
import { eq, gt, count } from 'drizzle-orm';

export { leaderboardView };

export async function refreshLeaderboard(): Promise<void> {
  await db.refreshMaterializedView(leaderboardView);
}

export async function getLeaderboardEntries(pageSize: number, page: number) {
  return await db
    .select({
      id: leaderboardView.id,
      name: leaderboardView.name,
      xHandle: leaderboardView.xHandle,
      questPoints: leaderboardView.questPoints,
      socialPoints: leaderboardView.socialPoints,
      contributionPoints: leaderboardView.contributionPoints,
      referralCount: leaderboardView.referralCount,
      totalPoints: leaderboardView.totalPoints,
      rank: leaderboardView.rank,
      relativeMindshare: leaderboardView.relativeMindshare,
    })
    .from(leaderboardView)
    .where(gt(leaderboardView.totalPoints, 0))
    .limit(pageSize)
    .offset((page - 1) * pageSize);
}

export async function getLeaderboardEntriesCount() {
  return await db
    .select({ count: count() })
    .from(leaderboardView)
    .where(gt(leaderboardView.totalPoints, 0));
}

export async function getLeaderboardUserPosition(userId: string) {
  return await db
    .select({
      id: leaderboardView.id,
      userId: leaderboardView.userId,
      name: leaderboardView.name,
      xHandle: leaderboardView.xHandle,
      questPoints: leaderboardView.questPoints,
      socialPoints: leaderboardView.socialPoints,
      contributionPoints: leaderboardView.contributionPoints,
      referralCount: leaderboardView.referralCount,
      totalPoints: leaderboardView.totalPoints,
      rank: leaderboardView.rank,
      relativeMindshare: leaderboardView.relativeMindshare,
    })
    .from(leaderboardView)
    .where(eq(leaderboardView.userId, userId));
}
