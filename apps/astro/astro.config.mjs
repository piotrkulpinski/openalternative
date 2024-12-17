// @ts-check
import cloudflare from "@astrojs/cloudflare"
import { defineConfig, envField } from "astro/config"

export default defineConfig({
  devToolbar: { enabled: false },
  experimental: {
    responsiveImages: true,
    svg: true,
  },
  compressHTML: true,
  adapter: cloudflare(),
  env: {
    schema: {
      PUBLIC_SITE_URL: envField.string({ context: "client", access: "public" }),
      PUBLIC_SITE_EMAIL: envField.string({ context: "client", access: "public" }),
      DATABASE_URL: envField.string({ context: "server", access: "secret" }),
      DATABASE_URL_UNPOOLED: envField.string({ context: "server", access: "secret" }),
      PUBLIC_POSTHOG_API_KEY: envField.string({ context: "client", access: "public" }),
      PUBLIC_POSTHOG_HOST: envField.string({ context: "client", access: "public" }),
      PUBLIC_PLAUSIBLE_DOMAIN: envField.string({ context: "client", access: "public" }),
      PUBLIC_PLAUSIBLE_HOST: envField.string({ context: "client", access: "public" }),
      BEEHIIV_API_KEY: envField.string({ context: "server", access: "secret" }),
      BEEHIIV_PUBLICATION_ID: envField.string({ context: "server", access: "secret" }),
      STRIPE_SECRET_KEY: envField.string({ context: "server", access: "secret" }),
      STRIPE_WEBHOOK_SECRET: envField.string({ context: "server", access: "secret" }),
      STRIPE_PRODUCT_IDS: envField.string({ context: "server", access: "secret" }),
    },
  },
  integrations: [],
})
