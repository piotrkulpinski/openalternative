import { formatNumber } from "@curiousleaf/utils"
import { ToolStatus } from "@prisma/client"
import { formatDistanceToNowStrict } from "date-fns"
import wretch from "wretch"
import { config } from "~/config"
import { getToolSuffix } from "~/lib/tools"
import { toolAlternativesPayload } from "~/server/web/tools/payloads"
import { prisma } from "~/services/prisma"

export type Socials = Record<string, Array<Record<string, string> & { url: string }>>

export const getSocialsFromUrl = async (url: string) => {
  const brandLinkApi = wretch("https://brandlink.piotr-f64.workers.dev/api")
    .errorType("json")
    .resolve(r => r.json<Socials>())

  try {
    return await brandLinkApi.get(`/links?url=${url}`)
  } catch (error) {
    console.error("Error fetching socials:", error)
    return {}
  }
}

export const generateSocialPost = async () => {
  const count = await prisma.tool.count({ where: { status: ToolStatus.Published } })
  const skip = Math.floor(Math.random() * count)

  const tool = await prisma.tool.findFirst({
    where: { status: ToolStatus.Published },
    include: { alternatives: toolAlternativesPayload },
    skip,
  })

  if (tool) {
    const name = `${tool.name} ${tool.twitterHandle ? `(@${tool.twitterHandle})` : ""}`

    const insights = [
      { label: "Stars", value: formatNumber(tool.stars, "standard"), icon: "⭐" },
      { label: "Forks", value: formatNumber(tool.forks, "standard"), icon: "🔗" },
      {
        label: "Last commit",
        value: formatDistanceToNowStrict(tool.lastCommitDate as Date, { addSuffix: true }),
        icon: "⏩",
      },
      {
        label: "Repo age",
        value: formatDistanceToNowStrict(tool.firstCommitDate as Date),
        icon: "⌛",
      },
    ]

    return `${name} – ${getToolSuffix(tool)}

${insights.map(({ label, value, icon }) => `${icon} ${label}: ${value}`).join("\n")}

${config.site.url}/${tool.slug}`
  }
}
