import type { License } from "@openalternative/db/client"
import {
  createSearchParamsCache,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
} from "nuqs/server"
import { z } from "zod"
import { getSortingStateParser } from "~/lib/parsers"

export const adminLicensesSearchParams = createSearchParamsCache({
  name: parseAsString.withDefault(""),
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(25),
  sort: getSortingStateParser<License>().withDefault([{ id: "name", desc: false }]),
  from: parseAsString.withDefault(""),
  to: parseAsString.withDefault(""),
  operator: parseAsStringEnum(["and", "or"]).withDefault("and"),
})

export type FindLicensesSchema = Awaited<ReturnType<typeof adminLicensesSearchParams.parse>>

export const licenseSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().optional(),
  description: z.string().optional(),
  content: z.string().optional(),
})

export type LicenseSchema = z.infer<typeof licenseSchema>
