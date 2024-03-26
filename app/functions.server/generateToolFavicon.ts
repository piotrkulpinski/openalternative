import { inngest } from "~/services.server/inngest"
import { got } from "got"
import { uploadToS3Storage } from "~/services.server/s3"
import { prisma } from "~/services.server/prisma"

export const generateToolFavicon = inngest.createFunction(
  { id: "generate-tool-favicon" },
  { event: "tool.created" },

  async ({ event, step, logger }) => {
    const { id, slug, website, faviconUrl } = event.data

    if (!website) {
      logger.warn(`Tool ${id} does not have a website URL`)
      return
    }

    if (faviconUrl) {
      logger.info(`Tool ${id} already has a favicon`)
      return
    }

    const location = await step.run("store-screenshot", async () => {
      const url = `https://www.google.com/s2/favicons?sz=128&domain_url=${website}`
      const { body } = await got(url, { responseType: "buffer" })

      return await uploadToS3Storage(body, `${slug}/favicon.png`)
    })

    await step.run("update-tool", async () => {
      return await prisma.tool.update({
        where: { id },
        data: { faviconUrl: location },
      })
    })
  }
)
