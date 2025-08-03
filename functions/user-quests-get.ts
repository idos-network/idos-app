import type { Config, Context } from '@netlify/functions';
import { getUserQuests, getUserQuestById } from '@/db/user-quests';

export default async (request: Request, _context: Context) => {
  const url = new URL(request.url);
  const userId = url.searchParams.get('userId');
  const id = url.searchParams.get('id');

  try {
    if (userId && id) {
      const userQuest = await getUserQuestById(userId, Number(id));
      return new Response(JSON.stringify(userQuest), { status: 200 });
    }

    if (userId) {
      const userQuests = await getUserQuests(userId);
      return new Response(JSON.stringify(userQuests), { status: 200 });
    }

    return new Response(JSON.stringify({ error: 'userId is required' }), {
      status: 400,
    });
  } catch (error) {
    console.error('Get user quests error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
    });
  }
};

export const config: Config = {
  path: '/api/user-quests',
  method: 'GET',
};
