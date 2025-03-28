import { createAnthropic } from "@ai-sdk/anthropic"
import { isTruthy } from "@curiousleaf/utils"
import { db } from "@openalternative/db"
import { generateObject } from "ai"
import { z } from "zod"
import { env } from "~/env"
import { getErrorMessage } from "~/lib/handle-error"
import { firecrawlClient } from "~/services/firecrawl"
import { tryCatch } from "~/utils/helpers"

/**
 * The system prompt for the content generator.
 */
const systemPrompt = `
  You are an expert content creator specializing in open source products.
  Your task is to generate high-quality, engaging content to display on a directory website.
  You do not use any catchphrases like "Empower", "Streamline" etc.
`

/**
 * The schema for the content generator.
 */
const contentSchema = z.object({
  tagline: z
    .string()
    .describe(
      "A tagline (up to 60 characters) that captures the essence of the tool. Should not include the tool name.",
    ),
  description: z
    .string()
    .describe(
      "A concise description (up to 160 characters) that highlights the main features and benefits. Should not include the tool name.",
    ),
  content: z
    .string()
    .describe(
      "A detailed and engaging longer description with key benefits (up to 1000 characters). Can be Markdown formatted, but should start with paragraph and not use headings. Highlight important points with bold text. Make sure the lists use correct Markdown syntax.",
    ),
})

/**
 * Scrapes a website and returns the scraped data.
 * @param url The URL of the website to scrape.
 * @returns The scraped data.
 */
const scrapeWebsiteData = async (url: string) => {
  const data = await firecrawlClient.scrapeUrl(url, { formats: ["markdown"] })

  if (!data.success) {
    throw new Error(data.error)
  }

  return data
}

/**
 * Generates content for a tool.
 * @param url The URL of the website to scrape.
 * @params prompt Additional prompt to add to the system prompt.
 * @returns The generated content.
 */
export const generateContent = async (url: string, prompt?: string) => {
  const anthropic = createAnthropic({ apiKey: env.ANTHROPIC_API_KEY })
  const model = anthropic("claude-3-5-sonnet-latest")
  const scrapedData = await scrapeWebsiteData(url)

  const { data, error } = await tryCatch(
    generateObject({
      model,
      schema: contentSchema,
      system: systemPrompt,
      temperature: 0.3,
      prompt: `
        Provide me details for the following data:
        Title: ${scrapedData.metadata?.title}
        Description: ${scrapedData.metadata?.description}
        Content: ${scrapedData.markdown}
        
        ${prompt}
      `,
    }),
  )

  if (error) {
    throw new Error(getErrorMessage(error))
  }

  return data.object
}

/**
 * Generates content for a tool with relations.
 * @param url The URL of the website to scrape.
 * @params prompt Additional prompt to add to the system prompt.
 * @returns The generated content.
 */
export const generateContentWithRelations = async (url: string, prompt?: string) => {
  const anthropic = createAnthropic({ apiKey: env.ANTHROPIC_API_KEY })
  const model = anthropic("claude-3-5-sonnet-latest")
  const scrapedData = await scrapeWebsiteData(url)

  const [categories, alternatives] = await Promise.all([
    db.category.findMany(),
    db.alternative.findMany(),
  ])

  const schema = contentSchema.extend({
    categories: z
      .array(z.string())
      .transform(a => a.map(name => categories.find(cat => cat.name === name)).filter(isTruthy))
      .describe(`
        Assign the open source software product to the categories that it belongs to.
        Try to assign the tool to multiple categories, but not more than 3.
        If a tool does not belong to any category, return an empty array.
      `),
    alternatives: z
      .array(z.string())
      .transform(a => a.map(name => alternatives.find(alt => alt.name === name)).filter(isTruthy))
      .describe(`
        Assign the open source software product to the proprietary software products that it is similar to.
        Try to assign the tool to multiple alternatives.
        If a tool does not have an alternative, return an empty array.
      `),
  })

  const { data, error } = await tryCatch(
    generateObject({
      model,
      schema,
      system: systemPrompt,
      temperature: 0.3,
      prompt: `
        Provide me details for the following data:
        Title: ${scrapedData.metadata?.title}
        Description: ${scrapedData.metadata?.description}
        Content: ${scrapedData.markdown}

        ${prompt}
        
        Here is the list of categories to assign to the tool:
        ${categories.map(({ name }) => name).join("\n")}

        Here is the list of proprietary software alternatives to assign to the tool:
        ${alternatives.map(({ name, description }) => `${name}: ${description}`).join("\n")}
      `,
    }),
  )

  if (error) {
    throw new Error(getErrorMessage(error))
  }

  return data.object
}
