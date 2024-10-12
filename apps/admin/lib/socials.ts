import { formatNumber, joinAsSentence } from "@curiousleaf/utils"
import { formatDistanceToNowStrict } from "date-fns"
import { siteConfig } from "~/config/site"
import { prisma } from "~/services/prisma"

export const generateSocialTweet = async () => {
  const where = { publishedAt: { not: null, lte: new Date() } }
  const count = await prisma.tool.count({ where })
  const skip = Math.floor(Math.random() * count)
  const tool = await prisma.tool.findFirst({
    where,
    skip,
    include: { alternatives: { include: { alternative: { select: { name: true } } } } },
  })

  if (tool) {
    let suffix = ""
    const name = `${tool.name} ${tool.twitterHandle ? `(@${tool.twitterHandle})` : ""}`

    switch (tool.alternatives.length) {
      case 0:
        suffix = `${tool.tagline}`
        break
      case 1:
        suffix = `Open Source ${tool.alternatives[0]?.alternative.name} Alternative`
        break
      default:
        suffix = `Open Source Alternative to ${joinAsSentence(tool.alternatives.map(({ alternative }) => alternative?.name))}`
    }

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

    return `${name} – ${suffix}

${insights.map(({ label, value, icon }) => `${icon} ${label}: ${value}`).join("\n")}

${siteConfig.url}/${tool.slug}`
  }
}
