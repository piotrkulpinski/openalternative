import type { Tool } from "@openalternative/db"
import type { Jsonify } from "inngest/helpers/jsonify"
import { config } from "~/config"
import { sendTweet } from "~/services/twitter"

/**
 * Check if a tool has reached a milestone
 * @param prevStars - The number of stars the tool had before the current update
 * @param newStars - The current number of stars for the tool
 * @returns The milestone reached, or null if it hasn't reached any milestone
 */
export const getMilestoneReached = (prevStars: number, newStars: number) => {
  const baseMilestones = [100, 500, 1000, 2500, 5000]
  const tenThousands = Array.from({ length: 30 }, (_, i) => (i + 1) * 10000)
  const twentyFiveThousands = Array.from({ length: 12 }, (_, i) => (i + 1) * 25000)
  const milestones = [...new Set([...baseMilestones, ...tenThousands, ...twentyFiveThousands])]

  const unreachedMilestones = milestones.sort((a, b) => a - b).filter(m => prevStars < m)
  const reachedMilestones = unreachedMilestones.filter(m => newStars >= m)

  return reachedMilestones.length ? Math.max(...reachedMilestones) : null
}

/**
 * Send a tweet congratulating a tool for reaching a milestone
 * @param milestone - The milestone reached
 * @param tool - The tool object
 */
export const sendMilestoneTweet = async (milestone: number, tool: Tool | Jsonify<Tool>) => {
  const tweet = `⭐ ${tool.name} has just reached ${milestone.toLocaleString()} stars on GitHub! Huge congrats to the${tool.twitterHandle ? ` @${tool.twitterHandle}` : ""} team! 🎉

${config.site.url}/${tool.slug}`

  try {
    await sendTweet(tweet)
    console.log(`Tweet sent for ${tool.name}`)
  } catch (error) {
    console.error(`Error sending tweet for ${tool.name}:`, error)
  }
}
