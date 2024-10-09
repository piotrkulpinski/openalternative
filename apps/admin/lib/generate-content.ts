import { createAnthropic } from "@ai-sdk/anthropic"
import { openai } from "@ai-sdk/openai"
import type { Tool } from "@openalternative/db"
import { generateObject } from "ai"
import type { Jsonify } from "inngest/helpers/jsonify"
import { z } from "zod"
import { linkSchema } from "~/app/(dashboard)/tools/_lib/validations"
import { siteConfig } from "~/config/site"
import { getErrorMessage } from "~/lib/handle-error"
import { firecrawlClient } from "~/services/firecrawl"
import { prisma } from "~/services/prisma"

/**
 * Generates content for a tool.
 * @param tool The tool to generate content for.
 * @returns The generated content.
 */
export const generateContent = async (tool: Tool | Jsonify<Tool>) => {
  const model = createAnthropic()("claude-3-5-sonnet-20240620")

  try {
    const scrapedData = await firecrawlClient.scrapeUrl(tool.website, {
      formats: ["markdown"],
    })

    if (!scrapedData.success) {
      throw new Error(scrapedData.error)
    }

    const { object } = await generateObject({
      model,
      system: `
        You are an expert content creator specializing in open source products.
        Your task is to generate high-quality, engaging content to display on a directory website.
        You do not use any catchphrases like "Empower", "Streamline" etc.
      `,
      prompt: `
        Provide me details for the following data:
        title: ${scrapedData.metadata?.title}
        description: ${scrapedData.metadata?.description}
        content: ${scrapedData.markdown}
      `,
      schema: z.object({
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
            "A detailed and engaging longer description with key benefits (up to 1000 characters). Can be Markdown formatted, but should start with paragraph. Make sure the lists use correct Markdown syntax.",
          ),
        links: z
          .array(linkSchema)
          .describe(
            "A list of relevant links to pricing information, documentation, social profiles and other resources. Make sure to include the name of the link and the URL. Social profiles should be last. Skip landing page and Github repository links.",
          ),
      }),
    })

    return object
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

/**
 * Generates a list of categories for a tool.
 * @param tool The tool to generate categories for.
 * @returns The list of categories.
 */
export const generateCategories = async (tool: string) => {
  const model = openai("gpt-4o")
  const categories = await prisma.category.findMany()

  const { object } = await generateObject({
    model,
    output: "array",
    schema: z.string().describe("The name of the category"),
    prompt: `
      Take the following list of categories and an open source software product.
      Assign the open source software product to the categories that it belongs to.
      Try to assign the tool to multiple categories if it belongs to multiple categories.
      If a tool does not belong to any category, return an empty array.

      === Start of Categories ===
      ${categories.map(cat => cat.name).join("\n")}
      === End of Categories ===

      === Start of Open Source Product ===
      ${tool}
      === End of Open Source Product ===
    `,
  })

  return object
}

/**
 * Generates a list of alternatives for a tool.
 * @param tool The tool to generate alternatives for.
 * @returns The list of alternatives.
 */
export const generateAlternatives = async (tool: string) => {
  const model = openai("gpt-4o")
  const alternatives = await prisma.alternative.findMany()

  const { object } = await generateObject({
    model,
    output: "array",
    schema: z.string().describe("The name of the alternative"),
    prompt: `
      Take the following list of proprietary software products and an open source software product.
      Assign the open source software product to the proprietary software products that it is similar to.
      Try to assign the tool to multiple alternatives if it is similar to multiple alternatives.
      If a tool does not have an alternative, return an empty array.

      === Start of Proprietary Products ===
      ${alternatives.map(alt => `${alt.name}: ${alt.description}`).join("\n")}
      === End of Proprietary Products ===

      === Start of Open Source Product ===
      ${tool}
      === End of Open Source Product ===
    `,
  })

  return object
}

/**
 * Generates a launch tweet for a tool.
 * @param tool The tool to generate a launch tweet for.
 * @returns The launch tweet.
 */
export const generateLaunchTweet = async (tool: Tool | Jsonify<Tool>) => {
  const model = openai("gpt-4o")

  const { object } = await generateObject({
    model,
    schema: z.object({
      tweet: z.string().max(240).describe("The launch tweet"),
    }),
    system: `
      You are an expert content creator.
      Use new lines to separate paragraphs.
      Use the following template:
      "
      🚀 Just published — {name} ({twitter handle}): {tagline}

      {description}

      {links}
      "
    `,
    prompt: `
      Generate a tweet to announce the feature of the following open source software product:

      Name: "${tool.name}"
      Tagline: "${tool.tagline}"
      Description: "${tool.description}"
      Twitter Handle: "${tool.twitterHandle}"
      Link: "${siteConfig.url}/${tool.slug}"
    `,
  })

  return object
}

/**
 * Finds the Twitter handle from a list of links.
 * @param links The list of links.
 * @returns The Twitter handle, or undefined if not found.
 */
export const findTwitterHandle = (links: z.infer<typeof linkSchema>[]) => {
  const regex = /(?:https?:\/\/)?(?:www\.)?(?:twitter\.com\/|x\.com\/)?@?([a-zA-Z0-9_]{1,25})/

  const twitterLink = links.find(
    ({ url }) => url.startsWith("https://twitter.com/") || url.startsWith("https://x.com/"),
  )

  if (!twitterLink) return undefined

  const match = twitterLink.url.match(regex)

  return match ? match[1] : undefined
}
