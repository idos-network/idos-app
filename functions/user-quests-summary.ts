import type { Config, Context } from '@netlify/functions';
import { getUserQuestsSummary } from '@/db/user-quests';

export default async (request: Request, _context: Context) => {
  const url = new URL(request.url);
  const userId = url.searchParams.get('userId');

  try {
    if (!userId) {
      return new Response(JSON.stringify({ error: 'User ID is required' }), {
        status: 404,
      });
    }

    const userQuestsSummary = await getUserQuestsSummary(userId);
    return new Response(JSON.stringify(userQuestsSummary), { status: 200 });
  } catch (error) {
    console.error('Get user quests summary error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
    });
  }
};

export const config: Config = {
  path: '/api/user-quests/summary',
  method: 'GET',
};
