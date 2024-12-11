import { createAnthropic } from "@ai-sdk/anthropic"
import { isTruthy } from "@curiousleaf/utils"
import type { ScrapeResponse } from "@mendable/firecrawl-js"
import { generateObject } from "ai"
import { z } from "zod"
import { getErrorMessage } from "~/lib/handle-error"
import { prisma } from "~/services/prisma"

/**
 * Generates content for a tool.
 * @param tool The tool to generate content for.
 * @returns The generated content.
 */
export const generateContent = async (scrapedData: Omit<ScrapeResponse, "actions">) => {
  const model = createAnthropic()("claude-3-5-sonnet-20240620")

  const [categories, alternatives] = await Promise.all([
    prisma.category.findMany(),
    prisma.alternative.findMany(),
  ])

  try {
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
