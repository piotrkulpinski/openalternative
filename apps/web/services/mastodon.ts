import { env, isProd } from "~/env"

const MASTODON_API = "https://mastodon.social/api/v1"

/**
 * Sends a post to Mastodon
 * @param text - Post content to send
 * @param url - Optional URL to include in the post
 * @returns Promise resolving to post result
 */
export const sendMastodonPost = async (text: string, url?: string) => {
  if (!isProd || !env.MASTODON_ACCESS_TOKEN) {
    console.log(text)
    return null
  }

  try {
    const response = await fetch(`${MASTODON_API}/statuses`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.MASTODON_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: text,
        visibility: "public",
        ...(url && { card: { url } }),
      }),
    })

    if (!response.ok) {
      throw new Error(`Mastodon API error: ${response.statusText}`)
    }

    await response.json()
  } catch (error) {
    console.error("Error posting to Mastodon:", error)
    return null
  }
}
