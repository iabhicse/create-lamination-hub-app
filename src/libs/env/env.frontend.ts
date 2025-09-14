import dotenv from "dotenv";
import { z } from "zod";
dotenv.config();

// ✅ Load environment variables from .env file
// ✅ Define schema with defaults and transformations
const envConfigSchema = z.object({
  FRONTEND_URL: z.url().trim().default("http://localhost:3000"),
  FRONTEND_API_URL: z.url().trim().default("http://localhost:3000/api"),
});

// ✅ Validate process.env safely
const parsed = envConfigSchema.safeParse(process.env);

if (!parsed.success) {
  throw new Error(
    `❌ Invalid frontend environment variables:\n${parsed.error.issues
      .map((i) => `• ${i.path.join(".")}: ${i.message}`)
      .join("\n")}`
  );
}

// ✅ Export validated config
export const envFrontendConfig = Object.freeze({
  APP_FRONTEND: parsed.data.FRONTEND_URL,
  APP_FRONTEND_API_URL: parsed.data.FRONTEND_API_URL,
});

// ✅ Optional: Export type
export type EnvFrontendConfig = z.infer<typeof envConfigSchema>;
