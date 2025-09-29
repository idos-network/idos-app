import type { Context } from "@netlify/functions";
import * as Sentry from "@sentry/aws-serverless";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0, // nebo míň v produkci
});


export const withSentry = Sentry.wrapHandler as unknown as <T = Response>(handler: (request: Request, context: Context) => Promise<T>) => (event: Request, context: Context) => Promise<T>;
