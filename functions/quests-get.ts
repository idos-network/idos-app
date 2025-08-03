import type { Config, Context } from '@netlify/functions';
import { getActiveQuests } from '@/db/quests';

export default async (_request: Request, _context: Context) => {
  try {
    const quests = await getActiveQuests();
    return new Response(JSON.stringify(quests), { status: 200 });
  } catch (error) {
    console.error('Get quests error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
    });
  }
};

export const config: Config = {
  path: '/api/quests',
  method: 'GET',
};
