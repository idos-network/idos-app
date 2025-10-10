import {
  getLeaderboardEntries,
  getLeaderboardEntriesCount,
  getLeaderboardUserPosition,
} from '@/db/leaderboard';
import type { Config } from '@netlify/functions';
import { withSentry } from './utils/sentry';

export interface LeaderboardEntry {
  id: string;
  userId?: string;
  name: string;
  xHandle: string | null;
  rank: number;
  totalPoints: number;
  questPoints: number;
  socialPoints: number;
  contributionPoints: number;
  referralCount: number;
}

async function getPaginatedLeaderboard(
  limit: number,
  offset: number,
): Promise<{ data: LeaderboardEntry[]; total: number }> {
  // Ensure parameters are valid
  const safeLimit =
    Number.isFinite(limit) && limit > 0 && limit <= 10000 ? limit : 1000;
  const safeOffset = Number.isFinite(offset) && offset >= 0 ? offset : 0;

  const [leaderboardEntries, totalCount] = await Promise.all([
    getLeaderboardEntries(safeLimit, Math.floor(safeOffset / safeLimit) + 1),
    getLeaderboardEntriesCount(),
  ]);

  const entriesWithPositions: LeaderboardEntry[] = leaderboardEntries.map(
    (entry) => ({
      id: String(entry.id),
      name: entry.name || '',
      xHandle: entry.xHandle,
      rank: entry.rank,
      totalPoints: entry.totalPoints,
      questPoints: entry.questPoints,
      socialPoints: entry.socialPoints,
      contributionPoints: entry.contributionPoints,
      referralCount: entry.referralCount,
    }),
  );

  return {
    data: entriesWithPositions,
    total: totalCount[0]?.count || 0,
  };
}

export default withSentry(async (request: Request) => {
  const url = new URL(request.url);
  const userId = url.searchParams.get('userId');
  const limitParam = url.searchParams.get('limit');
  const offsetParam = url.searchParams.get('offset');
  const offset = Number(offsetParam ?? '0');

  // Handle user position request
  if (userId) {
    const userPositionResult = await getLeaderboardUserPosition(userId);
    const userPosition = userPositionResult[0];

    if (!userPosition || userPosition.totalPoints === 0) {
      return new Response(
        JSON.stringify({ error: 'User not found on leaderboard' }),
        { status: 404 },
      );
    }

    const userEntry: LeaderboardEntry = {
      id: String(userPosition.id),
      userId: userPosition.userId,
      name: userPosition.name || '',
      xHandle: userPosition.xHandle,
      rank: userPosition.rank,
      totalPoints: userPosition.totalPoints,
      questPoints: userPosition.questPoints,
      socialPoints: userPosition.socialPoints,
      contributionPoints: userPosition.contributionPoints,
      referralCount: userPosition.referralCount,
    };

    return new Response(JSON.stringify({ data: userEntry }), {
      status: 200,
    });
  }

  // Handle paginated leaderboard request
  const limit = Number(limitParam);
  const safeLimit =
    Number.isFinite(limit) && limit > 0 && limit <= 10000 ? limit : 1000;
  const safeOffset = Number.isFinite(offset) && offset >= 0 ? offset : 0;

  const result = await getPaginatedLeaderboard(safeLimit, safeOffset);

  return new Response(
    JSON.stringify({
      data: result.data,
      total: result.total,
    }),
    { status: 200 },
  );
});

export const config: Config = {
  path: '/api/leaderboard',
  method: 'GET',
};
