import { inngest } from "~/services.server/inngest"
import { got } from "got"
import { uploadToS3Storage } from "~/services.server/s3"
import { prisma } from "~/services.server/prisma"

export const generateToolFavicon = inngest.createFunction(
  { id: "generate-tool-favicon" },
  { event: "tool.created" },

  async ({ event, step, logger }) => {
    const { id, slug, website } = event.data

    if (!website) {
      logger.warn(`Tool ${id} does not have a website URL`)
      return
    }

    const faviconUrl = await step.run("store-screenshot", async () => {
      const apiUrl = `https://www.google.com/s2/favicons?sz=128&domain_url=${website}`
      const apiResponse = await got.head(apiUrl)
      const contentLocation = apiResponse.headers["content-location"]!
      const { body } = await got(contentLocation, { responseType: "buffer" })
      const extention = contentLocation.split(".").pop()

      return await uploadToS3Storage(body, `${slug}/favicon.${extention}`)
    })

    await step.run("update-tool", async () => {
      return await prisma.tool.update({
        where: { id },
        data: { faviconUrl },
      })
    })
  }
)
