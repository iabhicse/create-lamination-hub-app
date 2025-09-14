import dotenv from "dotenv";
import { z } from "zod";
dotenv.config();

// ✅ Load environment variables from .env file
// ✅ Define schema with defaults and transformations
const envConfigSchema = z.object({
  COOKIE_SECRET_TOKEN: z.string().default("secret-token"),
  COOKIE_EXPIRES_IN: z.string().default("7d"),
  COOKIE_DOMAIN: z.string().default("localhost"),
  COOKIE_SECURE: z.boolean().default(true),
  JWT_SECRET_TOKEN: z.string().default("jwt-secret-token"),
  JWT_REFRESH_TOKEN: z.string().default("jwt-refresh-token"),
  JWT_ACCESS_TOKEN: z.string().default("jwt-access-token"),
});

// ✅ Validate process.env safely
const parsed = envConfigSchema.safeParse(process.env);

if (!parsed.success) {
  throw new Error(
    `❌ Invalid cookie environment variables:\n${parsed.error.issues
      .map((i) => `• ${i.path.join(".")}: ${i.message}`)
      .join("\n")}`
  );
}

// ✅ Export validated config
export const envCookieConfig = Object.freeze(parsed.data);

// ✅ Optional: Export type (for type-safe config)
export type EnvCookieConfig = z.infer<typeof envConfigSchema>;
