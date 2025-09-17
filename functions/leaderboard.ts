import {
  getContributionPoints,
  getQuestPoints,
  getSocialPoints,
} from '@/db/leaderboard';
import type { Config } from '@netlify/functions';

export interface LeaderboardEntry {
  userId: string;
  totalPoints: number;
  questPoints: number;
  socialPoints: number;
  contributionPoints: number;
  referralCount: number;
  position: number;
}

async function getLeaderboardTotals(options?: {
  limit?: number;
  offset?: number;
}): Promise<LeaderboardEntry[]> {
  const limit = options?.limit ?? 100;
  const offset = options?.offset ?? 0;

  const questPointsMap = await getQuestPoints();
  const socialPointsMap = await getSocialPoints();
  const contributionPointsMap = await getContributionPoints();

  const leaderboardEntries: Omit<LeaderboardEntry, 'position'>[] = [];

  const allUserIds = new Set(questPointsMap.keys());
  socialPointsMap.forEach((_, userId) => allUserIds.add(userId));
  contributionPointsMap.forEach((_, userId) => allUserIds.add(userId));

  for (const userId of allUserIds) {
    const questData = questPointsMap.get(userId);
    const questPoints = questData?.questPoints ?? 0;
    const socialPoints = socialPointsMap.get(userId) ?? 0;
    const contributionPoints = contributionPointsMap.get(userId) ?? 0;
    const referralCount = questData?.referralCount ?? 0;

    const totalPoints = questPoints + socialPoints + contributionPoints;

    leaderboardEntries.push({
      userId,
      totalPoints,
      questPoints,
      socialPoints,
      contributionPoints,
      referralCount,
    });
  }

  leaderboardEntries.sort((a, b) => b.totalPoints - a.totalPoints);

  const entriesWithPositions: LeaderboardEntry[] = [];
  let currentPosition = 1;
  let previousPoints: number | null = null;

  for (let i = 0; i < leaderboardEntries.length; i++) {
    const entry = leaderboardEntries[i];

    if (previousPoints === null || entry.totalPoints !== previousPoints) {
      currentPosition = i + 1;
    }

    entriesWithPositions.push({
      ...entry,
      position: currentPosition,
    });

    previousPoints = entry.totalPoints;
  }

  let startIndex = 0;
  if (offset > 0) {
    startIndex = entriesWithPositions.findIndex(
      (entry) => entry.position > offset,
    );
    if (startIndex === -1) {
      return [];
    }
  }

  let endIndex = entriesWithPositions.length;
  if (limit > 0) {
    const targetPosition = offset + limit;
    endIndex = entriesWithPositions.findIndex(
      (entry) => entry.position > targetPosition,
    );
    if (endIndex === -1) {
      endIndex = entriesWithPositions.length;
    }
  }

  return entriesWithPositions.slice(startIndex, endIndex);
}

export default async (request: Request) => {
  const url = new URL(request.url);
  const limit = Number(url.searchParams.get('limit') ?? '100');
  const offset = Number(url.searchParams.get('offset') ?? '0');

  const safeLimit =
    Number.isFinite(limit) && limit > 0 && limit <= 500 ? limit : 100;
  const safeOffset = Number.isFinite(offset) && offset >= 0 ? offset : 0;

  const data = await getLeaderboardTotals({
    limit: safeLimit,
    offset: safeOffset,
  });

  return new Response(JSON.stringify({ data }), { status: 200 });
};

export const config: Config = {
  path: '/api/leaderboard',
  method: 'GET',
};
