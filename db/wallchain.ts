import { sql } from 'drizzle-orm';
import { db, wallchainLeaderboard } from './index';

export type WallchainLeaderboardRow = {
  username: string;
  relativeMindshare: number;
};

export async function updateWallchainLeaderboard(
  rows: WallchainLeaderboardRow[],
) {
  await db.transaction(async (tx) => {
    await tx.execute(
      sql`TRUNCATE TABLE wallchain_leaderboard RESTART IDENTITY`,
    );

    if (rows.length === 0) return;

    await tx.insert(wallchainLeaderboard).values(
      rows.map((r) => ({
        username: r.username,
        relativeMindshare: r.relativeMindshare.toString(),
      })),
    );
  });
}
