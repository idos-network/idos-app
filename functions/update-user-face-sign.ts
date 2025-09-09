import { updateUserFaceSign } from '@/db/user';
import type { Config, Context } from '@netlify/functions';

export default async (request: Request, _context: Context) => {
    const { userId, faceSignHash } = await request.json();
    await updateUserFaceSign(userId, faceSignHash);
    return new Response(JSON.stringify({ success: true }), { status: 200 });
};

export const config: Config = {
    path: '/api/update-user-face-sign',
    method: 'POST',
};