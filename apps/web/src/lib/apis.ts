import type { AllowedKeys } from "@specfy/stack-analyser"
import wretch from "wretch"
import { env } from "~/env"

export const analyzerApi = wretch("http://localhost:3001/api")
  .headers({ "X-API-Key": env.STACK_ANALYZER_API_KEY })
  .errorType("json")
  .resolve(r => r.json<AllowedKeys[]>())

export const brandLinkApi = wretch("https://brandlink.piotr-f64.workers.dev/api")
  .errorType("json")
  .resolve(r => r.json<Record<string, Array<Record<string, string> & { url: string }>>>())
