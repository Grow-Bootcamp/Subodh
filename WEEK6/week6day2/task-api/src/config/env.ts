import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(3000),

  JWT_ACCESS_SECRET: z
    .string({ error: "JWT_ACCESS_SECRET is required" })
    .min(16, "JWT_ACCESS_SECRET must be at least 16 characters"),

  JWT_REFRESH_SECRET: z
    .string({ error: "JWT_REFRESH_SECRET is required" })
    .min(16, "JWT_REFRESH_SECRET must be at least 16 characters"),

  JWT_ACCESS_EXPIRES_IN: z
    .string({ error: "JWT_ACCESS_EXPIRES_IN is required" })
    .min(1, "JWT_ACCESS_EXPIRES_IN must not be empty"),

  JWT_REFRESH_EXPIRES_IN: z
    .string({ error: "JWT_REFRESH_EXPIRES_IN is required" })
    .min(1, "JWT_REFRESH_EXPIRES_IN must not be empty"),

  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
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
