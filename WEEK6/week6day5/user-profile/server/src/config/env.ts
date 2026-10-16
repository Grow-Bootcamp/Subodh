import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  CLIENT_PORT: z.coerce.number().int().positive().default(3000),

  JWT_SECRET: z
    .string({ error: "JWT_ACCESS_SECRET is required" })
    .min(16, "JWT_SECRET must be at least 16 characters"),

  JWT_EXPIRES_IN: z
    .string({ error: "JWT_EXPIRES_IN is required" })
    .min(1, "JWT_EXPIRES_IN must not be empty"),

  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  DB_NAME: z.string({ error: "DB_NAME is required" }),
  DB_HOST: z.string({ error: "DB_HOST is required" }),
  DB_PORT: z.coerce.number().int().positive().default(3306),
  DB_PASSWORD: z.string({ error: "DB_PASSWORD is required" }),
  DB_USER: z.string({ error: "DB_USER is required" }),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment configuration:");
  for (const issue of parsed.error.issues) {
    console.error(`  - ${issue.path.join(".") || "(root)"}: ${issue.message}`);
  }
  console.error("\nFix your .env file (see .env.example) and try again.");
  process.exit(1);
}

export const env = parsed.data;

export type Env = z.infer<typeof envSchema>;

export const isProduction = env.NODE_ENV === "production";
