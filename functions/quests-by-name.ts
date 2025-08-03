import type { Config, Context } from '@netlify/functions';
import { getQuestByName } from '@/db/quests';

export default async (_request: Request, context: Context) => {
  const { questName } = context.params;

  try {
    if (!questName) {
      return new Response(JSON.stringify({ error: 'Quest name is required' }), {
        status: 400,
      });
    }

    const quest = await getQuestByName(questName);
    return new Response(JSON.stringify(quest), { status: 200 });
  } catch (error) {
    console.error('Get quest by name error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
    });
  }
};

export const config: Config = {
  path: '/api/quests/:questName',
  method: 'GET',
};
