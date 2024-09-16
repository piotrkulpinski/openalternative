import type { Tool } from "@openalternative/db"
import { generateObject } from "ai"
import type { Jsonify } from "inngest/helpers/jsonify"
import { z } from "zod"
import { getErrorMessage } from "~/lib/handle-error"
import { anthropicClient } from "~/services/anthropic"
import { firecrawlClient } from "~/services/firecrawl"

export const generateContent = async (tool: Tool | Jsonify<Tool>) => {
  // Generate content using Anthropic
  const model = anthropicClient("claude-3-5-sonnet-20240620")

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
          .array(z.object({ name: z.string(), url: z.string().url() }))
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
