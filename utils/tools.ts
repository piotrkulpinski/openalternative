import type { Tool } from "@openalternative/db"

export const isToolPublished = (tool: Tool) => {
  return !!tool.publishedAt && tool.publishedAt <= new Date()
}
