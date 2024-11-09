import { AtpAgent } from "@atproto/api"
import { env, isProd } from "~/env"

/**
 * Send a post to Bluesky
 * @param text - The text of the post
 */
export const sendBlueskyPost = async (text: string) => {
  if (!isProd || !env.BLUESKY_USERNAME || !env.BLUESKY_PASSWORD) {
    return
  }

  const agent = new AtpAgent({
    service: "https://bsky.social",
  })

  await agent.login({
    identifier: env.BLUESKY_USERNAME,
    password: env.BLUESKY_PASSWORD,
  })

  // TODO: Enable when I fix the issue with links
  // await agent.post({ text })
}
