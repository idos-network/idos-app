import { UserNotFoundError } from '@/utils/errors';
import { withSentry } from "@neptune.digital/sentry-netlify-v2";
import type { Config, Context } from '@netlify/functions';

export default withSentry(async (_request: Request, _context: Context) => {
  throw new UserNotFoundError("TEST_USER_ID");
});

export const config: Config = {
  path: '/api/test-exception',
  method: 'GET',
};
