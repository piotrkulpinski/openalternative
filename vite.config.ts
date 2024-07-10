import { vitePlugin as remix } from "@remix-run/dev"
import { installGlobals } from "@remix-run/node"
import { vercelPreset } from "@vercel/remix/vite"
import { defineConfig } from "vite"
import tsconfigPaths from "vite-tsconfig-paths"
import contentCollections from "@content-collections/remix-vite"

installGlobals()

export default defineConfig({
  ssr: {
    noExternal: ["tailwind-merge", "remix-utils"],
  },
  plugins: [tsconfigPaths(), remix({ presets: [vercelPreset()] }), contentCollections()],
})
