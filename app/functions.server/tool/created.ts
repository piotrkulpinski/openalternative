import ky from "ky"
import { inngest } from "~/services.server/inngest"
import { SITE_URL } from "~/utils/constants"

export const toolCreated = inngest.createFunction(
  { id: "tool.created", retries: 0 },
  { event: "tool.created" },

  async ({ event, step, logger }) => {
    const { id, slug, website } = event.data

    if (!website) {
      logger.warn(`Tool ${id} does not have a website`)
      return
    }

    // Fetch remote Url from the provided website and store it's content in the S3 bucket
    const screenshotParams = new URLSearchParams({
      access_key: process.env.SCREENSHOTONE_ACCESS_KEY!,
      url: website,

      // Blockers
      block_ads: "true",
      block_chats: "true",
      block_trackers: "true",
      block_cookie_banners: "true",

      // Image and viewport options
      format: "webp",
      viewport_width: "1280",
      viewport_height: "720",

      // Storage options
      store: "true",
      storage_path: `screenshots/${slug}`,
      storage_bucket: process.env.S3_BUCKET!,
      storage_access_key_id: process.env.S3_ACCESS_KEY!,
      storage_secret_access_key: process.env.S3_SECRET_ACCESS_KEY!,
      storage_return_location: "true",

      // Async options
      async: "true",
      response_type: "json",
      webhook_url: `${SITE_URL}/api/screenshotone/webhook`,
    })

    await step.run("store-screenshot", async () => {
      await ky.get(`https://api.screenshotone.com/take?${screenshotParams.toString()}`).json()
    })
  }
)
