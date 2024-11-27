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

export const getLicensesSchema = searchParamsSchema

export type GetLicensesSchema = z.infer<typeof getLicensesSchema>

export const licenseSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().optional(),
  description: z.string().optional(),
  content: z.string().optional(),
})

export type LicenseSchema = z.infer<typeof licenseSchema>
