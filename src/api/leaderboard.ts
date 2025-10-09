import { z } from 'zod';
import axiosInstance from './axios';
import { parseWithSchema } from './parser';

export interface LeaderboardEntryData {
  id: string;
  userId?: string;
  name: string;
  xHandle: string | null;
  totalPoints: number;
  questPoints: number;
  socialPoints: number;
  contributionPoints: number;
  referralCount: number;
  rank: number;
  mindsharePercentage: number;
}

export const getLeaderboard = async (opts?: {
  limit?: number;
  offset?: number;
}): Promise<{ data: LeaderboardEntryData[]; total?: number }> => {
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
          id: z.string(),
          userId: z.string().optional(),
          name: z.string(),
          xHandle: z.string().nullable(),
          totalPoints: z.number(),
          questPoints: z.number(),
          socialPoints: z.number(),
          contributionPoints: z.number(),
          referralCount: z.number(),
          rank: z.number(),
          mindsharePercentage: z.number(),
        }),
      ),
      total: z.number().optional(),
    }),
  );

  return { data: parsed.data, total: parsed.total };
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
          id: z.string(),
          userId: z.string(),
          name: z.string(),
          xHandle: z.string().nullable(),
          totalPoints: z.number(),
          questPoints: z.number(),
          socialPoints: z.number(),
          contributionPoints: z.number(),
          referralCount: z.number(),
          rank: z.number(),
          mindsharePercentage: z.number(),
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
