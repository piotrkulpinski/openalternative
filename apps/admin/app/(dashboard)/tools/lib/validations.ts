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
  name: z.string(),
  slug: z.string(),
  website: z.string().url(),
  repository: z.string().url(),
})

export type CreateToolSchema = z.infer<typeof createToolSchema>

export const updateToolSchema = z.object({
  name: z.string(),
})

export type UpdateToolSchema = z.infer<typeof updateToolSchema>
