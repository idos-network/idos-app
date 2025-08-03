import type { Config, Context } from '@netlify/functions';
import { saveUserQuest, type UserQuest } from '@/db/user-quests';

export default async (request: Request, _context: Context) => {
  try {
    const userQuestData = (await request.json()) as UserQuest;
    const result = await saveUserQuest(userQuestData);
    return new Response(JSON.stringify(result), { status: 201 });
  } catch (error) {
    console.error('Create user quest error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
    });
  }
};

export const config: Config = {
  path: '/api/user-quests/save',
  method: 'POST',
};
