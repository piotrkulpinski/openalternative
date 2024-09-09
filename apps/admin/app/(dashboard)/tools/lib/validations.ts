import * as z from "zod"

export const searchParamsSchema = z.object({
  page: z.coerce.number().default(1),
  per_page: z.coerce.number().default(25),
  sort: z.string().optional(),
  name: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
  operator: z.enum(["and", "or"]).optional(),
})

export const getToolsSchema = searchParamsSchema

export type GetToolsSchema = z.infer<typeof getToolsSchema>

export const createToolSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
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
  links: z.array(z.string()).optional(),
  bump: z.number().optional(),
  faviconUrl: z.string().optional(),
  screenshotUrl: z.string().optional(),
  isFeatured: z.boolean().default(false),
  submitterName: z.string().optional(),
  submitterEmail: z.string().optional(),
  submitterNote: z.string().optional(),
  hostingUrl: z.string().optional(),
  discountCode: z.string().optional(),
  discountAmount: z.number().optional(),
  publishedAt: z.date().optional(),
})

export type CreateToolSchema = z.infer<typeof createToolSchema>

export const updateToolSchema = z.object({
  name: z.string(),
  website: z.string().min(1, "Website is required").url(),
  repository: z
    .string()
    .min(1, "Repository is required")
    .url()
    .refine(
      url => /^https:\/\/github\.com\/([^/]+)\/([^/]+)(\/)?$/.test(url),
      "The repository must be a valid GitHub URL",
    ),
  tagline: z.string().nullish(),
  description: z.string().nullish(),
  content: z.string().nullish(),
  // links: z.array(z.string()).nullish(),
  bump: z.number().nullish(),
  faviconUrl: z.string().nullish(),
  screenshotUrl: z.string().nullish(),
  isFeatured: z.boolean().default(false),
  submitterName: z.string().nullish(),
  submitterEmail: z.string().nullish(),
  submitterNote: z.string().nullish(),
  hostingUrl: z.string().nullish(),
  discountCode: z.string().nullish(),
  discountAmount: z.number().nullish(),
  publishedAt: z.date().nullish(),
})

export type UpdateToolSchema = z.infer<typeof updateToolSchema>
