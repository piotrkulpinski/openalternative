import { vitePlugin as remix } from "@remix-run/dev"
import { installGlobals } from "@remix-run/node"
import { vercelPreset } from "@vercel/remix/vite"
import { defineConfig } from "vite"
import tsconfigPaths from "vite-tsconfig-paths"

installGlobals()

export default defineConfig({
  ssr: {
    noExternal: ["tailwind-merge", "remix-utils/client-only"],
  },
  // optimizeDeps: {
  //   include: ["tailwind-merge"],
  // },
  // build: {
  //   rollupOptions: {
  //     external
  //   }
  // },
  plugins: [tsconfigPaths(), remix({ presets: [vercelPreset()] })],
})
