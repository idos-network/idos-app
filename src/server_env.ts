import z from 'zod';

const schema = z.object({
  NETLIFY_DATABASE_URL:
    process.env.NODE_ENV === 'production'
      ? z.string().min(1)
      : z.string().optional(),
  DATABASE_URL: z.string().default('postgres://localhost:5432/idos_dev'),
  JWT_SECRET: z
    .string()
    .min(32)
    .default('your-secret-key-change-in-production'),
});

export const env = schema.parse(process.env);
