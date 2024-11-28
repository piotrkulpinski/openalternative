"use server"

import { env } from "~/env"
import { authedProcedure } from "~/lib/safe-actions"
import { prisma } from "~/services/prisma"

export const updateFaviconUrls = authedProcedure.createServerAction().handler(async () => {
  const alternatives = await prisma.alternative.findMany()

  for (const alternative of alternatives) {
    await prisma.alternative.update({
      where: { id: alternative.id },
      data: {
        faviconUrl: alternative.faviconUrl?.replace(
          `s3.${env.S3_REGION}.amazonaws.com/${env.S3_BUCKET}`,
          `${env.S3_BUCKET}.s3.${env.S3_REGION}.amazonaws.com`,
        ),
      },
    })
  }
})
