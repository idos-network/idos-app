import { drizzle } from 'drizzle-orm/better-sqlite3';
import { drizzle as drizzlePostgres } from 'drizzle-orm/neon-http';
import { neon } from '@netlify/neon';
import Database from 'better-sqlite3';

import * as pgSchema from './schema';
import * as sqliteSchema from './schema-local';

const isProduction = (process.env.NODE_ENV || 'development') === 'production';

export const db = (
  isProduction
    ? drizzlePostgres({
        schema: pgSchema,
        client: neon(),
      })
    : (() => {
        const sqlite = new Database('./local.db');
        return drizzle(sqlite, { schema: sqliteSchema });
      })()
) as any;

export const schema = isProduction ? pgSchema : sqliteSchema;

export const { users, userQuests } = schema;
