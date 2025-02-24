import { type Report, ReportType } from "@openalternative/db/client"
import {
  createSearchParamsCache,
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
} from "nuqs/server"
import * as z from "zod"
import { getSortingStateParser } from "~/lib/parsers"

export const searchParamsCache = createSearchParamsCache({
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(25),
  sort: getSortingStateParser<Report>().withDefault([{ id: "createdAt", desc: false }]),
  message: parseAsString.withDefault(""),
  type: parseAsArrayOf(z.nativeEnum(ReportType)).withDefault([]),
  from: parseAsString.withDefault(""),
  to: parseAsString.withDefault(""),
  operator: parseAsStringEnum(["and", "or"]).withDefault("and"),
})

export type GetReportsSchema = Awaited<ReturnType<typeof searchParamsCache.parse>>
