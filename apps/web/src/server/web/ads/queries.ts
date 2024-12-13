import { prisma } from "@openalternative/db"
import type { Prisma } from "@openalternative/db/client"
import { cache } from "~/lib/cache"
import { adManyPayload, adOnePayload } from "~/server/web/ads/payloads"

export const findAds = cache(
  async ({ where, orderBy, ...args }: Prisma.AdFindManyArgs) => {
    return prisma.ad.findMany({
      ...args,
      orderBy: orderBy ?? { startsAt: "desc" },
      select: adManyPayload,
    })
  },
  ["ads"],
)

export const findAd = cache(
  async ({ where, orderBy, ...args }: Prisma.AdFindFirstArgs) => {
    return prisma.ad.findFirst({
      ...args,
      orderBy: orderBy ?? { startsAt: "desc" },
      where: { startsAt: { lte: new Date() }, endsAt: { gt: new Date() }, ...where },
      select: adOnePayload,
    })
  },
  ["ad"],
  { revalidate: 60 * 60 },
)
