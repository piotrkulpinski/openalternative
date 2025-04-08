import type { Category } from "@openalternative/db/client"
import {
  createSearchParamsCache,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
} from "nuqs/server"
import { z } from "zod"
import { getSortingStateParser } from "~/lib/parsers"

export const categoriesTableParamsSchema = {
  name: parseAsString.withDefault(""),
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(25),
  sort: getSortingStateParser<Category>().withDefault([{ id: "name", desc: false }]),
  from: parseAsString.withDefault(""),
  to: parseAsString.withDefault(""),
  operator: parseAsStringEnum(["and", "or"]).withDefault("and"),
}

export const categoriesTableParamsCache = createSearchParamsCache(categoriesTableParamsSchema)
export type CategoriesTableSchema = Awaited<ReturnType<typeof categoriesTableParamsCache.parse>>

export const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().optional(),
  label: z.string().optional(),
  description: z.string().optional(),
  parentId: z.string().nullable().optional(),
  tools: z.array(z.string()).optional(),
})

export type CategorySchema = z.infer<typeof categorySchema>
