
import type { Config, Context } from "@netlify/functions";
export default async (request: Request, _context: Context) => {


  return new Response(JSON.stringify({
    time:
      Date.now()
  }), { status: 200 });
}

export const config: Config = {
  path: '/api/time',
  method: 'GET',
};
