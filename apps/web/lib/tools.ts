import { joinAsSentence } from "@curiousleaf/utils"
import type { Tool } from "@openalternative/db/client"
import { differenceInDays } from "date-fns"
import { config } from "~/config"
import type { ToolOne } from "~/server/web/tools/payloads"

/**
 * Check if a tool is publicly available to be viewed.
 *
 * @param tool - The tool to check.
 * @returns Whether the tool is public.
 */
export const isToolVisible = (tool: Pick<Tool, "status">) => {
  return ["Scheduled", "Published"].includes(tool.status)
}

/**
 * Check if a tool is published.
 *
 * @param tool - The tool to check.
 * @returns Whether the tool is published.
 */
export const isToolPublished = (tool: Pick<Tool, "status">) => {
  return ["Published"].includes(tool.status)
}

/**
 * Check if a tool is within the expedite threshold.
 *
 * @param tool - The tool to check.
 * @returns Whether the tool is within the expedite threshold.
 */
export const isToolWithinExpediteThreshold = (tool: Pick<Tool, "publishedAt">) => {
  const threshold = config.submissions.expediteThresholdDays

  return tool.publishedAt && differenceInDays(tool.publishedAt, new Date()) < threshold
}

/**
 * Get the suffix for a tool.
 *
 * @param tool - The tool to get the suffix for.
 * @returns The suffix for the tool.
 */
export const getToolSuffix = (tool: Pick<ToolOne, "alternatives" | "tagline">) => {
  let suffix = ""

  switch (tool.alternatives.length) {
    case 0:
      suffix = `${tool.tagline}`
      break
    case 1:
      suffix = `Open Source ${tool.alternatives[0].name} Alternative`
      break
    default:
      suffix = `Open Source Alternative to ${joinAsSentence(tool.alternatives.map(({ name }) => name))}`
  }

  return suffix
}
