import { prisma } from "~/lib/prisma"
import type { Prisma } from "@openalternative/db/client"
import { adManyPayload, adOnePayload } from "~/server/ads/payloads"

export const findAds = async ({ where, orderBy, ...args }: Prisma.AdFindManyArgs) => {
  return prisma.ad.findMany({
    ...args,
    orderBy: orderBy ?? { startsAt: "desc" },
    select: adManyPayload,
  })
}

export const findAd = async ({ where, orderBy, ...args }: Prisma.AdFindFirstArgs) => {
  return prisma.ad.findFirst({
    ...args,
    orderBy: orderBy ?? { startsAt: "desc" },
    where: { startsAt: { lte: new Date() }, endsAt: { gt: new Date() }, ...where },
    select: adOnePayload,
  })
}
