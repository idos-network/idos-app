import { neon } from '@netlify/neon';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import * as pgSchema from './schema';
import { env } from '@/server_env';

const isProduction = (process.env.NODE_ENV || 'development') === 'production';

export const db = isProduction
  ? // @ts-ignore
  drizzle(neon(env.NETLIFY_DATABASE_URL), { schema: pgSchema })
  : drizzle(postgres(env.DATABASE_URL), { schema: pgSchema });

export const schema = pgSchema;

export const { users, userQuests } = schema;
