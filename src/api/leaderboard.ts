import { z } from 'zod';
import axiosInstance from './axios';
import { parseWithSchema } from './parser';

export interface LeaderboardEntryData {
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

export const getLeaderboard = async (opts?: {
  limit?: number;
  offset?: number;
}): Promise<LeaderboardEntryData[]> => {
  const params = new URLSearchParams();
  if (opts?.limit) params.set('limit', String(opts.limit));
  if (opts?.offset) params.set('offset', String(opts.offset));

  const response = await axiosInstance.get(
    `/leaderboard${params.toString() ? `?${params.toString()}` : ''}`,
  );
  const parsed = parseWithSchema(
    response.data,
    z.object({
      data: z.array(
        z.object({
          userId: z.string(),
          name: z.string(),
          xHandle: z.string().nullable(),
          totalPoints: z.number(),
          questPoints: z.number(),
          socialPoints: z.number(),
          contributionPoints: z.number(),
          referralCount: z.number(),
          position: z.number(),
        }),
      ),
    }),
  );

  return parsed.data;
};

export const getUserPosition = async (
  userId: string,
): Promise<LeaderboardEntryData | null> => {
  const params = new URLSearchParams();
  params.set('userId', userId);

  try {
    const response = await axiosInstance.get(
      `/leaderboard?${params.toString()}`,
    );
    const parsed = parseWithSchema(
      response.data,
      z.object({
        data: z.object({
          userId: z.string(),
          name: z.string(),
          xHandle: z.string().nullable(),
          totalPoints: z.number(),
          questPoints: z.number(),
          socialPoints: z.number(),
          contributionPoints: z.number(),
          referralCount: z.number(),
          position: z.number(),
        }),
      }),
    );

    return parsed.data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      return null;
    }
    throw error;
  }
};
