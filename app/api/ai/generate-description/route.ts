import { google } from "@ai-sdk/google"
import { streamObject } from "ai"
import { z } from "zod"
import { isDev } from "~/env"
import { withAdminAuth } from "~/lib/auth-hoc"
import { descriptionSchema } from "~/server/admin/shared/schema"

export const maxDuration = 60

const generateContentSchema = z.object({
  url: z.string().url(),
})

export const POST = withAdminAuth(async req => {
  const { url } = generateContentSchema.parse(await req.json())

  const result = streamObject({
    model: isDev ? google("gemini-2.5-pro-preview-05-06") : google("claude-3-5-sonnet-latest"),
    schema: descriptionSchema,
    system: `
      You are an expert content creator specializing in reasearching and writing about software.
      Your task is to generate high-quality, engaging content to display on a directory website.
      DO NOT use catchphrases like "Empower", "Streamline" etc.
    `,
    temperature: 0.3,
    maxTokens: 5000,
    prompt: `Provide me details for the following website URL: ${url}.`,
    onError: error => {
      console.error(error)
      throw error
    },
  })

  return result.toTextStreamResponse()
})
