import { AtpAgent, RichText } from "@atproto/api"
import wretch from "wretch"
import { env, isProd } from "~/env"
import { getUrlMetadata } from "~/utils/helpers"

/**
 * Get the Bluesky embed card
 * @param url - The URL to get the embed card for
 * @param agent - The Bluesky agent
 * @returns The embed card
 */
const getBlueskyEmbedCard = async (url: string | undefined, agent: AtpAgent) => {
  if (!url) return

  try {
    const metadata = await getUrlMetadata(url)

    if (!metadata) return

    const blob = await wretch(metadata.image).get().blob()
    const { data } = await agent.uploadBlob(blob, { encoding: "image/jpeg" })

    return {
      $type: "app.bsky.embed.external",
      external: {
        uri: url,
        title: metadata.title,
        description: metadata.description,
        thumb: data.blob,
      },
    }
  } catch (error) {
    console.error("Error fetching embed card:", error)
    return
  }
}

/**
 * Send a post to Bluesky
 * @param text - The text of the post
 */
export const sendBlueskyPost = async (text: string, url?: string) => {
  if (!isProd || !env.BLUESKY_USERNAME || !env.BLUESKY_PASSWORD) {
    console.log(text)
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
    embed: await getBlueskyEmbedCard(url, agent),
  })
}
