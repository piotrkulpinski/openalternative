import { ToolStatus } from "@openalternative/db/client"
import * as z from "zod"
import { repositorySchema } from "~/server/schemas"

export const searchParamsSchema = z.object({
  name: z.string().optional(),
  status: z.string().optional(),
  page: z.coerce.number().default(1),
  per_page: z.coerce.number().default(50),
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

export const toolSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().optional(),
  website: z.string().min(1, "Website is required").url(),
  repository: repositorySchema,
  tagline: z.string().optional(),
  description: z.string().optional(),
  content: z.string().optional(),
  faviconUrl: z.string().optional(),
  screenshotUrl: z.string().optional(),
  isFeatured: z.boolean().default(false),
  isSelfHosted: z.boolean().default(false),
  submitterName: z.string().optional(),
  submitterEmail: z.string().optional(),
  submitterNote: z.string().optional(),
  hostingUrl: z.string().url().optional().or(z.literal("")),
  discountCode: z.string().optional(),
  discountAmount: z.string().optional(),
  publishedAt: z.coerce.date().nullish(),
  status: z.nativeEnum(ToolStatus).default("Draft"),
  alternatives: z.array(z.string()).optional(),
  categories: z.array(z.string()).optional(),
})

export type ToolSchema = z.infer<typeof toolSchema>
