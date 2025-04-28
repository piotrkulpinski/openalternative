import { anthropic } from "@ai-sdk/anthropic"
import { streamObject } from "ai"
import { z } from "zod"
import { withAdminAuth } from "~/lib/auth-hoc"
import { scrapeWebsiteData } from "~/lib/scraper"
import { contentSchema } from "~/server/admin/shared/schema"

export const maxDuration = 60

const generateContentSchema = z.object({
  url: z.string().url(),
})

export const POST = withAdminAuth(async req => {
  const { url } = generateContentSchema.parse(await req.json())
  const scrapedData = await scrapeWebsiteData(url)

  const result = streamObject({
    model: anthropic("claude-3-5-sonnet-latest"),
    schema: contentSchema,
    system: `
      You are an expert content creator specializing in open source products.
      Your task is to generate high-quality, engaging content to display on a directory website.
      You do not use any catchphrases like "Empower", "Streamline" etc.
    `,
    temperature: 0.3,
    prompt: `
      Provide me details for the following data:
      Title: ${scrapedData.title}
      Description: ${scrapedData.description}
      Content: ${scrapedData.content}
    `,
    onError: error => {
      console.error(error)
      throw error
    },
  })

  return result.toTextStreamResponse()
})
