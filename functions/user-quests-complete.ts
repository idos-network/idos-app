import type { Config, Context } from '@netlify/functions';
import { completeUserQuest } from '@/db/user-quests';

interface CompleteUserQuestRequest {
  questName: string;
  userId: string;
}

export default async (request: Request, _context: Context) => {
  try {
    const { questName, userId } =
      (await request.json()) as CompleteUserQuestRequest;

    if (!questName || !userId) {
      return new Response(
        JSON.stringify({
          error: 'questName and userId are required',
        }),
        { status: 400 },
      );
    }

    const result = await completeUserQuest(userId, questName);

    if (!result.success) {
      if (result.code === 'QUEST_NOT_FOUND') {
        return new Response(JSON.stringify({ error: result.error }), {
          status: 404,
        });
      }
      if (result.code === 'QUEST_NOT_REPEATABLE') {
        return new Response(JSON.stringify({ error: result.error }), {
          status: 409,
        });
      }
      return new Response(JSON.stringify({ error: result.error }), {
        status: 500,
      });
    }

    return new Response(JSON.stringify(result.data), { status: 200 });
  } catch (error) {
    console.error('Complete user quest error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
    });
  }
};

export const config: Config = {
  path: '/api/user-quests/complete',
  method: 'POST',
};
