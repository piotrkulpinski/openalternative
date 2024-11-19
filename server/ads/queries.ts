import type { Prisma } from "@prisma/client"
import { adOnePayload } from "~/server/ads/payloads"
import { prisma } from "~/services/prisma"

export const findFirstAd = async ({ where, orderBy, ...args }: Prisma.AdFindFirstArgs) => {
  return prisma.ad.findFirst({
    ...args,
    orderBy: orderBy ?? { startsAt: "desc" },
    where: { startsAt: { lte: new Date() }, endsAt: { gt: new Date() }, ...where },
    select: adOnePayload,
  })
}
