import { getLeaderboardEntries, refreshLeaderboard } from '@/db/leaderboard';
import type { Config } from '@netlify/functions';

export interface LeaderboardEntry {
  userId: string;
  name: string;
  xHandle: string | null;
  totalPoints: number;
  questPoints: number;
  socialPoints: number;
  contributionPoints: number;
  referralCount: number;
  position: number;
}

async function getCompleteLeaderboard(): Promise<LeaderboardEntry[]> {
  await refreshLeaderboard();

  const leaderboardEntries = await getLeaderboardEntries();

  const entriesWithPositions: LeaderboardEntry[] = [];
  let currentPosition = 1;
  let previousPoints: number | null = null;

  for (let i = 0; i < leaderboardEntries.length; i++) {
    const entry = leaderboardEntries[i];

    if (previousPoints === null || entry.totalPoints !== previousPoints) {
      currentPosition = i + 1;
    }

    entriesWithPositions.push({
      userId: entry.userId,
      name: entry.name || '',
      xHandle: entry.xHandle,
      totalPoints: entry.totalPoints,
      questPoints: entry.questPoints,
      socialPoints: entry.socialPoints,
      contributionPoints: entry.contributionPoints,
      referralCount: entry.referralCount,
      position: currentPosition,
    });

    previousPoints = entry.totalPoints;
  }

  return entriesWithPositions;
}

export default async (request: Request) => {
  const url = new URL(request.url);
  const userId = url.searchParams.get('userId');
  const limitParam = url.searchParams.get('limit');
  const offset = Number(url.searchParams.get('offset') ?? '0');

  const completeLeaderboard = await getCompleteLeaderboard();

  if (userId) {
    const userPosition = completeLeaderboard.find(
      (entry) => entry.userId === userId,
    );

    if (!userPosition) {
      return new Response(
        JSON.stringify({ error: 'User not found on leaderboard' }),
        { status: 404 },
      );
    }

    return new Response(JSON.stringify({ data: userPosition }), {
      status: 200,
    });
  }

  if (!limitParam) {
    return new Response(JSON.stringify({ data: completeLeaderboard }), {
      status: 200,
    });
  }

  const limit = Number(limitParam);
  const safeLimit =
    Number.isFinite(limit) && limit > 0 && limit <= 10000 ? limit : 1000;
  const safeOffset = Number.isFinite(offset) && offset >= 0 ? offset : 0;

  const paginatedData = completeLeaderboard.slice(
    safeOffset,
    safeOffset + safeLimit,
  );

  return new Response(JSON.stringify({ data: paginatedData }), { status: 200 });
};

export const config: Config = {
  path: '/api/leaderboard',
  method: 'GET',
};
