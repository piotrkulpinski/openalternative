import type { Alternative } from "@openalternative/db"
import { task } from "@trigger.dev/sdk/v3"
import { uploadFavicon } from "~/lib/media"
import { prisma } from "~/services/prisma"

export const alternativeCreatedTask = task({
  id: "alternative-created",
  run: async ({ id, slug, website }: Alternative) => {
    const faviconUrl = await uploadFavicon(website, `alternatives/${slug}/favicon`)

    await prisma.alternative.update({
      where: { id },
      data: { faviconUrl },
    })
  },
})
