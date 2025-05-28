import { ReportType } from "@prisma/client"
import { createSearchParamsCache, parseAsArrayOf, parseAsInteger, parseAsString } from "nuqs/server"
import { z } from "zod"
import { config } from "~/config"
import { githubRegex } from "~/lib/github/utils"

export const filterParamsSchema = {
  q: parseAsString.withDefault(""),
  sort: parseAsString.withDefault("default"),
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(35),
  alternative: parseAsArrayOf(parseAsString).withDefault([]),
  category: parseAsArrayOf(parseAsString).withDefault([]),
  stack: parseAsArrayOf(parseAsString).withDefault([]),
  license: parseAsArrayOf(parseAsString).withDefault([]),
}

export const filterParamsCache = createSearchParamsCache(filterParamsSchema)
export type FilterSchema = Awaited<ReturnType<typeof filterParamsCache.parse>>

const repositoryMessage =
  "Please enter a valid GitHub repository URL (e.g. https://github.com/owner/name)"

export const repositorySchema = z
  .string()
  .min(1, "Repository is required")
  .url(repositoryMessage)
  .trim()
  .toLowerCase()
  .regex(githubRegex, repositoryMessage)

export const submitToolSchema = z.object({
  name: z.string().min(1, "Name is required"),
  websiteUrl: z.string().min(1, "Website is required").url("Invalid URL").trim(),
  repositoryUrl: repositorySchema,
  submitterName: z.string().min(1, "Your name is required"),
  submitterEmail: z.string().email("Please enter a valid email address"),
  submitterNote: z.string().max(200),
  newsletterOptIn: z.boolean().optional().default(true),
})

export const newsletterSchema = z.object({
  captcha: z.literal("").optional(),
  value: z.string().email("Please enter a valid email address"),
  referring_site: z.string().optional().default(config.site.url),
  utm_source: z.string().optional().default(config.site.name),
  utm_medium: z.string().optional().default("subscribe_form"),
  utm_campaign: z.string().optional().default("organic"),
  double_opt_override: z.string().optional(),
  reactivate_existing: z.boolean().optional(),
  send_welcome_email: z.boolean().optional(),
})

export const reportSchema = z.object({
  type: z.nativeEnum(ReportType),
  message: z.string().optional(),
})

export const feedbackSchema = z.object({
  message: z.string().min(1, "Message is required"),
})

export const adDetailsSchema = z.object({
  name: z.string().min(1, "Company name is required"),
  description: z.string().min(1, "Description is required").max(160),
  websiteUrl: z.string().url("Please enter a valid website URL"),
  buttonLabel: z.string().optional(),
})

export type SubmitToolSchema = z.infer<typeof submitToolSchema>
export type NewsletterSchema = z.infer<typeof newsletterSchema>
export type ReportSchema = z.infer<typeof reportSchema>
export type FeedbackSchema = z.infer<typeof feedbackSchema>
export type AdDetailsSchema = z.infer<typeof adDetailsSchema>
