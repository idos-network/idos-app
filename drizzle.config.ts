import { env } from '@/server_env';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    dialect: 'postgresql',
    dbCredentials: {
        url: env.NETLIFY_DATABASE_URL! || env.DATABASE_URL!,
    },
    schema: './db/schema.ts',
    /**
     * Never edit the migrations directly, only use drizzle.
     * There are scripts in the package.json "db:generate" and "db:migrate" to handle this.
     */
    out: './migrations',
});
