import { createEnv } from "@t3-oss/env-core"
import { z } from "zod"

export const env = createEnv({
  // https://docs.astro.build/pl/guides/environment-variables/#default-environment-variables
  shared: {
    MODE: z.enum(["development", "production"]).nullish(),
    PROD: z.boolean().nullish(),
    DEV: z.boolean().nullish(),
    BASE_URL: z.string().nullish(),
    SITE: z.string().url().nullish(),
    ASSETS_PREFIX: z.string().nullish(),
  },

  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app isn't
   * built with invalid env vars.
   */
  server: {
    SITE_URL: z.string().url().min(1),
    GRAPHQL_ENDPOINT: z.string().url().min(1),
    GRAPHQL_TOKEN: z.string().min(1),
    SCREENSHOTONE_ACCESS_KEY: z.string().min(1),
    SCREENSHOTONE_SECRET_KEY: z.string().min(1),
    POSTHOG_API_KEY: z.string().min(1),
  },

  /**
   * The prefix that client-side variables must have. This is enforced both at
   * a type-level and at runtime.
   */
  clientPrefix: "PUBLIC_",

  /**
   * Specify your client-side environment variables schema here.
   * For them to be exposed to the client, prefix them with `NEXT_PUBLIC_`.
   */
  client: {},

  /**
   * What object holds the environment variables at runtime. This is usually
   * `process.env` or `import.meta.env`.
   */
  runtimeEnv: import.meta.env,

  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
   * This is especially useful for Docker builds.
   */
  skipValidation: !!import.meta.env.SKIP_ENV_VALIDATION,

  /**
   * By default, this library will feed the environment variables directly to
   * the Zod validator.
   *
   * This means that if you have an empty string for a value that is supposed
   * to be a number (e.g. `PORT=` in a ".env" file), Zod will incorrectly flag
   * it as a type mismatch violation. Additionally, if you have an empty string
   * for a value that is supposed to be a string with a default value (e.g.
   * `DOMAIN=` in an ".env" file), the default value will never be applied.
   *
   * In order to solve these issues, we recommend that all new projects
   * explicitly specify this option as true.
   */
  emptyStringAsUndefined: true,
})
