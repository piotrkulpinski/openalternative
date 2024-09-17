"use server"

import type { Alternative, Tool } from "@openalternative/db"
import { uploadFavicon, uploadScreenshot } from "~/lib/media"
import { prisma } from "~/services/prisma"

export const reuploadToolAssets = async (tool: Tool) => {
  const [faviconUrl, screenshotUrl] = await Promise.all([
    uploadFavicon(tool.website, `${tool.slug}/favicon`),
    uploadScreenshot(tool.website, `${tool.slug}/screenshot`),
  ])

  await prisma.tool.update({
    where: { id: tool.id },
    data: { faviconUrl, screenshotUrl },
  })
}

export const reuploadAlternativeAssets = async (alternative: Alternative) => {
  const faviconUrl = await uploadFavicon(
    alternative.website,
    `alternatives/${alternative.slug}/favicon`,
  )

  await prisma.alternative.update({
    where: { id: alternative.id },
    data: { faviconUrl },
  })
}
