import type { Prisma } from "@prisma/client"
import { unstable_cacheTag as cacheTag } from "next/cache"
import { connection } from "next/server"
import { adManyPayload, adOnePayload } from "~/server/web/ads/payloads"
import { prisma } from "~/services/prisma"

export const findAds = async ({ where, orderBy, ...args }: Prisma.AdFindManyArgs) => {
  "use cache"
  cacheTag("ads")

  return prisma.ad.findMany({
    ...args,
    orderBy: orderBy ?? { startsAt: "desc" },
    select: adManyPayload,
  })
}

export const findAd = async ({ where, orderBy, ...args }: Prisma.AdFindFirstArgs) => {
  await connection()

  return prisma.ad.findFirst({
    ...args,
    orderBy: orderBy ?? { startsAt: "desc" },
    where: { startsAt: { lte: new Date() }, endsAt: { gt: new Date() }, ...where },
    select: adOnePayload,
  })
}
