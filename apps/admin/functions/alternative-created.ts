import { uploadFavicon } from "~/lib/media"
import { inngest } from "~/services/inngest"
import { prisma } from "~/services/prisma"

export const alternativeCreated = inngest.createFunction(
  { id: "alternative.created" },
  { event: "alternative.created" },

  async ({ event, step }) => {
    const { id, slug, website } = event.data

    const faviconUrl = await step.run("upload-favicon", async () => {
      return uploadFavicon(website, `alternatives/${slug}/favicon`)
    })

    await step.run("update-alternative", async () => {
      return prisma.alternative.update({
        where: { id },
        data: { faviconUrl },
      })
    })
  },
)
