import { z } from "zod"

/**
 * The schema for the content generator.
 */
export const contentSchema = z.object({
  tagline: z
    .string()
    .describe(
      "A compelling tagline (max 60 chars) that captures the tool's unique value proposition. Avoid tool name, focus on benefits.",
    ),
  description: z
    .string()
    .describe(
      "A concise meta description (max 160 chars) highlighting key features and benefits. Use active voice, avoid tool name.",
    ),
  content: z
    .string()
    .describe(
      "A detailed and engaging longer description with key benefits (up to 1000 characters). Can be Markdown formatted, but should start with paragraph and not use headings. Highlight important points with bold text. Make sure the lists use correct Markdown syntax.",
    ),
})
