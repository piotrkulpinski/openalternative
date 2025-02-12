import type { Alternative } from "@openalternative/db/client"
import {
  createSearchParamsCache,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
} from "nuqs/server"
import * as z from "zod"
import { getSortingStateParser } from "~/lib/parsers"

export const searchParamsCache = createSearchParamsCache({
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(25),
  sort: getSortingStateParser<Alternative>().withDefault([{ id: "createdAt", desc: true }]),
  name: parseAsString.withDefault(""),
  from: parseAsString.withDefault(""),
  to: parseAsString.withDefault(""),
  operator: parseAsStringEnum(["and", "or"]).withDefault("and"),
})

export type GetAlternativesSchema = Awaited<ReturnType<typeof searchParamsCache.parse>>

export const alternativeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().optional(),
  websiteUrl: z.string().min(1, "Website is required").url(),
  description: z.string().optional(),
  faviconUrl: z.string().optional(),
  isFeatured: z.boolean().optional(),
  discountCode: z.string().optional(),
  discountAmount: z.string().optional(),
  tools: z.array(z.string()).optional(),
})

export type AlternativeSchema = z.infer<typeof alternativeSchema>
