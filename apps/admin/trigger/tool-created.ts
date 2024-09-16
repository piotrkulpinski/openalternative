import type { Tool } from "@openalternative/db"
import { task } from "@trigger.dev/sdk/v3"
import { uploadFavicon, uploadScreenshot } from "~/lib/media"
import { prisma } from "~/services/prisma"

export const toolCreatedTask = task({
  id: "tool-created",
  run: async ({ id, slug, website }: Tool) => {
    const [faviconUrl, screenshotUrl] = await Promise.all([
      uploadFavicon(website, `${slug}/favicon`),
      uploadScreenshot(website, `${slug}/screenshot`),
    ])

    await prisma.tool.update({
      where: { id },
      data: { faviconUrl, screenshotUrl },
    })
  },
})
