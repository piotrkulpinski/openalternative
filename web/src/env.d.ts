/// <reference types="astro/client" />

import { z } from "zod"
import type { env } from "./variables"

interface ImportMeta {
  readonly env: z.infer<typeof env>
}

declare global {
  interface Window {
    posthog: any
  }
}

export type ExpandRecursively<T> = T extends object
  ? T extends infer O
    ? { [K in keyof O]: ExpandRecursively<O[K]> }
    : never
  : T

export type RemoveNull<T> = ExpandRecursively<{ [K in keyof T]: Exclude<RemoveNull<T[K]>, null> }>
