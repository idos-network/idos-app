import type { Config, Context } from '@netlify/functions';
import { completeUserQuest } from '@/db/user-quests';
import { z, ZodError } from 'zod';

const completeUserQuestRequestSchema = z.object({
  questName: z.string().min(1, 'questName is required'),
  userId: z.string().min(1, 'userId is required'),
});

export default async (request: Request, _context: Context) => {
  try {
    const requestBody = await request.json();
    const { questName, userId } =
      completeUserQuestRequestSchema.parse(requestBody);

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

    if (error instanceof ZodError) {
      return new Response(JSON.stringify({ error: 'Invalid request data' }), {
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
