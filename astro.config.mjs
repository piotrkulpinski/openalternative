import tailwind from "@astrojs/tailwind"
import { defineConfig } from "astro/config"

import cloudflare from "@astrojs/cloudflare"

// https://astro.build/config
export default defineConfig({
  site: "https://openalternative.local",
  integrations: [tailwind()],
  output: "hybrid",
  adapter: cloudflare(),
})
