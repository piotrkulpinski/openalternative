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

export const getAlternativesSchema = searchParamsSchema

export type GetAlternativesSchema = z.infer<typeof getAlternativesSchema>

export const alternativeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().optional(),
  website: z.string().min(1, "Website is required").url(),
  description: z.string().optional(),
  faviconUrl: z.string().optional(),
  isFeatured: z.boolean().optional(),
  discountCode: z.string().optional(),
  discountAmount: z.string().optional(),
  tools: z.array(z.string()).optional(),
})

export type AlternativeSchema = z.infer<typeof alternativeSchema>
