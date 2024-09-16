import { uploadFavicon, uploadScreenshot } from "~/lib/media"
import { prisma } from "~/services/prisma"
import { inngest } from "~/services/inngest"

export const toolCreated = inngest.createFunction(
  { id: "tool.created" },
  { event: "tool.created" },

  async ({ event, step }) => {
    const { id, slug, website } = event.data

    const [faviconUrl, screenshotUrl] = await step.run("upload-assets", async () => {
      return Promise.all([
        uploadFavicon(website, `${slug}/favicon`),
        uploadScreenshot(website, `${slug}/screenshot`),
      ])
    })

    await step.run("update-tool", async () => {
      return prisma.tool.update({
        where: { id },
        data: { faviconUrl, screenshotUrl },
      })
    })
  },
)
