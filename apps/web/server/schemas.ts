import { ReportType } from "@openalternative/db/client"
import { getRepositoryString, githubRegex } from "@openalternative/github"
import { z } from "zod"
import { config } from "~/config"

export const repositorySchema = z
  .string()
  .min(1, "Repository is required")
  .trim()
  .toLowerCase()
  .regex(githubRegex, "Please enter a valid GitHub repository (e.g. https://github.com/owner/name)")

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

export const stackAnalyzerSchema = z.object({
  repository: repositorySchema.transform(getRepositoryString),
})

export const reportSchema = z.object({
  type: z.nativeEnum(ReportType),
  message: z.string().optional(),
})

export type SubmitToolSchema = z.infer<typeof submitToolSchema>
export type NewsletterSchema = z.infer<typeof newsletterSchema>
export type StackAnalyzerSchema = z.infer<typeof stackAnalyzerSchema>
export type ReportSchema = z.infer<typeof reportSchema>
