import { uploadFavicon } from "~/lib/media"
import { inngest } from "~/services/inngest"
import { prisma } from "~/services/prisma"

export const alternativeCreated = inngest.createFunction(
  { id: "alternative.created" },
  { event: "alternative.created" },

  async ({ event, step }) => {
    const alternative = await step.run("find-alternative", async () => {
      return prisma.alternative.findUniqueOrThrow({ where: { slug: event.data.slug } })
    })

    const faviconUrl = await step.run("upload-favicon", async () => {
      return uploadFavicon(alternative.website, `alternatives/${alternative.slug}/favicon`)
    })

    await step.run("update-alternative", async () => {
      return prisma.alternative.update({
        where: { id: alternative.id },
        data: { faviconUrl },
      })
    })
  },
)
