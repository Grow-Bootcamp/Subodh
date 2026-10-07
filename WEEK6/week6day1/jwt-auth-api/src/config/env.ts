import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),

  PORT: z.coerce
    .number({ error: 'PORT must be a number' })
    .int('PORT must be an integer')
    .positive('PORT must be a positive integer')
    .default(3000),

  JWT_SECRET: z
    .string({ error: 'JWT_SECRET is required' })
    .min(16, 'JWT_SECRET must be at least 16 characters long'),

  JWT_EXPIRES_IN: z
    .string({ error: 'JWT_EXPIRES_IN is required' })
    .min(1, 'JWT_EXPIRES_IN must not be empty'),

  JWT_ISSUER: z.string().min(1).optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment configuration:');
  for (const issue of parsed.error.issues) {
    const key = issue.path.join('.') || '(root)';
    console.error(`  - ${key}: ${issue.message}`);
  }
  console.error('\nFix your .env file (see .env.example) and try again.');
  process.exit(1);
}

export const env = parsed.data;

export type Env = z.infer<typeof envSchema>;
