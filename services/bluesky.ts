import { AtpAgent, RichText } from "@atproto/api"
import wretch from "wretch"
import { env, isProd } from "~/env"

type Metadata = {
  title: string
  description: string
  image: string
}

/**
 * Get the Bluesky embed card
 * @param url - The URL to get the embed card for
 * @param agent - The Bluesky agent
 * @returns The embed card
 */
export const getBlueskyEmbedCard = async (url: string | undefined, agent: AtpAgent) => {
  if (!url) return

  try {
    const json = await wretch(`https://api.dub.co/metatags?url=${url}`).get().json<Metadata>()
    const blob = await wretch(json.image).get().blob()

    const { data } = await agent.uploadBlob(blob, { encoding: "image/jpeg" })

    return {
      $type: "app.bsky.embed.external",
      external: {
        uri: url,
        title: json.title,
        description: json.description,
        thumb: data.blob,
      },
    }
  } catch (error) {
    console.error("Error fetching socials:", error)
    return undefined
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
