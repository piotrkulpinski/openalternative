"use server"

import { prisma } from "@openalternative/db"
import type sharp from "sharp"
import sharpIco from "sharp-ico"
import wretch from "wretch"
import { createServerAction } from "zsa"
import { env } from "~/env"
import { removeS3File, uploadToS3Storage } from "~/lib/media"

export const convertFavicons = createServerAction().handler(async () => {
  try {
    const tools = await prisma.tool.findMany({
      where: { faviconUrl: { contains: ".ico" } },
      select: { id: true, faviconUrl: true },
    })

    const results = await Promise.all(
      tools.map(async tool => {
        try {
          // Get the S3 key from the URL
          const s3Key = tool.faviconUrl!.replace(
            `https://${env.S3_BUCKET}.s3.${env.S3_REGION}.amazonaws.com/`,
            "",
          )

          // Download the .ico file
          const icoBuffer = await wretch(tool.faviconUrl!).get().arrayBuffer().then(Buffer.from)

          // Convert to PNG using sharp
          const ico = sharpIco.sharpsFromIco(icoBuffer)[0] as sharp.Sharp
          const pngBuffer = await ico
            .png()
            .resize({ width: 72, height: 72 })
            .flatten({ background: { r: 255, g: 255, b: 255, alpha: 1 } })
            .toBuffer()

          // Upload the PNG to S3
          const newS3Key = s3Key.replace(".ico", ".png")
          const newUrl = await uploadToS3Storage(pngBuffer, newS3Key)

          // Update the tool record
          await prisma.tool.update({
            where: { id: tool.id },
            data: { faviconUrl: newUrl },
          })

          // Delete the old .ico file
          await removeS3File(s3Key)

          return { id: tool.id, success: true, oldUrl: tool.faviconUrl, newUrl }
        } catch (error) {
          console.error(`Failed to process favicon for tool ${tool.id}:`, error)
          return { id: tool.id, success: false, error: String(error) }
        }
      }),
    )

    return {
      success: true,
      data: {
        processed: results.length,
        successful: results.filter(r => r.success).length,
        failed: results.filter(r => !r.success).length,
        details: results,
      },
    }
  } catch (error) {
    console.error("Failed to convert favicons:", error)
    return { success: false, error: String(error) }
  }
})

export const appendMediaVariants = createServerAction().handler(async () => {
  const timestamp = Date.now()

  try {
    const tools = await prisma.tool.findMany({
      where: { faviconUrl: { not: { contains: "?v=" } } },
      select: { id: true, faviconUrl: true },
      take: 1,
    })

    await Promise.all(
      tools.map(async tool => {
        // Update the tool record
        await prisma.tool.update({
          where: { id: tool.id },
          data: { faviconUrl: `${tool.faviconUrl}?v=${timestamp}` },
        })
      }),
    )
  } catch (error) {
    console.error("Failed to append media variants:", error)
    return { success: false, error: String(error) }
  }
})
