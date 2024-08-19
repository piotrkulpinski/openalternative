import { formatNumber } from "@curiousleaf/utils"
import type { Tool } from "@prisma/client"
import type { SerializeFrom } from "@remix-run/node"
import { TwitterApi } from "twitter-api-v2"
import { SITE_URL } from "~/utils/constants"

const client = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY ?? "",
  appSecret: process.env.TWITTER_API_SECRET ?? "",
  accessToken: process.env.TWITTER_ACCESS_TOKEN ?? "",
  accessSecret: process.env.TWITTER_ACCESS_SECRET ?? "",
})

export const sendMilestoneTweet = async (tool: SerializeFrom<Tool>, stars: number) => {
  const tweet = `🎉 ${tool.name} has just reached ${formatNumber(stars)} stars on GitHub!
  Huge congrats to the team!

  Check it out on OpenAlternative: ${SITE_URL}/${tool.slug}

  #opensource #openalternative #github #software`

  try {
    await client.v2.tweet(tweet)
    console.log(`Tweet sent for ${tool.name}`)
  } catch (error) {
    console.error(`Error sending tweet for ${tool.name}:`, error)
  }
}
