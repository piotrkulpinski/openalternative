import { uploadFavicon, uploadScreenshot } from "~/lib/media"
import { prisma } from "~/services/prisma"
import { inngest } from "~/services/inngest"

export const toolCreated = inngest.createFunction(
  { id: "tool.created" },
  { event: "tool.created" },

  async ({ event, step }) => {
    const tool = await step.run("find-tool", async () => {
      return prisma.tool.findUniqueOrThrow({ where: { id: event.data.id } })
    })

    const [faviconUrl, screenshotUrl] = await step.run("upload-assets", async () => {
      return Promise.all([
        uploadFavicon(tool.website, `${tool.slug}/favicon`),
        uploadScreenshot(tool.website, `${tool.slug}/screenshot`),
      ])
    })

    await step.run("update-tool", async () => {
      return prisma.tool.update({
        where: { id: tool.id },
        data: { faviconUrl, screenshotUrl },
      })
    })
  },
)
