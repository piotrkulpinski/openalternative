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

export const getCategoriesSchema = searchParamsSchema

export type GetCategoriesSchema = z.infer<typeof getCategoriesSchema>

export const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().optional(),
  label: z.string().optional(),
  tools: z.array(z.string()).optional(),
})

export type CategorySchema = z.infer<typeof categorySchema>
