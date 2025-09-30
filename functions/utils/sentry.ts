import type { Context } from "@netlify/functions";
import * as Sentry from "@sentry/aws-serverless";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0, // or less in prod
  ignoreErrors: ["Possible function timeout: undefined"], // This is because of neon & drizzle
});


export const withSentry = Sentry.wrapHandler as unknown as <T = Response>(handler: (request: Request, context: Context) => Promise<T>) => (event: Request, context: Context) => Promise<T>;

