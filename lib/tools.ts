import type { Tool } from "@prisma/client"

export const isToolPublished = (tool: Tool) => {
  return !!tool.publishedAt && tool.publishedAt <= new Date()
}
