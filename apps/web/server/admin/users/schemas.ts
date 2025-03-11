import type { User } from "@openalternative/db/client"
import {
  createSearchParamsCache,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
} from "nuqs/server"
import { z } from "zod"
import { getSortingStateParser } from "~/lib/parsers"

export const usersTableParamsSchema = {
  name: parseAsString.withDefault(""),
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(50),
  sort: getSortingStateParser<User>().withDefault([{ id: "createdAt", desc: true }]),
  from: parseAsString.withDefault(""),
  to: parseAsString.withDefault(""),
  operator: parseAsStringEnum(["and", "or"]).withDefault("and"),
}

export const usersTableParamsCache = createSearchParamsCache(usersTableParamsSchema)
export type UsersTableSchema = Awaited<ReturnType<typeof usersTableParamsCache.parse>>

export const userSchema = z.object({
  name: z.string().optional(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  image: z.string().url().optional().or(z.literal("")),
  role: z.enum(["admin", "user"]).optional(),
})

export type UserSchema = z.infer<typeof userSchema>
