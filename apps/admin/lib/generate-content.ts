import { createAnthropic } from "@ai-sdk/anthropic"
import { openai } from "@ai-sdk/openai"
import { isTruthy } from "@curiousleaf/utils"
import type { Tool } from "@openalternative/db"
import { generateObject } from "ai"
import type { Jsonify } from "inngest/helpers/jsonify"
import { z } from "zod"
import { config } from "~/config"
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

  const [categories, alternatives] = await Promise.all([
    prisma.category.findMany(),
    prisma.alternative.findMany(),
  ])

  try {
    const scrapedData = await firecrawlClient.scrapeUrl(tool.website, {
      formats: ["markdown"],
    })

    if (!scrapedData.success) {
      throw new Error(scrapedData.error)
    }

    const schema = z.object({
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
      categories: z
        .array(z.string())
        .max(3)
        .transform(a => a.map(name => categories.find(cat => cat.name === name)).filter(isTruthy))
        .describe(`
          Assign the open source software product to the categories that it belongs to.
          Try to assign the tool to multiple categories.
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

    const { object } = await generateObject({
      model,
      schema,
      system: `
        You are an expert content creator specializing in open source products.
        Your task is to generate high-quality, engaging content to display on a directory website.
        You do not use any catchphrases like "Empower", "Streamline" etc.
      `,
      prompt: `
        Provide me details for the following data:
        Title: ${scrapedData.metadata?.title}
        Description: ${scrapedData.metadata?.description}
        Content: ${scrapedData.markdown}
        
        Here is the list of categories to assign to the tool:
        ${categories.map(({ name }) => name).join("\n")}

        Here is the list of proprietary software alternatives to assign to the tool:
        ${alternatives.map(({ name, description }) => `${name}: ${description}`).join("\n")}
      `,
      temperature: 0.3,
    })

    return object
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
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
      tweet: z.string().max(280).describe("The launch tweet"),
    }),
    system: `
      You are an expert content creator.
      Use new lines to separate paragraphs.
      Tweet should do not exceed 240 characters.
      Use the following template:
      
      "🚀 Just published — {name} ({twitter handle}): {tagline}

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
      Link: "${config.site.url}/${tool.slug}"
    `,
  })

  return object
}
