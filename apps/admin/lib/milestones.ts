import type { Tool } from "@openalternative/db"
import { siteConfig } from "~/config/site"
import { twitterClient } from "~/services/twitter"

/**
 * Check if a tool has reached a milestone
 * @param prevStars - The number of stars the tool had before the current update
 * @param newStars - The current number of stars for the tool
 * @returns The milestone reached, or null if it hasn't reached any milestone
 */
export const getMilestoneReached = (prevStars: number, newStars: number) => {
  const milestones = [100, 500, 1000, 2500, 5000, 10000, 25000, 50000, 100000]
  const unreachedMilestones = milestones.filter(m => prevStars < m)
  const reachedMilestones = unreachedMilestones.filter(m => newStars >= m)

  return reachedMilestones.length ? Math.max(...reachedMilestones) : null
}

/**
 * Send a tweet congratulating a tool for reaching a milestone
 * @param tool - The tool that reached the milestone
 * @param stars - The current number of stars for the tool
 */
export const sendMilestoneTweet = async (milestone: number, tool: Tool) => {
  const tweet = `🎉 ${tool.name} has just reached ${milestone.toLocaleString()} stars on GitHub!
Huge congrats to the team!

Check it out on OpenAlternative: ${siteConfig.url}/${tool.slug}

#opensource #openalternative #github #software`

  try {
    await twitterClient.tweet(tweet)
    console.log(`Tweet sent for ${tool.name}`)
  } catch (error) {
    console.error(`Error sending tweet for ${tool.name}:`, error)
  }
}
