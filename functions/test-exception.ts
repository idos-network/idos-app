import { UserNotFoundError } from '@/utils/errors';
import type { Config } from '@netlify/functions';
import * as Sentry from "@sentry/aws-serverless";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0, // nebo míň v produkci
});


export default Sentry.wrapHandler<Request, never>(async (_request: Request) => {
  throw new UserNotFoundError("TEST_USER_ID");
});

// export default Sentry.wrapHandler(handler)

export const config: Config = {
  path: '/api/test-exception',
  method: 'GET',
};
