import { UserNotFoundError } from '@/utils/errors';
import type { Config } from '@netlify/functions';
import { withSentry } from './utils/sentry';


export default withSentry(async (_request: Request) => {
  throw new UserNotFoundError("TEST_USER_ID");
});

export const config: Config = {
  path: '/api/test-exception',
  method: 'GET',
};
