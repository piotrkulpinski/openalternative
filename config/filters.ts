import { parseAsArrayOf, parseAsString } from "nuqs"

export const filters = {
  query: parseAsString.withDefault(""),
  technologies: parseAsArrayOf(parseAsString).withDefault([]),
}
