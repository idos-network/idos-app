import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'sqlite',
  dbCredentials: {
    url: './local.db',
  },
  schema: './db/schema-local.ts',
  /**
   * Local SQLite database for development.
   * Use npm run db:setup:local to initialize.
   */
  out: './migrations-local',
});
