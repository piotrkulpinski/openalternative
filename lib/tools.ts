import { joinAsSentence } from "@curiousleaf/utils"
import type { Tool } from "@prisma/client"
import type { Jsonify } from "inngest/helpers/jsonify"
import type { ToolOne } from "~/server/web/tools/payloads"

export const isToolPublished = (tool: Pick<Tool | Jsonify<Tool>, "publishedAt">) => {
  return !!tool.publishedAt && tool.publishedAt <= new Date()
}

export const getToolSuffix = (tool: ToolOne | Jsonify<ToolOne>) => {
  let suffix = ""

  switch (tool.alternatives.length) {
    case 0:
      suffix = `${tool.tagline}`
      break
    case 1:
      suffix = `Open Source ${tool.alternatives[0].alternative.name} Alternative`
      break
    default:
      suffix = `Open Source Alternative to ${joinAsSentence(tool.alternatives.map(({ alternative }) => alternative?.name))}`
  }

  return suffix
}
