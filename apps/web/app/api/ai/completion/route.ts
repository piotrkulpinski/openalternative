import { google } from "@ai-sdk/google"
import { streamText } from "ai"
import { z } from "zod"
import { withAdminAuth } from "~/lib/auth-hoc"

const completionSchema = z.object({
  prompt: z.string(),
  model: z
    .enum(["gemini-2.0-pro-exp-02-05", "gemini-2.0-flash-lite-preview-02-05"])
    .optional()
    .default("gemini-2.0-flash-lite-preview-02-05"),
})

export const POST = withAdminAuth(async req => {
  const { prompt, model } = completionSchema.parse(await req.json())

  const result = streamText({
    model: google(model),
    prompt,
    maxTokens: 300,
  })

  return result.toDataStreamResponse()
})
