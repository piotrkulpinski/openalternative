import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

export const env = createEnv({
  shared: {
    PORT: z.coerce.number().default(8000),
    VERCEL_URL: z
      .string()
      .optional()
      .transform(v => (v ? `https://${v}` : undefined)),
  },

  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app isn't
   * built with invalid env vars.
   */
  server: {
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    VERCEL_ENV: z.enum(["development", "preview", "production"]).default("development"),
    DATABASE_URL: z.string().min(1),
    AUTH_SECRET: z.string().min(1),
    AUTH_ALLOWED_EMAILS: z.string().optional(),
    AUTH_GOOGLE_ID: z.string().min(1),
    AUTH_GOOGLE_SECRET: z.string().min(1),
    ALGOLIA_ADMIN_API_KEY: z.string().min(1),
    RESEND_API_KEY: z.string().min(1),
    S3_BUCKET: z.string().min(1),
    S3_REGION: z.string().min(1),
    S3_ACCESS_KEY: z.string().min(1),
    S3_SECRET_ACCESS_KEY: z.string().min(1),
    STRIPE_SECRET_KEY: z.string().min(1),
    STRIPE_WEBHOOK_SECRET: z.string().min(1),
    GITHUB_TOKEN: z.string().min(1),
    SCREENSHOTONE_ACCESS_KEY: z.string().min(1),
    PLAUSIBLE_API_KEY: z.string().min(1),
    TWITTER_API_KEY: z.string().min(1),
    TWITTER_API_SECRET: z.string().min(1),
    TWITTER_ACCESS_TOKEN: z.string().min(1),
    TWITTER_ACCESS_SECRET: z.string().min(1),
    OPENAI_API_KEY: z.string().min(1),
    ANTHROPIC_API_KEY: z.string().min(1),
    FIRECRAWL_API_KEY: z.string().min(1),
  },

  /**
   * Specify your client-side environment variables schema here.
   * For them to be exposed to the client, prefix them with `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_SITE_URL: z.string().url().min(1),
    NEXT_PUBLIC_SITE_ADMIN_URL: z.string().url().min(1),
    NEXT_PUBLIC_SITE_EMAIL: z.string().email().min(1),
    NEXT_PUBLIC_ALGOLIA_APP_ID: z.string().min(1),
    NEXT_PUBLIC_ALGOLIA_INDEX_NAME: z.string().min(1),
    NEXT_PUBLIC_PLAUSIBLE_DOMAIN: z.string().min(1),
    NEXT_PUBLIC_PLAUSIBLE_HOST: z.string().url().min(1),
  },

  /**
   * Destructure all variables from `process.env` to make sure they aren't tree-shaken away.
   */
  experimental__runtimeEnv: {
    PORT: process.env.PORT,
    VERCEL_URL: process.env.VERCEL_URL,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_SITE_ADMIN_URL: process.env.NEXT_PUBLIC_SITE_ADMIN_URL,
    NEXT_PUBLIC_SITE_EMAIL: process.env.NEXT_PUBLIC_SITE_EMAIL,
    NEXT_PUBLIC_ALGOLIA_APP_ID: process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
    NEXT_PUBLIC_ALGOLIA_INDEX_NAME: process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME,
    NEXT_PUBLIC_PLAUSIBLE_DOMAIN: process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN,
    NEXT_PUBLIC_PLAUSIBLE_HOST: process.env.NEXT_PUBLIC_PLAUSIBLE_HOST,
  },

  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
   * This is especially useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,

  /**
   * Makes it so that empty strings are treated as undefined.
   * `SOME_VAR: z.string()` and `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
})

export const isProd =
  process.env.NODE_ENV === "production" || process.env.VERCEL_ENV === "production"
export const isDev = !isProd
