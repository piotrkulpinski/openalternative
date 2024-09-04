import { inngest } from "apps/web/app/services.server/inngest"
import { prisma } from "apps/web/app/services.server/prisma"
import { uploadToS3Storage } from "apps/web/app/services.server/s3"
import { got } from "got"

export const onAlternativeCreated = inngest.createFunction(
  { id: "alternative.created" },
  { event: "alternative.created" },

  async ({ event, step, logger }) => {
    const alternative = await step.run("find-alternative", async () => {
      return prisma.alternative.findUniqueOrThrow({
        where: { id: event.data.id },
        select: { id: true, slug: true, website: true, faviconUrl: true },
      })
    })

    if (!alternative.website) {
      logger.warn(`${alternative.slug} does not have a website URL`)
      return
    }

    const generateFaviconUrl = step.run("generate-favicon", async () => {
      if (alternative.faviconUrl) {
        return alternative.faviconUrl
      }

      const url = `https://www.google.com/s2/favicons?sz=128&domain_url=${alternative.website}`
      const { body } = await got(url, { responseType: "buffer" })
      const location = await uploadToS3Storage(body, `alternatives/${alternative.slug}/favicon.png`)

      console.info("✨ Favicon generated for:", alternative.slug)

      return location
    })

    // Run steps in parallel
    const faviconUrl = await generateFaviconUrl

    await step.run("update-alternative", async () => {
      return prisma.alternative.update({
        where: { id: alternative.id },
        data: { faviconUrl },
      })
    })
  },
)
