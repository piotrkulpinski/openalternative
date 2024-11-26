import type { Tool } from "@prisma/client"
import type { Jsonify } from "inngest/helpers/jsonify"

export const isToolPublished = (tool: Tool | Jsonify<Tool>) => {
  return !!tool.publishedAt && tool.publishedAt <= new Date()
}
