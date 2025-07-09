import type { ZodSchema } from 'zod';

export function parseWithSchema<T>(data: unknown, schema: ZodSchema<T>): T {
  try {
    return schema.parse(data);
  } catch (error) {
    console.error('Parsing error:', error);
    throw new Error('Invalid response format');
  }
}
