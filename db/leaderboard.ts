import { db, leaderboardView } from './index';

export { leaderboardView };

export async function refreshLeaderboard(): Promise<void> {
  await db.refreshMaterializedView(leaderboardView);
}

export async function getLeaderboardEntries() {
  return await db.select().from(leaderboardView);
}
