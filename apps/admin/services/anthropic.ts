import { createAnthropic } from "@ai-sdk/anthropic"
import { env } from "~/env"

export const anthropicClient = createAnthropic({
  apiKey: env.ANTHROPIC_API_KEY,
})
