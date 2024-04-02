import { inngest } from "~/services.server/inngest"
import { got } from "got"
import { uploadToS3Storage } from "~/services.server/s3"
import { prisma } from "~/services.server/prisma"

export const onToolCreated = inngest.createFunction(
  { id: "tool.created" },
  { event: "tool.created" },

  async ({ event, step, logger }) => {
    const tool = await step.run("find-tool", async () => {
      return prisma.tool.findUniqueOrThrow({
        where: { id: event.data.id },
        select: { id: true, slug: true, website: true, faviconUrl: true, screenshotUrl: true },
      })
    })

    if (!tool.website) {
      logger.warn(`${tool.slug} does not have a website URL`)
      return
    }

    const generateFaviconUrl = step.run("generate-favicon", async () => {
      if (tool.faviconUrl) {
        return tool.faviconUrl
      }

      const url = `https://www.google.com/s2/favicons?sz=128&domain_url=${tool.website}`
      const { body } = await got(url, { responseType: "buffer" })
      const location = await uploadToS3Storage(body, `${tool.slug}/favicon.png`)

      console.info("✨ Favicon generated for:", tool.slug)

      return location
    })

    const generateScreenshotUrl = step.run("generate-screenshot", async () => {
      if (tool.screenshotUrl) {
        return tool.screenshotUrl
      }

      const screenshotParams = new URLSearchParams({
        access_key: process.env.SCREENSHOTONE_ACCESS_KEY!,
        url: tool.website!,
        response_type: "json",

        // Cache
        cache: "true",
        cache_ttl: "2592000",

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
        storage_path: `${tool.slug}/screenshot`,
        storage_bucket: process.env.S3_BUCKET!,
        storage_access_key_id: process.env.S3_ACCESS_KEY!,
        storage_secret_access_key: process.env.S3_SECRET_ACCESS_KEY!,
        storage_return_location: "true",
      })

      const url = `https://api.screenshotone.com/take?${screenshotParams.toString()}`
      const response = await got.get(url).json<{ store: { location: string } }>()

      console.info("✨ Screenshot generated for:", tool.slug)

      return response.store.location
    })

    // Run steps in parallel
    const [faviconUrl, screenshotUrl] = await Promise.all([
      generateFaviconUrl,
      generateScreenshotUrl,
    ])

    await step.run("update-tool", async () => {
      return prisma.tool.update({
        where: { id: tool.id },
        data: { faviconUrl, screenshotUrl },
      })
    })
  }
)
