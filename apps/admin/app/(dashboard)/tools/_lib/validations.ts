import * as z from "zod"

export const searchParamsSchema = z.object({
  name: z.string().optional(),
  publishedAt: z.string().optional().default(""),
  page: z.coerce.number().default(1),
  per_page: z.coerce.number().default(25),
  sort: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
  operator: z
    .enum(["and", "or"])
    .default("and")
    .transform(val => val.toUpperCase()),
})

export const getToolsSchema = searchParamsSchema

export type GetToolsSchema = z.infer<typeof getToolsSchema>

export const linkSchema = z.object({
  name: z.string().min(1, "Name is required"),
  url: z.string().url("Must be a valid URL"),
})

export const toolSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().optional(),
  website: z.string().min(1, "Website is required").url(),
  repository: z
    .string()
    .min(1, "Repository is required")
    .url()
    .refine(
      url => /^https:\/\/github\.com\/([^/]+)\/([^/]+)(\/)?$/.test(url),
      "The repository must be a valid GitHub URL",
    ),
  tagline: z.string().optional(),
  description: z.string().optional(),
  content: z.string().optional(),
  links: z.array(linkSchema).optional(),
  faviconUrl: z.string().optional(),
  screenshotUrl: z.string().optional(),
  isFeatured: z.boolean().default(false),
  submitterName: z.string().optional(),
  submitterEmail: z.string().optional(),
  submitterNote: z.string().optional(),
  hostingUrl: z.string().url().optional().or(z.literal("")),
  discountCode: z.string().optional(),
  discountAmount: z.string().optional(),
  twitterHandle: z.string().optional(),
  publishedAt: z.date().nullish(),
  alternatives: z.array(z.string()).optional(),
  categories: z.array(z.string()).optional(),
})

export type ToolSchema = z.infer<typeof toolSchema>
