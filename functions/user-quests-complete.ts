import type { Config, Context } from '@netlify/functions';
import { completeUserQuest } from '@/db/user-quests';

interface CompleteUserQuestRequest {
  questId: number;
  userId: string;
}

export default async (request: Request, _context: Context) => {
  try {
    const { questId, userId } =
      (await request.json()) as CompleteUserQuestRequest;

    if (!questId || !userId) {
      return new Response(
        JSON.stringify({
          error: 'questId and userId are required',
        }),
        { status: 400 },
      );
    }

    const result = await completeUserQuest(questId, userId);
    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    console.error('Complete user quest error:', error);

    if (error instanceof Error && error.message.includes('not repeatable')) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 409,
      });
    }
    if (error instanceof Error && error.message.includes('not found')) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
    });
  }
};

export const config: Config = {
  path: '/api/user-quests/complete',
  method: 'POST',
};
