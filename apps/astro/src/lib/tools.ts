import { joinAsSentence } from "@curiousleaf/utils"
import type { Jsonify } from "inngest/helpers/jsonify"
import type { ToolOne } from "~/server/tools/payloads"

type Tool = ToolOne | Jsonify<ToolOne>

export const isToolPublished = (tool: Pick<Tool, "publishedAt">) => {
  return !!tool.publishedAt && tool.publishedAt <= new Date()
}

export const getToolSuffix = (tool: Pick<Tool, "alternatives" | "tagline">) => {
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
