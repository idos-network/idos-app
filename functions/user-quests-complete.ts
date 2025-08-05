import type { Config, Context } from '@netlify/functions';
import { completeUserQuest } from '@/db/user-quests';
import { z, ZodError } from 'zod';
import { InternalServerError, ValidationError } from '@/utils/errors';

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

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    if (error instanceof ZodError) {
      throw new ValidationError(error.message);
    }

    throw new InternalServerError(
      error instanceof Error ? error.message : 'Internal server error',
    );
  }
};

export const config: Config = {
  path: '/api/user-quests/complete',
  method: 'POST',
};
