import { AtpAgent, RichText } from "@atproto/api"
import { env } from "~/env"

/**
 * Send a post to Bluesky
 * @param text - The text of the post
 */
export const sendBlueskyPost = async (text: string) => {
  if (!env.BLUESKY_USERNAME || !env.BLUESKY_PASSWORD) {
    return
  }

  const agent = new AtpAgent({
    service: "https://bsky.social",
  })

  await agent.login({
    identifier: env.BLUESKY_USERNAME,
    password: env.BLUESKY_PASSWORD,
  })

  const rt = new RichText({ text })
  await rt.detectFacets(agent)

  await agent.post({
    text: rt.text,
    facets: rt.facets,
  })
}
