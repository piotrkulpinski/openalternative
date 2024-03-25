import { got } from "got"
import { inngest } from "~/services.server/inngest"
import { prisma } from "~/services.server/prisma"

export const generateToolScreenshot = inngest.createFunction(
  { id: "generate-tool-screenshot", retries: 0 },
  { event: "tool.created" },

  async ({ event, step, logger }) => {
    const { id, slug, website } = event.data

    if (!website) {
      logger.warn(`Tool ${id} does not have a website URL`)
      return
    }

    // Fetch remote Url from the provided website and store it's content in the S3 bucket
    const screenshotParams = new URLSearchParams({
      access_key: process.env.SCREENSHOTONE_ACCESS_KEY!,
      url: website,
      response_type: "json",

      // Cache
      cache: "true",
      cache_ttl: "86400",

      // Blockers
      delay: "2",
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
      storage_path: `${slug}/screenshot`,
      storage_bucket: process.env.S3_BUCKET!,
      storage_access_key_id: process.env.S3_ACCESS_KEY!,
      storage_secret_access_key: process.env.S3_SECRET_ACCESS_KEY!,
      storage_return_location: "true",
    })

    const response = await step.run("store-screenshot", async () => {
      const url = `https://api.screenshotone.com/take?${screenshotParams.toString()}`

      return await got.get(url).json<{ store: { location: string } }>()
    })

    await step.run("update-tool", async () => {
      return await prisma.tool.update({
        where: { id },
        data: { screenshotUrl: response.store.location },
      })
    })
  }
)
