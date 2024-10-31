import type { Tool } from "@openalternative/db"
import type { Jsonify } from "inngest/helpers/jsonify"

export const isToolPublished = (tool: Tool | Jsonify<Tool>) => {
  return !!tool.publishedAt && new Date(tool.publishedAt) <= new Date()
}
