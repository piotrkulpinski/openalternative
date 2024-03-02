import sitemap from "@astrojs/sitemap"
import tailwind from "@astrojs/tailwind"
import { defineConfig } from "astro/config"

// https://astro.build/config
export default defineConfig({
  site: process.env.SITE_URL || "https://openalternative.local",
  integrations: [tailwind(), sitemap()],
})
