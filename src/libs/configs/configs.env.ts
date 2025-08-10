import * as dotenv from "dotenv";
import packageJSON from "../../../package.json";

dotenv.config();
// App/server development or build configs
const _envAppConfig = {
  APP_VERSION: process.env.APP_VERSION || packageJSON.version,
  APP_NAME: process.env.APP_NAME || packageJSON.name,
  APP_HOST: process.env.APP_HOST || "http://localhost:7164",
  APP_ENV: process.env.APP_ENV || ("development" as string),
  NODE_ENV: process.env.APP_ENV || ("development" as string),
  APP_API_PATH: process.env.APP_API_PATH || "/api",
  APP_PORT: process.env.APP_PORT
    ? parseInt(process.env.APP_PORT as string, 10)
    : process.env.SERVER_PORT
      ? parseInt(process.env.SERVER_PORT as string, 10)
      : 7164,
  SERVER_PORT: parseInt(process.env.SERVER_PORT as string, 10) | 7164,
};

//mysql database env configs
const _envDBConfig = {
  DB_URL: process.env.DB_URL as string,
  DB_NAME: process.env.DB_NAME as string,
  DB_HOST: process.env.DB_HOST as string,
  DB_USERNAME: process.env.DB_USERNAME as string,
  DB_PASSWORD: process.env.DB_PASSWORD as string,
  DB_SYNC: parseInt(process.env.DB_SYNC as string, 10) | (0 as number),
  DB_PORT: parseInt(process.env.DB_PORT as string, 10) | (3306 as number),
};

//redis database config
const _envRedisDBConfig = {
  DB_URL: process.env.DB_REDIS_URL as string,
  DB_TOKEN: process.env.DB_REDIS_TOKEN as string,
};

//supabase database config
const _envSupabaseDBConfig = {
  DB_SUPABASE_URL: process.env.DB_SUPABASE_URL! as string,
  DB_SUPABASE_ANON_KEY: process.env.DB_SUPABASE_ANON_KEY! as string,
};

//mail service configs
const _envMailServicesConfig = {
  SMTP_URL: process.env.SMTP_URL as string,
  SMTP_HOST: process.env.SMTP_HOST as string,
  SMTP_SERVICE: process.env.SMTP_SERVICE as string,
  SMTP_USER: process.env.SMTP_USER as string,
  SMTP_PASSWORD: process.env.SMTP_PASSWORD as string,
  SMTP_PORT: parseInt(process.env.SMTP_PORT as string, 10) | (465 as number),
};

const _envJWTConfig = {
  JWT_SECRET_TOKEN: process.env.JWT_SECRET_TOKEN as string,
  JWT_ACCESS_TOKEN: process.env.JWT_ACCESS_TOKEN as string,
  JWT_REFRESH_TOKEN: process.env.JWT_REFRESH_TOKEN as string,
  // JWT_EXPIRES_IN: parseInt(process.env.JWT_EXPIRES_IN as string, 10) || (60 * 60 * 24 * 7),
  // JWT_ALGORITHM: process.env.JWT_ALGORITHM as string,
  // JWT_AUDIENCE: process.env.JWT_AUDIENCE as string,
  // JWT_ISSUER: process.env.JWT_ISSUER as string,
  // JWT_SUBJECT: process.env.JWT_SUBJECT as string,
  // JWT_ID: process.env.JWT_ID as string,
  // JWT_SCOPE: process.env.JWT_SCOPE as string,
  // JWT_TYPE: process.env.JWT_TYPE as string,
  // JWT_KEY_ID: process.env.JWT_KEY_ID as string,
  // JWT_CERTIFICATE: process.env.JWT_CERTIFICATE as string,
};

const _envCookieConfig = {
  COOKIE_SECURE: process.env.APP_ENV === "production" ? true : false,
  COOKIE_HTTP_ONLY: process.env.APP_ENV === "production" ? true : false,
  COOKIE_DOMAIN: process.env.COOKIE_DOMAIN as string | "localhost",
  // COOKIE_MAX_AGE: parseInt(process.env.COOKIE_MAX_AGE as string, 10) || (60 * 60 * 24 * 7),
  // COOKIE_DOMAIN: process.env.COOKIE_DOMAIN as string,
  // COOKIE_PATH: process.env.COOKIE_PATH as string,
  // COOKIE_SAME_SITE: process.env.COOKIE_SAME_SITE as string,
};

const _envGoogleConfig = {
  GOOGLE_CLIENT_ID:
    (process.env.GOOGLE_CLIENT_ID as string) || "google-client-id",
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET as string,
  GOOGLE_REDIRECT_URL: process.env.GOOGLE_REDIRECT_URL as string,
};

const _envGithubConfig = {
  GITHUB_CLIENT_ID:
    (process.env.GITHUB_CLIENT_ID as string) || "github-client-id",
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET as string,
  GITHUB_REDIRECT_URL: process.env.GITHUB_REDIRECT_URL as string,
};

export const envAppConfig = Object.freeze(_envAppConfig);
export const envDBConfig = Object.freeze(_envDBConfig);
export const envRedisDBConfig = Object.freeze(_envRedisDBConfig);
export const envSupabaseDBConfig = Object.freeze(_envSupabaseDBConfig);
export const envMailServicesConfig = Object.freeze(_envMailServicesConfig);
export const envJWTConfig = Object.freeze(_envJWTConfig);
export const envCookieConfig = Object.freeze(_envCookieConfig);
export const envGoogleConfig = Object.freeze(_envGoogleConfig);
export const envGithubConfig = Object.freeze(_envGithubConfig);
