import { formatNumber } from "@curiousleaf/utils"
import type { Tool } from "@openalternative/db/client"
import { formatDistanceToNowStrict } from "date-fns"
import type { Jsonify } from "inngest/helpers/jsonify"
import { config } from "~/config"
import { brandLinkApi } from "~/lib/apis"
import { sendBlueskyPost } from "~/services/bluesky"
import { sendTwitterPost } from "~/services/twitter"

const socialHandle = "{social handle}"

/**
 * Fetches social media links for a given URL using the BrandLink API
 * @param url - Website URL to fetch social media links for
 * @returns Object containing social media handles and URLs, or empty object on error
 */
export const getSocialsFromUrl = async (url: string) => {
  try {
    return await brandLinkApi.get(`/links?url=${url}`)
  } catch (error) {
    console.error("Error fetching socials:", error)
    return {}
  }
}

/**
 * Sends a post to multiple social media platforms
 * @param template - Post template to use
 * @param tool - Tool data to include in the post
 * @returns Promise resolving to array of post results
 */
export const sendSocialPost = async (template: string, tool: Tool | Jsonify<Tool>) => {
  const socials = await getSocialsFromUrl(tool.website)
  const twitterHandle = socials.X?.[0]?.user
  const blueskyHandle = socials.Bluesky?.[0]?.user
  const url = `${config.site.url}/${tool.slug}`

  return await Promise.all([
    sendTwitterPost(`${updatePostTemplate(template, twitterHandle, url)}`),
    sendBlueskyPost(`${updatePostTemplate(template, blueskyHandle, url)}`, url),
  ])
}

/**
 * Updates a post template with a social media handle
 * @param template - Post template containing placeholder
 * @param handle - Social media handle to insert
 * @param url - Tool URL to include in the post
 * @returns Updated post text with handle and tool URL
 */
export const updatePostTemplate = (template: string, handle: string | undefined, url: string) => {
  return `${template.replace(` ${socialHandle}`, handle ? ` @${handle}` : "")}\n\n${url}`
}

/**
 * Generates a social media post template for tool launch announcements
 * @param tool - Tool data to include in the post
 * @returns Post template with tool details
 */
export const getPostLaunchTemplate = (tool: Tool | Jsonify<Tool>) => {
  return `🚀 Just published: ${tool.name} ${socialHandle} — ${tool.tagline}\n\n${tool.description}`
}

/**
 * Generates a social media post template with tool insights
 * @param tool - Tool data to include in the post
 * @returns Post template with tool stats and metrics
 */
export const getPostTemplate = async (tool: Tool | Jsonify<Tool>) => {
  const formatDate = (date: Date) => formatDistanceToNowStrict(date, { addSuffix: true })

  const insights = [
    { label: "Stars", value: formatNumber(tool.stars, "standard"), icon: "⭐" },
    { label: "Forks", value: formatNumber(tool.forks, "standard"), icon: "🔗" },
    { label: "Last commit", value: formatDate(tool.lastCommitDate as Date), icon: "⏩" },
    { label: "First commit", value: formatDate(tool.firstCommitDate as Date), icon: "⌛" },
  ]

  return `${tool.name} ${socialHandle} — ${tool.tagline}\n\n${insights.map(({ label, value, icon }) => `${icon} ${label}: ${value}`).join("\n")}`
}

/**
 * Generates a social media post template for milestone announcements
 * @param tool - Tool data to include in the post
 * @param milestone - Star count milestone reached
 * @returns Post template celebrating the milestone
 */
export const getPostMilestoneTemplate = (tool: Tool | Jsonify<Tool>, milestone: number) => {
  return `⭐ ${tool.name} has just reached ${milestone.toLocaleString()} stars on GitHub! Huge congrats to the ${socialHandle} team! 🎉`
}
