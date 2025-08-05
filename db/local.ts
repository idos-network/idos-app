import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';

import * as schema from './schema-local';

// Create SQLite database for local development
const sqlite = new Database('./local.db');

export const db = drizzle(sqlite, { schema });
