import { neon } from '@netlify/neon';
import { drizzle as drizzlePostgres } from 'drizzle-orm/postgres-js';
import { drizzle as drizzleNeon } from 'drizzle-orm/neon-http';
import postgres from 'postgres';

import * as pgSchema from './schema';
import { env } from '@/server_env';

const isProduction = (process.env.NODE_ENV || 'development') === 'production';

export const db = isProduction
  ? drizzleNeon(neon(env.NETLIFY_DATABASE_URL), { schema: pgSchema })
  : drizzlePostgres(postgres(env.DATABASE_URL), { schema: pgSchema });

export const schema = pgSchema;

export const { users, userQuests } = schema;
